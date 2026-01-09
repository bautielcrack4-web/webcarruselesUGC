import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ratelimit } from '@/lib/ratelimit';
import { generateHeyGenVideo } from '@/lib/heygen';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { image, prompt, duration = 10, size = '720*1280' } = body;

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value, ...options });
                        } catch (error) { }
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value: '', ...options });
                        } catch (error) { }
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Rate Limiting
        const { success: limitSuccess } = await ratelimit.limit(user.id);
        if (!limitSuccess) {
            return NextResponse.json({
                error: 'Too Many Requests',
                message: 'Límite de 5 videos por minuto alcanzado.'
            }, { status: 429 });
        }

        // Credit Deduction
        const creditCost = duration === 15 ? 45 : 30;
        const { data: success, error: rpcError } = await supabase.rpc('deduct_credits', {
            p_user_id: user.id,
            p_amount: creditCost,
            p_description: `Generación HeyGen (${duration}s)`
        });

        if (rpcError || !success) {
            return NextResponse.json({
                error: 'Créditos insuficientes',
                message: 'No tienes suficientes créditos.'
            }, { status: 402 });
        }

        if (!process.env.HEYGEN_API_KEY) {
            console.error('Missing HEYGEN_API_KEY');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        // For HeyGen Talking Photo, we prioritize the 'message' field if sent,
        // otherwise try to extract it from the prompt.
        const script = body.message || prompt.match(/"([^"]+)"/)?.[1] || prompt;

        console.log(`Generating HeyGen video for ${user.email}. Script: ${script.slice(0, 30)}...`);

        try {
            const videoId = await generateHeyGenVideo({
                image_url: image,
                script,
                dimension: size === '720*1280' ? { width: 720, height: 1280 } : { width: 1280, height: 720 }
            });

            return NextResponse.json({ id: videoId, status: 'processing' });
        } catch (heyGenError: any) {
            console.error('HeyGen API Error:', heyGenError);
            return NextResponse.json({
                error: 'HeyGen API Failed',
                details: heyGenError.message
            }, { status: 500 });
        }
    } catch (err: any) {
        console.error('API Route Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const ATLAS_API_BASE = 'https://api.atlascloud.ai/api/v1/model';
const API_KEY = process.env.NEXT_PUBLIC_ATLASCLOUD_API_KEY; // Using the existing one for compatibility

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { image, prompt, duration = 10, size = '720*1280' } = body;

        // 1. Get User Session using @supabase/ssr
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
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Calculate Credit Cost
        // 10s -> 30 credits, 15s -> 45 credits
        const creditCost = duration === 15 ? 45 : 30;

        // 3. Attempt to Deduct Credits via RPC
        const { data: success, error: rpcError } = await supabase.rpc('deduct_credits', {
            p_user_id: user.id,
            p_amount: creditCost,
            p_description: `Generación de video UGC (${duration}s)`
        });

        if (rpcError || !success) {
            console.error('Credit deduction failed:', rpcError);
            return NextResponse.json({
                error: 'Créditos insuficientes',
                message: 'No tienes suficientes créditos para esta operación.'
            }, { status: 402 });
        }

        console.log(`API Route: Credits deducted (${creditCost}) for user ${user.email}`);

        const response = await fetch(`${ATLAS_API_BASE}/generateVideo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "openai/sora-2/image-to-video-developer",
                image,
                prompt,
                duration,
                size
            })
        });

        const json = await response.json();
        return NextResponse.json(json);
    } catch (err: any) {
        console.error('API Route Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

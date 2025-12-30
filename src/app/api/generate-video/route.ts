import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ratelimit } from '@/lib/ratelimit';

const ATLAS_API_BASE = 'https://api.atlascloud.ai/api/v1/model';
const API_KEY = process.env.NEXT_PUBLIC_ATLASCLOUD_API_KEY; // Using the existing one for compatibility

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { image, prompt, duration = 10, size = '720*1280' } = body;

        // 1. Get User Session using @supabase/ssr
        const cookieStore = await cookies();

        // 2. Rate Limiting Check
        // We do this EARLY to save resources
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";

        // We import ratelimit dynamically or at top? Top is better.
        // But we need user ID for better limiting.
        // Let's check session first.


        // DEBUG: Log received cookies
        const allCookies = cookieStore.getAll();
        console.log('API Route: Cookies received:', allCookies.map(c => c.name));

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
                        } catch (error) {
                            // The `set` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                    remove(name: string, options: CookieOptions) {
                        try {
                            cookieStore.set({ name, value: '', ...options });
                        } catch (error) {
                            // The `delete` method was called from a Server Component.
                            // This can be ignored if you have middleware refreshing
                            // user sessions.
                        }
                    },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error('API Route: Auth Error:', authError);
        }

        if (!user) {
            console.error('API Route: User lookup failed (User is null)');
            return NextResponse.json({
                error: 'Unauthorized',
                debug_cookies: allCookies.map(c => c.name),
                auth_error: authError
            }, { status: 401 });
        }

        // 2. Rate Limiting (Strict Protection)
        const { success: limitSuccess, limit, reset, remaining } = await ratelimit.limit(user.id);

        if (!limitSuccess) {
            console.warn(`Rate Limit Exceeded for user ${user.id}`);
            return NextResponse.json({
                error: 'Too Many Requests',
                message: 'Has alcanzado el límite de 5 videos por minuto. Por favor espera unos segundos.'
            }, {
                status: 429,
                headers: {
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString()
                }
            });
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

        if (!API_KEY) {
            console.error('API Route Error: Missing NEXT_PUBLIC_ATLASCLOUD_API_KEY');
            return NextResponse.json({ error: 'Server Misconfiguration: Missing API Key' }, { status: 500 });
        }

        console.log(`API Route: Credits deducted (${creditCost}) for user ${user.email}`);

        const atlasResponse = await fetch(`${ATLAS_API_BASE}/generateVideo`, {
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

        const json = await atlasResponse.json();

        if (!atlasResponse.ok) {
            console.error('Atlas API Error:', json);
            return NextResponse.json({
                error: 'Atlas API Failed',
                details: json
            }, { status: atlasResponse.status });
        }

        return NextResponse.json(json);
    } catch (err: any) {
        console.error('API Route Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

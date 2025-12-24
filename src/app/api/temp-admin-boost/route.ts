
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const amount = parseInt(searchParams.get('amount') || '0');

    if (!email || !amount) {
        return NextResponse.json({ error: 'Missing email or amount' }, { status: 400 });
    }

    // Use Service Role Key for Admin Access (Bypass RLS)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Get User ID
    const { data: { users }, error: userError } = await supabaseAdmin.auth.admin.listUsers();

    if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });

    const user = users.find((u) => u.email === email);

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Update Subscription
    // First check if subscription exists
    const { data: sub, error: subError } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (subError && subError.code !== 'PGRST116') { // PGRST116 is "not found"
        return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    let result;
    if (sub) {
        // Update existing
        result = await supabaseAdmin
            .from('user_subscriptions')
            .update({ credits_remaining: (sub.credits_remaining || 0) + amount })
            .eq('user_id', user.id)
            .select();
    } else {
        // Insert new (if needed, though unlikely for an existing user without a row layout)
        result = await supabaseAdmin
            .from('user_subscriptions')
            .insert({
                user_id: user.id,
                credits_remaining: amount,
                plan_id: 'pro', // Default or whatever
                status: 'active'
            })
            .select();
    }

    if (result.error) {
        return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: result.data });
}

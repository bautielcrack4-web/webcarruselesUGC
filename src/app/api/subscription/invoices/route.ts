import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { listOrders, lemonSqueezySetup } from '@/lib/lemonsqueezy';

// Initialize Lemon Squeezy
lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
});

export async function GET(req: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies });

        // 1. Auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get Customer/Subscription ID from DB
        const { data: subscription } = await supabase
            .from('user_subscriptions')
            .select('lemonsqueezy_subscription_id, lemonsqueezy_customer_id')
            .eq('user_id', user.id)
            .single();

        if (!subscription?.lemonsqueezy_customer_id) {
            return NextResponse.json({ invoices: [] }); // No customer, no orders
        }

        // 3. Fetch Orders for this customer from Lemon Squeezy
        const { data: ordersData, error } = await listOrders({
            filter: {
                storeId: process.env.LEMONSQUEEZY_STORE_ID,
                userEmail: user.email,
            },
        });

        if (error) {
            throw new Error(error.message);
        }

        // 4. Map to simple format
        const invoices = ordersData?.data.map((order: any) => ({
            id: order.id,
            date: order.attributes.created_at,
            amount: (order.attributes.total / 100).toFixed(2),
            currency: order.attributes.currency,
            status: order.attributes.status,
            invoiceId: order.attributes.identifier,
            receiptUrl: order.attributes.urls.receipt
        })) || [];

        return NextResponse.json({ invoices });

    } catch (error: any) {
        console.error('Fetch Invoices Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

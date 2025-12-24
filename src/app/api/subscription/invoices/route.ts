import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Paddle } from '@paddle/paddle-node-sdk';

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
            .select('paddle_subscription_id, paddle_customer_id')
            .eq('user_id', user.id)
            .single();

        if (!subscription?.paddle_subscription_id) {
            return NextResponse.json({ invoices: [] }); // No sub, no invoices
        }

        // 3. Initialize Paddle
        const paddle = new Paddle(process.env.PADDLE_API_KEY || '');

        // 4. Fetch Transactions for this subscription
        const transactionCollection: any = await paddle.transactions.list({
            subscriptionId: [subscription.paddle_subscription_id],
            perPage: 20,
            status: ['completed', 'refunded', 'adjusted'] as any
        });

        // 5. Map to simple format
        // Check if structure matches expected iteration
        const dataItems = transactionCollection.items || [];
        const invoices = dataItems.map((txn: any) => ({
            id: txn.id,
            date: txn.createdAt,
            amount: txn.details?.totals?.total || '0',
            currency: txn.currencyCode,
            status: txn.status,
            invoiceId: txn.invoiceId,
            receiptUrl: txn.receiptNumber ? `https://paddle.com/receipt/${txn.receiptNumber}` : null
        }));

        return NextResponse.json({ invoices });

    } catch (error: any) {
        console.error('Fetch Invoices Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

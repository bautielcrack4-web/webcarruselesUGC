import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Verify webhook signature
function verifySignature(payload: string, signature: string, secret: string): boolean {
    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-signature') || '';
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

        // Verify webhook signature
        if (!verifySignature(body, signature, secret)) {
            console.error('Invalid webhook signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);
        const eventName = event.meta.event_name;
        const data = event.data;

        console.log('Lemon Squeezy Webhook Event:', eventName);

        switch (eventName) {
            case 'order_created':
                await handleOrderCreated(data);
                break;

            case 'subscription_created':
                await handleSubscriptionCreated(data);
                break;

            case 'subscription_updated':
                await handleSubscriptionUpdated(data);
                break;

            case 'subscription_cancelled':
                await handleSubscriptionCancelled(data);
                break;

            case 'subscription_resumed':
                await handleSubscriptionResumed(data);
                break;

            case 'subscription_expired':
                await handleSubscriptionExpired(data);
                break;

            default:
                console.log('Unhandled event:', eventName);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

async function handleOrderCreated(data: any) {
    console.log('Order created:', data.id);

    const customerId = data.attributes.customer_id;
    const userEmail = data.attributes.user_email;
    const total = data.attributes.total;

    // Log the order for tracking
    console.log(`Order ${data.id} created for ${userEmail} - Total: $${total / 100}`);
}

async function handleSubscriptionCreated(data: any) {
    console.log('Subscription created:', data.id);

    const customerId = data.attributes.customer_id;
    const variantId = data.attributes.variant_id;
    const status = data.attributes.status;

    // Get user_id from custom_data passed through checkout URL
    // The event structure has meta.custom_data.user_id
    const event = data; // data is already the full event
    const userId = data.attributes?.first_order_item?.custom_data?.user_id ||
        data.meta?.custom_data?.user_id;

    if (!userId) {
        console.error('No user_id found in custom_data. Full data:', JSON.stringify(data, null, 2));
        return;
    }

    console.log('Processing subscription for user:', userId);

    // Determine plan tier and credits based on variant
    const { planTier, credits } = getPlanDetails(variantId.toString());

    // Create or update subscription
    const { error: subError } = await supabase
        .from('user_subscriptions')
        .upsert({
            user_id: userId,
            lemonsqueezy_subscription_id: data.id.toString(),
            lemonsqueezy_customer_id: customerId.toString(),
            plan_tier: planTier,
            credits_remaining: credits,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id'
        });

    if (subError) {
        console.error('Error creating subscription:', subError);
        return;
    }

    // Log credit transaction
    await supabase.from('credit_transactions').insert({
        user_id: userId,
        amount: credits,
        type: 'purchase',
        description: `${planTier} plan subscription - ${credits} credits`,
    });

    console.log(`Subscription created for user ${userId}: ${planTier} plan with ${credits} credits`);
}

async function handleSubscriptionUpdated(data: any) {
    console.log('Subscription updated:', data.id);

    const subscriptionId = data.id;
    const status = data.attributes.status;
    const variantId = data.attributes.variant_id;

    // Find subscription
    const { data: subscription, error: findError } = await supabase
        .from('user_subscriptions')
        .select('user_id, credits_remaining')
        .eq('lemonsqueezy_subscription_id', subscriptionId)
        .single();

    if (findError || !subscription) {
        console.error('Subscription not found:', subscriptionId);
        return;
    }

    // If plan changed, update credits
    const { planTier, credits } = getPlanDetails(variantId);

    const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
            plan_tier: planTier,
            credits_remaining: credits,
            updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId);

    if (updateError) {
        console.error('Error updating subscription:', updateError);
        return;
    }

    // Log credit transaction
    await supabase.from('credit_transactions').insert({
        user_id: subscription.user_id,
        amount: credits,
        type: 'purchase',
        description: `Plan updated to ${planTier} - ${credits} credits`,
    });

    console.log(`Subscription ${subscriptionId} updated to ${planTier} plan`);
}

async function handleSubscriptionCancelled(data: any) {
    console.log('Subscription cancelled:', data.id);

    const subscriptionId = data.id;

    // Update subscription status
    const { error } = await supabase
        .from('user_subscriptions')
        .update({
            plan_tier: 'cancelled',
            updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId);

    if (error) {
        console.error('Error cancelling subscription:', error);
    }
}

async function handleSubscriptionResumed(data: any) {
    console.log('Subscription resumed:', data.id);

    const subscriptionId = data.id;
    const variantId = data.attributes.variant_id;

    const { planTier, credits } = getPlanDetails(variantId);

    // Reactivate subscription
    const { error } = await supabase
        .from('user_subscriptions')
        .update({
            plan_tier: planTier,
            credits_remaining: credits,
            updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId);

    if (error) {
        console.error('Error resuming subscription:', error);
    }
}

async function handleSubscriptionExpired(data: any) {
    console.log('Subscription expired:', data.id);

    const subscriptionId = data.id;

    // Set to free plan
    const { error } = await supabase
        .from('user_subscriptions')
        .update({
            plan_tier: 'free',
            credits_remaining: 0,
            updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId);

    if (error) {
        console.error('Error expiring subscription:', error);
    }
}

// Helper function to map variant IDs to plans
function getPlanDetails(variantId: string): { planTier: string; credits: number } {
    const planMap: Record<string, { planTier: string; credits: number }> = {
        '1180151': { planTier: 'starter', credits: 50 },
        '1180157': { planTier: 'pro', credits: 150 },
        '1180158': { planTier: 'business', credits: 500 },
    };

    return planMap[variantId] || { planTier: 'free', credits: 0 };
}

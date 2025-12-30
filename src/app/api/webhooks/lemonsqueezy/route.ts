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
                await handleOrderCreated(event);
                break;

            case 'subscription_created':
                await handleSubscriptionCreated(event);
                break;

            case 'subscription_updated':
                await handleSubscriptionUpdated(event);
                break;

            case 'subscription_cancelled':
                await handleSubscriptionCancelled(event);
                break;

            case 'subscription_resumed':
                await handleSubscriptionResumed(event);
                break;

            case 'subscription_expired':
                await handleSubscriptionExpired(event);
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

async function handleOrderCreated(event: any) {
    const data = event.data;
    console.log('Order created:', data.id);

    // Get custom data
    const customData = event.meta?.custom_data || data.attributes?.custom_data;
    const userId = customData?.user_id;
    const packId = customData?.pack_id;

    if (!userId || !packId) {
        console.log('Order created but missing user_id or pack_id in custom_data. Ignoring (could be a subscription order handled by other events).');
        return;
    }

    console.log(`Processing One-Time Pack: ${packId} for user ${userId}`);

    let creditsToAdd = 0;
    let packName = '';

    switch (packId) {
        case 'pack_starter':
            creditsToAdd = 50;
            packName = 'Starter Boost';
            break;
        case 'pack_pro':
            creditsToAdd = 150;
            packName = 'Pro Top-up';
            break;
        case 'pack_agency':
            creditsToAdd = 500;
            packName = 'Agency Scale';
            break;
        default:
            console.error('Unknown pack_id:', packId);
            return;
    }

    if (creditsToAdd > 0) {
        // 1. Get current subscription to add credits to it
        const { data: sub, error: subError } = await supabase
            .from('user_subscriptions')
            .select('credits_remaining, credits_total')
            .eq('user_id', userId)
            .single();

        if (subError && subError.code !== 'PGRST116') { // Ignore not found, we might create one? 
            // Actually, if they buy a pack they should ideally have a record, 
            // but if they are new users buying a pack (unlikely flow but possible), we might need to insert.
            // For now assume they have a row (created at signup).
            console.error('Error fetching subscription for pack update:', subError);
        }

        const currentRemaining = sub?.credits_remaining || 0;
        const currentTotal = sub?.credits_total || 0;

        // 2. Update Subscription (Add credits)
        const { error: updateError } = await supabase
            .from('user_subscriptions')
            .upsert({
                user_id: userId,
                credits_remaining: currentRemaining + creditsToAdd,
                credits_total: currentTotal + creditsToAdd,
                status: sub ? undefined : 'active', // If new, set active
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (updateError) {
            console.error('Error updating credits for pack:', updateError);
            return;
        }

        // 3. Log Transaction
        await supabase.from('credit_transactions').insert({
            user_id: userId,
            amount: creditsToAdd,
            type: 'purchase_pack',
            description: `${packName} - ${creditsToAdd} credits`,
        });

        console.log(`Successfully added ${creditsToAdd} credits to user ${userId}`);
    }
}

async function handleSubscriptionCreated(event: any) {
    const data = event.data;
    console.log('Subscription created:', data.id);

    const customerId = data.attributes.customer_id;
    const variantId = data.attributes.variant_id;
    const status = data.attributes.status;

    // Get user_id from meta.custom_data (where Lemon Squeezy puts it)
    const userId = event.meta?.custom_data?.user_id ||
        data.attributes?.first_order_item?.custom_data?.user_id;

    if (!userId) {
        console.error('No user_id found in custom_data. Full event meta:', JSON.stringify(event.meta, null, 2));
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
            plan_id: planTier,
            credits_remaining: credits,
            credits_total: credits,
            status: 'active',
            next_billing_date: data.attributes.renews_at,
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

async function handleSubscriptionUpdated(event: any) {
    const data = event.data;
    console.log('Subscription updated:', data.id);

    const subscriptionId = data.id;
    const status = data.attributes.status;
    const variantId = data.attributes.variant_id;

    // Find subscription
    const { data: subscription, error: findError } = await supabase
        .from('user_subscriptions')
        .select('user_id, credits_remaining')
        .eq('lemonsqueezy_subscription_id', subscriptionId.toString())
        .single();

    if (findError || !subscription) {
        console.error('Subscription not found:', subscriptionId);
        return;
    }

    // If plan changed, update credits
    const { planTier, credits } = getPlanDetails(variantId.toString());

    const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
            plan_id: planTier,
            credits_remaining: credits,
            credits_total: credits,
            status: 'active',
            updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId.toString());

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

async function handleSubscriptionCancelled(event: any) {
    const data = event.data;
    console.log('Subscription cancelled:', data.id);

    const subscriptionId = data.id;

    // Update subscription status
    const { error } = await supabase
        .from('user_subscriptions')
        .update({
            status: 'cancelled',
            updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId.toString());

    if (error) {
        console.error('Error cancelling subscription:', error);
    }
}

async function handleSubscriptionResumed(event: any) {
    const data = event.data;
    console.log('Subscription resumed:', data.id);

    const subscriptionId = data.id;
    const variantId = data.attributes.variant_id;

    const { planTier, credits } = getPlanDetails(variantId.toString());

    // Reactivate subscription
    const { error } = await supabase
        .from('user_subscriptions')
        .update({
            plan_id: planTier,
            credits_remaining: credits,
            credits_total: credits,
            status: 'active',
            updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId.toString());

    if (error) {
        console.error('Error resuming subscription:', error);
    }
}

async function handleSubscriptionExpired(event: any) {
    const data = event.data;
    console.log('Subscription expired:', data.id);

    const subscriptionId = data.id;

    // Set to free plan
    const { error } = await supabase
        .from('user_subscriptions')
        .update({
            plan_id: 'free',
            credits_remaining: 0,
            status: 'expired',
            updated_at: new Date().toISOString(),
        })
        .eq('lemonsqueezy_subscription_id', subscriptionId.toString());

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

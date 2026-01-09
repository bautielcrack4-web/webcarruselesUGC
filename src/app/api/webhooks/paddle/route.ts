import { NextResponse } from 'next/server';

// Placeholder Paddle webhook route - Not currently in use
// Lemon Squeezy is the active payment provider

export async function POST() {
    return NextResponse.json({
        error: 'Paddle webhooks are not configured. Use Lemon Squeezy.'
    }, { status: 501 });
}

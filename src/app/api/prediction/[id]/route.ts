import { NextResponse } from 'next/server';
import { getHeyGenVideoStatus } from '@/lib/heygen';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!process.env.HEYGEN_API_KEY) {
            return NextResponse.json({ error: 'Config error' }, { status: 500 });
        }

        const status = await getHeyGenVideoStatus(id);
        return NextResponse.json(status);
    } catch (err: any) {
        console.error('Prediction Status Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

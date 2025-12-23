import { NextResponse } from 'next/server';

const ATLAS_API_BASE = 'https://api.atlascloud.ai/api/v1/model';
const API_KEY = process.env.NEXT_PUBLIC_ATLASCLOUD_API_KEY;

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const response = await fetch(`${ATLAS_API_BASE}/prediction/${id}`, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const json = await response.json();
        return NextResponse.json(json);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

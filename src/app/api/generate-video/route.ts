import { NextResponse } from 'next/server';

const ATLAS_API_BASE = 'https://api.atlascloud.ai/api/v1/model';
const API_KEY = process.env.NEXT_PUBLIC_ATLASCLOUD_API_KEY; // Using the existing one for compatibility

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { image, prompt, duration, size } = body;

        console.log('API Route: Starting generation for', image);

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
        console.log('API Route: Atlas response:', json);

        if (!response.ok) {
            return NextResponse.json({ error: json.message || 'Error from AtlasCloud' }, { status: response.status });
        }

        return NextResponse.json(json);
    } catch (err: any) {
        console.error('API Route Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

/**
 * HeyGen API Client Wrapper
 */

const HEYGEN_API_BASE = 'https://api.heygen.com';
const API_KEY = process.env.HEYGEN_API_KEY;

export interface HeyGenVideoSettings {
    resolution?: '360p' | '720p' | '1080p';
}

export interface HeyGenDimension {
    width: number;
    height: number;
}

export interface HeyGenGenerateParams {
    image_url: string;
    script: string;
    dimension?: HeyGenDimension;
    voice_id?: string;
}

/**
 * Upload an image URL to HeyGen to get a talking_photo_id
 */
export async function uploadTalkingPhoto(imageUrl: string): Promise<string> {
    if (!API_KEY) throw new Error('HEYGEN_API_KEY is not configured');

    const response = await fetch(`${HEYGEN_API_BASE}/v1/talking_photo.upload`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': API_KEY
        },
        body: JSON.stringify({
            source_url: imageUrl
        })
    });

    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.error?.message || 'Failed to upload talking photo');
    }

    return json.data.talking_photo_id;
}

/**
 * Create a video generation task using a talking photo
 */
export async function generateHeyGenVideo(params: HeyGenGenerateParams): Promise<string> {
    if (!API_KEY) throw new Error('HEYGEN_API_KEY is not configured');

    // 1. First we need the talking photo ID
    const talkingPhotoId = await uploadTalkingPhoto(params.image_url);

    // 2. Then we generate the video
    const response = await fetch(`${HEYGEN_API_BASE}/v2/video_generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': API_KEY
        },
        body: JSON.stringify({
            video_settings: {
                resolution: '720p'
            },
            dimension: params.dimension || { width: 720, height: 1280 },
            character: {
                type: 'talking_photo',
                talking_photo_id: talkingPhotoId,
                avatar_style: 'normal'
            },
            script: {
                type: 'text',
                input_text: params.script
            }
        })
    });

    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.error?.message || 'Failed to generate HeyGen video');
    }

    return json.data.video_id;
}

/**
 * Get status of a HeyGen video task
 */
export async function getHeyGenVideoStatus(videoId: string) {
    if (!API_KEY) throw new Error('HEYGEN_API_KEY is not configured');

    const response = await fetch(`${HEYGEN_API_BASE}/v2/video_status/${videoId}`, {
        method: 'GET',
        headers: {
            'X-Api-Key': API_KEY
        }
    });

    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.error?.message || 'Failed to get video status');
    }

    // Mapping HeyGen status to our internal format
    // HeyGen statuses: 'pending', 'processing', 'completed', 'failed'
    const statusMap: Record<string, string> = {
        'pending': 'processing',
        'processing': 'processing',
        'completed': 'succeeded',
        'failed': 'failed'
    };

    return {
        id: videoId,
        status: statusMap[json.data.status] || 'processing',
        outputs: json.data.video_url ? [json.data.video_url] : [],
        error: json.data.error?.message
    };
}

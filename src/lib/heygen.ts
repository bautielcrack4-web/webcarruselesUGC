/**
 * HeyGen API Client Wrapper
 */

const HEYGEN_API_BASE = 'https://api.heygen.com';
const API_KEY = process.env.HEYGEN_API_KEY;

// Curated Stock Avatars from HeyGen (UGC-optimized selection)
export const STOCK_AVATARS = [
    { id: 'Kristin_public_2_20240108', name: 'Kristin', gender: 'female', style: 'casual', preview: 'https://files.heygen.ai/avatar/v3/f94222a03cee4adaa110761a374cfadc_13181/preview_talk_5.webp' },
    { id: 'josh_lite3_20230714', name: 'Josh', gender: 'male', style: 'casual', preview: 'https://files.heygen.ai/avatar/v3/10063c743f114722ab6538b35905c51c_3013/preview_target.webp' },
    { id: 'Anna_public_3_20240108', name: 'Anna', gender: 'female', style: 'professional', preview: 'https://files.heygen.ai/avatar/v3/3c427d8c81414355b04c2b25a1e7873a_13216/preview_talk_3.webp' },
    { id: 'Tyler-incasualsuit-20220721', name: 'Tyler', gender: 'male', style: 'professional', preview: 'https://files.heygen.ai/avatar/v3/79b245561ad448e796b7e77cd2773d0b_14263/preview_talk_11.webp' },
    { id: 'Kayla-incasualsuit-20220818', name: 'Kayla', gender: 'female', style: 'energetic', preview: 'https://files.heygen.ai/avatar/v3/bf83f0f830794d90b509ba6524962e05_1079/preview_talk_2.webp' },
    { id: 'Eric_public_pro2_20230608', name: 'Edward', gender: 'male', style: 'friendly', preview: 'https://files.heygen.ai/avatar/v3/bab998cb82fb4423b521341a9e962017_2662/preview_target.webp' },
    { id: 'Briana_public_3_20240110', name: 'Briana', gender: 'female', style: 'warm', preview: 'https://files.heygen.ai/avatar/v3/e50a097f50b541749c318dfedfe9c640_13311/preview_talk_4.webp' },
    { id: 'Wayne_20240711', name: 'Wayne', gender: 'male', style: 'confident', preview: 'https://files2.heygen.ai/avatar/v3/a3fdb0c652024f79984aaec11ebf2694_34350/preview_target.webp' },
    { id: 'Susan_public_2_20240328', name: 'Susan', gender: 'female', style: 'elegant', preview: 'https://files.heygen.ai/avatar/v3/5dc05aef0295473da983300f43abf7fd_17860/preview_talk_5.webp' },
    { id: 'Justin_public_3_20240308', name: 'Justin', gender: 'male', style: 'dynamic', preview: 'https://files.heygen.ai/avatar/v3/9ae54bef2c444d68bbbb63021df4bbbb_14944/preview_target.webp' },
    { id: 'Lily_public_pro1_20230614', name: 'Lily', gender: 'female', style: 'youthful', preview: 'https://files.heygen.ai/avatar/v3/51267c0f0f2045518a8c66bb1709bf2a_2654/preview_target.webp' },
    { id: 'Wade_public_2_20240228', name: 'Wade', gender: 'male', style: 'mature', preview: 'https://files.heygen.ai/avatar/v3/2bf6af4afbc24ad0ae8e1f2f5a8ac25b_15204/preview_talk_3.webp' },
];

export interface HeyGenVideoSettings {
    resolution?: '360p' | '720p' | '1080p';
}

export interface HeyGenDimension {
    width: number;
    height: number;
}

export interface HeyGenGenerateParams {
    image_url?: string; // For talking photo mode
    avatar_id?: string; // For stock avatar mode
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
 * Create a video generation task using a talking photo OR a stock avatar
 */
export async function generateHeyGenVideo(params: HeyGenGenerateParams): Promise<string> {
    if (!API_KEY) throw new Error('HEYGEN_API_KEY is not configured');

    // Determine character type based on params
    let characterPayload: any;

    if (params.avatar_id) {
        // Stock Avatar Mode
        characterPayload = {
            type: 'avatar',
            avatar_id: params.avatar_id,
            avatar_style: 'normal'
        };
    } else if (params.image_url) {
        // Talking Photo Mode - need to upload first
        const talkingPhotoId = await uploadTalkingPhoto(params.image_url);
        characterPayload = {
            type: 'talking_photo',
            talking_photo_id: talkingPhotoId,
            avatar_style: 'normal'
        };
    } else {
        throw new Error('Either avatar_id or image_url must be provided');
    }

    // Generate the video
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
            character: characterPayload,
            script: {
                type: 'text',
                input_text: params.script
            },
            voice: params.voice_id ? {
                voice_id: params.voice_id
            } : undefined
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

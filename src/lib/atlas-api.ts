/**
 * AtlasCloud IA Service for Sora 2 Image-to-Video
 */

const ATLAS_API_BASE = 'https://api.atlascloud.ai/api/v1/model';
const API_KEY = process.env.NEXT_PUBLIC_ATLASCLOUD_API_KEY;

export interface GenerationParams {
    image: string; // Public URL
    prompt: string;
    duration?: 10 | 15;
    size?: '720*1280' | '1280*720';
}

export interface PredictionResponse {
    id: string;
    status: 'starting' | 'processing' | 'completed' | 'failed';
    outputs?: string[];
    error?: string;
}

/**
 * Starts the video generation process
 */
export async function generateVideo(params: GenerationParams): Promise<string> {
    const response = await fetch(`${ATLAS_API_BASE}/generateVideo`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "openai/sora-2/image-to-video-developer",
            ...params
        })
    });

    const json = await response.json();

    if (!response.ok || json.code !== 200) {
        throw new Error(json.message || 'Failed to start video generation');
    }

    return json.data.id;
}

/**
 * Polls for the status of a specific prediction
 */
export async function getPredictionStatus(predictionId: string): Promise<PredictionResponse> {
    const response = await fetch(`${ATLAS_API_BASE}/prediction/${predictionId}`, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`
        }
    });

    const json = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch prediction status');
    }

    return {
        id: predictionId,
        status: json.status,
        outputs: json.outputs,
        error: json.error
    };
}

/**
 * Helper to wait until a video is ready
 */
export async function waitForVideo(
    predictionId: string,
    onProgress?: (status: string) => void
): Promise<string> {
    return new Promise((resolve, reject) => {
        const poll = async () => {
            try {
                const result = await getPredictionStatus(predictionId);

                if (onProgress) onProgress(result.status);

                if (result.status === 'completed' && result.outputs?.[0]) {
                    resolve(result.outputs[0]);
                } else if (result.status === 'failed') {
                    reject(new Error(result.error || 'Generation failed'));
                } else {
                    // Continue polling
                    setTimeout(poll, 5000);
                }
            } catch (err) {
                reject(err);
            }
        };

        poll();
    });
}

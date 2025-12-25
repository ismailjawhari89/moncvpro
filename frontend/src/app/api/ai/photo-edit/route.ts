import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 60; // 60 seconds for cloud API

/**
 * AI Photo Editor Controller - Cloud API Architecture (Replicate/FAL)
 * 
 * Flow:
 * 1. Receive Base64 Image from Frontend
 * 2. Call Replicate API for Virtual Try-On
 * 3. Return result URL to Frontend
 * 
 * REPLACES: Local OOTDiffusion (45+ min CPU) → Replicate (15-30 sec)
 */

// Garment images hosted online (you can replace with your own hosted images)
const GARMENT_LIBRARY: Record<string, string> = {
    'formal-suit': 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=768&h=1024&fit=crop',
    'blazer': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=768&h=1024&fit=crop',
    'professor': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=768&h=1024&fit=crop',
    'shirt': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=768&h=1024&fit=crop',
    'hoodie': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=768&h=1024&fit=crop',
    'scrubs': 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=768&h=1024&fit=crop',
};

// Mapping action to garment key
function getGarmentKey(action: string): string {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('formal') || actionLower.includes('suit')) return 'formal-suit';
    if (actionLower.includes('blazer') || actionLower.includes('casual')) return 'blazer';
    if (actionLower.includes('professor') || actionLower.includes('academic')) return 'professor';
    if (actionLower.includes('shirt') || actionLower.includes('dress')) return 'shirt';
    if (actionLower.includes('hoodie') || actionLower.includes('tech')) return 'hoodie';
    if (actionLower.includes('scrubs') || actionLower.includes('medical')) return 'scrubs';
    return 'formal-suit'; // default
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { image, action, prompt } = body;

        // console.log(`[AI Photo] Received request: ${action}`);

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Check for Replicate API key
        const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

        if (!REPLICATE_API_TOKEN) {
            // console.log('[AI Photo] No Replicate API key, returning demo mode');
            return NextResponse.json({
                success: true,
                imageUrl: '', // Return original
                demo: true,
                message: 'Demo Mode: Configure REPLICATE_API_TOKEN for AI processing'
            });
        }

        // Get garment URL based on action
        const garmentKey = getGarmentKey(action);
        const garmentUrl = GARMENT_LIBRARY[garmentKey];

        // Prepare image data
        // If image is base64, convert to data URL
        const humanImage = image.startsWith('data:') ? image : `data:image/png;base64,${image}`;

        // console.log(`[AI Photo] Using garment: ${garmentKey}`);
        // console.log(`[AI Photo] Calling Replicate API...`);

        // Call Replicate API - IDM-VTON model (best for virtual try-on)
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // IDM-VTON is one of the best virtual try-on models
                version: 'c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4',
                input: {
                    human_img: humanImage,
                    garm_img: garmentUrl,
                    garment_des: prompt || 'a professional business outfit',
                    is_checked: true,
                    is_checked_crop: false,
                    denoise_steps: 30,
                    seed: 42
                }
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('[AI Photo] Replicate API error:', error);
            throw new Error(`Replicate API error: ${response.status}`);
        }

        const prediction = await response.json();
        // console.log(`[AI Photo] Prediction started: ${prediction.id}`);

        // Poll for completion (Replicate is async)
        let result = prediction;
        let attempts = 0;
        const maxAttempts = 60; // 60 seconds max

        while (result.status !== 'succeeded' && result.status !== 'failed' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

            const pollResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
                headers: {
                    'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
                }
            });

            result = await pollResponse.json();
            attempts++;

            // console.log(`[AI Photo] Status: ${result.status} (attempt ${attempts})`);
        }

        if (result.status === 'failed') {
            throw new Error(result.error || 'Replicate prediction failed');
        }

        if (result.status !== 'succeeded') {
            throw new Error('Prediction timeout');
        }

        // Get the output image URL
        const outputUrl = Array.isArray(result.output) ? result.output[0] : result.output;

        console.log(`[AI Photo] Success: ${action}`);

        return NextResponse.json({
            success: true,
            imageUrl: outputUrl,
            message: 'AI outfit change successful!'
        });

    } catch (error: any) {
        console.error('[AI Photo] Handler Error:', error.message);

        // Return error with fallback to demo mode
        return NextResponse.json({
            success: false,
            imageUrl: '',
            demo: true,
            error: error.message,
            message: `AI Generation Failed: ${error.message.substring(0, 100)}`
        });
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/server-auth';
import { createClient } from '@supabase/supabase-js';

// Edge Runtime preferred for Cloudflare
export const runtime = 'edge';

// Initialize Supabase Client (Standard)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Contract:
// GET /api/cv -> Returns list of CVs
// POST /api/cv -> Saves (Upsert) a CV. Body: { id?: string, content: any }

export async function GET(req: NextRequest) {
    const user = await getAuthenticatedUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: req.headers.get('Authorization')! } }
    });

    const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
    const user = await getAuthenticatedUser(req);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, content } = body;

        if (!content) {
            return NextResponse.json({ error: 'Missing content' }, { status: 400 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: req.headers.get('Authorization')! } }
        });

        const timestamp = new Date().toISOString();

        let result;

        if (id) {
            // Update existing
            result = await supabase
                .from('resumes')
                .update({
                    content,
                    updated_at: timestamp
                })
                .eq('id', id)
                .eq('user_id', user.id) // Security: Ensure ownership
                .select()
                .single();
        } else {
            // Create new
            result = await supabase
                .from('resumes')
                .insert({
                    user_id: user.id,
                    content,
                    updated_at: timestamp
                })
                .select()
                .single();
        }

        if (result.error) {
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        // Edge Case: Update on non-existent or unowned ID
        if (id && !result.data) {
            return NextResponse.json({ error: 'Resume not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ data: result.data });

    } catch (e) {
        return NextResponse.json({ error: 'Invalid Request Body' }, { status: 400 });
    }
}

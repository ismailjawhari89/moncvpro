import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAuthenticatedUser } from '@/lib/server-auth';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: NextRequest) {
    try {
        // Authenticate user
        const user = await getAuthenticatedUser(req);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided" },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: req.headers.get('Authorization')! } }
        });

        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${user.id}.${fileExt}`;

        // Upload file to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(fileName, file, {
                contentType: file.type,
            });

        if (error) {
            console.error('Upload error:', error);
            return NextResponse.json(
                { success: false, message: "File upload failed" },
                { status: 500 }
            );
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase
            .storage
            .from('uploads')
            .getPublicUrl(data.path);

        return NextResponse.json({
            success: true,
            fileUrl: publicUrl,
            filePath: data.path,
            message: "File uploaded successfully"
        });

    } catch (err) {
        console.error('Upload API error:', err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
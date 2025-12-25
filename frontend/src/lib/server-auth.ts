import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

export async function getAuthenticatedUser(req: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase environment variables');
        return null;
    }

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');

    if (!authHeader) {
        return null;
    }

    // Create a Supabase client with the user's access token
    const supabase = createClient(supabaseUrl, supabaseKey, {
        global: {
            headers: {
                Authorization: authHeader,
            },
        },
    });

    // Verify the user
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return user;
}

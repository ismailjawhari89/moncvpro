import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Email validation helper
const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { success: false, message: "Please include a valid email" },
                { status: 400 }
            );
        }

        if (!password) {
            return NextResponse.json(
                { success: false, message: "Password is required" },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Login user using Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Login error:', error);
            return NextResponse.json(
                { success: false, message: "Invalid Credentials" },
                { status: 400 }
            );
        }

        // Return user data and session
        return NextResponse.json({
            success: true,
            user: {
                id: data.user?.id,
                email: data.user?.email,
            },
            session: data.session,
            message: "Login successful"
        });

    } catch (err) {
        console.error('Auth login error:', err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
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

        if (!password || password.length < 6) {
            return NextResponse.json(
                { success: false, message: "Please enter a password with 6 or more characters" },
                { status: 400 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Register user using Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            // Handle different error cases
            if (error.message.includes('already registered')) {
                return NextResponse.json(
                    { success: false, message: "User already exists" },
                    { status: 400 }
                );
            }

            console.error('Registration error:', error);
            return NextResponse.json(
                { success: false, message: "Server error during registration" },
                { status: 500 }
            );
        }

        // Supabase signUp returns user data including access token
        return NextResponse.json({
            success: true,
            user: {
                id: data.user?.id,
                email: data.user?.email,
            },
            message: "Registration successful. Please check your email for confirmation."
        });

    } catch (err) {
        console.error('Auth registration error:', err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to validate email simple regex
const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export async function POST(req: NextRequest) {
    try {
        const { email, source, honeypot } = await req.json();

        // 1. Anti-Spam: Honeypot check
        if (honeypot) {
            // If honeypot field is filled, it's likely a bot. 
            // Return success to confuse the bot, but don't save.
            return NextResponse.json({ success: true, message: "Added to waitlist" });
        }

        // 2. Validate Email
        if (!email || !isValidEmail(email)) {
            return NextResponse.json(
                { success: false, message: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        // 3. Insert into Supabase
        // Using upsert (ignore duplicates) or insert with error handling
        const { error } = await supabase
            .from('pro_waitlist')
            .insert([{ email, source: source || 'unknown' }]);

        // 4. Handle Duplicates (23505 is Postgres unique_violation code)
        if (error) {
            // Check for unique key violation
            if (error.code === '23505') {
                return NextResponse.json({
                    success: true,
                    message: "You are already on the list! We'll keep you posted."
                });
            }

            console.error('Waitlist insert error:', error);
            return NextResponse.json(
                { success: false, message: "Something went wrong. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "🎉 You’re on the list! Early access members will unlock special perks."
        });

    } catch (err) {
        console.error('Waitlist API error:', err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

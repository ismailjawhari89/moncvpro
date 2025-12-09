import { NextRequest, NextResponse } from 'next/server';

// NOTE: Puppeteer is too heavy for Cloudflare Pages build limits and not supported in Edge runtime.
// PDF export is disabled for this deployment.
// To enable PDF export, use a 3rd party API (e.g. Browserless, DocRaptor) or deploy to Vercel/Node.

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { html } = body;

        if (!html) {
            return NextResponse.json({ error: 'HTML content missing' }, { status: 400 });
        }

        console.log("PDF generation requested. Mocking response due to Cloudflare limits.");

        // Return a mock PDF or error explaining limitation
        // For now, we return a simple text file as PDF just to satisfy the interface or an error.
        // Returning 501 Not Implemented is appropriate.
        return NextResponse.json(
            { error: 'PDF Generation not supported on this environment', details: 'Cloudflare Workers cannot run Puppeteer.' },
            { status: 501 }
        );

    } catch (error) {
        console.error('PDF Export Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

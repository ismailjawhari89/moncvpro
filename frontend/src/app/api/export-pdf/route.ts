import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { html } = body;

        if (!html) {
            return NextResponse.json({ error: 'HTML content missing' }, { status: 400 });
        }

        // Launch Browser 
        // Note: In production (Vercel/Lambda), you'd need puppeteer-core and @sparticuz/chromium
        // For this "Production-Ready" local project, we use standard puppeteer.
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true
        });

        const page = await browser.newPage();

        // Inject content with Tailwind CDN for styling
        const completeHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
                    <style>
                        body { margin: 0; padding: 0; }
                        /* Ensure exact A4 sizing if needed */
                        @page { size: A4; margin: 0; }
                    </style>
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `;

        await page.setContent(completeHtml, {
            waitUntil: 'networkidle0', // Wait for external resources (fonts, cdn)
            timeout: 30000
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        await browser.close();

        return new NextResponse(new Blob([pdfBuffer as any], { type: 'application/pdf' }), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="cv-export.pdf"'
            }
        });

    } catch (error) {
        console.error('PDF Export Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

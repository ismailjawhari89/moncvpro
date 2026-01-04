
import type { Metadata } from "next";
// import "./globals.css"; // We don't have this yet, maybe omit or create minimal

export const metadata: Metadata = {
    title: "MonCVPro",
    description: "Professional CV Builder",
};

import "@/lib/config";
import SentryInit from "@/components/SentryInit";
import { Providers } from "@/providers/Providers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
                <SentryInit />
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}

'use client';

import Dashboard from '@/components/dashboard/Dashboard';

// Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

export default function DashboardPage() {
    return <Dashboard />;
}

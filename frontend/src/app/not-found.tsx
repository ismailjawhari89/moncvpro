import Link from 'next/link';

// 1. Edge Runtime for Not Found Page
export const runtime = 'edge';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
                The page you are looking for does not exist.
            </p>
            <Link
                href="/fr"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Go Home (Français)
            </Link>
        </div>
    );
}

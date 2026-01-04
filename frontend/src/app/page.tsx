'use client';

import CVBuilder from '../components/cv/CVBuilder';
import { useWebSocket } from '../hooks/useWebSocket';

export default function Home() {
    useWebSocket();

    return (
        <main style={{ height: '100vh' }}>
            <CVBuilder />
        </main>
    );
}

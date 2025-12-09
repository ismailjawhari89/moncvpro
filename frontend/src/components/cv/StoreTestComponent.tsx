'use client';
import React from 'react';
import { useCVStore } from '@/stores/useCVStore';

export default function StoreTestComponent() {
    const isLoading = useCVStore((state) => state.isLoading);
    return (
        <div className="p-4 bg-blue-100 border border-blue-500 rounded">
            Store Test: IsLoading = {String(isLoading)}
        </div>
    );
}

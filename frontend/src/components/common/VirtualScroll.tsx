// Virtual Scrolling Component for Long Lists
'use client';

import React, { useState, useRef, ReactNode } from 'react';

interface VirtualScrollProps<T> {
    items: T[];
    itemHeight: number;
    containerHeight: number;
    renderItem: (item: T, index: number) => ReactNode;
    overscan?: number;
}

export default function VirtualScroll<T>({
    items,
    itemHeight,
    containerHeight,
    renderItem,
    overscan = 3,
}: VirtualScrollProps<T>) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalHeight = items.length * itemHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
        items.length - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items.slice(startIndex, endIndex + 1);
    const offsetY = startIndex * itemHeight;

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{
                height: containerHeight,
                overflow: 'auto',
                position: 'relative',
            }}
            className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map((item, index) =>
                        renderItem(item, startIndex + index)
                    )}
                </div>
            </div>
        </div>
    );
}

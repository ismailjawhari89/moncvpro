import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getSpacingClass = (gap?: number) => {
    if (gap === undefined) return 'gap-4';
    if (gap >= 32) return 'gap-8';
    if (gap >= 24) return 'gap-6';
    if (gap >= 16) return 'gap-4';
    if (gap >= 12) return 'gap-3';
    return 'gap-2';
};

export const getFontSizeClass = (baseSize: number, scale: number = 1) => {
    const size = baseSize * scale;
    if (size >= 30) return 'text-3xl';
    if (size >= 24) return 'text-2xl';
    if (size >= 20) return 'text-xl';
    if (size >= 18) return 'text-lg';
    if (size >= 16) return 'text-base';
    if (size >= 14) return 'text-sm';
    return 'text-xs';
};

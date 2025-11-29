'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: Locale) => {
        const segments = pathname.split('/').filter(Boolean);
        if (locales.includes(segments[0] as Locale)) {
            segments.shift();
        }
        const newPath = `/${newLocale}/${segments.join('/')}`;
        router.push(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Switch language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales.map((l) => (
                    <DropdownMenuItem
                        key={l}
                        onClick={() => switchLocale(l)}
                        className={locale === l ? 'bg-accent' : ''}
                    >
                        {localeNames[l]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

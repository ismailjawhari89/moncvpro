'use client';

import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface RTLTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: 'start' | 'end' | 'center';
}

export function RTLText({ children, align = 'start', className, ...props }: RTLTextProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const alignmentClasses = {
    start: isRTL ? 'text-right' : 'text-left',
    end: isRTL ? 'text-left' : 'text-right',
    center: 'text-center'
  };

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(alignmentClasses[align], className)}
      {...props}
    >
      {children}
    </div>
  );
}

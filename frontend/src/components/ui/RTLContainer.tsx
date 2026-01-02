'use client';

import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface RTLContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function RTLContainer({ children, className, ...props }: RTLContainerProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className={cn(isRTL && 'font-cairo', className)}
      {...props}
    >
      {children}
    </div>
  );
}

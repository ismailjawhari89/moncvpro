'use client';

import React, { use } from 'react';
import ExamplesClient from './ExamplesClient';

export default function ExamplesPage(props: any) {
    // In Next.js 15, params is a Promise. We use React.use() to unwrap it.
    // We cast to any to avoid TS errors for now, or define interface.
    const params = use(props.params) as { locale: string };
    const locale = params.locale || 'ar';

    return <ExamplesClient locale={locale} />;
}

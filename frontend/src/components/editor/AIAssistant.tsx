'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Zap, Target, TrendingUp } from 'lucide-react';

export function AIAssistant() {
    const [loading, setLoading] = useState(false);
    const t = useTranslations('editor');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {t('aiAssistant')}
                </CardTitle>
                <CardDescription>{t('aiAssistantDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    {t('suggestLayout')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {t('checkATS')}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    {t('smartRewrite')}
                </Button>
            </CardContent>
        </Card>
    );
}

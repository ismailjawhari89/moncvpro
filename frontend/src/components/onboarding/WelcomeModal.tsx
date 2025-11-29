'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const t = useTranslations('onboarding');

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('hasSeenWelcome', 'true');
    };

    const steps = [
        { title: t('step1Title'), desc: t('step1Desc') },
        { title: t('step2Title'), desc: t('step2Desc') },
        { title: t('step3Title'), desc: t('step3Desc') },
        { title: t('step4Title'), desc: t('step4Desc') },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{steps[currentStep].title}</DialogTitle>
                    <DialogDescription>{steps[currentStep].desc}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {/* Step indicator */}
                    <div className="flex justify-center gap-2">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-2 w-2 rounded-full ${idx === currentStep ? 'bg-primary' : 'bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        {t('skip')}
                    </Button>
                    <Button onClick={handleNext}>
                        {currentStep === steps.length - 1 ? t('finish') : t('next')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

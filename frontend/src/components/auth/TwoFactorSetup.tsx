
'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, ShieldCheck, Copy, Check, Loader2, AlertTriangle } from 'lucide-react';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export const TwoFactorSetup = () => {
    const t = useTranslations('Auth');
    const [step, setStep] = useState<'initial' | 'setup' | 'enabled'>('initial');
    const [setupData, setSetupData] = useState<{ secret: string; qrCode: string } | null>(null);
    const [otp, setOtp] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    const initiateSetup = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post('/auth/2fa/setup');
            setSetupData(response.data);
            setStep('setup');
        } catch (error) {
            toast.error('Failed to initiate 2FA setup');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEnable = async () => {
        setIsProcessing(true);
        try {
            const response = await axios.post('/auth/2fa/enable', { otpToken: otp });
            setBackupCodes(response.data.backupCodes);
            setStep('enabled');
            toast.success('Two-Factor Authentication enabled!');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Invalid verification code');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyBackupCodes = () => {
        navigator.clipboard.writeText(backupCodes.join('\n'));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (step === 'initial') {
        return (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <div className="mx-auto w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-bold mb-2">Secure Your Account</h3>
                <p className="text-sm text-slate-500 mb-6">Add an extra layer of security by requiring a verification code from your device when you log in.</p>
                <Button onClick={initiateSetup} disabled={isProcessing} className="bg-violet-600 hover:bg-violet-700">
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enable 2FA
                </Button>
            </div>
        );
    }

    if (step === 'setup') {
        return (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="text-violet-600" />
                    Configure Authenticator app
                </h3>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            1. Install an authenticator app (like Google Authenticator or Authy).
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            2. Scan this QR code or enter the secret key manually.
                        </p>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-between font-mono text-xs">
                            <span className="truncate mr-2">{setupData?.secret}</span>
                            <button onClick={() => navigator.clipboard.writeText(setupData?.secret || '')} className="text-violet-600">
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center bg-white p-4 rounded-xl shadow-inner border border-slate-100">
                        {setupData?.qrCode && <img src={setupData.qrCode} alt="QR Code" className="w-40 h-40" />}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-top border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold mb-4">3. Enter the 6-digit code from your app:</p>
                    <div className="flex gap-4">
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="000000"
                            maxLength={6}
                            className="text-center font-mono text-xl tracking-widest h-12"
                        />
                        <Button onClick={handleEnable} disabled={isProcessing || otp.length !== 6} className="bg-violet-600 hover:bg-violet-700 h-12 px-8">
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Verify & Enable
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'enabled') {
        return (
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">2FA is Enabled!</h3>
                        <p className="text-xs text-emerald-600">Your account is now protected.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-emerald-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 font-bold text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        Save your backup codes
                    </div>
                    <p className="text-xs text-slate-500 mb-4">If you lose your device, you'll need one of these codes to log in. Each code can be used only once.</p>

                    <div className="grid grid-cols-2 gap-2 font-mono text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-lg mb-4">
                        {backupCodes.map((code, i) => (
                            <div key={i} className="flex justify-between">{code}</div>
                        ))}
                    </div>

                    <Button variant="outline" size="sm" onClick={copyBackupCodes} className="w-full">
                        {copied ? <Check className="mr-2 h-4 w-4 text-emerald-500" /> : <Copy className="mr-2 h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy Backup Codes'}
                    </Button>
                </div>
            </div>
        );
    }

    return null;
};

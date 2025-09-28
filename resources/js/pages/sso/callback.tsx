import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Head, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';

interface SsoCallbackQueryParams {
    sso_token?: string;
    state?: string;
    error?: string;
    target_app?: string;
    timestamp?: string;
}

interface SsoCallbackPageProps {
    ssoBaseUrl?: string;
}

export default function SsoCallback(): JSX.Element {
    const { ssoBaseUrl } = usePage<SsoCallbackPageProps>().props;
    const [status, setStatus] = useState<'validating' | 'success' | 'error'>('validating');
    const [message, setMessage] = useState('Memvalidasi token SSO...');
    const [error, setError] = useState<string | null>(null);

    // Get query parameters from URL
    useEffect(() => {
        console.log('SsoCallback component mounted, running useEffect...');
        console.log('ssoBaseUrl from props:', ssoBaseUrl);

        const params = new URLSearchParams(window.location.search);
        const queryParams: SsoCallbackQueryParams = {
            sso_token: params.get('sso_token') || undefined,
            state: params.get('state') || undefined,
            error: params.get('error') || undefined,
            target_app: params.get('target_app') || undefined,
            timestamp: params.get('timestamp') || undefined,
        };

        // console.log('Query params: ', queryParams);

        // Check if there's an error in the query params
        if (queryParams.error) {
            handleError(`SSO authentication failed: ${queryParams.error}`);
            return;
        }

        // Validate required parameters
        if (!queryParams.sso_token || !queryParams.state) {
            handleError('Missing required parameters: sso_token and state');
            return;
        }

        // Perform SSO validation
        validateSsoToken(queryParams.sso_token, queryParams.state);
    }, [ssoBaseUrl]);

    const validateSsoToken = async (ssoToken: string, state: string) => {
        try {
            setMessage('Menghubungi server SSO...');

            // Get SSO configuration from backend API since we need the API key which should not be exposed in frontend
            const configResponse = await fetch('/api/v1/auth/sso/config');
            if (!configResponse.ok) {
                throw new Error('Failed to retrieve SSO configuration from server');
            }

            const config = await configResponse.json();
            const ssoConfig = config?.ssoConfig?.digikoperasi;
            console.log(config);

            if (!ssoConfig || !ssoConfig.url || !ssoConfig.api_key) {
                throw new Error('SSO configuration is incomplete or unavailable');
            }

            // Call SSO server validation endpoint
            const url = `${ssoConfig.url}/redirect-sso/validate`;
            const responseValidate = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ssoConfig.api_key,
                    Origin: window.location.origin,
                },
                body: JSON.stringify({
                    sso_token: ssoToken,
                    state: state,
                }),
            });

            if (!responseValidate.ok) {
                const errorData = await responseValidate.json().catch(() => ({}));
                const errorMessage = errorData.message || errorData.error || `SSO validation failed with status: ${responseValidate.status}`;
                throw new Error(errorMessage);
            }

            const result = await responseValidate.json();

            if (!result?.data) {
                throw new Error('Invalid response from SSO server: missing data in response');
            }

            setMessage('Membuat sesi pengguna...');

            // Handle user login/create via backend API
            const loginResponse = await fetch('/api/v1/auth/sso/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_data: result.data,
                }),
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json().catch(() => ({}));
                const errorMessage = errorData.message || errorData.error || 'Failed to create user session';
                throw new Error(errorMessage);
            }

            const loginResult = await loginResponse.json();

            if (loginResult.requires_onboarding) {
                setMessage('Mengarahkan ke onboarding...');
                // Redirect to onboarding with prefilled data
                router.replace('/onboarding');
            } else {
                setMessage('Login berhasil, mengarahkan ke dashboard...');
                // Redirect to dashboard
                router.replace('/dashboard');
            }

            setStatus('success');
        } catch (err: any) {
            console.error('SSO validation error:', err);
            handleError(err.message || 'An unexpected error occurred during SSO validation');
        }
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
        setMessage('Validasi SSO gagal');
        setStatus('error');
        console.error('SSO Validation Error:', errorMessage);
    };

    // Render different UI based on status
    if (status === 'validating') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <Head title="SSO Validation" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md px-4"
                >
                    <Card className="overflow-hidden border-0 shadow-2xl">
                        <CardContent className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                }}
                                className="mx-auto mb-6"
                            >
                                <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                                    <ShieldCheck className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"
                                    />
                                </div>
                            </motion.div>

                            <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">Memvalidasi SSO</h2>
                            <p className="mb-6 text-slate-600 dark:text-slate-400">{message}</p>

                            <div className="flex justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 dark:from-slate-900 dark:to-slate-800">
                <Head title="SSO Validation Error" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md px-4"
                >
                    <Card className="overflow-hidden border-0 shadow-2xl">
                        <CardContent className="p-8 text-center">
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 260,
                                    damping: 20,
                                }}
                                className="mx-auto mb-6"
                            >
                                <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                                    <ShieldCheck className="h-10 w-10 text-red-600 dark:text-red-400" />
                                </div>
                            </motion.div>

                            <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">Validasi Gagal</h2>
                            <p className="mb-6 text-slate-600 dark:text-slate-400">
                                {error || 'An unexpected error occurred during SSO validation.'}
                            </p>

                            <Button variant="outline" className="w-full" onClick={() => (window.location.href = '/')}>
                                Kembali ke Halaman Utama
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Success state would redirect automatically, but we'll include a fallback UI
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
            <Head title="SSO Validation Success" />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md px-4"
            >
                <Card className="overflow-hidden border-0 shadow-2xl">
                    <CardContent className="p-8 text-center">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 260,
                                damping: 20,
                            }}
                            className="mx-auto mb-6"
                        >
                            <div className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
                                <ShieldCheck className="h-10 w-10 text-green-600 dark:text-green-400" />
                            </div>
                        </motion.div>

                        <h2 className="mb-2 text-2xl font-bold text-slate-800 dark:text-slate-100">Berhasil!</h2>
                        <p className="mb-6 text-slate-600 dark:text-slate-400">{message}</p>

                        <Button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                            onClick={() => (window.location.href = '/dashboard')}
                        >
                            Ke Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

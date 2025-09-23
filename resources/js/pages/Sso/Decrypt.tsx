import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'sonner';
import HeaderLayout from '@/layouts/header-layout';

interface DecryptProps {
    sampleData?: Record<string, any>;
}

export default function Decrypt({ sampleData }: DecryptProps) {
    const [encryptedValue, setEncryptedValue] = useState('');
    const [decryptedValue, setDecryptedValue] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDecrypt = async () => {
        if (!encryptedValue.trim()) {
            toast.error('Please enter an encrypted value');
            return;
        }

        setLoading(true);
        setDecryptedValue(null);
        setError(null);

        try {
            const response = await axios.post('/api/v1/auth/sso/decrypt', {
                value: encryptedValue,
            });

            if (response.data.success) {
                setDecryptedValue(response.data.data.decrypted);
                toast.success('Value decrypted successfully');
            } else {
                setError(response.data.message || 'Failed to decrypt value');
                toast.error(response.data.message || 'Failed to decrypt value');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to decrypt value. Check logs for details.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setEncryptedValue('');
        setDecryptedValue(null);
        setError(null);
    };

    return (
        <HeaderLayout>
            <div className="container mx-auto py-8">
                <Card className="mx-auto max-w-3xl">
                    <CardHeader>
                        <CardTitle>SSO Field Decryption</CardTitle>
                        <CardDescription>Decrypt encrypted SSO field values from Digikoperasi integration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="encrypted-value">Encrypted Value</Label>
                            <Textarea
                                id="encrypted-value"
                                value={encryptedValue}
                                onChange={(e) => setEncryptedValue(e.target.value)}
                                placeholder="Enter the encrypted value from SSO response"
                                rows={4}
                            />
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleDecrypt} disabled={loading}>
                                {loading ? 'Decrypting...' : 'Decrypt Value'}
                            </Button>
                            <Button variant="outline" onClick={handleClear}>
                                Clear
                            </Button>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 text-red-800">
                                <h3 className="font-medium">Decryption Error</h3>
                                <p className="mt-1 text-sm">{error}</p>
                                <p className="mt-2 text-xs">
                                    If decryption continues to fail, please check the application logs for more details or contact the Digikoperasi
                                    team.
                                </p>
                            </div>
                        )}

                        {decryptedValue && (
                            <div className="space-y-2">
                                <Label>Decrypted Value</Label>
                                <Card className="bg-muted">
                                    <CardContent className="p-4">
                                        {Array.isArray(decryptedValue) || typeof decryptedValue === 'object' ? (
                                            <pre className="overflow-x-auto text-sm">{JSON.stringify(decryptedValue, null, 2)}</pre>
                                        ) : (
                                            <pre className="overflow-x-auto text-sm">{decryptedValue}</pre>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {sampleData && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Sample Encrypted Fields</h3>
                                <div className="rounded-md bg-blue-50 p-4">
                                    <p className="text-sm text-blue-800">
                                        <strong>Note:</strong> Some values may not decrypt correctly due to encryption method differences. If
                                        decryption fails, please contact the Digikoperasi team for assistance.
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    {Object.entries(sampleData)
                                        .filter(
                                            ([key]) =>
                                                key !== 'sub' &&
                                                key !== 'email_verified' &&
                                                key !== 'account_status' &&
                                                key !== 'two_factor_enabled' &&
                                                key !== 'source_app' &&
                                                key !== 'final_redirect_url' &&
                                                key !== 'bank_account' &&
                                                key !== 'nib_file' &&
                                                key !== 'ktp_file' &&
                                                key !== 'npwp_file',
                                        )
                                        .map(([key, value]) => (
                                            <div key={key} className="flex items-start gap-3">
                                                <Label className="mt-2 w-32">{key}:</Label>
                                                <div className="flex-1 space-y-2">
                                                    <Input value={String(value)} readOnly className="font-mono text-xs" />
                                                    <Button size="sm" onClick={() => setEncryptedValue(String(value))} variant="secondary">
                                                        Use for Decryption
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </HeaderLayout>
    );
}

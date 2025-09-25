import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CreditLimitAlertProps {
    tenantId: string;
}

export default function CreditLimitAlert({ tenantId }: CreditLimitAlertProps) {
    const [creditLimit, setCreditLimit] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Fetch credit limit from API
    const fetchCreditLimit = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('credit.limit'));

            if (response.data.success) {
                setCreditLimit(response.data.remaining_credit);
                setLastUpdated(new Date());
                // Save to localStorage with timestamp
                const dataToStore = {
                    creditLimit: response.data.remaining_credit,
                    timestamp: Date.now(),
                    formattedCredit: response.data.formatted_credit,
                };
                localStorage.setItem('creditLimitData', JSON.stringify(dataToStore));
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            setError('Failed to fetch credit limit');
            // Try to get from localStorage as fallback
            const storedData = localStorage.getItem('creditLimitData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setCreditLimit(parsedData.creditLimit);
                setLastUpdated(new Date(parsedData.timestamp));
            }
        } finally {
            setLoading(false);
        }
    };

    // Check if we should update from API (5 minutes cache)
    const shouldUpdateFromAPI = () => {
        const storedData = localStorage.getItem('creditLimitData');
        if (!storedData) return true;

        const parsedData = JSON.parse(storedData);
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000; // 5 minutes in milliseconds

        return parsedData.timestamp < fiveMinutesAgo;
    };

    // Load initial data
    useEffect(() => {
        // Check localStorage first
        const storedData = localStorage.getItem('creditLimitData');
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setCreditLimit(parsedData.creditLimit);
            setLastUpdated(new Date(parsedData.timestamp));

            // If data is less than 5 minutes old, don't fetch from API
            if (!shouldUpdateFromAPI()) {
                setLoading(false);
                return;
            }
        }

        // Fetch from API if needed
        fetchCreditLimit();

        // Set up interval to refresh every 5 minutes
        const interval = setInterval(
            () => {
                fetchCreditLimit();
            },
            5 * 60 * 1000,
        ); // 5 minutes

        return () => clearInterval(interval);
    }, [tenantId]);

    // Don't show if not SSO user or no tenant ID
    if (!tenantId) {
        return null;
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formattedLastUpdated = lastUpdated ? `${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Just now';

    return (
        <Alert variant="default" className="bg-card-foreground p-3 drop-shadow-2xl backdrop-blur sm:p-4">
            <AlertDescription>
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-primary">Credit Limit:</span>
                            {loading ? (
                                <div className="h-5 w-24 animate-pulse rounded bg-gray-300/50 dark:bg-zinc-600/50"></div>
                            ) : error ? (
                                <span className="text-sm text-red-500">{error}</span>
                            ) : creditLimit !== null ? (
                                <div>
                                    <span className="text-sm text-white dark:text-zinc-700">{formatCurrency(creditLimit)}</span>
                                </div>
                            ) : (
                                <span className="text-sm">Unable to load</span>
                            )}
                        </div>
                        <span className="text-xs text-primary-foreground opacity-75">Last updated: {formattedLastUpdated}</span>
                    </div>
                    <Info className="my-auto size-6 flex-shrink-0 text-primary sm:size-8" />
                </div>
            </AlertDescription>
        </Alert>
    );
}

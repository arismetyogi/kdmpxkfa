import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashMessageProps {
    message?: string;
    type?: 'success' | 'error' | 'info';
    onClose?: () => void;
}

export default function FlashMessage({ message, type = 'info', onClose }: FlashMessageProps) {
    const [isVisible, setIsVisible] = useState(!!message);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message || !isVisible) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5" />;
            case 'error':
                return <AlertCircle className="h-5 w-5" />;
            default:
                return <Info className="h-5 w-5" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200';
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 border rounded-lg shadow-lg ${getStyles()}`}>
            {getIcon()}
            <span className="font-medium">{message}</span>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                    setIsVisible(false);
                    onClose?.();
                }}
                className="ml-auto h-6 w-6 p-0 hover:bg-transparent"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}

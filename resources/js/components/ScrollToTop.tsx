// src/components/ScrollToTopButton.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ScrollToTopButtonProps {
    PC?: boolean;
    tops?: number;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ PC = false, tops = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        setIsVisible(window.pageYOffset > 300);
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: tops || 0,
            behavior: 'smooth',
        });
    };

    return (
        <>
            {/* Mobile floating version */}
            <Button
                size="icon"
                variant="default"
                onClick={scrollToTop}
                className={cn(
                    'fixed right-4 bottom-28 z-20 h-11 w-11 rounded-full shadow-lg transition-opacity duration-300',
                    'lg:hidden', // hide on desktop
                    isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                aria-label="Scroll to top"
            >
                <ArrowUp className="h-6 w-6" />
            </Button>

            {/* Desktop version (only if PC=true) */}
            {PC && (
                <Button
                    size="default"
                    variant="default"
                    onClick={scrollToTop}
                    className={cn(
                        'fixed right-10 bottom-10 z-20 rounded-full px-6 py-3 text-base shadow-lg transition-opacity duration-300',
                        'hidden lg:flex', // show only on desktop
                        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0',
                    )}
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="h-full w-full" />
                </Button>
            )}
        </>
    );
};

export default ScrollToTopButton;

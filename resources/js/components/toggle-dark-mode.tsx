'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { MoonStar, Sun } from 'lucide-react';
import { ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation';

const DarkModeToggle = () => {
    const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
        animationType: ThemeAnimationType.BLUR_CIRCLE,
        blurAmount: 4,
        duration: 1000,
    });

    return (
        <button ref={ref} onClick={toggleSwitchTheme} className="mx-auto rounded-full p-2">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDarkMode ? 'moon' : 'sun'}
                    initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    {isDarkMode ? <MoonStar className="h-6 w-6 text-zinc-400" /> : <Sun className="h-6 w-6 text-yellow-500" />}
                </motion.div>
            </AnimatePresence>
        </button>
    );
};

export default DarkModeToggle;

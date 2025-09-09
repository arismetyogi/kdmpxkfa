'use client'

import React from 'react'
import { ThemeAnimationType, useModeAnimation } from 'react-theme-switch-animation'
import { MoonStar, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DarkModeToggle = () => {
    const { ref, toggleSwitchTheme, isDarkMode } = useModeAnimation({
        animationType: ThemeAnimationType.BLUR_CIRCLE,
        blurAmount: 4,
        duration: 1000,
    })

    return (
        <button ref={ref} onClick={toggleSwitchTheme} className="p-2 rounded-full mx-auto">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDarkMode ? 'moon' : 'sun'}
                    initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    {isDarkMode ? (
                        <MoonStar className="w-6 h-6 text-zinc-400" />
                    ) : (
                        <Sun className="w-6 h-6 text-yellow-500" />
                    )}
                </motion.div>
            </AnimatePresence>
        </button>
    )
}

export default DarkModeToggle

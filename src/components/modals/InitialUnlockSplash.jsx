import React from 'react';
import { motion } from 'framer-motion';

export function InitialUnlockSplash({ 
    isAudioUnlocked, 
    onUnlock 
}) {
    if (isAudioUnlocked) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onClick={onUnlock}
            onTouchStart={onUnlock}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto bg-black/90 cursor-pointer select-none"
        >
            {/* Pure Clean Luxury Void - No clutter, just capture touch anywhere to start */}
        </motion.div>
    );
}

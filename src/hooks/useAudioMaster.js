import { useState, useEffect, useRef } from 'react';
import { MR_AUDIO_SRC } from '../constants/frames';

export function useAudioMaster() {
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showWelcomeBack, setShowWelcomeBack] = useState(false);
    const [isFlowsHit, setIsFlowsHit] = useState(false);
    const mrAudioRef = useRef(null);
    const hasLeftRef = useRef(false);

    // Bulletproof Mobile Native Gesture Audio Unlocker
    useEffect(() => {
        const unlock = () => {
            if (mrAudioRef.current && !isAudioUnlocked) {
                mrAudioRef.current.volume = 0.85;
                const playPromise = mrAudioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsAudioUnlocked(true);
                        })
                        .catch((err) => {
                            console.warn("Mobile audio autoplay awaiting gesture:", err);
                        });
                }
            }
        };

        window.addEventListener('touchstart', unlock, { passive: true });
        window.addEventListener('touchend', unlock, { passive: true });
        window.addEventListener('pointerdown', unlock, { passive: true });
        window.addEventListener('click', unlock, { passive: true });

        return () => {
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('touchend', unlock);
            window.removeEventListener('pointerdown', unlock);
            window.removeEventListener('click', unlock);
        };
    }, [isAudioUnlocked]);

    // Focus / Home-Key / Tab Inactive Detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // User pressed home key or changed tab -> Pause immediately
                if (mrAudioRef.current && isAudioUnlocked) {
                    mrAudioRef.current.pause();
                    hasLeftRef.current = true;
                }
            } else {
                // User returned to the app -> Trigger Welcome Back 5s countdown
                if (hasLeftRef.current && isAudioUnlocked) {
                    setShowWelcomeBack(true);
                }
            }
        };

        const handleBlur = () => {
            if (mrAudioRef.current && isAudioUnlocked) {
                mrAudioRef.current.pause();
                hasLeftRef.current = true;
            }
        };

        const handleFocus = () => {
            if (hasLeftRef.current && isAudioUnlocked) {
                setShowWelcomeBack(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [isAudioUnlocked]);

    const forceUnlockAudio = () => {
        if (mrAudioRef.current) {
            mrAudioRef.current.volume = 0.85;
            mrAudioRef.current.play().then(() => {
                setIsAudioUnlocked(true);
            }).catch(() => {});
        }
        setIsAudioUnlocked(true);
    };

    const handleFlowsHit = () => {
        setIsFlowsHit(true);
        setTimeout(() => setIsFlowsHit(false), 950);
    };

    const handleToggleMute = () => {
        setIsMuted((prev) => {
            const next = !prev;
            if (mrAudioRef.current) {
                mrAudioRef.current.muted = next;
            }
            return next;
        });
    };

    // Resume Audio after Welcome Back Countdown finishes
    const handleResumeFromWelcomeBack = () => {
        setShowWelcomeBack(false);
        hasLeftRef.current = false;
        if (mrAudioRef.current && !isMuted) {
            mrAudioRef.current.play().catch(() => {});
        }
    };

    return {
        isAudioUnlocked,
        isMuted,
        showWelcomeBack,
        isFlowsHit,
        handleFlowsHit,
        mrAudioRef,
        forceUnlockAudio,
        handleToggleMute,
        handleResumeFromWelcomeBack
    };
}

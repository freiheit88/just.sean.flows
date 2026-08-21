import { useState, useEffect, useRef } from 'react';
import { MR_AUDIO_SRC } from '../constants/frames';

export function useAudioMaster() {
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const mrAudioRef = useRef(null);

    // Bulletproof Mobile Native Gesture Audio Unlocker
    useEffect(() => {
        const unlock = () => {
            if (mrAudioRef.current) {
                mrAudioRef.current.volume = 0.85;
                const playPromise = mrAudioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsAudioUnlocked(true);
                        })
                        .catch((err) => {
                            console.warn("Mobile audio autoplay blocked, awaiting gesture:", err);
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
    }, []);

    const forceUnlockAudio = () => {
        if (mrAudioRef.current) {
            mrAudioRef.current.volume = 0.85;
            mrAudioRef.current.play().then(() => {
                setIsAudioUnlocked(true);
            }).catch(() => {});
        }
        setIsAudioUnlocked(true);
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

    return {
        isAudioUnlocked,
        isMuted,
        mrAudioRef,
        forceUnlockAudio,
        handleToggleMute
    };
}

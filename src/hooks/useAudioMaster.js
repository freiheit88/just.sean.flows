import { useState, useEffect, useRef } from 'react';
import { MR_AUDIO_SRC } from '../constants/frames';

export function useAudioMaster() {
    const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [showWelcomeBack, setShowWelcomeBack] = useState(false);
    const [isFlowsHit, setIsFlowsHit] = useState(false);
    const [isModalActive, setIsModalActive] = useState(false);
    const mrAudioRef = useRef(null);
    const hasLeftRef = useRef(false);
    const isModalActiveRef = useRef(false);

    useEffect(() => {
        isModalActiveRef.current = isModalActive;
        if (isModalActive && mrAudioRef.current) {
            mrAudioRef.current.pause();
            mrAudioRef.current.muted = true;
        } else if (!isModalActive && mrAudioRef.current && isAudioUnlocked && !isMuted) {
            mrAudioRef.current.muted = false;
        }
    }, [isModalActive, isAudioUnlocked, isMuted]);

    // Audio unlocked strictly via user interaction through forceUnlockAudio()

    // Focus / Home-Key / Tab Inactive Detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (mrAudioRef.current && isAudioUnlocked) {
                    mrAudioRef.current.pause();
                    hasLeftRef.current = true;
                }
            } else {
                if (hasLeftRef.current && isAudioUnlocked && !isModalActiveRef.current) {
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
            if (hasLeftRef.current && isAudioUnlocked && !isModalActiveRef.current) {
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
        setIsAudioUnlocked(true);
        if (!isModalActiveRef.current && mrAudioRef.current) {
            mrAudioRef.current.volume = 0.85;
            mrAudioRef.current.play().catch(() => {});
        }
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

    const handleResumeFromWelcomeBack = () => {
        setShowWelcomeBack(false);
        hasLeftRef.current = false;
        if (mrAudioRef.current && !isMuted && !isModalActiveRef.current) {
            mrAudioRef.current.play().catch(() => {});
        }
    };

    return {
        isAudioUnlocked,
        isMuted,
        showWelcomeBack,
        isFlowsHit,
        isModalActive,
        setIsModalActive,
        handleFlowsHit,
        mrAudioRef,
        forceUnlockAudio,
        handleToggleMute,
        handleResumeFromWelcomeBack
    };
}

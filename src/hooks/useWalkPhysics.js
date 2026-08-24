import { useState, useEffect, useRef, useCallback } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isAtelierModalOpen, setIsAtelierModalOpen] = useState(false);

    const progressRef = useRef(0);
    const isHoldingTouchRef = useRef(false);
    const touchHoldIntervalRef = useRef(null);

    const audioCtxRef = useRef(null);
    const footstepAudioRef = useRef(null);
    const footstepBufferRef = useRef(null);
    const isFetchingRef = useRef(false);
    const lastFootstepTimeRef = useRef(0);

    // 1. Audio Engine Preload
    useEffect(() => {
        const initAudio = async () => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;
            try {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                if (AudioCtxClass) {
                    audioCtxRef.current = new AudioCtxClass();
                    const resp = await fetch('/assets/footstep_crunch.mp3').catch(() => null);
                    if (resp && resp.ok) {
                        const arrayBuffer = await resp.arrayBuffer();
                        footstepBufferRef.current = await audioCtxRef.current.decodeAudioData(arrayBuffer);
                    }
                }
            } catch (e) {
                console.warn("Footstep buffer load:", e);
            }
            try {
                footstepAudioRef.current = new Audio('/assets/footstep_crunch.mp3');
                footstepAudioRef.current.volume = 0.18;
            } catch (e) {}
        };
        initAudio();
    }, []);

    const playFootstepSound = useCallback(() => {
        if (!isAudioUnlocked) return;
        const now = Date.now();
        if (now - lastFootstepTimeRef.current < 180) return; // Debounce rapid footsteps
        lastFootstepTimeRef.current = now;

        if (audioCtxRef.current && footstepBufferRef.current) {
            try {
                if (audioCtxRef.current.state === 'suspended') {
                    audioCtxRef.current.resume();
                }
                const source = audioCtxRef.current.createBufferSource();
                source.buffer = footstepBufferRef.current;
                const gainNode = audioCtxRef.current.createGain();
                gainNode.gain.value = 0.18;
                source.connect(gainNode);
                gainNode.connect(audioCtxRef.current.destination);
                source.start(0);
                return;
            } catch (e) {}
        }
        if (footstepAudioRef.current) {
            try {
                footstepAudioRef.current.currentTime = 0;
                footstepAudioRef.current.volume = 0.18;
                footstepAudioRef.current.play().catch(() => {});
            } catch (e) {}
        }
    }, [isAudioUnlocked]);

    // 2. Map Progress (0 ~ 100) to Active Frame Index (0 ~ 7)
    const updateProgress = useCallback((delta) => {
        setProgress((prev) => {
            const next = Math.max(0, Math.min(100, prev + delta));
            progressRef.current = next;

            // Frame mapping: 8 frames (0 to 7) distributed evenly across 100%
            let frameIdx = Math.min(7, Math.floor((next / 100) * 8));
            setActiveFrameIdx(frameIdx);
            return next;
        });
    }, []);

    // 3. Gentle Ambient Drift (0.04% per 50ms)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const autoDriftInterval = setInterval(() => {
            if (progressRef.current < 100) {
                updateProgress(0.045);
            }
        }, 50);

        return () => clearInterval(autoDriftInterval);
    }, [isAudioUnlocked, updateProgress]);

    // 4. Robust Wheel, Touch & Mobile Gesture Handler
    useEffect(() => {
        if (!isAudioUnlocked) return;

        // Mouse Wheel Scroll Handler
        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .overflow-x-auto, button, input');
            if (isScrollableChild) return;

            if (e.deltaY > 0) {
                if (triggerDopamineScrollUp) triggerDopamineScrollUp();
                playFootstepSound();
                const deltaProgress = Math.min(e.deltaY * 0.0035, 1.5);
                updateProgress(deltaProgress);
            }
        };

        // Mobile Touch Gesture & Hold Handler
        let touchStartY = 0;
        let touchStartX = 0;

        const handleTouchStart = (e) => {
            const isInteractive = e.target.closest('button, input, a, .overflow-x-auto');
            if (isInteractive) return;

            if (e.touches && e.touches[0]) {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
                isHoldingTouchRef.current = true;

                // Immediate step on tap
                if (triggerDopamineScrollUp) triggerDopamineScrollUp();
                playFootstepSound();
                updateProgress(0.6);

                // Continuous Hold-to-Walk Loop
                if (touchHoldIntervalRef.current) clearInterval(touchHoldIntervalRef.current);
                touchHoldIntervalRef.current = setInterval(() => {
                    if (isHoldingTouchRef.current && progressRef.current < 100) {
                        playFootstepSound();
                        updateProgress(0.75); // Continuous advance while finger is held
                    }
                }, 120);
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                const currentY = e.touches[0].clientY;
                const deltaY = touchStartY - currentY;
                const currentX = e.touches[0].clientX;
                const deltaX = Math.abs(touchStartX - currentX);

                // If vertical swipe up or down
                if (Math.abs(deltaY) > 4 && deltaX < Math.abs(deltaY) * 1.8) {
                    if (triggerDopamineScrollUp) triggerDopamineScrollUp();
                    playFootstepSound();
                    const swipeProgress = Math.min(Math.abs(deltaY) * 0.015, 2.5);
                    updateProgress(swipeProgress);
                    touchStartY = currentY;
                }
            }
        };

        const handleTouchEnd = () => {
            isHoldingTouchRef.current = false;
            if (touchHoldIntervalRef.current) {
                clearInterval(touchHoldIntervalRef.current);
                touchHoldIntervalRef.current = null;
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });
        window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
            window.removeEventListener('touchcancel', handleTouchEnd);
            if (touchHoldIntervalRef.current) clearInterval(touchHoldIntervalRef.current);
        };
    }, [isAudioUnlocked, triggerDopamineScrollUp, playFootstepSound, updateProgress]);

    const handleVideoCompleted = () => {
        updateProgress(15);
    };

    const resetWalk = () => {
        setProgress(0);
        progressRef.current = 0;
        setActiveFrameIdx(0);
    };

    return {
        progress,
        activeFrameIdx,
        isAtelierModalOpen,
        playFootstepSound,
        setIsAtelierModalOpen,
        handleVideoCompleted,
        resetWalk
    };
}

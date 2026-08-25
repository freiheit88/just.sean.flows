import { useState, useEffect, useRef, useCallback } from 'react';

export function useWalkPhysics({ isAudioUnlocked, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isStep25Active, setIsStep25Active] = useState(false);
    const [stepSubCount, setStepSubCount] = useState(0);
    const [walkBobTrigger, setWalkBobTrigger] = useState(0);
    const [isAtelierModalOpen, setIsAtelierModalOpen] = useState(false);

    const progressRef = useRef(0);
    const activeFrameIdxRef = useRef(0);
    const lastStepChangeTimeRef = useRef(Date.now());
    const stepClickCounterRef = useRef(0);

    // Reset Step Timer when Audio Unlocks
    useEffect(() => {
        if (isAudioUnlocked) {
            lastStepChangeTimeRef.current = Date.now();
            stepClickCounterRef.current = 0;
            setStepSubCount(0);
            setIsStep25Active(false);
        }
    }, [isAudioUnlocked]);

    // 1. EXPLICIT STEP JUMP
    const goToStep = useCallback((stepIdx) => {
        const clampedIdx = Math.max(0, Math.min(6, stepIdx));
        activeFrameIdxRef.current = clampedIdx;
        setActiveFrameIdx(clampedIdx);
        setIsStep25Active(false);
        lastStepChangeTimeRef.current = Date.now();
        stepClickCounterRef.current = 0;
        setStepSubCount(0);
        setWalkBobTrigger(prev => prev + 1);

        const targetProgress = (clampedIdx / 6) * 100;
        progressRef.current = targetProgress;
        setProgress(targetProgress);
    }, []);

    const stepForward = useCallback(() => {
        if (activeFrameIdxRef.current === 1) return;
        goToStep(activeFrameIdxRef.current + 1);
    }, [goToStep]);

    const stepBackward = useCallback(() => {
        if (activeFrameIdxRef.current === 1) return;
        goToStep(activeFrameIdxRef.current - 1);
    }, [goToStep]);

    // 2. VIDEO PROGRESS SYNC FOR STEP 2 (Strictly follows video duration)
    const handleVideoTimeUpdate = useCallback((currentTime, duration) => {
        if (activeFrameIdxRef.current !== 1 || !duration || duration <= 0) return;
        const videoFraction = Math.min(1.0, Math.max(0, currentTime / duration));
        const videoProgress = (1 / 6) * 100 + videoFraction * (100 / 6);
        progressRef.current = videoProgress;
        setProgress(videoProgress);
    }, []);

    // 3. STEP 2 VIDEO COMPLETED -> OPEN STEP 2.5 POPUP (5.0s DWELL)
    const handleVideoCompleted = useCallback(() => {
        setIsStep25Active(true);
    }, []);

    const handleCompleteStep25 = useCallback(() => {
        setIsStep25Active(false);
        goToStep(2); // Advance to Step 3
    }, [goToStep]);

    // 4. 24-CLICK ARCHITECTURE WITH 1ST-PERSON FORWARD STEP ZOOM
    const handleStepInput = useCallback((points = 4) => {
        if (!isAudioUnlocked) return;

        const currentIdx = activeFrameIdxRef.current;

        // RULE: During Step 2 Video (idx 1) or Step 2.5 Popup, inputs are frozen
        if (currentIdx === 1 || isStep25Active) {
            return;
        }

        const now = Date.now();
        const timeInStep = (now - lastStepChangeTimeRef.current) / 1000;

        if (triggerDopamineScrollUp) triggerDopamineScrollUp();

        const requiredFreeze = (currentIdx === 0) ? 2.0 : 1.0;
        if (timeInStep < requiredFreeze) {
            return;
        }

        stepClickCounterRef.current += points;
        const currentSub = Math.min(4, Math.floor(stepClickCounterRef.current / 4));
        setStepSubCount(currentSub);
        setWalkBobTrigger(prev => prev + 1);

        const baseProgress = (currentIdx / 6) * 100;
        const subStepProgress = (Math.min(16, stepClickCounterRef.current) / 16) * (100 / 6);
        const liveProgress = Math.min(100, baseProgress + subStepProgress);
        progressRef.current = liveProgress;
        setProgress(liveProgress);

        if (stepClickCounterRef.current >= 16) {
            const nextIdx = Math.min(6, currentIdx + 1);
            if (nextIdx !== currentIdx) {
                goToStep(nextIdx);
            } else {
                stepClickCounterRef.current = 0;
            }
        }
    }, [isAudioUnlocked, isStep25Active, triggerDopamineScrollUp, goToStep]);

    // 5. AUTOMATIC PASSIVE DRIFT (4.0s Fixed Dwell per Step, Step 2 is 100% Video-Driven)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const autoStepInterval = setInterval(() => {
            const currentIdx = activeFrameIdxRef.current;
            if (currentIdx === 1 || currentIdx >= 6 || isStep25Active) return;

            const now = Date.now();
            const timeSinceStepChange = (now - lastStepChangeTimeRef.current) / 1000;

            const baseProgress = (currentIdx / 6) * 100;
            const autoDwellTime = 4.0;
            const liveFraction = Math.min(1.0, timeSinceStepChange / autoDwellTime);
            const liveProgress = Math.min(100, baseProgress + liveFraction * (100 / 6));
            progressRef.current = liveProgress;
            setProgress(liveProgress);

            if (timeSinceStepChange >= autoDwellTime) {
                goToStep(currentIdx + 1);
            }
        }, 80);

        return () => clearInterval(autoStepInterval);
    }, [isAudioUnlocked, isStep25Active, goToStep]);

    // 6. GLOBAL CLICK, WHEEL & TOUCH HANDLERS
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const handleClick = (e) => {
            const isInteractive = e.target.closest('button, input, a, .overflow-x-auto, .overflow-y-auto');
            if (isInteractive) return;
            handleStepInput(4);
        };

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .overflow-x-auto, button, input');
            if (isScrollableChild) return;

            if (e.deltaY > 15) {
                handleStepInput(8);
            }
        };

        let touchStartY = 0;
        let touchStartX = 0;

        const handleTouchStart = (e) => {
            const isInteractive = e.target.closest('button, input, a, .overflow-x-auto');
            if (isInteractive) return;

            if (e.touches && e.touches[0]) {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            }
        };

        const handleTouchEnd = (e) => {
            const isInteractive = e.target.closest('button, input, a, .overflow-x-auto');
            if (isInteractive) return;

            if (e.changedTouches && e.changedTouches[0]) {
                const deltaY = touchStartY - e.changedTouches[0].clientY;
                const deltaX = Math.abs(touchStartX - e.changedTouches[0].clientX);

                if (deltaY > 30 && deltaX < deltaY * 1.5) {
                    handleStepInput(8);
                } else if (Math.abs(deltaY) < 10 && deltaX < 10) {
                    handleStepInput(4);
                }
            }
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isAudioUnlocked, handleStepInput]);

    const resetWalk = () => {
        goToStep(0);
    };

    return {
        progress,
        activeFrameIdx,
        isStep25Active,
        stepSubCount,
        walkBobTrigger,
        isAtelierModalOpen,
        setIsAtelierModalOpen,
        handleVideoTimeUpdate,
        handleVideoCompleted,
        handleCompleteStep25,
        resetWalk,
        goToStep,
        stepForward,
        stepBackward
    };
}

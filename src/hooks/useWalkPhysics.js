import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, onFinishWalk, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const progressRef = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);
    const step1PacingActive = useRef(false);

    // Frame Index 계산
    useEffect(() => {
        const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
        setActiveFrameIdx(frameIdx);
    }, [progress]);

    // 1단계 5초 정속 자동 진행 (0% -> 14.3% over 5000ms)
    useEffect(() => {
        if (!isAudioUnlocked || step1PacingActive.current) return;
        step1PacingActive.current = true;

        const startTime = Date.now();
        const duration = 5000; // 5초 정속
        const targetProgress = 14.3; // 2번째 컷 진입점

        const step1Timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ratio = Math.min(1, elapsed / duration);
            const currentVal = ratio * targetProgress;

            setProgress((prev) => {
                const next = Math.max(prev, currentVal);
                progressRef.current = next;
                return next;
            });

            if (ratio >= 1) {
                clearInterval(step1Timer);
            }
        }, 30);

        return () => clearInterval(step1Timer);
    }, [isAudioUnlocked]);

    // 휠 & 터치 스크롤 이벤트 리스너 (1단계 5초 정속 이후 자유 스크롤)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }

            if (e.deltaY > 0) {
                triggerDopamineScrollUp();
                // 1단계에서는 5초 정속이 우선, 2단계(14.3% 이상)부터는 빠른 스크롤 반응
                const clampedDelta = Math.min(e.deltaY * 0.00225, 1.25);
                setProgress((prev) => {
                    if (prev < 14.3) {
                        // 1단계 내에서는 완만한 보행 감도
                        const next = Math.min(100, prev + clampedDelta * 0.25);
                        progressRef.current = next;
                        return next;
                    }
                    const next = Math.min(100, prev + clampedDelta);
                    progressRef.current = next;
                    if (next >= 100 && onFinishWalk) {
                        setTimeout(() => onFinishWalk(), 800);
                    }
                    return next;
                });
            }
        };

        const handleTouchStart = (e) => {
            if (e.touches && e.touches[0]) {
                touchStartY.current = e.touches[0].clientY;
                touchStartTime.current = Date.now();
            }
        };

        const handleTouchMove = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.touches && e.touches[0]) {
                const currentY = e.touches[0].clientY;
                const deltaY = touchStartY.current - currentY;
                if (deltaY < 0 && window.scrollY === 0 && e.cancelable) {
                    e.preventDefault();
                }

                if (deltaY > 0) {
                    triggerDopamineScrollUp();
                    const strokeProgress = Math.min(deltaY * 0.011, 1.9);
                    setProgress((prev) => {
                        if (prev < 14.3) {
                            const next = Math.min(100, prev + strokeProgress * 0.25);
                            progressRef.current = next;
                            return next;
                        }
                        const next = Math.min(100, prev + strokeProgress);
                        progressRef.current = next;
                        if (next >= 100 && onFinishWalk) {
                            setTimeout(() => onFinishWalk(), 800);
                        }
                        return next;
                    });
                }
                touchStartY.current = currentY;
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isAudioUnlocked]);

    const resetWalk = () => {
        setProgress(0);
        progressRef.current = 0;
        step1PacingActive.current = false;
    };

    return {
        progress,
        setProgress,
        activeFrameIdx,
        resetWalk
    };
}

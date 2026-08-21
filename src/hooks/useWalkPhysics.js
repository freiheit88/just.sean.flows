import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

// React Stale Closure가 없는 안전한 보행 물리 엔진
export function useWalkPhysics({ isAudioUnlocked, onFinishWalk, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const progressRef = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);
    const hasUserStartedScroll = useRef(false);

    // Frame Index 계산
    useEffect(() => {
        const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
        setActiveFrameIdx(frameIdx);
    }, [progress]);

    // 휠 & 터치 스크롤 이벤트 리스너 (락 없이 100% 매끄러운 전진)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }

            if (e.deltaY > 0) {
                hasUserStartedScroll.current = true;
                triggerDopamineScrollUp();
                const clampedDelta = Math.min(e.deltaY * 0.00225, 1.25);
                setProgress((prev) => {
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
                    hasUserStartedScroll.current = true;
                    triggerDopamineScrollUp();
                    const strokeProgress = Math.min(deltaY * 0.011, 1.9);
                    setProgress((prev) => {
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
    };

    return {
        progress,
        setProgress,
        activeFrameIdx,
        resetWalk
    };
}

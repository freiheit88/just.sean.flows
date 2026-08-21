import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, onFinishWalk, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const progressRef = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    // Sequence state: 'stage1' (5s) -> 'video' -> 'stage2' (5s) -> 'free'
    const sequenceState = useRef('idle'); // 'idle' | 'stage1' | 'video' | 'stage2' | 'free'

    // Frame Index 계산
    useEffect(() => {
        const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
        setActiveFrameIdx(frameIdx);
    }, [progress]);

    // STAGE 1: 1단계 5초 정속 보행 (0% -> 14.3% over 5000ms)
    useEffect(() => {
        if (!isAudioUnlocked || sequenceState.current !== 'idle') return;
        sequenceState.current = 'stage1';

        const startTime = Date.now();
        const duration = 5000; // 5초 정속
        const targetProgress = 14.3; // 2번째 컷(동영상) 진입점

        const stage1Timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ratio = Math.min(1, elapsed / duration);
            const currentVal = ratio * targetProgress;

            setProgress((prev) => {
                const next = Math.max(prev, currentVal);
                progressRef.current = next;
                return next;
            });

            if (ratio >= 1) {
                clearInterval(stage1Timer);
                sequenceState.current = 'video';
            }
        }, 30);

        return () => clearInterval(stage1Timer);
    }, [isAudioUnlocked]);

    // 동영상 완료 후 STAGE 2: 2단계 5초 정속 보행 트리거 함수
    const handleVideoCompleted = () => {
        if (sequenceState.current !== 'video') return;
        sequenceState.current = 'stage2';

        const startTime = Date.now();
        const duration = 5000; // 5초 정속
        const startProgress = 14.3;
        const targetProgress = 28.6; // 3번째 컷(코너턴 완료 및 LOOK UP 직전)

        const stage2Timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ratio = Math.min(1, elapsed / duration);
            const currentVal = startProgress + ratio * (targetProgress - startProgress);

            setProgress((prev) => {
                const next = Math.max(prev, currentVal);
                progressRef.current = next;
                return next;
            });

            if (ratio >= 1) {
                clearInterval(stage2Timer);
                sequenceState.current = 'free'; // 3단계(LOOK UP)부터 자유 스크롤 언락!
            }
        }, 30);
    };

    // 휠 & 터치 스크롤 이벤트 리스너 (Stage 1 & 2 정속 보호 + Stage 3 이후 자유 스크롤)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }

            if (e.deltaY > 0) {
                triggerDopamineScrollUp();

                // 3단계(28.6%) 이전까지는 정속 시퀀스가 우선, 이후부터 자유 스크롤
                if (sequenceState.current === 'free' || progressRef.current >= 28.6) {
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

                    // 3단계(28.6%) 이전까지는 정속 시퀀스가 우선, 이후부터 자유 스크롤
                    if (sequenceState.current === 'free' || progressRef.current >= 28.6) {
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
        sequenceState.current = 'idle';
    };

    return {
        progress,
        setProgress,
        activeFrameIdx,
        resetWalk,
        handleVideoCompleted
    };
}

import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, onFinishWalk, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const progressRef = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    // Sequence state: 'idle' -> 'stage1' (5s) -> 'video' (1 play) -> 'stage2' (3s pause on frame 2) -> 'free'
    const sequenceState = useRef('idle');

    // Frame Index calculation (Frame 0: 0~14.3%, Frame 1: 14.3~28.6%, Frame 2: 28.6~42.8%, Frame 3: 42.8~57.1%...)
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
                // 8.5s fallback to guarantee smooth progression even if video stalls
                setTimeout(() => {
                    if (sequenceState.current === 'video') {
                        handleVideoCompleted();
                    }
                }, 8500);
            }
        }, 30);

        return () => clearInterval(stage1Timer);
    }, [isAudioUnlocked]);

    // 동영상 완료 후: 즉시 2번 사진(28.6%)으로 점프하여 3초간 머무른 뒤 3단계로 연결!
    const handleVideoCompleted = () => {
        if (sequenceState.current !== 'video') return;
        sequenceState.current = 'stage2';

        // 1. 즉시 2번 사진(코너 턴, 28.6%)으로 화면 전환 (동영상 2회 반복 재생 원천 차단!)
        setProgress(28.6);
        progressRef.current = 28.6;

        // 2. 2번 사진에서 정확히 3초간 머무름 (3-Second Pacing Pause on Frame 2)
        const startTime = Date.now();
        const duration = 3000; // 3초 대기
        const startProgress = 28.6;
        const targetProgress = 42.9; // 3단계(LOOK UP 간판) 도달점

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
                sequenceState.current = 'free'; // 3단계부터 자유 스크롤 언락!
            }
        }, 30);
    };

    // 휠 & 터치 스크롤 이벤트 리스너
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }

            if (e.deltaY > 0) {
                triggerDopamineScrollUp();

                // 3단계(42.9%) 이후부터 자유 스크롤 가능
                if (sequenceState.current === 'free' || progressRef.current >= 42.8) {
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

                    // 3단계(42.9%) 이후부터 자유 스크롤 가능
                    if (sequenceState.current === 'free' || progressRef.current >= 42.8) {
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

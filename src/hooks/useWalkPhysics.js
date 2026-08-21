import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, onFinishWalk, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const progressRef = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    // Sequence state: 'idle' -> 'stage1' (0번 사진 5s) -> 'video' (1번 비디오 1회) -> 'stage2' (2번 사진 3s 대기) -> 'free'
    const sequenceState = useRef('idle');

    // Dynamic Frame Index computation with strict phase locking
    useEffect(() => {
        if (sequenceState.current === 'stage1') {
            setActiveFrameIdx(0); // 1단계 5초 동안 0번 사진 엄격 고정!
        } else if (sequenceState.current === 'video') {
            setActiveFrameIdx(1); // 동영상 재생 중 1번 비디오 엄격 고정!
        } else if (sequenceState.current === 'stage2') {
            setActiveFrameIdx(2); // 2단계 코너 턴 3초 동안 2번 사진 엄격 고정!
        } else {
            const frameIdx = Math.min(FRAMES.length - 1, Math.max(0, Math.floor((progress / 100) * FRAMES.length)));
            setActiveFrameIdx(frameIdx);
        }
    }, [progress]);

    // STAGE 1: 1단계 5초 정속 보행 (0번 사진 5초간 유지)
    useEffect(() => {
        if (!isAudioUnlocked || sequenceState.current !== 'idle') return;
        sequenceState.current = 'stage1';
        setActiveFrameIdx(0);

        const startTime = Date.now();
        const duration = 5000; // 5초

        const stage1Timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ratio = Math.min(1, elapsed / duration);
            const currentVal = ratio * 14.0; // 14%까지만 진행 (0번 사진 안전 범위)

            setProgress((prev) => {
                const next = Math.max(prev, currentVal);
                progressRef.current = next;
                return next;
            });

            if (ratio >= 1) {
                clearInterval(stage1Timer);
                // 5초 완료 즉시 비디오 단계로 전환 (코너 사진 노출 원천 차단)
                sequenceState.current = 'video';
                setProgress(14.3);
                progressRef.current = 14.3;
                setActiveFrameIdx(1);

                // 8.5s fallback to guarantee progression
                setTimeout(() => {
                    if (sequenceState.current === 'video') {
                        handleVideoCompleted();
                    }
                }, 8500);
            }
        }, 30);

        return () => clearInterval(stage1Timer);
    }, [isAudioUnlocked]);

    // 동영상 완료 후: 2번 사진으로 전환 후 3초간 정속 대기!
    const handleVideoCompleted = () => {
        if (sequenceState.current !== 'video') return;
        sequenceState.current = 'stage2';

        // 1. 즉시 2번 사진(코너 턴)으로 고정
        setProgress(28.6);
        progressRef.current = 28.6;
        setActiveFrameIdx(2);

        // 2. 2번 사진에서 정확히 3초간 대기 (3-Second Pause on Frame 2)
        const startTime = Date.now();
        const duration = 3000; // 3초 대기
        const startProgress = 28.6;
        const targetProgress = 42.9;

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
                setActiveFrameIdx(3);
            }
        }, 30);
    };

    // 휠 & 터치 스크롤 이벤트 리스너 (3단계 이전에는 자유 스크롤 차단, 이후 해제)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }

            if (e.deltaY > 0) {
                triggerDopamineScrollUp();

                if (sequenceState.current === 'free' || progressRef.current >= 42.8) {
                    const clampedDelta = Math.min(e.deltaY * 0.00225, 1.25);
                    setProgress((prev) => {
                        const next = Math.min(100, prev + clampedDelta);
                        progressRef.current = next;
                        // Locked cleanly inside Step 7
                        return next;
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
        setActiveFrameIdx(0);
    };

    return {
        progress,
        setProgress,
        activeFrameIdx,
        resetWalk,
        handleVideoCompleted
    };
}

import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, onFinishWalk, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [isAtelierModalOpen, setIsAtelierModalOpen] = useState(false);

    const progressRef = useRef(0);
    const hasTriggered100Modal = useRef(false);
    // sequenceState: 'idle' -> 'stage1' (0번 5s) -> 'stage2_origin' (1번 3s) -> 'video' (2번 mp4) -> 'stage2_variant' (3번 5s) -> 'free' (4~7번)
    const sequenceState = useRef('idle');

    const audioCtxRef = useRef(null);
    const footstepAudioRef = useRef(null);
    const footstepBufferRef = useRef(null);
    const isFetchingRef = useRef(false);

    // Audio Engine Preload (30% scale)
    useEffect(() => {
        const initAudio = async () => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    audioCtxRef.current = new AudioContext();
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

    const playFootstepSound = () => {
        if (!isAudioUnlocked) return;
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
    };

    // Frame Index computation with ironclad phase locking
    useEffect(() => {
        if (sequenceState.current === 'stage1') {
            setActiveFrameIdx(0); // 1번 사진 5초 고정!
        } else if (sequenceState.current === 'stage2_origin') {
            setActiveFrameIdx(1); // 원본 2번 사진 3초 고정!
        } else if (sequenceState.current === 'video') {
            setActiveFrameIdx(2); // 동영상 재생 고정!
        } else if (sequenceState.current === 'stage2_variant') {
            setActiveFrameIdx(3); // 변형된 2번 코너 턴 사진 5초 고정!
        } else {
            // Free scroll for Frames 4, 5, 6, 7 (50% ~ 100% progress mapped to indices 4 ~ 7)
            const freeProg = Math.max(0, Math.min(1, (progress - 50) / 50));
            const frameIdx = Math.min(7, Math.max(4, 4 + Math.floor(freeProg * 4)));
            setActiveFrameIdx(frameIdx);
        }
    }, [progress]);

    // STAGE 1 (5.0s) -> STAGE 2 ORIGIN (3.0s) -> VIDEO
    useEffect(() => {
        if (!isAudioUnlocked || sequenceState.current !== 'idle') return;
        sequenceState.current = 'stage1';
        setActiveFrameIdx(0);
        setProgress(0);

        const startTime = Date.now();
        const stage1Duration = 5000; // 1번 사진 5초

        const stage1Timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ratio = Math.min(1, elapsed / stage1Duration);
            const currentVal = ratio * 12.5;

            setProgress(currentVal);
            progressRef.current = currentVal;
            setActiveFrameIdx(0);

            if (ratio >= 1) {
                clearInterval(stage1Timer);

                // Stage 2 Origin: 원본 2번 사진 3초 고정 진입!
                sequenceState.current = 'stage2_origin';
                setActiveFrameIdx(1);
                setProgress(12.5);
                progressRef.current = 12.5;

                const originStartTime = Date.now();
                const originDuration = 3000; // 원본 2번 사진 3초

                const originTimer = setInterval(() => {
                    const originElapsed = Date.now() - originStartTime;
                    const originRatio = Math.min(1, originElapsed / originDuration);
                    const originVal = 12.5 + originRatio * 12.5;

                    setProgress(originVal);
                    progressRef.current = originVal;
                    setActiveFrameIdx(1);

                    if (originRatio >= 1) {
                        clearInterval(originTimer);

                        // 동영상 단계로 직행!
                        sequenceState.current = 'video';
                        setActiveFrameIdx(2);
                        setProgress(25.0);
                        progressRef.current = 25.0;

                        // 8.5s fallback to guarantee video transition
                        setTimeout(() => {
                            if (sequenceState.current === 'video') {
                                handleVideoCompleted();
                            }
                        }, 8500);
                    }
                }, 30);
            }
        }, 30);

        return () => clearInterval(stage1Timer);
    }, [isAudioUnlocked]);

    // 동영상 완료 후: 변형된 2번 사진(코너 턴)으로 전환 후 '정확히 5.0초 고정' 대기!
    const handleVideoCompleted = () => {
        if (sequenceState.current !== 'video') return;
        sequenceState.current = 'stage2_variant';

        setActiveFrameIdx(3);
        setProgress(37.5);
        progressRef.current = 37.5;

        const startTime = Date.now();
        const duration = 5000; // 동영상 끝나고 5초 고정!
        const startProgress = 37.5;
        const targetProgress = 50.0;

        const variantTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ratio = Math.min(1, elapsed / duration);
            const currentVal = startProgress + ratio * (targetProgress - startProgress);

            setActiveFrameIdx(3); // 5초 동안 변형 2번 코너 턴 사진 엄격 고정!
            setProgress(currentVal);
            progressRef.current = currentVal;

            if (ratio >= 1) {
                clearInterval(variantTimer);
                sequenceState.current = 'free'; // 5초 완료 즉시 4번 아치 문 앞 단계로 진입 & 자유 스크롤 언락!
                setActiveFrameIdx(4);
                setProgress(50.0);
                progressRef.current = 50.0;
            }
        }, 30);
    };

    // Ambient Gentle Auto-Walk Progression (4단계 이후 가만히 있어도 서서히 전진)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const autoDriftInterval = setInterval(() => {
            if (sequenceState.current === 'free' && progressRef.current < 100) {
                setProgress((prev) => {
                    const next = Math.min(100, prev + 0.025);
                    progressRef.current = next;
                    return next;
                });
            }
        }, 50);

        return () => clearInterval(autoDriftInterval);
    }, [isAudioUnlocked]);

    // 휠 & 터치 스크롤 이벤트 리스너 (초반 자동 시퀀스 중에는 스크롤에 의한 진행 변형 차단)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .touch-pan-y, button, input');
            if (!isScrollableChild && e.cancelable && window.scrollY === 0 && e.deltaY < 0) {
                e.preventDefault();
            }

            if (e.deltaY > 0) {
                triggerDopamineScrollUp();
                playFootstepSound();

                if (sequenceState.current === 'free' && progressRef.current >= 50.0) {
                    const clampedDelta = Math.min(e.deltaY * 0.0018, 0.85);
                    setProgress((prev) => {
                        const next = Math.min(100, prev + clampedDelta);
                        progressRef.current = next;
                        return next;
                    });
                }
            }
        };

        let touchStartY = 0;
        const handleTouchStart = (e) => {
            if (e.touches && e.touches[0]) {
                touchStartY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                const currentY = e.touches[0].clientY;
                const deltaY = touchStartY - currentY;
                if (deltaY > 5) {
                    triggerDopamineScrollUp();
                    playFootstepSound();
                    if (sequenceState.current === 'free' && progressRef.current >= 50.0) {
                        const strokeProgress = Math.min(deltaY * 0.0075, 1.25);
                        setProgress((prev) => {
                            const next = Math.min(100, prev + strokeProgress);
                            progressRef.current = next;
                            return next;
                        });
                    }
                    touchStartY = currentY;
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isAudioUnlocked, triggerDopamineScrollUp]);

    // 100% Walk Completion Trailer Trigger
    useEffect(() => {
        if (progress >= 100 && !hasTriggered100Modal.current) {
            hasTriggered100Modal.current = true;
            if (onFinishWalk) onFinishWalk();
        }
    }, [progress, onFinishWalk]);

    const resetWalk = () => {
        sequenceState.current = 'free';
        setProgress(50.0);
        progressRef.current = 50.0;
        setActiveFrameIdx(4);
        hasTriggered100Modal.current = false;
    };

    return {
        progress,
        playFootstepSound,
        activeFrameIdx,
        isTrailerModalOpen,
        isAtelierModalOpen,
        setIsTrailerModalOpen,
        setIsAtelierModalOpen,
        handleVideoCompleted,
        resetWalk
    };
}

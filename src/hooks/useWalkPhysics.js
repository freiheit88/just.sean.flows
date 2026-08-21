import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, onFinishWalk, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [isAtelierModalOpen, setIsAtelierModalOpen] = useState(false);
    const [sequenceState, setSequenceState] = useState('idle');

    const progressRef = useRef(0);
    const sequenceStateRef = useRef('idle');
    const hasTriggered100Modal = useRef(false);

    const audioCtxRef = useRef(null);
    const footstepAudioRef = useRef(null);
    const footstepBufferRef = useRef(null);
    const isFetchingRef = useRef(false);

    // Audio Engine Preload (0.18 volume)
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

    // Keep sequenceStateRef synced
    useEffect(() => {
        sequenceStateRef.current = sequenceState;
    }, [sequenceState]);

    // MASTER CINEMATIC SEQUENCE CONTROLLER
    // Stage 1 (0번 사진 5s) -> Stage 2 Origin (1번 사진 3s) -> Video (2번 mp4)
    useEffect(() => {
        if (!isAudioUnlocked || sequenceState !== 'idle') return;

        // 1. Stage 1: 1번 골목 사진 5초
        setSequenceState('stage1');
        setActiveFrameIdx(0);
        setProgress(0);

        const stage1Start = Date.now();
        const stage1Duration = 5000;

        const stage1Timer = setInterval(() => {
            const elapsed = Date.now() - stage1Start;
            const ratio = Math.min(1, elapsed / stage1Duration);
            const val = ratio * 15;
            setProgress(val);
            progressRef.current = val;

            if (ratio >= 1) {
                clearInterval(stage1Timer);

                // 2. Stage 2 Origin: 원본 2번 사진 3초
                setSequenceState('stage2_origin');
                setActiveFrameIdx(1);
                setProgress(15);
                progressRef.current = 15;

                const originStart = Date.now();
                const originDuration = 3000;

                const originTimer = setInterval(() => {
                    const originElapsed = Date.now() - originStart;
                    const originRatio = Math.min(1, originElapsed / originDuration);
                    const originVal = 15 + originRatio * 15;
                    setProgress(originVal);
                    progressRef.current = originVal;

                    if (originRatio >= 1) {
                        clearInterval(originTimer);

                        // 3. Stage 2 Video: 동영상 재생
                        setSequenceState('video');
                        setActiveFrameIdx(2);
                        setProgress(30);
                        progressRef.current = 30;

                        // 8.5s fallback in case video event doesn't fire
                        setTimeout(() => {
                            if (sequenceStateRef.current === 'video') {
                                handleVideoCompleted();
                            }
                        }, 8500);
                    }
                }, 30);
            }
        }, 30);

        return () => clearInterval(stage1Timer);
    }, [isAudioUnlocked]);

    // 4. Stage 2 Variant: 동영상 끝나고 '변형된 2번 사진(코너 턴)' 정확히 5초 고정!
    const handleVideoCompleted = () => {
        if (sequenceStateRef.current !== 'video') return;

        setSequenceState('stage2_variant');
        setActiveFrameIdx(3); // 3번 코너 턴 사진으로 즉시 전환!
        setProgress(35);
        progressRef.current = 35;

        const variantStart = Date.now();
        const variantDuration = 5000; // 5초간 정확히 고정!

        const variantTimer = setInterval(() => {
            const elapsed = Date.now() - variantStart;
            const ratio = Math.min(1, elapsed / variantDuration);
            const val = 35 + ratio * 15;

            setActiveFrameIdx(3); // 5초 동안 3번 사진 엄격 고정!
            setProgress(val);
            progressRef.current = val;

            if (ratio >= 1) {
                clearInterval(variantTimer);

                // 5. Stage 4: 5초 완료 즉시 4번 아치 문 앞 도착 & 자유 스크롤 언락!
                setSequenceState('free');
                setActiveFrameIdx(4);
                setProgress(50);
                progressRef.current = 50;
            }
        }, 30);
    };

    // Free Scroll Progression Handler for Stages 4 ~ 7 (Progress 50% ~ 100%)
    useEffect(() => {
        if (sequenceState !== 'free') return;

        const freeProg = Math.max(0, Math.min(1, (progress - 50) / 50));
        const frameIdx = Math.min(7, Math.max(4, 4 + Math.floor(freeProg * 4)));
        setActiveFrameIdx(frameIdx);
    }, [progress, sequenceState]);

    // Ambient Gentle Auto-Walk Progression (Stage 4 이후 가만히 있어도 서서히 전진)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const autoDriftInterval = setInterval(() => {
            if (sequenceStateRef.current === 'free' && progressRef.current < 100) {
                setProgress((prev) => {
                    const next = Math.min(100, prev + 0.025);
                    progressRef.current = next;
                    return next;
                });
            }
        }, 50);

        return () => clearInterval(autoDriftInterval);
    }, [isAudioUnlocked]);

    // Wheel & Touch Scroll Handler (Only advances progress when sequenceState === 'free')
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

                if (sequenceStateRef.current === 'free' && progressRef.current >= 50.0) {
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
                    if (sequenceStateRef.current === 'free' && progressRef.current >= 50.0) {
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
        setSequenceState('free');
        setProgress(50.0);
        progressRef.current = 50.0;
        setActiveFrameIdx(4);
        hasTriggered100Modal.current = false;
    };

    return {
        progress,
        activeFrameIdx,
        isTrailerModalOpen,
        isAtelierModalOpen,
        playFootstepSound,
        setIsTrailerModalOpen,
        setIsAtelierModalOpen,
        handleVideoCompleted,
        resetWalk
    };
}

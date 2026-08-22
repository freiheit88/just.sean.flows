import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isAtelierModalOpen, setIsAtelierModalOpen] = useState(false);
    const [sequenceState, setSequenceState] = useState('idle');

    const progressRef = useRef(0);
    const sequenceStateRef = useRef('idle');

    const audioCtxRef = useRef(null);
    const footstepAudioRef = useRef(null);
    const footstepBufferRef = useRef(null);
    const isFetchingRef = useRef(false);

    const activeTimerRef = useRef(null);

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

    useEffect(() => {
        sequenceStateRef.current = sequenceState;
    }, [sequenceState]);

    // MASTER SEQUENCE: Stage 1 (0번 사진 5s) -> Stage 2 Origin (1번 원본 3s) -> Video (2번 mp4)
    useEffect(() => {
        if (!isAudioUnlocked || sequenceState !== 'idle') return;

        setSequenceState('stage1');
        setActiveFrameIdx(0);
        setProgress(0);
        progressRef.current = 0;

        const stage1Start = Date.now();
        const stage1Duration = 5000;

        if (activeTimerRef.current) clearInterval(activeTimerRef.current);

        activeTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - stage1Start;
            const ratio = Math.min(1, elapsed / stage1Duration);
            const val = ratio * 15;
            setProgress(val);
            progressRef.current = val;
            setActiveFrameIdx(0);

            if (ratio >= 1) {
                clearInterval(activeTimerRef.current);

                setSequenceState('stage2_origin');
                setActiveFrameIdx(1);
                setProgress(15);
                progressRef.current = 15;

                const originStart = Date.now();
                const originDuration = 3000;

                activeTimerRef.current = setInterval(() => {
                    const originElapsed = Date.now() - originStart;
                    const originRatio = Math.min(1, originElapsed / originDuration);
                    const originVal = 15 + originRatio * 15;
                    setProgress(originVal);
                    progressRef.current = originVal;
                    setActiveFrameIdx(1);

                    if (originRatio >= 1) {
                        clearInterval(activeTimerRef.current);

                        setSequenceState('video');
                        setActiveFrameIdx(2);
                        setProgress(30);
                        progressRef.current = 30;

                        // 8.5s fallback in case video onEnded fails to fire
                        setTimeout(() => {
                            if (sequenceStateRef.current === 'video') {
                                handleVideoCompleted();
                            }
                        }, 8500);
                    }
                }, 30);
            }
        }, 30);

        return () => {
            if (activeTimerRef.current) clearInterval(activeTimerRef.current);
        };
    }, [isAudioUnlocked]);

    // 동영상 끝난 후: 동영상 마지막 프레임(Frame 2) 상태 그대로 정확히 5.0초 고정 후 코너 턴 사진(Frame 3)으로 진입!
    const handleVideoCompleted = () => {
        if (sequenceStateRef.current !== 'video') return;

        setSequenceState('video_hold');
        setActiveFrameIdx(2); // 동영상 마지막 프레임 그대로 유지!
        setProgress(35);
        progressRef.current = 35;

        if (activeTimerRef.current) clearInterval(activeTimerRef.current);

        const holdStart = Date.now();
        const holdDuration = 5000; // 정확히 5.0초 고정!

        activeTimerRef.current = setInterval(() => {
            const elapsed = Date.now() - holdStart;
            const ratio = Math.min(1, elapsed / holdDuration);
            const val = 35 + ratio * 15;

            setActiveFrameIdx(2); // 5초 동안 마지막 프레임 엄격 고정!
            setProgress(val);
            progressRef.current = val;

            if (ratio >= 1) {
                clearInterval(activeTimerRef.current);

                // 5초 완료 즉시 코너 턴 사진(Frame 3)으로 전환 & 자유 스크롤 언락!
                setSequenceState('free');
                setActiveFrameIdx(3);
                setProgress(50.0);
                progressRef.current = 50.0;
            }
        }, 30);
    };

    // Free Scroll Progression Handler for Frames 3 ~ 7 (Progress 50% ~ 100% across 5 frames: 3, 4, 5, 6, 7)
    useEffect(() => {
        if (sequenceState !== 'free') return;

        const freeProg = Math.max(0, Math.min(1, (progress - 50) / 50));
        const frameIdx = Math.min(7, Math.max(3, 3 + Math.floor(freeProg * 5)));
        setActiveFrameIdx(frameIdx);
    }, [progress, sequenceState]);

    // Ambient Gentle Auto-Walk Progression
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

    // Wheel & Touch Scroll Handler
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

    const resetWalk = () => {
        setSequenceState('free');
        setProgress(50.0);
        progressRef.current = 50.0;
        setActiveFrameIdx(3);
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

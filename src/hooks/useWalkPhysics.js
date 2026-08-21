import { useState, useEffect, useRef } from 'react';
import { FRAMES } from '../constants/frames';

export function useWalkPhysics({ isAudioUnlocked, onFinishWalk, triggerDopamineScrollUp }) {
    const [progress, setProgress] = useState(0);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const progressRef = useRef(0);
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    const audioCtxRef = useRef(null);
    const footstepBufferRef = useRef(null);
    const html5AudioRef = useRef(null);
    const lastFootstepTime = useRef(0);

    // Preload & decode footsteps into Web Audio Buffer for 100% reliable instant playback
    useEffect(() => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                const ctx = new AudioCtx();
                audioCtxRef.current = ctx;

                fetch('/assets/sounds/footsteps_three_steps.wav')
                    .then((res) => res.arrayBuffer())
                    .then((arrayBuf) => ctx.decodeAudioData(arrayBuf))
                    .then((decodedBuf) => {
                        footstepBufferRef.current = decodedBuf;
                    })
                    .catch(() => {});
            }
        } catch (e) {}

        const html5 = new Audio('/assets/sounds/footsteps_three_steps.wav');
        html5.volume = 0.85;
        html5.preload = 'auto';
        html5AudioRef.current = html5;
    }, []);

    // Guaranteed 3-Step ("뚜벅 뚜벅 뚜벅") Cobblestone Footstep Player
    const playFootstepSound = () => {
        const now = Date.now();
        if (now - lastFootstepTime.current < 1000) return; // 1.0s pacing
        lastFootstepTime.current = now;

        let played = false;

        // Method 1: Web Audio Buffer Source (Bypasses all mobile autoplay locks)
        if (audioCtxRef.current && footstepBufferRef.current) {
            try {
                if (audioCtxRef.current.state === 'suspended') {
                    audioCtxRef.current.resume();
                }
                const source = audioCtxRef.current.createBufferSource();
                const gainNode = audioCtxRef.current.createGain();
                gainNode.gain.value = 0.25; // Scaled to 30% comfortable ambient level
                source.buffer = footstepBufferRef.current;
                source.connect(gainNode);
                gainNode.connect(audioCtxRef.current.destination);
                source.start(0);
                played = true;
            } catch (e) {}
        }

        // Method 2: HTML5 Audio Element Fallback
        if (!played && html5AudioRef.current) {
            try {
                html5AudioRef.current.volume = 0.25;
                html5AudioRef.current.currentTime = 0;
                html5AudioRef.current.play().catch(() => {});
                played = true;
            } catch (e) {}
        }

        // Method 3: Procedural Real-time Synthesizer Fallback (3 Distinct Taps)
        if (!played) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                const ctx = new AudioCtx();
                [0, 0.35, 0.70].forEach((delay, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const filter = ctx.createBiquadFilter();

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(160 - idx * 10, ctx.currentTime + delay);
                    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + delay + 0.12);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(650, ctx.currentTime + delay);

                    gain.gain.setValueAtTime(0.12, ctx.currentTime + delay); // Scaled to 30% volume level
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(ctx.currentTime + delay);
                    osc.stop(ctx.currentTime + delay + 0.13);
                });
            } catch (e) {}
        }
    };


    // Sequence state: 'idle' -> 'stage1' (5s) -> 'video' (1x) -> 'stage2' (3s pause) -> 'free'
    const sequenceState = useRef('idle');

    // Dynamic Frame Index computation with ironclad phase locking
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

    // STAGE 1: 1단계 5초 정속 보행 (0번 사진 5초간 엄격 유지)
    useEffect(() => {
        if (!isAudioUnlocked || sequenceState.current !== 'idle') return;
        sequenceState.current = 'stage1';
        setActiveFrameIdx(0);

        const startTime = Date.now();
        const duration = 5000; // 5초

        const stage1Timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const ratio = Math.min(1, elapsed / duration);
            const currentVal = ratio * 13.5; // Strictly capped at 13.5% (cannot leak into frame 1 or 2)

            setProgress((prev) => {
                const next = Math.max(prev, currentVal);
                progressRef.current = next;
                return next;
            });

            if (ratio >= 1) {
                clearInterval(stage1Timer);
                // 5초 완료 즉시 비디오 단계로 직행 (Frame 1 고정)
                sequenceState.current = 'video';
                setActiveFrameIdx(1);
                setProgress(14.3);
                progressRef.current = 14.3;

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

        setProgress(28.6);
        progressRef.current = 28.6;
        setActiveFrameIdx(2);

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
                sequenceState.current = 'free'; // 3단계부터 자유 스크롤 & 앰비언트 보행 언락!
                setActiveFrameIdx(3);
            }
        }, 30);
    };

    // Ambient Gentle Auto-Walk Progression (3단계 이후 가만히 있어도 서서히 전진)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const autoDriftInterval = setInterval(() => {
            if (sequenceState.current === 'free' && progressRef.current < 100) {
                setProgress((prev) => {
                    const next = Math.min(100, prev + 0.035);
                    progressRef.current = next;
                    return next;
                });
            }
        }, 50);

        return () => clearInterval(autoDriftInterval);
    }, [isAudioUnlocked]);

    // 휠 & 터치 스크롤 이벤트 리스너 (1단계, 비디오, 2단계에서는 스크롤에 의한 진행 변형 원천 차단)
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

                // 1단계, 비디오, 2단계 중에는 스크롤로 앞지르지 못하도록 절대 차단!
                if (sequenceState.current === 'free' && progressRef.current >= 42.8) {
                    const clampedDelta = Math.min(e.deltaY * 0.0025, 1.35);
                    setProgress((prev) => {
                        const next = Math.min(100, prev + clampedDelta);
                        progressRef.current = next;
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
                playFootstepSound();

                    // 1단계, 비디오, 2단계 중에는 스크롤로 앞지르지 못하도록 절대 차단!
                    if (sequenceState.current === 'free' && progressRef.current >= 42.8) {
                        const strokeProgress = Math.min(deltaY * 0.012, 2.0);
                        setProgress((prev) => {
                            const next = Math.min(100, prev + strokeProgress);
                            progressRef.current = next;
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

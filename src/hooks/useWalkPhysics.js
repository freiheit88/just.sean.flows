import { useState, useEffect, useRef, useCallback } from 'react';
import { spatialTactileAudio } from '../services/spatialTactileAudio';

export function useWalkPhysics({ isAudioUnlocked, isMuted = false, triggerDopamineScrollUp, onDirectMuseum }) {
    // Spatial Depth in 02:00 AM Room (0.0 = Entrance -> 1.0 = Inside TV Screen)
    const [depthZ, setDepthZ] = useState(0);
    const [isSnapping, setIsSnapping] = useState(false);
    const [activeFrameIdx, setActiveFrameIdx] = useState(0);
    const [isStep25Active, setIsStep25Active] = useState(false);
    const [walkBobTrigger, setWalkBobTrigger] = useState(0);
    const [isAtelierModalOpen, setIsAtelierModalOpen] = useState(false);

    const targetZRef = useRef(0);
    const smoothZRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const isSnappingRef = useRef(false);
    const rafIdRef = useRef(null);

    // Reset when audio unlocks
    useEffect(() => {
        if (isAudioUnlocked) {
            targetZRef.current = 0;
            smoothZRef.current = 0;
            setDepthZ(0);
            spatialTactileAudio.init();
        }
    }, [isAudioUnlocked]);

    // 1. DUAL-STAGE LERP PHYSICS ENGINE (60/120 FPS RAF Loop)
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const updatePhysicsLoop = (now) => {
            const dt = Math.min(0.1, (now - lastTimeRef.current) / 1000);
            lastTimeRef.current = now;

            // Dual-Stage Lerp: 0.05 for heavy luxury drag, 0.12 for snappy snap/dock
            const lerpFactor = isSnappingRef.current ? 0.12 : 0.05;
            const diff = targetZRef.current - smoothZRef.current;
            smoothZRef.current += diff * lerpFactor;

            // Velocity for tactile audio & haptics
            const velocity = diff;
            spatialTactileAudio.updatePhysics({
                velocity,
                depthProgress: smoothZRef.current,
                isMuted
            });

            setDepthZ(smoothZRef.current);

            // Reached TV Screen (Destination Threshold >= 0.98) -> Direct Museum Landing
            if (smoothZRef.current >= 0.98 && targetZRef.current >= 0.98) {
                if (onDirectMuseum) {
                    onDirectMuseum();
                }
            }

            rafIdRef.current = requestAnimationFrame(updatePhysicsLoop);
        };

        rafIdRef.current = requestAnimationFrame(updatePhysicsLoop);

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [isAudioUnlocked, isMuted, onDirectMuseum]);

    // 2. INPUT HANDLERS (Wheel, Drag, Touch, Keys)
    const addDepthInput = useCallback((delta) => {
        if (!isAudioUnlocked) return;
        isSnappingRef.current = false;
        setIsSnapping(false);

        targetZRef.current = Math.max(0, Math.min(1.0, targetZRef.current + delta));
        setWalkBobTrigger(prev => prev + 1);

        if (triggerDopamineScrollUp) triggerDopamineScrollUp();
    }, [isAudioUnlocked, triggerDopamineScrollUp]);

    const snapToTV = useCallback(() => {
        isSnappingRef.current = true;
        setIsSnapping(true);
        targetZRef.current = 1.0;
        if (triggerDopamineScrollUp) triggerDopamineScrollUp();
    }, [triggerDopamineScrollUp]);

    // Global Wheel & Touch Listeners for Step 1
    useEffect(() => {
        if (!isAudioUnlocked) return;

        const handleWheel = (e) => {
            const isScrollableChild = e.target.closest('.overflow-y-auto, .overflow-x-auto, button, input');
            if (isScrollableChild) return;

            // Forward / Backward scroll
            const delta = (e.deltaY > 0) ? 0.04 : -0.04;
            addDepthInput(delta);
        };

        let touchStartY = 0;
        const handleTouchStart = (e) => {
            if (e.touches && e.touches[0]) {
                touchStartY = e.touches[0].clientY;
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                const diffY = touchStartY - e.touches[0].clientY;
                if (Math.abs(diffY) > 8) {
                    addDepthInput(diffY * 0.0018);
                    touchStartY = e.touches[0].clientY;
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
    }, [isAudioUnlocked, addDepthInput]);

    // Backward compatibility helpers
    const goToStep = useCallback((stepIdx) => {
        const z = stepIdx / 6;
        targetZRef.current = z;
        setActiveFrameIdx(stepIdx);
    }, []);

    const resetWalk = () => {
        targetZRef.current = 0;
        smoothZRef.current = 0;
        setDepthZ(0);
    };

    return {
        depthZ,
        progress: depthZ * 100,
        activeFrameIdx,
        isSnapping,
        isStep25Active,
        stepSubCount: Math.floor(depthZ * 4),
        walkBobTrigger,
        isAtelierModalOpen,
        setIsAtelierModalOpen,
        addDepthInput,
        snapToTV,
        resetWalk,
        goToStep,
        stepForward: () => addDepthInput(0.15),
        stepBackward: () => addDepthInput(-0.15)
    };
}

import { useState, useEffect, useRef } from 'react';

export function useDeviceGyro() {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    
    // Auto-calibration baseline reference
    const baselineRef = useRef({ pitch: 45, roll: 0, isCalibrated: false });
    const targetTiltRef = useRef({ x: 0, y: 0 });
    const currentTiltRef = useRef({ x: 0, y: 0 });
    const animFrameRef = useRef(null);

    useEffect(() => {
        // Mobile Gyroscope Handler with Natural Hand Angle Calibration
        const handleDeviceOrientation = (e) => {
            if (e.beta !== null && e.gamma !== null) {
                // Auto-calibrate on first natural hold
                if (!baselineRef.current.isCalibrated) {
                    baselineRef.current = {
                        pitch: e.beta || 45,
                        roll: e.gamma || 0,
                        isCalibrated: true
                    };
                }

                // Delta relative to natural hand holding baseline
                const deltaPitch = e.beta - baselineRef.current.pitch;
                const deltaRoll = e.gamma - baselineRef.current.roll;

                // 1/4 Sensitivity (Divided by 60 and scaled by 0.25)
                const normX = Math.max(-1, Math.min(1, deltaRoll / 45)) * 0.25;
                const normY = Math.max(-1, Math.min(1, deltaPitch / 45)) * 0.25;

                targetTiltRef.current = { x: normX, y: normY };
            }
        };

        // Desktop Mouse Pointer 3D Tilt Fallback
        const handleMouseMove = (e) => {
            const normX = (e.clientX / window.innerWidth) * 2 - 1;
            const normY = (e.clientY / window.innerHeight) * 2 - 1;
            targetTiltRef.current = { x: normX, y: normY };
        };

        // Smooth Exponential Moving Average (EMA) Loop to prevent any jitter/jump
        const smoothLoop = () => {
            const lerpFactor = 0.10; // Smooth damping
            currentTiltRef.current.x += (targetTiltRef.current.x - currentTiltRef.current.x) * lerpFactor;
            currentTiltRef.current.y += (targetTiltRef.current.y - currentTiltRef.current.y) * lerpFactor;

            setTilt({
                x: parseFloat(currentTiltRef.current.x.toFixed(4)),
                y: parseFloat(currentTiltRef.current.y.toFixed(4))
            });

            animFrameRef.current = requestAnimationFrame(smoothLoop);
        };

        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        window.addEventListener('mousemove', handleMouseMove);
        animFrameRef.current = requestAnimationFrame(smoothLoop);

        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    const tiltX = tilt.x * 24;
    const tiltY = tilt.y * 20;
    const ghostOffsetX = tilt.x * 28;
    const ghostOffsetY = tilt.y * 20;

    return { tilt, tiltX, tiltY, ghostOffsetX, ghostOffsetY };
}

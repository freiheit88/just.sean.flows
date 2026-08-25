import { useState, useEffect, useRef } from 'react';

export function useDeviceGyro() {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    
    // Dynamic continuous moving baseline reference
    const baselineRef = useRef({ pitch: 45, roll: 0, initialized: false });
    const targetTiltRef = useRef({ x: 0, y: 0 });
    const currentTiltRef = useRef({ x: 0, y: 0 });
    const animFrameRef = useRef(null);

    useEffect(() => {
        // Mobile Gyroscope Handler with Dynamic Hand Grip Center
        const handleDeviceOrientation = (e) => {
            if (e.beta !== null && e.gamma !== null) {
                const pitch = e.beta || 0;
                const roll = e.gamma || 0;

                if (!baselineRef.current.initialized) {
                    baselineRef.current = { pitch, roll, initialized: true };
                } else {
                    // Slow baseline drift (adapts to user slowly changing posture)
                    baselineRef.current.pitch += (pitch - baselineRef.current.pitch) * 0.005;
                    baselineRef.current.roll += (roll - baselineRef.current.roll) * 0.005;
                }

                // Delta relative to holding baseline
                const deltaPitch = pitch - baselineRef.current.pitch;
                const deltaRoll = roll - baselineRef.current.roll;

                // Responsive dynamic tilt range (-1.0 to 1.0)
                const normX = Math.max(-1, Math.min(1, deltaRoll / 28));
                const normY = Math.max(-1, Math.min(1, deltaPitch / 28));

                targetTiltRef.current = { x: normX, y: normY };
            }
        };

        // Desktop Mouse Pointer 3D Tilt Fallback
        const handleMouseMove = (e) => {
            const normX = (e.clientX / window.innerWidth) * 2 - 1;
            const normY = (e.clientY / window.innerHeight) * 2 - 1;
            targetTiltRef.current = { x: normX, y: normY };
        };

        // Smooth Exponential Moving Average (EMA) 60fps Loop
        const smoothLoop = () => {
            const lerpFactor = 0.14; // Responsive & smooth
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

    const tiltX = tilt.x * 26;
    const tiltY = tilt.y * 22;
    const ghostOffsetX = tilt.x * 30;
    const ghostOffsetY = tilt.y * 22;

    return { tilt, tiltX, tiltY, ghostOffsetX, ghostOffsetY };
}

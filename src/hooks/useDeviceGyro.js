import { useState, useEffect } from 'react';

export function useDeviceGyro() {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Mobile Gyroscope Handler
        const handleDeviceOrientation = (e) => {
            if (e.beta !== null && e.gamma !== null) {
                const normX = Math.max(-1, Math.min(1, e.gamma / 16));
                const normY = Math.max(-1, Math.min(1, e.beta / 16));
                setTilt({ x: normX, y: normY });
            }
        };

        // Desktop Mouse Pointer 3D Tilt Fallback
        const handleMouseMove = (e) => {
            const normX = (e.clientX / window.innerWidth) * 2 - 1;
            const normY = (e.clientY / window.innerHeight) * 2 - 1;
            setTilt({ x: normX, y: normY });
        };

        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const tiltX = tilt.x * 28;
    const tiltY = tilt.y * 24;
    const ghostOffsetX = tilt.x * 32;
    const ghostOffsetY = tilt.y * 24;

    return { tilt, tiltX, tiltY, ghostOffsetX, ghostOffsetY };
}

import { useState, useEffect } from 'react';

// 모바일 기기 자이로 센서 & 부드러운 50% 튜닝 감도 훅
export function useDeviceGyro() {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleDeviceOrientation = (e) => {
            if (e.beta !== null && e.gamma !== null) {
                // 부드럽고 자연스러운 50% 감도 튜닝
                const normX = Math.max(-1, Math.min(1, e.gamma / 18));
                const normY = Math.max(-1, Math.min(1, e.beta / 18));
                setTilt({ x: normX, y: normY });
            }
        };

        window.addEventListener('deviceorientation', handleDeviceOrientation, true);
        return () => window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
    }, []);

    // 50% 축소 튜닝된 3D 틸트 스케일값
    const tiltX = tilt.x * 26;
    const tiltY = tilt.y * 22;
    const ghostOffsetX = tilt.x * 30;
    const ghostOffsetY = tilt.y * 22;

    return { tilt, tiltX, tiltY, ghostOffsetX, ghostOffsetY };
}

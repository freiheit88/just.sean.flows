import { useState, useEffect, useRef } from 'react';

// 60FPS LERP 알고리즘 기반 커서 트래커 & 4단 네온 애프터이미지 궤적 훅
export function useTrailCursor() {
    const [cursorPos, setCursorPos] = useState({ x: 0.5, y: 0.5, rawX: -100, rawY: -100, isHovered: false });
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const scrollUpTimerRef = useRef(null);

    const [trails, setTrails] = useState([
        { x: -100, y: -100 },
        { x: -100, y: -100 },
        { x: -100, y: -100 },
        { x: -100, y: -100 }
    ]);
    
    const targetPos = useRef({ x: -100, y: -100 });
    const currentTrails = useRef([
        { x: -100, y: -100 },
        { x: -100, y: -100 },
        { x: -100, y: -100 },
        { x: -100, y: -100 }
    ]);

    useEffect(() => {
        let animId;
        const lerpFactors = [0.32, 0.22, 0.16, 0.11];

        const updateTrails = () => {
            let prevX = targetPos.current.x;
            let prevY = targetPos.current.y;

            const updated = currentTrails.current.map((t, idx) => {
                const factor = lerpFactors[idx];
                t.x += (prevX - t.x) * factor;
                t.y += (prevY - t.y) * factor;
                prevX = t.x;
                prevY = t.y;
                return { x: t.x, y: t.y };
            });

            setTrails([...updated]);
            animId = requestAnimationFrame(updateTrails);
        };

        animId = requestAnimationFrame(updateTrails);
        return () => cancelAnimationFrame(animId);
    }, []);

    const updatePointerPos = (clientX, clientY) => {
        targetPos.current = { x: clientX, y: clientY };
        setCursorPos({
            x: clientX / window.innerWidth,
            y: clientY / window.innerHeight,
            rawX: clientX,
            rawY: clientY,
            isHovered: true
        });
    };

    const triggerDopamineScrollUp = () => {
        setIsScrollingUp(true);
        if (scrollUpTimerRef.current) clearTimeout(scrollUpTimerRef.current);
        scrollUpTimerRef.current = setTimeout(() => {
            setIsScrollingUp(false);
        }, 400);
    };

    return {
        cursorPos,
        trails,
        isScrollingUp,
        setIsScrollingUp,
        updatePointerPos,
        triggerDopamineScrollUp
    };
}

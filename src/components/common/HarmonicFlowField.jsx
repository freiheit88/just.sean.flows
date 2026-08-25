import React, { useEffect, useRef } from 'react';

export function HarmonicFlowField({ 
    activeChord = 'Dm', 
    accentColor = '#D4AF37', 
    strumPulse = false 
}) {
    const canvasRef = useRef(null);
    const colorWashRef = useRef(null);
    const prevChordRef = useRef(activeChord);

    // Color Wash Flash on Chord Transition (from mixer.html technology)
    useEffect(() => {
        if (prevChordRef.current !== activeChord && colorWashRef.current) {
            colorWashRef.current.style.backgroundColor = accentColor;
            colorWashRef.current.style.opacity = '0.08';
            setTimeout(() => {
                if (colorWashRef.current) {
                    colorWashRef.current.style.opacity = '0';
                }
            }, 600);
            prevChordRef.current = activeChord;
        }
    }, [activeChord, accentColor]);

    // Canvas Flow Field Particle Engine (adapted from mixer.html)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animId = null;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const PARTICLE_COUNT = 320;
        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: 0,
            vy: 0,
            size: 0.8 + Math.random() * 1.5,
            age: Math.random() * 200,
            maxAge: 150 + Math.random() * 150,
            speed: 0.4 + Math.random() * 0.8
        }));

        let frameT = 0;

        const render = () => {
            frameT += 0.01;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const pulseBoost = strumPulse ? 1.6 : 1.0;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.age += 1;

                if (p.age > p.maxAge || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
                    p.x = Math.random() * canvas.width;
                    p.y = Math.random() * canvas.height;
                    p.age = 0;
                    p.maxAge = 150 + Math.random() * 150;
                }

                // Flow angle based on sinusoidal field
                const angle = Math.sin(p.x * 0.003 + frameT * 0.4) * Math.cos(p.y * 0.003 + frameT * 0.3) * Math.PI * 2;
                p.vx = Math.cos(angle) * p.speed * pulseBoost;
                p.vy = Math.sin(angle) * p.speed * pulseBoost;

                p.x += p.vx;
                p.y += p.vy;

                const lifeRatio = Math.sin((p.age / p.maxAge) * Math.PI);
                const alpha = lifeRatio * (strumPulse ? 0.35 : 0.18);

                ctx.fillStyle = accentColor;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (strumPulse ? 1.4 : 1.0), 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1.0;
            animId = requestAnimationFrame(render);
        };

        animId = requestAnimationFrame(render);

        return () => {
            if (animId) cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [accentColor, strumPulse]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* 1. GPU-accelerated Flow Field Particle Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* 2. Color Wash Flash Layer (from mixer.html) */}
            <div 
                ref={colorWashRef} 
                className="absolute inset-0 transition-opacity duration-700 ease-out opacity-0 pointer-events-none mix-blend-screen"
            />
        </div>
    );
}

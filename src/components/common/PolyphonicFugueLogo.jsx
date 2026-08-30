import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * PolyphonicFugueLogo
 * 
 * Proprietary JSF 3-Voice Polyphonic Fugue 3.0s Real-Time Web-Coding Logo Renderer.
 * 
 * Voice 1 (0.0s ~ 3.0s, Subject): Spatial Geometry, DoF Focus (blur 12px -> 0px), Scale (0.95 -> 1.0)
 * Voice 2 (0.8s ~ 3.0s, Answer): Chromatics & 18K Gold Saturation (0% -> 135%), Contrast (0.85 -> 1.15)
 * Voice 3 (1.6s ~ 3.0s, Countersubject): Razor-Sharp Alpha Contour Rim-Light & Plasma Flash (2.6s)
 * Cadence (3.0s+): Seamless handoff to 3.6s analog metallic breathing loop.
 */
export function PolyphonicFugueLogo({ 
    onFugueComplete, 
    className = "w-20 sm:w-21",
    isKeypadMode = false
}) {
    // fuguePhase: 'v1_geometry' -> 'v2_chroma' -> 'v3_luminance' -> 'cadence_complete'
    const [fuguePhase, setFuguePhase] = useState('v1_geometry');
    const [isCadenceDone, setIsCadenceDone] = useState(false);

    useEffect(() => {
        // Voice 1 (0.0s): Spatial Geometry & DoF
        const t1 = setTimeout(() => {
            setFuguePhase('v2_chroma');
            if (navigator.vibrate) try { navigator.vibrate(10); } catch (e) {}
        }, 800);

        // Voice 2 (0.8s): Chromatic & 18K Gold Saturation
        const t2 = setTimeout(() => {
            setFuguePhase('v3_luminance');
            if (navigator.vibrate) try { navigator.vibrate([15, 20]); } catch (e) {}
        }, 1600);

        // Voice 3 (1.6s -> 2.6s plasma flash -> 3.0s cadence)
        const t3 = setTimeout(() => {
            setFuguePhase('cadence_complete');
            setIsCadenceDone(true);
            if (navigator.vibrate) try { navigator.vibrate(25); } catch (e) {}
            if (onFugueComplete) onFugueComplete();
        }, 3000);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, []);

    // Dynamic Filter Generator based on Polyphonic Fugue Progression
    const getFilterState = () => {
        if (isCadenceDone) {
            // Post-3.0s Cadence: 3.6s Analog Metallic Breathing Loop
            return [
                "drop-shadow(0 0 1px rgba(255,250,230,0.95)) drop-shadow(0 0 3.5px rgba(255,215,0,0.85)) drop-shadow(0 0 8px rgba(212,175,55,0.45)) brightness(1.05) contrast(1.08) saturate(130%)",
                "drop-shadow(0 0 1.8px rgba(255,255,255,1.0)) drop-shadow(0 0 5.5px rgba(255,225,60,0.98)) drop-shadow(0 0 14px rgba(231,255,0,0.75)) brightness(1.28) contrast(1.15) saturate(145%)",
                "drop-shadow(0 0 1px rgba(255,250,230,0.95)) drop-shadow(0 0 3.5px rgba(255,215,0,0.85)) drop-shadow(0 0 8px rgba(212,175,55,0.45)) brightness(1.05) contrast(1.08) saturate(130%)"
            ];
        }

        switch (fuguePhase) {
            case 'v1_geometry': // 0.0s ~ 0.8s (Monochrome, Soft Focus, Tracing)
                return "drop-shadow(0 0 1px rgba(200,200,200,0.4)) brightness(0.7) contrast(0.9) saturate(10%) blur(4px)";
            case 'v2_chroma': // 0.8s ~ 1.6s (18K Gold Infusion, Sharp Focus, Mid-Corona)
                return "drop-shadow(0 0 2px rgba(212,175,55,0.6)) brightness(1.0) contrast(1.05) saturate(110%) blur(0px)";
            case 'v3_luminance': // 1.6s ~ 3.0s (Razor Rim-Light + Plasma Flash)
                return "drop-shadow(0 0 1.5px rgba(255,255,255,0.95)) drop-shadow(0 0 4.5px rgba(255,225,60,0.95)) drop-shadow(0 0 12px rgba(231,255,0,0.7)) brightness(1.25) contrast(1.12) saturate(135%)";
            default:
                return "drop-shadow(0 0 1px rgba(255,250,230,0.95)) drop-shadow(0 0 3.5px rgba(255,215,0,0.85)) brightness(1.05) contrast(1.08)";
        }
    };

    return (
        <div className="relative flex flex-col items-center justify-center pointer-events-none select-none">
            {/* 18K Gold Symbol Canvas with Fugue State Transition */}
            <motion.img
                src="/assets/logo/jsf_symbol_pure.png"
                alt="Just Sean Flows 18K Gold Symbol"
                initial={{
                    opacity: 0,
                    scale: 0.92,
                    filter: "drop-shadow(0 0 1px rgba(200,200,200,0.2)) brightness(0.5) contrast(0.8) saturate(0%) blur(8px)"
                }}
                animate={{
                    opacity: 1,
                    scale: isKeypadMode ? 0.90 : 1.0,
                    filter: getFilterState()
                }}
                transition={
                    isCadenceDone 
                        ? { repeat: Infinity, duration: 3.6, ease: "easeInOut" }
                        : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                }
                className={`${className} object-contain pointer-events-none select-none`}
            />
        </div>
    );
}

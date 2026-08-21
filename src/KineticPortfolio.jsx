import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// 1. Constants
import { FRAMES, MR_AUDIO_SRC } from './constants/frames';

// 2. Custom Performance Hooks
import { useDeviceGyro } from './hooks/useDeviceGyro';
import { useTrailCursor } from './hooks/useTrailCursor';
import { useWalkPhysics } from './hooks/useWalkPhysics';
import { useAudioMaster } from './hooks/useAudioMaster';

// 3. Modular UI Components
import { Header3D } from './components/common/Header3D';
import { KineticCursor } from './components/common/KineticCursor';
import { VolumePrompt } from './components/common/VolumePrompt';
import { StainedGlassArch } from './components/walk/StainedGlassArch';
import { Step07Timeline } from './components/walk/Step07Timeline';
import { SonicFootprints } from './components/walk/SonicFootprints';
import { EvolutionGauge } from './components/walk/EvolutionGauge';

// 4. Interactive Modals
import { InitialUnlockSplash } from './components/modals/InitialUnlockSplash';
import { WelcomeBackModal } from './components/modals/WelcomeBackModal';
import { TeaserTrailerModal } from './components/modals/TeaserTrailerModal';
import { FrankfurtAtelierModal } from './components/modals/FrankfurtAtelierModal';

export default function KineticPortfolio() {
    // Gyroscope & 3D Tilt Hook (50% Sensitivity)
    const { tilt, tiltX, tiltY, ghostOffsetX, ghostOffsetY } = useDeviceGyro();

    // 60FPS LERP Trailing Cursor Hook
    const { 
        cursorPos, trails, isScrollingUp, 
        updatePointerPos, triggerDopamineScrollUp 
    } = useTrailCursor();

    // Bulletproof Mobile Master Audio Engine Hook
    const {
        isAudioUnlocked,
        isMuted,
        showWelcomeBack,
        mrAudioRef,
        forceUnlockAudio,
        handleToggleMute,
        handleResumeFromWelcomeBack
    } = useAudioMaster();

    // Modals
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [isAtelierModalOpen, setIsAtelierModalOpen] = useState(false);
    const [isFlowsHit, setIsFlowsHit] = useState(false);

    // Trigger billiard ball collision wobble on .FLOWS text
    const handleFlowsHit = () => {
        setIsFlowsHit(true);
        setTimeout(() => setIsFlowsHit(false), 1200);
    };

    // React Stale-Closure Free Walking Physics Engine
    const { progress, activeFrameIdx, resetWalk, handleVideoCompleted } = useWalkPhysics({
        isAudioUnlocked,
        onFinishWalk: () => setIsTrailerModalOpen(true),
        triggerDopamineScrollUp
    });

    // Stained Glass Visibility on Frames 3 & 4
    const isAtelierOptionVisible = (activeFrameIdx === 3 || activeFrameIdx === 4);

    return (
        <div 
            className="fixed inset-0 w-screen h-screen bg-black text-white select-none overflow-hidden flex flex-col items-center justify-start cursor-default touch-none pt-10 sm:pt-14 pb-4"
            onMouseMove={(e) => updatePointerPos(e.clientX, e.clientY)}
            onTouchMove={(e) => {
                if (e.touches && e.touches[0]) {
                    updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
                }
            }}
            onClick={forceUnlockAudio}
            onTouchStart={forceUnlockAudio}
        >
            {/* Background Master MR Audio Element */}
            <audio ref={mrAudioRef} src={MR_AUDIO_SRC} loop playsInline preload="auto" />

            {/* Interactive 60FPS Trailing Cursor */}
            <KineticCursor 
                cursorPos={cursorPos} 
                trails={trails} 
                isScrollingUp={isScrollingUp} 
            />

            {/* 7-Step 1st-Person Walkthrough Stage (Reduced Top Gap, Increased Bottom Buffer) */}
            <main 
                className="relative w-full flex-1 max-h-[88vh] max-w-[56.25vh] aspect-[9/16] md:w-[410px] md:h-[84vh] md:max-h-[840px] md:rounded-[36px] md:border-2 md:border-white/20 md:shadow-[0_0_80px_rgba(231,255,0,0.2)] overflow-hidden transition-all duration-700 bg-black flex flex-col justify-between mx-auto"
                style={{
                    filter: (!isAudioUnlocked || showWelcomeBack) ? 'blur(20px) brightness(40%)' : 'none'
                }}
            >
                {/* Visual Frames Sequence */}
                {FRAMES.map((f, idx) => (
                    <motion.div
                        key={f.id}
                        initial={false}
                        animate={{
                            opacity: activeFrameIdx === idx ? 1 : 0,
                            scale: activeFrameIdx === idx ? 1.0 : 1.05,
                        }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full"
                    >
                        {f.videoSrc && activeFrameIdx === idx ? (
                            <video
                                ref={(el) => {
                                    if (el) {
                                        el.muted = true; // Muted to prevent mobile OS from killing background MR soundtrack
                                        el.playsInline = true;
                                        el.play().catch(() => {});
                                    }
                                }}
                                src={f.videoSrc}
                                poster={f.src}
                                autoPlay
                                playsInline
                                webkit-playsinline="true"
                                x5-playsinline="true"
                                controls={false}
                                disablePictureInPicture
                                disableRemotePlayback
                                preload="auto"
                                onEnded={handleVideoCompleted}
                                className="w-full h-full object-cover pointer-events-none transition-transform duration-700 scale-100"
                            />
                        ) : (
                            <img
                                src={f.src}
                                alt={f.titleMain}
                                className="w-full h-full object-cover pointer-events-none transition-transform duration-700 scale-100"
                            />
                        )}
                    </motion.div>
                ))}

                {/* 1. Dynamic Pure White Volume Calibrator & Morphing Top-Right Mute Button */}
                <VolumePrompt 
                    isAudioUnlocked={isAudioUnlocked} 
                    isMuted={isMuted}
                    onToggleMute={handleToggleMute}
                    onFlowsHit={handleFlowsHit}
                />

                {/* 2. Step 4/5: 3D Iridescent Stained Glass Arch Hotspot */}
                <StainedGlassArch 
                    isVisible={isAtelierOptionVisible}
                    isAudioUnlocked={isAudioUnlocked}
                    tiltX={tiltX}
                    tiltY={tiltY}
                    onOpenAtelier={() => setIsAtelierModalOpen(true)}
                />

                {/* 3. Step 7: 5-Stage Progressive Atelier Timeline with Bidirectional Scroll */}
                <Step07Timeline 
                    activeFrameIdx={activeFrameIdx}
                    tiltX={tiltX}
                    tiltY={tiltY}
                    onWalkAgain={resetWalk}
                />

                {/* 4. Stepping Footprints Surge & Sonic Equalizer */}
                <SonicFootprints isScrollingUp={isScrollingUp} />

                {/* 5. 7-Stage Evolutionary Rainbow Master Gauge */}
                <EvolutionGauge 
                    progress={progress}
                    activeFrameIdx={activeFrameIdx}
                    isScrollingUp={isScrollingUp}
                />
            </main>

            {/* Opening 3D LET'S GO Particle Splash */}
            <InitialUnlockSplash 
                isAudioUnlocked={isAudioUnlocked}
                onUnlock={forceUnlockAudio}
                tilt={tilt}
                tiltX={tiltX}
                tiltY={tiltY}
                ghostOffsetX={ghostOffsetX}
                ghostOffsetY={ghostOffsetY}
            />

            {/* Welcome Back 5-Second Countdown Resume Modal */}
            <WelcomeBackModal 
                isOpen={showWelcomeBack}
                onComplete={handleResumeFromWelcomeBack}
            />

            {/* 100% Walk Completion Teaser Trailer Modal */}
            <TeaserTrailerModal 
                isOpen={isTrailerModalOpen}
                onClose={() => setIsTrailerModalOpen(false)}
                onWalkAgain={() => {
                    resetWalk();
                    setIsTrailerModalOpen(false);
                }}
            />

            {/* Atelier Headquarters Info Modal */}
            <FrankfurtAtelierModal 
                isOpen={isAtelierModalOpen}
                onClose={() => setIsAtelierModalOpen(false)}
            />

            {/* Top-Level Permanent 3D Header (z-[9999]) with .FLOWS collision response */}
            <Header3D isFlowsHit={isFlowsHit} tiltX={tiltX} tiltY={tiltY} />
        </div>
    );
}

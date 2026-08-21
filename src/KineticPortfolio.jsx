import React from 'react';
import { motion } from 'framer-motion';
import { FRAMES, MR_AUDIO_SRC } from './constants/frames';
import { useAudioMaster } from './hooks/useAudioMaster';
import { useDeviceGyro } from './hooks/useDeviceGyro';
import { useTrailCursor } from './hooks/useTrailCursor';
import { useWalkPhysics } from './hooks/useWalkPhysics';

// Core Dynamic Components
import { Header3D } from './components/common/Header3D';
import { KineticCursor } from './components/common/KineticCursor';
import { VolumePrompt } from './components/common/VolumePrompt';
import { StainedGlassArch } from './components/walk/StainedGlassArch';
import { Step07Timeline } from './components/walk/Step07Timeline';
import { SonicFootprints } from './components/walk/SonicFootprints';
import { EvolutionGauge } from './components/walk/EvolutionGauge';
import { ArchCalibrationDevTool } from './components/dev/ArchCalibrationDevTool';

// Modal Overlays
import { InitialUnlockSplash } from './components/modals/InitialUnlockSplash';
import { WelcomeBackModal } from './components/modals/WelcomeBackModal';
import { TeaserTrailerModal } from './components/modals/TeaserTrailerModal';
import { FrankfurtAtelierModal } from './components/modals/FrankfurtAtelierModal';

export default function KineticPortfolio() {
    // 1. Audio Master & Lifecycle Manager
    const {
        mrAudioRef,
        isAudioUnlocked,
        isMuted,
        showWelcomeBack,
        isFlowsHit,
        forceUnlockAudio,
        handleToggleMute,
        handleFlowsHit,
        handleResumeFromWelcomeBack
    } = useAudioMaster();

    // 2. 60FPS Gyro & Mouse Tilt Engine
    const { tilt, tiltX, tiltY, ghostOffsetX, ghostOffsetY } = useDeviceGyro();

    // 3. Fluid Mouse / Touch Trail Engine
    const { cursorPos, trails, isScrollingUp, updatePointerPos, triggerDopamineScrollUp } = useTrailCursor();

    // 4. Kinetic Walk Physics & 7-Stage State Machine
    const {
        progress,
        activeFrameIdx,
        isTrailerModalOpen,
        isAtelierModalOpen,
        setIsTrailerModalOpen,
        setIsAtelierModalOpen,
        handleVideoCompleted,
        resetWalk
    } = useWalkPhysics({
        isAudioUnlocked,
        onFinishWalk: () => setIsTrailerModalOpen(true),
        triggerDopamineScrollUp
    });

    // Stained Glass Visibility on Frames 3 & 4
    const isAtelierOptionVisible = (activeFrameIdx === 3 || activeFrameIdx === 4);

    return (
        <div 
            className="fixed inset-0 w-screen h-[100dvh] bg-black text-white select-none overflow-hidden flex flex-col items-center justify-center cursor-default touch-none pt-2 pb-2 px-3"
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

            {/* Centered Phone Canvas Wrapper (395px max width for PC & Mobile consistency) */}
            <div className="relative z-60 w-full max-w-[395px] aspect-[768/1376] max-h-[calc(100dvh-62px)] mx-auto my-auto flex items-center justify-center">
                
                {/* 7-Step 1st-Person Walkthrough Stage */}
                <main 
                    className="relative w-full h-full rounded-[32px] border-2 border-white/20 shadow-[0_0_60px_rgba(231,255,0,0.18)] overflow-hidden transition-all duration-700 bg-black flex flex-col justify-between"
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
                                scale: activeFrameIdx === idx ? 1.0 : 1.04
                            }}
                            transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ zIndex: activeFrameIdx === idx ? 10 : 0 }}
                        >
                            {f.isVideo ? (
                                <video
                                    ref={(el) => {
                                        if (el) {
                                            if (activeFrameIdx === idx) {
                                                el.currentTime = 0;
                                                el.play().catch(() => {});
                                            } else {
                                                el.pause();
                                            }
                                        }
                                    }}
                                    src={f.videoSrc}
                                    poster={f.src}
                                    muted
                                    autoPlay
                                    playsInline
                                    webkit-playsinline="true"
                                    x5-playsinline="true"
                                    controls={false}
                                    disablePictureInPicture
                                    disableRemotePlayback
                                    preload="auto"
                                    onEnded={handleVideoCompleted}
                                    className="w-full h-full object-fill pointer-events-none transition-transform duration-700 scale-100"
                                />
                            ) : (
                                <img
                                    src={f.src}
                                    alt={f.titleMain}
                                    className="w-full h-full object-fill pointer-events-none transition-transform duration-700 scale-100"
                                />
                            )}
                        </motion.div>
                    ))}

                    {/* Step 4/5: 3D Iridescent Stained Glass Arch Hotspot */}
                    <StainedGlassArch 
                        isVisible={isAtelierOptionVisible}
                        isAudioUnlocked={isAudioUnlocked}
                        tiltX={tiltX}
                        tiltY={tiltY}
                        onOpenAtelier={() => setIsAtelierModalOpen(true)}
                    />

                    {/* Live Dev Pen & Touch Calibration Tool */}
                    <ArchCalibrationDevTool isVisible={isAtelierOptionVisible} />

                    {/* Step 7: 5-Stage Progressive Atelier Timeline with Bidirectional Scroll */}
                    <Step07Timeline 
                        activeFrameIdx={activeFrameIdx}
                        tiltX={tiltX}
                        tiltY={tiltY}
                        onWalkAgain={resetWalk}
                    />

                    {/* Dynamic Stepping Footprints Surge (Only on Scroll Up) */}
                    <SonicFootprints isScrollingUp={isScrollingUp} />

                    {/* Restored Minimal Text-Free Progress Gauge Bar */}
                    <EvolutionGauge progress={progress} isAudioUnlocked={isAudioUnlocked} />
                </main>

                {/* Frame-Anchored Volume Calibrator & Morphing Top-Right Mute Button (z-[9998]) */}
                <VolumePrompt 
                    isAudioUnlocked={isAudioUnlocked} 
                    isMuted={isMuted}
                    onToggleMute={handleToggleMute}
                    onFlowsHit={handleFlowsHit}
                />
            </div>

            {/* Opening 3D LET'S GO Particle Splash */}
            <InitialUnlockSplash 
                isAudioUnlocked={isAudioUnlocked}
                onUnlock={forceUnlockAudio}
                tilt={tilt}
                tiltX={tiltX}
                tiltY={tiltY}
                ghostOffsetX={ghostOffsetX}
                ghostOffsetY={ghostOffsetY}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onFlowsHit={handleFlowsHit}
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

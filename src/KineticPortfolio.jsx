import { InstagramVipAuthModal, getStoredVipProfile } from './components/modals/InstagramVipAuthModal';
import { PrivateMemberVaultModal } from './components/museum/PrivateMemberVaultModal';
import { WalkRadarMap } from './components/walk/WalkRadarMap';
import { ModularSoundLabModal } from './components/museum/ModularSoundLabModal';
import { AtelierMuseumHub } from './components/museum/AtelierMuseumHub';
import { InteractiveSheetMusicModal } from './components/modals/InteractiveSheetMusicModal';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FRAMES, MR_AUDIO_SRC } from './constants/frames';
import { useAudioMaster } from './hooks/useAudioMaster';
import { useDeviceGyro } from './hooks/useDeviceGyro';
import { useTrailCursor } from './hooks/useTrailCursor';
import { useWalkPhysics } from './hooks/useWalkPhysics';
import { getWaveformHarmonicState, PHOTO_ATMOSPHERE_PALETTE } from './constants/guitarWaveformEngine';
import { HarmonicFlowField } from './components/common/HarmonicFlowField';

// Core Dynamic Components
import { Header3D } from './components/common/Header3D';
import { KineticCursor } from './components/common/KineticCursor';
import { VolumePrompt } from './components/common/VolumePrompt';
import { Step07Timeline } from './components/walk/Step07Timeline';
import { Step25QuestPopup } from './components/walk/Step25QuestPopup';
import { SonicFootprints } from './components/walk/SonicFootprints';
import { EvolutionGauge } from './components/walk/EvolutionGauge';

// Modal Overlays
import { InitialUnlockSplash } from './components/modals/InitialUnlockSplash';
import { WelcomeBackModal } from './components/modals/WelcomeBackModal';

export default function KineticPortfolio() {
    const {
        mrAudioRef,
        isAudioUnlocked,
        isMuted,
        showWelcomeBack,
        isFlowsHit,
        setIsModalActive,
        forceUnlockAudio,
        handleToggleMute,
        handleFlowsHit,
        handleResumeFromWelcomeBack
    } = useAudioMaster();

    const { tilt, tiltX, tiltY, ghostOffsetX, ghostOffsetY } = useDeviceGyro();
    const videoRef = useRef(null);
    const { cursorPos, trails, isScrollingUp, updatePointerPos, triggerDopamineScrollUp } = useTrailCursor();

    const {
        progress,
        activeFrameIdx,
        isStep25Active,
        stepSubCount,
        walkBobTrigger,
        isAtelierModalOpen,
        setIsAtelierModalOpen,
        handleVideoTimeUpdate,
        handleVideoCompleted,
        handleCompleteStep25,
        resetWalk,
        goToStep,
        stepForward,
        stepBackward
    } = useWalkPhysics({
        isAudioUnlocked,
        triggerDopamineScrollUp
    });

    const [isMuseumOpen, setIsMuseumOpen] = useState(false);
    const [isSoundLabOpen, setIsSoundLabOpen] = useState(false);
    const [isSheetMusicOpen, setIsSheetMusicOpen] = useState(false);

    // Exact Physical Audio Waveform Strum & Harmonic State
    const [activeChord, setActiveChord] = useState('Dm');
    const [strumPulse, setStrumPulse] = useState(false);
    const [currentPalette, setCurrentPalette] = useState(PHOTO_ATMOSPHERE_PALETTE['Dm']);

    // Real-time Audio Waveform Transient & Full Harmonic Loop
    useEffect(() => {
        let animId = null;

        const waveformSyncLoop = () => {
            const rawT = mrAudioRef.current ? mrAudioRef.current.currentTime : 0;
            const t = rawT + 0.30;

            const state = getWaveformHarmonicState(t);
            setActiveChord(state.activeChord);
            setStrumPulse(state.isStrumming);
            setCurrentPalette(state.palette);

            animId = requestAnimationFrame(waveformSyncLoop);
        };

        animId = requestAnimationFrame(waveformSyncLoop);
        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, []);

    // Master Audio Lock
    useEffect(() => {
        const isAnyModalOpen = isSoundLabOpen || isMuseumOpen || isSheetMusicOpen;
        setIsModalActive(isAnyModalOpen);
        if (isAnyModalOpen && mrAudioRef.current) {
            mrAudioRef.current.pause();
            mrAudioRef.current.muted = true;
        }
    }, [isSoundLabOpen, isMuseumOpen, isSheetMusicOpen]);

    const handleInitialUnlock = () => {
        forceUnlockAudio();
    };

    // Auto Play Video in Step 2
    useEffect(() => {
        const currentFrame = FRAMES[activeFrameIdx];
        if (currentFrame?.isVideo && videoRef.current) {
            try {
                videoRef.current.currentTime = 0;
                const p = videoRef.current.play();
                if (p !== undefined) {
                    p.catch(() => {});
                }
            } catch (e) {}
        } else if (videoRef.current) {
            try {
                videoRef.current.pause();
            } catch (e) {}
        }
    }, [activeFrameIdx]);

    const currentStepScale = 1.0 + (stepSubCount * 0.022);

    return (
        <div 
            className="fixed inset-0 w-screen h-[100dvh] bg-[#050507] text-white select-none overflow-hidden flex flex-col items-center justify-center cursor-default touch-none pt-2 pb-2 px-3 transition-colors duration-1000 ease-out"
            onMouseMove={(e) => updatePointerPos(e.clientX, e.clientY)}
            onTouchMove={(e) => {
                if (e.touches && e.touches[0]) {
                    updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
                }
            }}
            onClick={handleInitialUnlock}
            onTouchStart={handleInitialUnlock}
        >
            {/* Background Master MR Audio */}
            <audio ref={mrAudioRef} src={MR_AUDIO_SRC} loop playsInline preload="auto" />

            {/* 1. CINEMATIC AMBIENT LIGHT */}
            <div 
                className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out"
                style={{
                    background: currentPalette.ambientGradient,
                    opacity: 0.95
                }}
            />

            {/* 2. GPU FLOW FIELD PARTICLES */}
            <HarmonicFlowField 
                activeChord={activeChord}
                accentColor={currentPalette.accent}
                strumPulse={strumPulse}
            />

            {/* 3. SOFT DIFFUSED STREETLAMP AURA */}
            <motion.div 
                animate={{
                    scale: strumPulse ? 1.08 : 1.0,
                    opacity: strumPulse ? 0.42 : 0.22
                }}
                transition={{
                    duration: strumPulse ? 0.22 : 1.6,
                    ease: [0.16, 1, 0.3, 1]
                }}
                style={{
                    background: `radial-gradient(circle, ${currentPalette.accent} 0%, transparent 68%)`,
                    filter: 'blur(140px)'
                }}
                className="absolute w-[700px] h-[700px] rounded-full pointer-events-none z-0 mix-blend-screen"
            />

            <KineticCursor 
                cursorPos={cursorPos} 
                trails={trails} 
                isScrollingUp={isScrollingUp} 
            />

            {/* Centered Phone Canvas Wrapper */}
            <div className="relative z-60 w-full max-w-[395px] aspect-[768/1376] max-h-[calc(100dvh-62px)] mx-auto my-auto flex items-center justify-center">
                
                <motion.main 
                    animate={{
                        borderColor: currentPalette.borderColor,
                        boxShadow: strumPulse 
                            ? `0 0 40px ${currentPalette.glow}, 0 20px 50px rgba(0,0,0,0.95), inset 0 0 16px ${currentPalette.subtleGlow}`
                            : `0 0 22px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.9), inset 0 0 8px rgba(200, 169, 110, 0.12)`
                    }}
                    transition={{
                        duration: 0.18,
                        ease: "easeOut"
                    }}
                    className="relative w-full h-full rounded-[32px] border-[1.5px] overflow-hidden bg-[#070709] flex flex-col justify-between transition-colors duration-700"
                    style={{
                        filter: (!isAudioUnlocked || showWelcomeBack) ? 'blur(20px) brightness(40%)' : 'none'
                    }}
                >
                    {/* Visual Frames Sequence with Forward Step Zoom Physics */}
                    {FRAMES.map((f, idx) => {
                        const isCurrent = activeFrameIdx === idx;
                        return (
                            <motion.div
                                key={f.id}
                                initial={false}
                                animate={{
                                    opacity: isCurrent ? 1 : 0,
                                    scale: isCurrent ? currentStepScale : 1.05,
                                    y: isCurrent ? 0 : 4
                                }}
                                transition={{ 
                                    opacity: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
                                    scale: { type: "spring", stiffness: 280, damping: 22 },
                                    y: { type: "spring", stiffness: 320, damping: 20 }
                                }}
                                className="absolute inset-0 w-full h-full pointer-events-none"
                                style={{ zIndex: isCurrent ? 10 : 0 }}
                            >
                                {f.isVideo ? (
                                    <video
                                        ref={videoRef}
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
                                        onTimeUpdate={(e) => handleVideoTimeUpdate(e.target.currentTime, e.target.duration)}
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
                        );
                    })}

                    {/* Step 2.5 Quest Popup (Appears between Step 2 and Step 3) */}
                    <Step25QuestPopup 
                        isOpen={isStep25Active}
                        onComplete={handleCompleteStep25}
                        tiltX={tiltX}
                        tiltY={tiltY}
                    />

                    <Step07Timeline 
                        activeFrameIdx={activeFrameIdx}
                        tiltX={tiltX}
                        tiltY={tiltY}
                        onWalkAgain={resetWalk}
                        onOpenMuseum={() => setIsMuseumOpen(true)}
                    />

                    {/* Integrated Expandable Walk Radar (1, 3, 5 Numbers / 2, 4, 6, 7 Emojis) */}
                    <WalkRadarMap 
                        activeFrameIdx={activeFrameIdx}
                        isVisible={isAudioUnlocked && !isMuseumOpen && !isSoundLabOpen && !showWelcomeBack && !isStep25Active}
                        goToStep={goToStep}
                        stepForward={stepForward}
                        stepBackward={stepBackward}
                    />

                    <SonicFootprints isScrollingUp={isScrollingUp} />
                    <EvolutionGauge progress={progress} isAudioUnlocked={isAudioUnlocked} />
                </motion.main>

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
                onUnlock={handleInitialUnlock}
                onDirectMuseum={() => {
                    setIsMuseumOpen(true);
                    forceUnlockAudio();
                    if (mrAudioRef.current) {
                        mrAudioRef.current.pause();
                        mrAudioRef.current.muted = true;
                    }
                }}
                onDirectSoundLab={() => {
                    forceUnlockAudio();
                    if (mrAudioRef.current) mrAudioRef.current.pause();
                    setIsSoundLabOpen(true);
                }}
                tilt={tilt}
                tiltX={tiltX}
                tiltY={tiltY}
                ghostOffsetX={ghostOffsetX}
                ghostOffsetY={ghostOffsetY}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onFlowsHit={handleFlowsHit}
            />

            {/* Direct Remastered 3D Modular Sound Lab Visualizer Modal */}
            <ModularSoundLabModal
                isOpen={isSoundLabOpen}
                onClose={() => setIsSoundLabOpen(false)}
            />

            {/* Full-Scale Google Project Genie-Style 3D Crystal Orb Museum Hub */}
            <AtelierMuseumHub 
                isOpen={isMuseumOpen}
                onClose={() => setIsMuseumOpen(false)}
                onReplayWalk={() => {
                    setIsMuseumOpen(false);
                    resetWalk();
                }}
            />

            {/* Interactive Lead Sheet Music Modal (CADENZA-432) */}
            <InteractiveSheetMusicModal
                isOpen={isSheetMusicOpen}
                onClose={() => setIsSheetMusicOpen(false)}
            />

            {/* Welcome Back Modal */}
            <WelcomeBackModal 
                isOpen={showWelcomeBack}
                onComplete={handleResumeFromWelcomeBack}
            />

            {/* Top-Level Clean 3D Kinetic Header with Volume Morph Button */}
            {(!isMuseumOpen && !isSoundLabOpen) && (
                <Header3D 
                    isFlowsHit={isFlowsHit} 
                    tiltX={tiltX} 
                    tiltY={tiltY} 
                    isMuted={isMuted}
                    onToggleMute={handleToggleMute}
                />
            )}
        </div>
    );
}

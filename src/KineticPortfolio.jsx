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
import { unlockTitle } from './constants/titles';

// Core Dynamic Components
import { Header3D } from './components/common/Header3D';
import { KineticCursor } from './components/common/KineticCursor';
import { VolumePrompt } from './components/common/VolumePrompt';
import { ArchitecturalLedBoundaries } from './components/common/ArchitecturalLedBoundaries';
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

                    {/* Step 2+ Reconstruction Overlay (Halts progression for complete overhaul) */}
                    {activeFrameIdx >= 1 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1.0 }}
                            className="absolute inset-0 z-50 bg-[#070709]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center select-none"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/60 flex items-center justify-center mb-4 shadow-[0_0_35px_rgba(212,175,55,0.4)]">
                                <span className="text-2xl">🚧</span>
                            </div>
                            <span className="font-mono text-[9px] text-[#D4AF37] font-black tracking-[0.25em] uppercase mb-2">
                                ATELIER SPATIAL RECONSTRUCTION
                            </span>
                            <h2 className="text-lg font-serif text-white tracking-wide mb-2">
                                02:00 AM FRANKFURT WALK
                            </h2>
                            <p className="text-neutral-400 text-xs leading-relaxed max-w-[240px] mb-6">
                                7단계 시네마틱 공간 워크 및 카메라 트랜지션 엔진을 새롭게 전면 개편 중입니다.
                            </p>
                            <button
                                onClick={() => goToStep(0)}
                                className="px-5 py-2.5 rounded-full border border-[#D4AF37]/50 bg-black/60 hover:bg-[#D4AF37]/20 text-[#D4AF37] font-mono text-[10px] font-bold tracking-widest uppercase transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                            >
                                <span>←</span>
                                <span>BACK TO STEP 1</span>
                            </button>
                        </motion.div>
                    )}

                    {/* Step 4 & Step 5 Floating Interactive Company Storefront Logo Badge */}
                    {(activeFrameIdx === 3 || activeFrameIdx === 4) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1.0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                                transform: `translate3d(${tiltX * 0.4}px, ${tiltY * 0.4}px, 0)`
                            }}
                            className="absolute top-[28%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-auto cursor-pointer group"
                            onClick={() => {
                                if (typeof unlockTitle === 'function') {
                                    unlockTitle('ug_founding_archive');
                                }
                            }}
                        >
                            <div className="relative flex items-center justify-center">
                                <div className="absolute w-16 h-16 rounded-full bg-[#00E5FF]/25 blur-md group-hover:blur-xl transition-all animate-pulse" />
                                <div className="relative w-12 h-12 rounded-2xl bg-black/85 border-2 border-[#00E5FF] shadow-[0_0_25px_#00E5FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-xl">🏢</span>
                                </div>
                            </div>
                            <span className="mt-1.5 px-3 py-0.5 rounded-full bg-black/90 backdrop-blur-md border border-[#00E5FF]/60 font-mono text-[9px] font-black text-[#00E5FF] tracking-widest uppercase shadow-[0_0_12px_rgba(0,229,255,0.4)] group-hover:border-[#00E5FF] transition-all">
                                JUST SEAN FLOWS UG
                            </span>
                        </motion.div>
                    )}

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

            {/* Global Architectural 3% LED Boundary Light Fixtures (Top & Bottom Ambient Guard Rails) */}
            <ArchitecturalLedBoundaries 
                tiltX={tiltX} 
                tiltY={tiltY} 
                isMuted={isMuted} 
            />
        </div>
    );
}

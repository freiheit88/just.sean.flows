import { InstagramVipAuthModal, getStoredVipProfile } from './components/modals/InstagramVipAuthModal';
import { PayPalCheckoutModal } from './components/modals/PayPalCheckoutModal';
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
        depthZ = 0,
        progress,
        activeFrameIdx,
        isSnapping,
        isStep25Active,
        stepSubCount,
        walkBobTrigger,
        isAtelierModalOpen,
        setIsAtelierModalOpen,
        snapToTV,
        resetWalk,
        goToStep,
        stepForward,
        stepBackward
    } = useWalkPhysics({
        isAudioUnlocked,
        isMuted,
        triggerDopamineScrollUp,
        onDirectMuseum: () => {
            setIsMuseumOpen(true);
        }
    });

    const [isMuseumOpen, setIsMuseumOpen] = useState(false);
    const [isSoundLabOpen, setIsSoundLabOpen] = useState(false);
    const [isSheetMusicOpen, setIsSheetMusicOpen] = useState(false);
    const [isPayPalOpen, setIsPayPalOpen] = useState(false);
    const [payPalTier, setPayPalTier] = useState('VIP_PARTY');
    const [isVipAuthOpen, setIsVipAuthOpen] = useState(false);
    const [vipProfile, setVipProfile] = useState(() => getStoredVipProfile());

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
        const isAnyModalOpen = isSoundLabOpen || isMuseumOpen || isSheetMusicOpen || isPayPalOpen || isVipAuthOpen;
        setIsModalActive(isAnyModalOpen);
        if (isAnyModalOpen && mrAudioRef.current) {
            mrAudioRef.current.pause();
            mrAudioRef.current.muted = true;
        }
    }, [isSoundLabOpen, isMuseumOpen, isSheetMusicOpen, isPayPalOpen, isVipAuthOpen]);

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
                    {/* 1st-Person Eye-Level Spatial Walk into 02:00 AM TV Salon */}
                    <div 
                        className="relative w-full h-full overflow-hidden cursor-pointer select-none"
                        onClick={() => snapToTV()}
                    >
                        {/* Eye-Level 3D Room Gliding (Strict Y-Lock) */}
                        <motion.div
                            style={{
                                transform: `scale(${1.0 + (depthZ * 3.4)})`,
                                transformOrigin: '50% 52%'
                            }}
                            className="absolute inset-0 w-full h-full pointer-events-none"
                        >
                            <img
                                src="/assets/lone_light_salon_02am.jpg"
                                alt="02:00 AM Lone Light Salon"
                                className="w-full h-full object-fill brightness-95"
                            />
                        </motion.div>

                        {/* Interactive CRT TV Screen Video & Bloom Layer */}
                        <motion.div
                            style={{
                                opacity: depthZ > 0.3 ? 1 : 0.85,
                                transform: `scale(${1.0 + (depthZ * 3.4)})`,
                                transformOrigin: '50% 52%'
                            }}
                            className="absolute inset-0 pointer-events-none flex items-center justify-center"
                        >
                            {/* TV Golden Scanline & Micro Light Bloom */}
                            <div 
                                style={{
                                    opacity: 0.15 + (depthZ * 0.45),
                                    boxShadow: '0 0 45px rgba(212,175,55,0.8)'
                                }}
                                className="w-20 h-16 rounded-md bg-[#D4AF37]/20 mix-blend-screen pointer-events-none" 
                            />
                        </motion.div>

                        {/* Subtle Tactile Floating Prompt Badge */}
                        <motion.div
                            animate={{
                                opacity: depthZ > 0.90 ? 0 : 1,
                                y: [0, -3, 0]
                            }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                            className="absolute inset-x-0 bottom-6 z-30 flex flex-col items-center pointer-events-auto"
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    snapToTV();
                                }}
                                className="px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/60 hover:bg-[#D4AF37]/20 text-[#D4AF37] font-mono text-[8.5px] font-bold tracking-[0.22em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer flex items-center gap-1.5"
                            >
                                <span>📺</span>
                                <span>{depthZ > 0.7 ? 'DOCKING INTO TV // ENTER ATELIER' : 'SCROLL / DRAG FORWARD TO TV'}</span>
                            </button>
                        </motion.div>
                    </div>

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
                onOpenVipAuth={() => setIsVipAuthOpen(true)}
                onOpenPayPal={(tier) => {
                    if (tier) setPayPalTier(tier);
                    setIsPayPalOpen(true);
                }}
                vipProfile={vipProfile}
            />

            {/* PayPal Smart Payment Checkout Modal */}
            <PayPalCheckoutModal
                isOpen={isPayPalOpen}
                onClose={() => setIsPayPalOpen(false)}
                defaultTier={payPalTier}
                onPaymentSuccess={(receipt, updatedVip) => {
                    setVipProfile(updatedVip);
                }}
            />

            {/* Instagram VIP Passport Auth Modal */}
            <InstagramVipAuthModal
                isOpen={isVipAuthOpen}
                onClose={() => setIsVipAuthOpen(false)}
                onAuthenticated={(profile) => {
                    setVipProfile(profile);
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
            {(isAudioUnlocked && !isMuseumOpen && !isSoundLabOpen && !isPayPalOpen && !isVipAuthOpen) && (
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

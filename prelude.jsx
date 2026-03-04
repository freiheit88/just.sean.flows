import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicOpening from './components/CinematicOpening';
import {
    LucideCheckCircle, LucideGlobe, LucideInstagram,
    LucideSparkles, LucideInfo, LucideVolume2,
    LucideLoader2, LucideChevronLeft,
    LucideTrophy, LucideLayout, LucideMapPin,
    LucideFeather, LucideScroll, LucideCompass, LucideUser, LucideUpload,
    LucideCheckSquare, LucideSquare, LucideFlame, LucideSettings, LucideCamera, LucideZap, LucideScale,
    LucideArrowLeft, LucideArrowRight, LucideLock,
    LucideOrbit, LucideActivity
} from 'lucide-react';
import MinaDirective from './components/MinaDirective';
import { calculateArchetype } from './components/Archetypes';

class SimpleErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, info) { console.error("Crash:", error, info); }
    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-[99999] bg-[#5C1A1A] p-8 text-white flex flex-col items-start overflow-auto">
                    <h1 className="text-3xl font-black text-red-400 mb-4">CRITICAL REACT CRASH</h1>
                    <p className="font-bold mb-4">{this.state.error && this.state.error.toString()}</p>
                    <pre className="text-xs bg-black/50 p-4 rounded text-white/70 max-w-full whitespace-pre-wrap">{this.state.error && this.state.error.stack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const BUILD_VERSION = "v1.4.0-clockwork-masterpiece-final";

/**
 * [V19] Singleton AudioManager
 * Prevents overlapping sounds and manages persistent themes.
 */
const AudioManager = {
    currentSfx: null,
    currentTheme: null,
    mainTheme: null,
    currentMina: null,
    lastPlayedThemeIndex: {},

    playSfx: (id, volume = 0.5, overlap = false) => {
        let filename = `${id}.mp3`;
        if (id === 'click') filename = 'en-click.mp3';
        if (id === 'shutter') filename = 'gear-click.mp3';
        if (id === 'forge') filename = 'ink-scratching.mp3';
        if (id === 'confirm') filename = 'portal-transition.mp3';
        if (id === 'transition') {
            filename = 'portal-transition.mp3';
            // [V26] Hack to triple the amplitude of the transition effect natively
            [...Array(3)].forEach(() => {
                const audio = new Audio(`/assets/sounds/${filename}`);
                audio.volume = volume;
                audio.play().catch(() => { });
            });
            return;
        }

        if (AudioManager.currentSfx && !overlap) {
            AudioManager.currentSfx.pause();
            AudioManager.currentSfx = null;
        }
        const audio = new Audio(`/assets/sounds/${filename}`);
        audio.volume = volume;
        audio.play().catch(() => { });
        if (!overlap) AudioManager.currentSfx = audio;
    },

    playTheme: (langId, targetVolume = 0.28, fadeDuration = 3000) => {
        // V27: Map available new tracks
        const THEME_TRACKS = {
            ar: ['ar_song1', 'ar_song2'],
            de: ['de_song1', 'de_song2'],
            en: ['en_song1', 'en_song2'],
            es: ['es_song1', 'es_song2'],
            hi: ['in_song1', 'in_song2'],
            ja: ['jp_song1', 'jp_song2'],
            ko: ['ko_song1', 'ko_song2'],
            pl: ['po_song1', 'po_song2']
        };

        let audioSrc = `/assets/sounds/${langId}-theme.mp3`; // fallback
        let trackName = `${langId}-theme`;

        // V28: First time random pick, subsequent clicks toggle (alternate)
        if (THEME_TRACKS[langId] && THEME_TRACKS[langId].length > 0) {
            const tracks = THEME_TRACKS[langId];

            if (AudioManager.lastPlayedThemeIndex[langId] === undefined) {
                // First click: Pick a random track index
                AudioManager.lastPlayedThemeIndex[langId] = Math.floor(Math.random() * tracks.length);
            } else {
                // Subsequent clicks: Cycle to the next track
                AudioManager.lastPlayedThemeIndex[langId] = (AudioManager.lastPlayedThemeIndex[langId] + 1) % tracks.length;
            }

            trackName = tracks[AudioManager.lastPlayedThemeIndex[langId]];
            audioSrc = `/assets/manual_upload/language_thema/${trackName}.wav`;
        }

        // Point 6: Immediate switch. If already playing this theme from random array, just exit.
        if (AudioManager.currentTheme && !AudioManager.currentTheme.paused && AudioManager.currentTheme.src.includes(trackName)) return;

        // Force stop mainTheme to ensure no overlap
        if (AudioManager.mainTheme) {
            AudioManager.mainTheme.pause();
            AudioManager.mainTheme.currentTime = 0;
        }

        if (AudioManager.currentTheme) {
            // Quick fade out of the old theme
            const oldTheme = AudioManager.currentTheme;
            let oldVol = oldTheme.volume;
            const fadeOutInterval = setInterval(() => {
                oldVol -= 0.05;
                if (oldVol <= 0) {
                    oldTheme.pause();
                    oldTheme.currentTime = 0;
                    clearInterval(fadeOutInterval);
                } else {
                    oldTheme.volume = oldVol;
                }
            }, 50);
        }

        const audio = new Audio(audioSrc);

        // Setup fade-in
        audio.volume = 0;
        audio.loop = true;
        audio.play().catch(() => { });

        const steps = 20;
        const stepTime = fadeDuration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        AudioManager.baseThemeVolume = targetVolume;
        if (AudioManager.themeFadeInterval) clearInterval(AudioManager.themeFadeInterval);

        AudioManager.themeFadeInterval = setInterval(() => {
            if (currentStep < steps && audio === AudioManager.currentTheme) {
                audio.volume = Math.min(targetVolume, audio.volume + volumeStep);
                currentStep++;
            } else {
                clearInterval(AudioManager.themeFadeInterval);
            }
        }, stepTime);

        AudioManager.currentTheme = audio;
        window.journeyTheme = audio;
    },

    stopTheme: () => {
        if (AudioManager.currentTheme) {
            AudioManager.currentTheme.pause();
            AudioManager.currentTheme = null;
        }
    },

    playMainTheme: (targetVolume = 0.35, fadeDuration = 3000) => {
        if (AudioManager.mainTheme && !AudioManager.mainTheme.paused && AudioManager.mainTheme.src.includes(`background_candiate1.mp3`)) return;

        if (AudioManager.mainTheme) {
            AudioManager.mainTheme.pause();
            AudioManager.mainTheme.currentTime = 0;
        }

        const audio = new Audio('/assets/sounds/background_candiate1.mp3');
        audio.volume = 0;
        audio.loop = true;
        audio.play().catch(() => { });

        const steps = 20;
        const stepTime = fadeDuration / steps;
        const volumeStep = targetVolume / steps;
        let currentStep = 0;

        AudioManager.baseMainThemeVolume = targetVolume;
        if (AudioManager.mainThemeFadeInterval) clearInterval(AudioManager.mainThemeFadeInterval);

        AudioManager.mainThemeFadeInterval = setInterval(() => {
            if (currentStep < steps && audio === AudioManager.mainTheme) {
                audio.volume = Math.min(targetVolume, audio.volume + volumeStep);
                currentStep++;
            } else {
                clearInterval(AudioManager.mainThemeFadeInterval);
            }
        }, stepTime);

        AudioManager.mainTheme = audio;
    },

    fadeMainTheme: (targetVolume, fadeDuration = 2000) => {
        if (!AudioManager.mainTheme) return;
        const audio = AudioManager.mainTheme;
        const startVolume = audio.volume;
        const steps = 40;
        const stepTime = fadeDuration / steps;
        let currentStep = 0;

        AudioManager.baseMainThemeVolume = targetVolume;
        if (AudioManager.mainThemeFadeInterval) clearInterval(AudioManager.mainThemeFadeInterval);

        AudioManager.mainThemeFadeInterval = setInterval(() => {
            if (currentStep < steps && audio === AudioManager.mainTheme) {
                audio.volume = startVolume + (targetVolume - startVolume) * (currentStep / steps);
                currentStep++;
            } else {
                if (audio === AudioManager.mainTheme) audio.volume = targetVolume;
                clearInterval(AudioManager.mainThemeFadeInterval);
            }
        }, stepTime);
    },

    duckInterval: null,
    restoreInterval: null,
    baseThemeVolume: 0.15,
    baseMainThemeVolume: 0.20,
    currentMina: null,
    currentSignature: null,
    playMina: (langId, step, volume = 1.0) => {
        const audioKey = `${langId}-${step}`;

        // V30: Prevent duplicate overlapping calls within 1 second
        if (AudioManager.lastPlayedAudioKey === audioKey && (Date.now() - (AudioManager.lastPlayedAudioTime || 0) < 1000)) {
            console.log("Blocking duplicate audio call:", audioKey);
            return;
        }
        AudioManager.lastPlayedAudioKey = audioKey;
        AudioManager.lastPlayedAudioTime = Date.now();

        if (AudioManager.currentMina) {
            AudioManager.currentMina.pause();
            AudioManager.currentMina.currentTime = 0;
        }
        if (AudioManager.currentSignature) {
            AudioManager.currentSignature.pause();
            AudioManager.currentSignature.currentTime = 0;
        }
        if (AudioManager.currentHuman) {
            AudioManager.currentHuman.pause();
            AudioManager.currentHuman.currentTime = 0;
        }

        // --- 1. Audio Ducking Down to 20% ---
        const hasTheme = AudioManager.currentTheme && !AudioManager.currentTheme.paused;
        const hasMain = AudioManager.mainTheme && !AudioManager.mainTheme.paused;

        if (hasTheme || hasMain) {
            // Cancel any ongoing fades to prevent fighting with ducking
            if (AudioManager.themeFadeInterval) clearInterval(AudioManager.themeFadeInterval);
            if (AudioManager.mainThemeFadeInterval) clearInterval(AudioManager.mainThemeFadeInterval);

            // Clear any existing duck/restore intervals
            if (AudioManager.duckInterval) clearInterval(AudioManager.duckInterval);
            if (AudioManager.restoreInterval) clearInterval(AudioManager.restoreInterval);

            // Fade down to 10% of the explicitly set base volume over 2 seconds
            const duckThemeVolume = AudioManager.baseThemeVolume * 0.1;
            const duckMainVolume = AudioManager.baseMainThemeVolume * 0.1;
            const duckDuration = 2000;
            const steps = 40; // 50ms intervals
            const stepTime = duckDuration / steps;

            let currentThemeVol = hasTheme ? AudioManager.currentTheme.volume : 0;
            let currentMainVol = hasMain ? AudioManager.mainTheme.volume : 0;
            let currentStep = 0;

            AudioManager.duckInterval = setInterval(() => {
                if (currentStep < steps) {
                    if (hasTheme && AudioManager.currentTheme) {
                        currentThemeVol -= (currentThemeVol - duckThemeVolume) / (steps - currentStep);
                        AudioManager.currentTheme.volume = Math.max(0, Math.min(1, currentThemeVol));
                    }
                    if (hasMain && AudioManager.mainTheme) {
                        currentMainVol -= (currentMainVol - duckMainVolume) / (steps - currentStep);
                        AudioManager.mainTheme.volume = Math.max(0, Math.min(1, currentMainVol));
                    }
                    currentStep++;
                } else {
                    clearInterval(AudioManager.duckInterval);
                    AudioManager.duckInterval = null;
                }
            }, stepTime);
        }

        if (window.setMinaSpeaking) window.setMinaSpeaking(true);

        // V31: Tchaikovsky Orchestral SFX Replaces TTS mapping
        // We bypass the language-specific TTS and directly play the newly generated 1.5s SFX mapping
        // Mapping: step 'language', 'auth', 'avatar', 'confirm', 'dashboard'

        // Disable signature sound as the new SFX is a full 1.5s orchestration that stands alone

        let sfxFilePath = `/assets/sounds/mina/mina-ko-${step}.mp3`;
        // Fallback for steps that might not have a generated SFX (though all 5 core UI steps do)
        const validSteps = ['language', 'auth', 'avatar', 'confirm', 'dashboard'];
        if (!validSteps.includes(step)) {
            sfxFilePath = `/assets/sounds/mina/mina-ko-language.mp3`; // default bright chime
        }

        const minaAudio = new Audio(sfxFilePath);
        minaAudio.crossOrigin = "anonymous";
        minaAudio.volume = volume;

        // V28: Web Audio API Removed since Orchestral SFX is pre-mastered loudly


        // --- 2. Restore Volume upon Complete ---
        // Since SFX is exactly 1.5s with a 1s natural fade-out tail, we can immediately restore volume
        minaAudio.onended = () => {
            if (window.setMinaSpeaking) window.setMinaSpeaking(false);
            const hasTheme = AudioManager.currentTheme && !AudioManager.currentTheme.paused;
            const hasMain = AudioManager.mainTheme && !AudioManager.mainTheme.paused;

            if (hasTheme || hasMain) {
                if (AudioManager.duckInterval) clearInterval(AudioManager.duckInterval);
                if (AudioManager.restoreInterval) clearInterval(AudioManager.restoreInterval);

                // Fade up to base volume over 3 seconds
                const restoreDuration = 3000;
                const steps = 60; // 50ms intervals
                const stepTime = restoreDuration / steps;

                let currentThemeVol = hasTheme ? AudioManager.currentTheme.volume : 0;
                let currentMainVol = hasMain ? AudioManager.mainTheme.volume : 0;
                let currentStep = 0;

                AudioManager.restoreInterval = setInterval(() => {
                    if (currentStep < steps) {
                        if (hasTheme && AudioManager.currentTheme) {
                            currentThemeVol += (AudioManager.baseThemeVolume - currentThemeVol) / (steps - currentStep);
                            AudioManager.currentTheme.volume = Math.max(0, Math.min(1, currentThemeVol));
                        }
                        if (hasMain && AudioManager.mainTheme) {
                            currentMainVol += (AudioManager.baseMainThemeVolume - currentMainVol) / (steps - currentStep);
                            AudioManager.mainTheme.volume = Math.max(0, Math.min(1, currentMainVol));
                        }
                        currentStep++;
                    } else {
                        if (hasTheme && AudioManager.currentTheme) {
                            AudioManager.currentTheme.volume = 1.0;
                        }
                        if (hasMain && AudioManager.mainTheme) {
                            AudioManager.mainTheme.volume = AudioManager.baseMainThemeVolume;
                        }
                        clearInterval(AudioManager.restoreInterval);
                        AudioManager.restoreInterval = null;
                    }
                }, stepTime);
            }
        };

        // Play the SFX directly without signature sound chaining
        minaAudio.play().catch(() => { if (window.setMinaSpeaking) window.setMinaSpeaking(false); });
        AudioManager.currentMina = minaAudio;
    },

    preloadTTS: () => {
        const langs = ['en', 'ko', 'es', 'hi', 'de', 'ja', 'ar', 'pl'];
        langs.forEach(langId => {
            const audio = new Audio(`/assets/sounds/mina/mina-${langId}-comingsoon.mp3`);
            audio.preload = 'auto'; // Fetch in the background automatically
        });
    }
};

// [V10 UPDATE: Cinematic Editorial - Muted Tones & Diffused Glow]
const THEME_CONFIG = {
    ko: { bg: 'bg-[#121114]', text: 'text-[#EFEFF0]', accent: 'text-[#9A8C9E]', border: 'border-[#9A8C9E]/40', shadow: 'shadow-[#9A8C9E]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Lavender
    en: { bg: 'bg-[#0F1115]', text: 'text-[#F0F2F5]', accent: 'text-[#4A6478]', border: 'border-[#4A6478]/40', shadow: 'shadow-[#4A6478]/10', blur: 'backdrop-blur-sm', font: 'font-sans' }, // Muted Electric Blue
    es: { bg: 'bg-[#151211]', text: 'text-[#F5EBE8]', accent: 'text-[#A67B71]', border: 'border-[#A67B71]/40', shadow: 'shadow-[#A67B71]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Coral
    hi: { bg: 'bg-[#14120F]', text: 'text-[#F5F2EC]', accent: 'text-[#B08D5B]', border: 'border-[#B08D5B]/40', shadow: 'shadow-[#B08D5B]/10', blur: 'backdrop-blur-sm', font: 'font-sans' }, // Muted Amber
    de: { bg: 'bg-[#101211]', text: 'text-[#ECEFEF]', accent: 'text-[#7D9185]', border: 'border-[#7D9185]/40', shadow: 'shadow-[#7D9185]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Sage Green
    ja: { bg: 'bg-[#0E1112]', text: 'text-[#EBF1F2]', accent: 'text-[#6B8C96]', border: 'border-[#6B8C96]/40', shadow: 'shadow-[#6B8C96]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Cyan
    ar: { bg: 'bg-[#131013]', text: 'text-[#F4EEF4]', accent: 'text-[#966B84]', border: 'border-[#966B84]/40', shadow: 'shadow-[#966B84]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }, // Muted Magenta
    pl: { bg: 'bg-[#121212]', text: 'text-[#EEEEEE]', accent: 'text-[#8A8A8A]', border: 'border-[#8A8A8A]/40', shadow: 'shadow-[#8A8A8A]/10', blur: 'backdrop-blur-sm', font: 'font-serif' }  // Muted Ash
};

const LANGUAGES = [
    {
        id: 'ko', name: '한국어', flag: '🇰🇷',
        image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop', // Seoul neon night
        welcome: "로드 매너에 오신 것을 환영합니다. 운명의 톱니바퀴가 당신을 기다립니다.",
        loading: "크로노미터 컨설팅 중...",
        ui: {
            authTitle: "신원 인증", authBtn: "영혼의 자격 증명", authDone: "신원 기록 완료",
            galleryTitle: "매너 기록 보관소", gallerySub: "역사적 기록 1899",
            manorTitle: "기계동력 심장부", manorHeirlooms: "선조의 유물", manorEstate: "저택 부지",
            returnGallery: "보관소로 돌아가기", textOptionTitle: "당신의 이름을 기록하세요",
            textInputPlaceholder: "방문자 이름...", textSubmitBtn: "이름 남기기",
            uploadTitle: "에테르 포트레잇 스캔", generateBtn: "자아 연성", generating: "변환 중...",
            confirmTitle: "당신의 세계가 맞습니까?", confirmBtn: "확정합니다", confirmDone: "언어 동기화 완료",
            todoTitle: "선언문", todo1: "신원 확립", todo2: "심장 점검", todo3: "운명 봉인", todoDone: "운명이 발현되었습니다.",
            consulting: "알고리즘이 속삭입니다...", sealBtn: "이 운명을 봉인하기", fateSealed: "운명 확정",
            directiveLanguage: "▶️ 원하는 세계를 중앙으로\n[드래그] 하세요.",
            directiveConfirm: "📜 마지막 맹세입니다.\n낙인을 [클릭] 하세요.",
            directiveAuth: "👤 자아 증명 대기중...\n[이름] 입력 또는 [사진] 업로드",
            directiveAvatar: "✨ 그릇 완성!\n하단 버튼 [클릭]",
            directiveDashboard: "🎭 막이 올랐습니다!\n기록의 전당으로 입장하세요.",
            comingSoon: "곧 돌아옵니다",
            archetypeBadge: "관측된 영혼의 형태",
            comingSoonDesc1: "일단은 여기 까지입니다! Coming soon! 추후 업데이트 됩니다. 하지만 여기서 각 세계관의 음악은 계속 들을 수 있죠.",
            comingSoonDesc2: "각 언어별로 총 2곡이 준비되어 있으니깐, 끝까지 감상해보세요!",
            titleEarned: "새로운 칭호 획득",
            minaSystem: "🎻 수석 지휘자", minaAction: ">> 🎼 첫 막: 언어를 선택하세요 <<",
            inviting: "멀티버스로 진입 중...", awaiting: "저택이 당신의 영혼을 기다립니다.",
            tap: "탭하여 선택", sync: "동기화 중", drag: "가운데로 드래그", fateSealed: "운명 확정"
        }
    },
    {
        id: 'en', name: 'English', flag: '🇬🇧',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', // London fog/bridge
        welcome: "Welcome to the Lord Manor, guest. The gears of destiny await your touch.",
        loading: "Consulting the Chronometer...",
        ui: {
            authTitle: "Aether Identity", authBtn: "Verify Soul Imprint", authDone: "Identity Sealed",
            galleryTitle: "MANOR ARCHIVE", gallerySub: "Historical Record 1899",
            manorTitle: "The Clockwork Heart", manorHeirlooms: "Ancestral Gears", manorEstate: "Manor Grounds",
            returnGallery: "Return to Archive", textOptionTitle: "Inscribe Your Name",
            textInputPlaceholder: "Guest Name...", textSubmitBtn: "Summon Identity",
            uploadTitle: "Scan Aether Portrait", generateBtn: "Forge Soul", generating: "Transmuting...",
            confirmTitle: "Is this your native tongue?", confirmBtn: "I Agree", confirmDone: "Language Bound",
            todoTitle: "Manifest", todo1: "Forge Identity", todo2: "Inspect Heart", todo3: "Seal Fate", todoDone: "Destiny manifested.",
            consulting: "The Algorithm whispers...", sealBtn: "Seal this fate", fateSealed: "Fate Locked",
            directiveLanguage: "Drag your chosen\nmultiverse.",
            directiveConfirm: "Imprint to\nseal fate.",
            directiveAuth: "Verify identity\nnow.",
            directiveAvatar: "Your persona\nis forged.",
            directiveDashboard: "Investigate the\nManor archives.",
            comingSoon: "Coming Soon",
            archetypeBadge: "OBSERVED SOUL ARCHETYPE",
            comingSoonDesc1: "This is the current end of the line! Updates coming soon. However, you can continue listening to the music of each multiverse here.",
            comingSoonDesc2: "There are a total of 2 tracks prepared for each language, so please enjoy them to the end!",
            titleEarned: "NEW TITLE ACQUIRED",
            minaSystem: "🎻 PRINCIPAL CONDUCTOR", minaAction: ">> 🎼 ACTION REQUIRED: SELECT A MULTIVERSE <<",
            inviting: "INVITING THE MULTIVERSE...", awaiting: "THE MANOR AWAITS YOUR SOUL'S VOYAGE.",
            tap: "TAP TO SELECT", sync: "SYNCHRONIZING", drag: "DRAG TO CENTER", fateSealed: "FATE SEALED"
        }
    },
    {
        id: 'es', name: 'Español', flag: '🇪🇸',
        image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop', // Madrid architecture
        welcome: "Bienvenido a Lord Manor. Los engranajes del destino esperan tu toque.",
        loading: "Consultando el Cronómetro...",
        ui: {
            authTitle: "Identidad Étérea", authBtn: "Verificar Huella del Alma", authDone: "Identidad Sellada",
            galleryTitle: "ARCHIVO DE LA MANSIÓN", gallerySub: "Registro Histórico 1899",
            manorTitle: "El Corazón de Relojería", manorHeirlooms: "Engranajes Ancestrales", manorEstate: "Terrenos de la Mansión",
            returnGallery: "Volver al Archivo", textOptionTitle: "Inscribe Tu Nombre",
            textInputPlaceholder: "Nombre del Huésped...", textSubmitBtn: "Invocar Identidad",
            uploadTitle: "Escanear Retrato de Éter", generateBtn: "Forjar Alma", generating: "Transmutando...",
            confirmTitle: "¿Es esta tu lengua materna?", confirmBtn: "Estoy de acuerdo", confirmDone: "Idioma Vinculado",
            todoTitle: "Manifiesto", todo1: "Forjar Identidad", todo2: "Inspeccionar Corazón", todo3: "Sellar Destino", todoDone: "Destino manifestado.",
            consulting: "El algoritmo susurra...", sealBtn: "Sellar este destino", fateSealed: "Destino bloqueado",
            directiveLanguage: "Arrastra el multiverso\nelegido.",
            directiveConfirm: "Imprime para\nsellar el destino.",
            directiveAuth: "Verifica\ntu identidad.",
            directiveAvatar: "Tu persona\nestá forjada.",
            directiveDashboard: "Investiga los\narchivos de la Mansión.",
            comingSoon: "Próximamente",
            archetypeBadge: "ARQUETIPO DE ALMA OBSERVADA",
            comingSoonDesc1: "¡Este es el final de la línea por ahora! Próximamente habrá actualizaciones. Sin embargo, puedes seguir escuchando la música de cada multiverso aquí.",
            comingSoonDesc2: "Hay un total de 2 pistas preparadas para cada idioma, ¡así que disfrútalas hasta el final!",
            titleEarned: "NUEVO TÍTULO ADQUIRIDO",
            minaSystem: "🎻 DIRECTOR PRINCIPAL", minaAction: ">> 🎼 ACCIÓN REQUERIDA: SELECCIONA UN MULTIVERSO <<",
            inviting: "INVITANDO AL MULTIVERSO...", awaiting: "LA MANSIÓN ESPERA EL VIAJE DE TU ALMA.",
            tap: "TOCA PARA SELECCIONAR", sync: "SINCRONIZANDO", drag: "ARRASTRA AL CENTRO", fateSealed: "DESTINO SELLADO"
        }
    },
    {
        id: 'hi', name: 'हिन्दी', flag: '🇮🇳',
        image: '/assets/images/countries/india_festival.png', // Indian Holi and Diwali festival fusion
        welcome: "लॉर्ड मैनर में आपका स्वागत है। भाग्य के पहिये आपकी प्रतीक्षा कर रहे हैं।",
        loading: "क्रोनोमीटर से परामर्श किया जा रहा है...",
        ui: {
            authTitle: "ईथर पहचान", authBtn: "आत्मा की छाप सत्यापित करें", authDone: "पहचान सील",
            galleryTitle: "मैनर पुरालेख", gallerySub: "ऐतिहासिक रिकॉर्ड 1899",
            manorTitle: "लॉर्ड मैनर", manorHeirlooms: "पैतृक गियर्स", manorEstate: "मैनर मैदान",
            returnGallery: "पुरालेख पर वापस", textOptionTitle: "अपना नाम दर्ज करें",
            textInputPlaceholder: "अतिथि का नाम...", textSubmitBtn: "पहचान बुलाएं",
            uploadTitle: "ईथर पोर्ट्रेट स्कैन करें", generateBtn: "आत्मा बनाएं", generating: "रूपांतरण...",
            confirmTitle: "क्या यह आपकी मातृभाषा है?", confirmBtn: "मैं सहमत हूँ", confirmDone: "भाषा बाध्य",
            todoTitle: "घोषणापत्र", todo1: "पहचान बनाएं", todo2: "हृदय का निरीक्षण करें", todo3: "भाग्य को सील करें", todoDone: "भाग्य प्रकट हुआ।",
            consulting: "एल्गोरिथम फुसफुसाता है...", sealBtn: "इस भाग्य को सील करें", fateSealed: "भाग्य लॉक हो गया",
            directiveLanguage: "अपना चुना हुआ\nमल्टीवर्स खींचें।",
            directiveConfirm: "भाग्य पर\nमुहर लगाएँ।",
            directiveAuth: "अभी पहचान\nसत्यापित करें।",
            directiveAvatar: "खिलाड़ी\nतैयार है।",
            directiveDashboard: "जागीर अभिलेखागार\nकी जांच करें।",
            comingSoon: "जल्द आ रहा है",
            archetypeBadge: "देखा गया आत्मा का मूलरूप",
            comingSoonDesc1: "अभी के लिए बस इतना ही! जल्द ही अपडेट आ रहे हैं। हालाँकि, आप यहाँ प्रत्येक मल्टीवर्स का संगीत सुनना जारी रख सकते हैं।",
            comingSoonDesc2: "प्रत्येक भाषा के लिए कुल 2 ट्रैक तैयार किए गए हैं, इसलिए कृपया अंत तक उनका आनंद लें!",
            titleEarned: "नई उपाधि प्राप्त की",
            minaSystem: "🎻 प्रधान संवाहक", minaAction: ">> 🎼 कार्रवाई आवश्यक: एक मल्टीवर्स चुनें <<",
            inviting: "मल्टीवर्स को आमंत्रित किया जा रहा है...", awaiting: "मैनर आपकी आत्मा की यात्रा की प्रतीक्षा कर रहा है。",
            tap: "चुनने के लिए टैप करें", sync: "सिंक्रनाइज़ कर रहा है", drag: "केंद्र में खींचें", fateSealed: "भाग्य सील"
        }
    },
    {
        id: 'de', name: 'Deutsch', flag: '🇩🇪',
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop', // German Black Forest / Castle
        welcome: "Willkommen im Lord Manor. Die Zahnräder des Schicksals erwarten Sie.",
        loading: "Konsultiere das Chronometer...",
        ui: {
            authTitle: "Ätherische Identität", authBtn: "Seelenabdruck verifizieren", authDone: "Identität besiegelt",
            galleryTitle: "MANOR ARCHIV", gallerySub: "Historische Aufzeichnung 1899",
            manorTitle: "Das mechanische Herz", manorHeirlooms: "Ahnen-Zahnräder", manorEstate: "Anwesen",
            returnGallery: "Zurück zum Archiv", textOptionTitle: "Namen eintragen",
            textInputPlaceholder: "Gastname...", textSubmitBtn: "Identität beschwören",
            uploadTitle: "Äther-Porträt scannen", generateBtn: "Seele schmieden", generating: "Transmutiere...",
            confirmTitle: "Ist dies Ihre Muttersprache?", confirmBtn: "Ich stimme zu", confirmDone: "Sprache gebunden",
            todoTitle: "Manifest", todo1: "Identität schmieden", todo2: "Herz inspizieren", todo3: "Schicksal besiegeln", todoDone: "Schicksal manifestiert.",
            consulting: "Der Algorithmus flüstert...", sealBtn: "Schicksal besiegeln", fateSealed: "Schicksal gesperrt",
            directiveLanguage: "Ziehen Sie das\ngewählte Multiversum.",
            directiveConfirm: "Aufdrucken, um das\nSchicksal zu besiegeln.",
            directiveAuth: "Identität\njetzt verfizieren.",
            directiveAvatar: "Ihre Persona\nist geschmiedet.",
            directiveDashboard: "Untersuchen Sie die\nArchive des Herrenhauses.",
            comingSoon: "Demnächst",
            archetypeBadge: "BEOBACHTETER SEELEN-ARCHETYP",
            comingSoonDesc1: "Das ist vorerst das Ende der Reise! Updates folgen in Kürze. Sie können jedoch weiterhin die Musik jedes Multiversums hier anhören.",
            comingSoonDesc2: "Es gibt insgesamt 2 Tracks für jede Sprache, also genießen Sie sie bis zum Ende!",
            titleEarned: "NEUER TITEL ERWORBEN",
            minaSystem: "🎻 CHEFDIRIGENT", minaAction: ">> 🎼 AKTION ERFORDERLICH: WÄHLEN SIE EIN MULTIVERSUM <<",
            inviting: "LADE DAS MULTIVERSUM EIN...", awaiting: "DAS ANWESEN ERWARTET DIE REISE IHRER SEELE.",
            tap: "ZUM AUSWÄHLEN TIPPEN", sync: "SYNCHRONISIERE", drag: "ZUR MITTE ZIEHEN", fateSealed: "SCHICKSAL BESIEGELT"
        }
    },
    {
        id: 'ja', name: '日本語', flag: '🇯🇵',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', // Kyoto temples / Japan
        welcome: "ロード・マナーへようこそ。運命の歯車があなたを待っています。",
        loading: "クロノメーターを照合中...",
        ui: {
            authTitle: "エーテル身元確認", authBtn: "魂の刻印を確認", authDone: "身元封印完了",
            galleryTitle: "マナー・アーカイブ", gallerySub: "歴史的記録 1899",
            manorTitle: "時計仕掛けの心臓", manorHeirlooms: "祖先の歯車", manorEstate: "邸宅の敷地",
            returnGallery: "アーカイブへ戻る", textOptionTitle: "名を記す",
            textInputPlaceholder: "来客名...", textSubmitBtn: "身元を召喚",
            uploadTitle: "エーテル肖像をスキャン", generateBtn: "魂を錬成", generating: "錬成中...",
            confirmTitle: "この言語があなたの母国語ですか？", confirmBtn: "同意する", confirmDone: "言語バインド完了",
            todoTitle: "マニフェスト", todo1: "身元を錬成", todo2: "心臓を点検", todo3: "運命を封印", todoDone: "運命が具現化されました。",
            consulting: "アルゴリズムの囁き...", sealBtn: "運命を封印する", fateSealed: "運命確定",
            directiveLanguage: "世界観を中央へ\nドラッグしてください。",
            directiveConfirm: "指紋で運命を\n確定します。",
            directiveAuth: "身元を\n証明してください。",
            directiveAvatar: "ペルソナが\n完成しました。",
            directiveDashboard: "保管所を\n探索してください。",
            comingSoon: "近日公開",
            archetypeBadge: "観測された魂の形態",
            comingSoonDesc1: "今回はここまでです！アップデートは近日公開予定です。ただし、ここでは各世界観の音楽を引き続き楽しむことができます。",
            comingSoonDesc2: "各言語に合計2曲用意されていますので、最後までお楽しみください！",
            titleEarned: "新しい称号を獲得",
            minaSystem: "🎻 首席指揮者", minaAction: ">> 🎼 アクション要求：マルチバースを選択してください <<",
            inviting: "マルチバースを招待中...", awaiting: "館があなたの魂の旅立ちを待っています。",
            tap: "タップして選択", sync: "同期中", drag: "中央へドラッグ", fateSealed: "運命確定"
        }
    },
    {
        id: 'ar', name: 'العربية', flag: '🇸🇦',
        image: '/assets/images/countries/arab_festival.png', // Vibrant Arab street market lantern festival
        welcome: "مرحبًا بكم في لورد مانور. تروس القدر في انتظار لمستك.",
        loading: "استشارة الكرونومتر...",
        ui: {
            authTitle: "هوية الأثير", authBtn: "التحقق من بصمة الروح", authDone: "تم ختم الهوية",
            galleryTitle: "أرشيف القصر", gallerySub: "سجل تاريخي 1899",
            manorTitle: "قلب الساعة", manorHeirlooms: "تروس الأجداد", manorEstate: "أراضي القصر",
            returnGallery: "العودة للأرشيف", textOptionTitle: "أدخل اسمك",
            textInputPlaceholder: "اسم الضيف...", textSubmitBtn: "استدعاء الهوية",
            uploadTitle: "مسح صورة الأثير", generateBtn: "صياغة الروح", generating: "تحويل...",
            confirmTitle: "هل هذه لغتك الأم؟", confirmBtn: "أوافق", confirmDone: "تم ربط اللغة",
            todoTitle: "البيان", todo1: "صياغة الهوية", todo2: "فحص القلب", todo3: "ختم القدر", todoDone: "القدر يتجلى.",
            consulting: "الخوارزمية تهمس...", sealBtn: "ختم هذا القدر", fateSealed: "القدر مغلق",
            directiveLanguage: "اسحب الكون\nالمتعدد الخاص بك.",
            directiveConfirm: "ابصم\nلختم المصير.",
            directiveAuth: "تحقق من\nهويتك الآن.",
            directiveAvatar: "تم تشكيل\nشخصيتك.",
            directiveDashboard: "اكتشف\nأرشيف القصر.",
            comingSoon: "قريباً",
            archetypeBadge: "نموذج الروح الملحوظ",
            comingSoonDesc1: "هذه هي نهاية الرحلة في الوقت الحالي! التحديثات قادمة قريباً. ومع ذلك، يمكنك الاستمرار في الاستماع إلى موسيقى كل كون متعدد هنا.",
            comingSoonDesc2: "هناك ما مجموعه مساران جاهزان لكل لغة، لذا يرجى الاستمتاع بهما حتى النهاية!",
            titleEarned: "تم اكتساب لقب جديد",
            minaSystem: "🎻 المايسترو الرئيسي", minaAction: ">> 🎼 الإجراء المطلوب: حدد كونًا متعددًا <<",
            inviting: "دعوة الأكوان المتعددة...", awaiting: "القصر ينتظر رحلة روحك.",
            tap: "اضغط للاختيار", sync: "مزامنة", drag: "اسحب للمركز", fateSealed: "تم ختم القدر"
        }
    },
    {
        id: 'pl', name: 'Polski', flag: '🇵🇱',
        image: '/assets/images/countries/poland_festival.png', // Polish traditional festival in Kraków market square
        welcome: "Witamy w Lord Manor. Tryby przeznaczenia czekają na twój dotyk.",
        loading: "Konsultacja z Chronometrem...",
        ui: {
            authTitle: "Eteryczna Tożsamość", authBtn: "Weryfikuj Duszę", authDone: "Tożsamość Zapieczętowana",
            galleryTitle: "ARCHIWUM DWORU", gallerySub: "Zapis Historyczny 1899",
            manorTitle: "Mechaniczne Serce", manorHeirlooms: "Zębatki Przodków", manorEstate: "Tereny Dworu",
            returnGallery: "Powrót do Archiwum", textOptionTitle: "Wpisz Swoje Imię",
            textInputPlaceholder: "Imię Gościa...", textSubmitBtn: "Przyzwij Tożsamość",
            uploadTitle: "Skanuj Eteryczny Portret", generateBtn: "Wykuj Duszę", generating: "Transmutacja...",
            confirmTitle: "Czy to twój język ojczysty?", confirmBtn: "Wyrażam zgodę", confirmDone: "Język Związany",
            todoTitle: "Manifest", todo1: "Wykuj Tożsamość", todo2: "Zbadaj Serce", todo3: "Zapieczętuj Los", todoDone: "Przeznaczenie zrealizowane.",
            consulting: "Algorytm Szepcze...", sealBtn: "Zapieczętuj ten los", fateSealed: "Los Zablokowany",
            directiveLanguage: "Przeciągnij wybrane\nmultiwersum.",
            directiveConfirm: "Odciśnij, by\nzapieczętować los.",
            directiveAuth: "Zweryfikuj\ntożsamość teraz.",
            directiveAvatar: "Twoja persona\njest gotowa.",
            directiveDashboard: "Zbadaj \narchiwa Dworu.",
            comingSoon: "Wkrótce",
            archetypeBadge: "ZAABSERWOWANY ARCHETYP DUSZY",
            comingSoonDesc1: "Na razie to koniec podróży! Aktualizacje wkrótce. Możesz jednak nadal słuchać muzyki z każdego multiwersum tutaj.",
            comingSoonDesc2: "Dla każdego języka przygotowano łącznie 2 utwory, więc ciesz się nimi do końca!",
            titleEarned: "ZDOBYTO NOWY TYTUŁ",
            minaSystem: "🎻 GŁÓWNY DYRYGENT", minaAction: ">> 🎼 WYMAGANE DZIAŁANIE: WYBIERZ MULTIWERSUM <<",
            inviting: "ZAPRASZANIE MULTIWERSUM...", awaiting: "DWÓR CZEKA NA PODRÓŻ TWOJEJ DUSZY.",
            tap: "DOTKNIJ ABY WYBRAĆ", sync: "SYNCHRONIZACJA", drag: "PRZECIĄGNIJ DO ŚRODKA", fateSealed: "LOS ZAPIECZĘTOWANY"
        }
    }
];

// [V7 UPDATE: Restored full 8 project cases from user source]
const PROJECTS = [
    { id: 1, title: "The Automaton Survival", desc: "Surviving 24h guided only by the Machine Spirit." },
    { id: 2, title: "The Silent Builder", desc: "Constructing 3 inventions without uttering a single code." },
    { id: 3, title: "The Clockwork Servant", desc: "Forging a mechanical golem to labor in my stead." },
    { id: 4, title: "Séance with History", desc: "Interviewing great figures of the past via the Aether." },
    { id: 5, title: "The Alchemist's Coin", desc: "Surviving a week trading only in cryptographic tokens." },
    { id: 6, title: "The Virtual Voyage", desc: "Living 48 hours within the simulacrum visor." },
    { id: 7, title: "The Haunted Manor", desc: "Automating the estate to startle uninvited guests." },
    { id: 8, title: "The Calculated Feast", desc: "Dining only on what the Algorithm prescribes." },
];

// --- Sub-components ---

// [V8 UPDATE: Aether Whispers - subtle AI background text]
const AetherWhispers = ({ text }) => (
    <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <AnimatePresence mode="wait">
            {text && (
                <motion.div
                    key={text}
                    initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ opacity: 0.1, scale: 1, filter: 'blur(2px)' }}
                    exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="text-[12vw] font-black uppercase tracking-[1em] text-[#C5A059] text-center leading-none opacity-10 break-all select-none"
                >
                    {text}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// [V8 UPDATE: Clockwork Shutter Transition Component]
const ShutterTransition = ({ isActive, children }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
            {!isActive && (
                <motion.div
                    key="shutter-top"
                    initial={{ y: "-100%" }}
                    animate={{ y: "-101%" }}
                    exit={{ y: "0%" }}
                    transition={{ duration: 0.4, ease: "circIn" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-[#1A1612] border-b-2 border-[#C5A059] z-[100] shadow-2xl"
                />
            )}
            {!isActive && (
                <motion.div
                    key="shutter-bottom"
                    initial={{ y: "100%" }}
                    animate={{ y: "101%" }}
                    exit={{ y: "0%" }}
                    transition={{ duration: 0.4, ease: "circIn" }}
                    className="absolute bottom-0 left-0 w-full h-1/2 bg-[#1A1612] border-t-2 border-[#C5A059] z-[100] shadow-2xl"
                />
            )}
        </AnimatePresence>
        <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
            {children}
        </div>
    </div>
);

// --- UI Primitives ---

const Background = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
        {/* Subtle cinematic gradient and noise */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0B] via-[#050505] to-black" />
        <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/assets/steampunk_paper_texture.png')]" />

        {/* Deep radial glow for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)]" />
    </div>
);

const GlassCard = ({ children, className = "", onClick, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
        onClick={onClick}
        className={`bg-[#050505]/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group ${className}`}
    >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10">{children}</div>
    </motion.div>
);

// --- View Components (Extracted to fix focus issues) ---

const IntroView = ({ selectedLang, userName, setUserName, generateTextCharacter, isAvatarGenerating, handleImageUpload, uploadedImage, generateCharacter, playSfx }) => (
    <div className="space-y-4 max-w-md mx-auto overflow-y-auto no-scrollbar max-h-[85vh] px-4 py-4">
        <GlassCard className="text-center italic text-sm border-l-4 border-l-white/50 py-4 mb-6">
            <span className="opacity-80">"{selectedLang.welcome}"</span>
        </GlassCard>

        <GlassCard className="py-6 px-4 flex flex-col items-center">
            <div className="absolute top-0 right-0 w-8 h-8 opacity-20"><LucideZap size={32} className="text-white" /></div>
            <h3 className="text-xs font-black uppercase mb-4 tracking-[0.2em] flex items-center gap-2 text-white/50">
                <LucideFeather size={16} /> {selectedLang.ui.textOptionTitle}
            </h3>
            <input
                type="text"
                value={userName}
                onChange={e => { setUserName(e.target.value); }}
                onFocus={() => playSfx?.('click')}
                placeholder={selectedLang.ui.textInputPlaceholder}
                className="w-full bg-transparent border-b border-white/20 p-3 mb-6 focus:outline-none font-sans text-lg transition-all focus:border-white text-center text-white placeholder-white/20"
            />
            <button
                onClick={generateTextCharacter}
                disabled={isAvatarGenerating || !userName.trim()}
                onMouseEnter={() => playSfx?.('hover')}
                className="w-full py-4 bg-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/20 disabled:opacity-30 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 backdrop-blur-md"
            >
                {isAvatarGenerating ? <LucideLoader2 className="animate-spin" size={16} /> : null}
                {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.textSubmitBtn}
            </button>
        </GlassCard>

        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em] bg-transparent">
                <span className="px-4 text-white/40 bg-[#0A0A0B]">OR</span>
            </div>
        </div>

        <label className="block w-full cursor-pointer group">
            <div className="p-6 border border-dashed border-white/20 bg-white/5 hover:bg-white/10 rounded-sm flex flex-col items-center transition-all shadow-inner backdrop-blur-sm">
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                <LucideUpload className="text-white/50 mb-3 group-hover:text-white transition-colors" size={24} />
                <p className="font-black uppercase tracking-widest text-[10px] text-white/50 group-hover:text-white transition-colors">{selectedLang.ui.uploadTitle}</p>
            </div>
        </label>

        {uploadedImage && !isAvatarGenerating && (
            <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={generateCharacter}
                onMouseEnter={() => playSfx?.('hover')}
                className={`w-full py-4 bg-black/40 border border-white/10 backdrop-blur-md ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95`}
            >
                <LucideCamera size={16} />
                {selectedLang.ui.generateBtn}
            </motion.button>
        )}

        {isAvatarGenerating && (
            <div className="text-center p-4">
                <LucideLoader2 className="animate-spin mx-auto text-[#5C1A1A] mb-2" size={32} />
                <p className="text-[10px] italic text-[#8B7355] animate-pulse">{selectedLang.loading}</p>
            </div>
        )}
    </div>
);

const GalleryView = ({ selectedLang, userAvatar, setViewMode, setTodos, playSfx, todos }) => {
    // [V10 UPDATE: Cinematic Editorial 3x3 Grid]
    const gridItems = [
        { id: 1, type: 'text', title: selectedLang.ui.manorTitle || 'MULTIVERSE CORE', subtitle: selectedLang.name },
        { id: 2, type: 'image', title: 'MEMORY', image: selectedLang.image },
        { id: 3, type: 'text', title: 'AETHER RECORD', subtitle: 'Sync 88' },
        { id: 4, type: 'image', title: 'ARCHIVE', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=300' },
        { id: 5, type: 'current', title: selectedLang.ui.comingSoon || 'COMING SOON', isCenter: true },
        { id: 6, type: 'manor', title: selectedLang.ui.manorTitle || 'THE MANOR' },
        { id: 7, type: 'text', title: 'DIGITAL SOUL', subtitle: 'Humanity in Code' },
        { id: 8, type: 'image', title: 'VISION', image: 'https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?auto=format&fit=crop&w=300&q=80' },
        { id: 9, type: 'rules', title: 'HOUSE RULES', subtitle: 'No Artificial Empathy' },
    ];

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-6 h-full py-4 overflow-hidden">
            <div className="text-center">
                <h1 className={`text-3xl md:text-4xl font-black ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} mb-1 uppercase tracking-widest leading-none filter drop-shadow-md`}>{selectedLang.ui.galleryTitle || "ARCHIVE"}</h1>
                <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white/50'}`}>{selectedLang.ui.gallerySub || "Historical Record"}</p>
            </div>

            <div className="w-full aspect-square grid grid-cols-3 grid-rows-3 gap-[2px] p-2 bg-[#0A0A0B]/80 backdrop-blur-md border border-white/10 shadow-2xl relative">
                {/* Vintage overlay artifact */}
                <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('/assets/steampunk_paper_texture.png')]" />

                {gridItems.map((slot, idx) => (
                    <motion.div
                        key={slot.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                        className="w-full h-full relative"
                    >
                        {slot.type === 'current' ? (
                            <button
                                onClick={() => { playSfx?.('click'); }}
                                onMouseEnter={() => playSfx?.('hover')}
                                className={`w-full h-full relative bg-[#0A0A0B] border border-white/20 overflow-hidden group active:scale-95 transition-transform hover:border-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] flex flex-col justify-center items-center`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                                <div className="absolute inset-0 flex items-center justify-center p-2 z-0">
                                    {userAvatar?.image ? (
                                        <img src={userAvatar.image} className="w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="avatar" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center">
                                            <div className={`w-12 h-12 rounded-full border-2 border-[${THEME_CONFIG[selectedLang.id]?.accent || '#C5A059'}] flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(197,160,89,0.3)]`}>
                                                <span className={`text-2xl font-black ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'}`}>{selectedLang.flag}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative z-20 text-center px-1">
                                    <p className={`text-[8px] font-serif italic mb-1 opacity-70 ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'}`}>{userAvatar?.textName || selectedLang.name}</p>
                                    <h4 className={`text-[10px] font-black uppercase tracking-widest leading-tight ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white'}`}>{slot.title}</h4>
                                </div>
                            </button>
                        ) : slot.type === 'manor' ? (
                            <button
                                onClick={() => {
                                    if (!todos?.home) AudioManager.playMina(selectedLang.id, 'dashboard');
                                    setViewMode('home_interior');
                                    setTodos(p => ({ ...p, home: true }));
                                    playSfx?.('click');
                                }}
                                onMouseEnter={() => playSfx?.('hover')}
                                className={`w-full h-full relative bg-[#121214] flex flex-col items-center justify-center hover:bg-white/5 transition-colors group active:scale-95 border border-transparent hover:border-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}]/50`}
                            >
                                <LucideLayout size={24} className={`mb-2 opacity-50 group-hover:opacity-100 transition-opacity ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white'}`} />
                                <span className="text-white/60 text-[8px] font-black uppercase tracking-widest text-center">{slot.title}</span>
                            </button>
                        ) : slot.type === 'image' ? (
                            <div className="w-full h-full relative overflow-hidden bg-black grayscale hover:grayscale-0 transition-all duration-1000 group">
                                <img src={slot.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-1000 group-hover:scale-110" alt="archive" />
                                <div className="absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 text-white/80 text-[7px] font-black uppercase tracking-widest backdrop-blur-sm">{slot.title}</div>
                            </div>
                        ) : slot.type === 'rules' ? (
                            <div className={`w-full h-full relative bg-[${THEME_CONFIG[selectedLang.id]?.accent || '#555'}]/10 flex flex-col items-center justify-center text-center p-2 border border-white/5 hover:bg-white/10 transition-colors`}>
                                <LucideInfo size={16} className={`mb-1 opacity-60 ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white'}`} />
                                <span className={`font-black text-[9px] uppercase leading-none mb-1 ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'}`}>{slot.title}</span>
                                <span className="text-[7px] font-serif italic text-white/50 leading-tight uppercase">{slot.subtitle}</span>
                            </div>
                        ) : (
                            <div className="w-full h-full relative bg-[#0D0D10] flex flex-col items-center justify-center p-2 text-center border border-white/5 hover:border-white/20 transition-colors">
                                <span className={`font-black text-[8px] uppercase leading-tight mb-1 ${THEME_CONFIG[selectedLang.id]?.text || 'text-white/80'}`}>{slot.title}</span>
                                <span className={`text-[6px] font-serif italic leading-none ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white/40'}`}>{slot.subtitle}</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 text-center px-8 border-t border-white/10 pt-4">
                "Digital Body. Analog Soul."
            </p>
        </div>
    );
};

const ManorView = ({ selectedLang, setViewMode, userAvatar, candleLit, setCandleLit, gearsSpinning, setGearsSpinning, loreText, playSfx }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-2 py-4">
        <button onClick={() => { setViewMode('gallery'); playSfx?.('click'); }} className="text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1">
            <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
        </button>

        <PaperCard className={`w-full flex-1 max-h-[75vh] p-0 border border-[${THEME_CONFIG[selectedLang.id]?.border || '#333'}] bg-transparent relative overflow-hidden shadow-2xl backdrop-blur-md`}>
            {/* Ambient Background with subtle noise/vignette */}
            <div
                className="absolute inset-0 bg-center bg-cover opacity-10 mix-blend-overlay"
                style={{ backgroundImage: "url('/assets/steampunk_manor_background.png')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />

            <div className="relative z-10 flex flex-col items-center p-6 h-full overflow-y-auto no-scrollbar">
                <div className="w-full flex justify-between mb-8 px-2">
                    <div className="cursor-pointer hover:scale-110 transition-transform flex items-center gap-2" onClick={() => setCandleLit(!candleLit)} onMouseEnter={() => playSfx?.('hover')}>
                        <LucideFlame size={20} className={candleLit ? `text-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]` : 'text-white/20'} />
                        <span className="text-[8px] uppercase tracking-widest text-white/30 font-black hidden sm:block">Aether Core</span>
                    </div>
                    <div className="cursor-pointer hover:rotate-90 transition-transform flex items-center gap-2" onClick={() => setGearsSpinning(!gearsSpinning)} onMouseEnter={() => playSfx?.('hover')}>
                        <span className="text-[8px] uppercase tracking-widest text-white/30 font-black hidden sm:block">Sync</span>
                        <motion.div animate={{ rotate: gearsSpinning ? 360 : 0 }} transition={{ duration: 4, repeat: gearsSpinning ? Infinity : 0, ease: "linear" }}>
                            <LucideOrbit size={20} className={`text-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}]`} />
                        </motion.div>
                    </div>
                </div>

                <div className={`relative w-28 h-28 mb-4 transition-all duration-700 ${candleLit ? '' : 'brightness-50'}`}>
                    <div className="absolute inset-0 border-4 border-[#C5A059] rounded-full shadow-[0_0_20px_rgba(197,160,89,0.3)]" />
                    <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-2 border-2 border-[#8B7355]/40 shadow-inner">
                        {userAvatar?.image ? (
                            <img src={userAvatar.image} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <span className="text-[#C5A059] font-black text-4xl text-center uppercase drop-shadow-md">{userAvatar?.textName?.charAt(0) || selectedLang?.name?.charAt(0) || "M"}</span>
                        )}
                    </div>
                </div>

                <h3 className={`text-xl font-serif font-black ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} mb-6 uppercase tracking-[0.3em] text-center leading-none`}>{selectedLang.ui.manorTitle}</h3>

                <div className={`w-full flex-1 bg-black/40 backdrop-blur-sm p-5 border-l border-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}]/30 rounded-r-lg font-mono text-[10px] ${THEME_CONFIG[selectedLang.id]?.text || 'text-white/80'} leading-relaxed relative overflow-y-auto no-scrollbar shadow-inner`}>
                    {loreText || selectedLang?.welcome || "Welcome to the Lord Manor."}<span className={`inline-block w-1.5 h-3 bg-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] ml-1 animate-ping`} />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-4 border-t border-white/10">
                    <motion.div whileHover={{ y: -2 }} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => playSfx?.('click')} onMouseEnter={() => playSfx?.('hover')}>
                        <LucideCompass size={18} className={`text-white/40 group-hover:text-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] transition-colors`} />
                        <span className={`text-[9px] font-black uppercase text-white/40 group-hover:text-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] tracking-widest`}>{selectedLang.ui.manorHeirlooms}</span>
                    </motion.div>
                    <div className="flex flex-col items-center gap-2 opacity-20 pointer-events-none">
                        <LucideMapPin size={18} className="text-white" />
                        <span className="text-[9px] font-black uppercase text-white tracking-widest">{selectedLang.ui.manorEstate}</span>
                    </div>
                </div>
            </div>
        </PaperCard>
    </motion.div>
);

// [V9 UPDATE: MissionView Redesign with IT-tech effects]
const MissionView = ({ selectedLang, setViewMode, PROJECTS, previewId, handlePreviewVote, isAuthenticated, setIsAuthenticated, oracleMessage, setStep, setTodos, playSfx }) => (
    <div className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-4 py-4 overflow-hidden px-4 scanline">
        <button
            onClick={() => { setViewMode('gallery'); playSfx?.('click'); }}
            className="text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1 transition-all hover:translate-x-1"
        >
            <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
        </button>

        <div className="w-full flex-1 flex flex-col overflow-hidden">
            <PaperCard className="py-4 px-6 border-[#C5A059] shadow-lg mb-4 shrink-0 bg-paper aether-glow">
                <h3 className="text-[10px] font-black text-[#5C1A1A] uppercase tracking-[0.2em] flex items-center gap-1 border-b border-black/5 pb-2">
                    <LucideInfo size={14} /> {selectedLang.ui.authTitle}
                </h3>
                {!isAuthenticated ? (
                    <button onClick={() => { setIsAuthenticated(true); playSfx?.('forge'); }} className="w-full mt-2 py-3 bg-[#1A1612] text-[#C5A059] text-[10px] font-black uppercase border border-[#C5A059]/40 hover:bg-[#5C1A1A] hover:text-white transition-all shadow-md active:scale-95">
                        {selectedLang.ui.authBtn}
                    </button>
                ) : (
                    <div className="flex items-center justify-center gap-2 text-[#556B2F] font-black bg-[#556B2F]/10 p-2 mt-2 border border-[#556B2F]/30 uppercase text-[10px]">
                        <LucideCheckCircle size={16} /> {selectedLang.ui.authDone}
                    </div>
                )}
            </PaperCard>

            <div className="flex-1 w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-start gap-4 pb-4 px-2">
                {PROJECTS.map((proj) => {
                    const isSelected = previewId === proj.id;
                    const isInactive = previewId && !isSelected;
                    return (
                        <div key={proj.id} className={`min-w-[280px] h-full snap-center transition-all duration-500 ${isInactive ? 'opacity-20 grayscale scale-90 blur-[1px]' : 'scale-100'}`}>
                            <PaperCard
                                onClick={() => { if (!isInactive && isAuthenticated) { handlePreviewVote(proj.id); playSfx?.('click'); } }}
                                className={`h-full cursor-pointer transition-all duration-700 overflow-hidden border-2 p-0 shadow-2xl flex flex-col relative ${isSelected ? 'border-[#C5A059] bg-[#2C241B]/20 aether-glow' : 'border-[#2C241B] hover:border-[#8B7355] bg-black/5'}`}
                            >
                                {isSelected && <div className="absolute inset-0 bg-[#C5A059]/5 animate-pulse pointer-events-none" />}
                                <div className="p-6 flex flex-col flex-1 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[10px] font-mono uppercase px-2 py-1 border transition-colors ${isSelected ? 'border-[#5C1A1A] text-[#5C1A1A] bg-[#5C1A1A]/10' : 'border-[#8B7355] text-[#8B7355]'}`}>Case #0{proj.id}</span>
                                        {isSelected && <LucideSparkles className="text-[#C5A059] animate-spin-slow" size={18} />}
                                    </div>
                                    <h4 className={`text-xl font-serif font-black uppercase tracking-wider mb-4 leading-tight transition-colors ${isSelected ? 'text-[#C5A059]' : 'text-[#8B7355]'}`}>{proj.title}</h4>
                                    <p className="text-[#8B7355] text-[11px] font-medium leading-relaxed italic opacity-80 mb-6 flex-1">
                                        {proj.desc}
                                    </p>

                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mt-auto">
                                                <div className="bg-[#1A1612] p-6 border-l-4 border-[#C5A059] mb-4 shadow-inner relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-[#C5A059]/30 animate-scan-line" />
                                                    <div className="absolute top-1 right-1"><LucideFeather size={14} className="text-[#5C1A1A] opacity-30" /></div>
                                                    <p className="text-[#f4e4bc] text-[11px] leading-relaxed text-center font-serif italic">"{oracleMessage || selectedLang.ui.consulting}"</p>
                                                </div>
                                                <button
                                                    onClick={() => { playSfx?.('shutter'); setStep('trailer'); setTodos(p => ({ ...p, voted: true })); }}
                                                    className="w-full py-4 bg-[#5C1A1A] text-white font-black uppercase text-xs tracking-[0.2em] border-b-4 border-black active:scale-95 transition-transform shadow-2xl hover:bg-[#7D2626]"
                                                >
                                                    {selectedLang.ui.sealBtn}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {!isSelected && isAuthenticated && (
                                        <div className="mt-auto pt-4 border-t border-[#8B7355]/10 text-[9px] font-black uppercase text-[#8B7355] text-center tracking-widest animate-pulse">Tap to examine destiny</div>
                                    )}
                                </div>
                            </PaperCard>
                        </div>
                    );
                })}
            </div>
            <div className="text-center py-2"><span className="text-[8px] font-black uppercase text-[#8B7355] tracking-widest opacity-60 flex items-center gap-2">
                <LucideArrowLeft size={10} className="animate-bounce-x" /> Swipe Aether Cases <LucideArrowRight size={10} className="animate-bounce-x" />
            </span></div>
        </div>
    </div>
);

const ComingSoonView = ({ selectedLang, currentTheme, setViewMode, setStep, metrics, onEarnBadge, earnedBadges }) => {
    const primaryArchetype = earnedBadges.length > 0 ? earnedBadges[0] : null;

    // Calculate Archetype Title on Load
    useEffect(() => {
        if (!metrics) return;
        const enhancedMetrics = {
            ...metrics,
            sessionTimeSeconds: metrics.timeSpentMs / 1000,
            selectedLangId: selectedLang?.id
        };
        const calculated = calculateArchetype(enhancedMetrics);
        // Only trigger if we found something new to avoid infinite loops, simplistic deduplication by ID
        if (calculated && calculated.length > 0) {
            onEarnBadge(calculated);
        }
    }, [metrics, selectedLang, onEarnBadge]);

    return (
        <motion.div
            key="coming-soon-wrapper"
            initial={{ opacity: 1, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[99999] bg-gradient-to-t from-black via-black/80 to-transparent w-full h-full flex flex-col items-center justify-center p-6 md:p-8 text-center overflow-auto pointer-events-auto"
            style={{ minHeight: '100vh', width: '100vw' }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key="mina-announcement"
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -10, x: "-50%" }}
                    transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.3 }}
                    className="w-[95%] max-w-[500px] absolute top-6 md:top-8 left-1/2 flex flex-col items-center z-[5000]"
                >
                    {/* Inventory / Title Unlocked Announcement using MinaDirective */}
                    <div className="w-full flex justify-center opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                        <MinaDirective
                            isVisible={true}
                            activeStep="coming_soon"
                            text={primaryArchetype ? `${selectedLang?.ui?.titleEarned || "NEW TITLE ACQUIRED"}: [ ${selectedLang?.id === 'ko' ? primaryArchetype.title : (primaryArchetype.sub || primaryArchetype.title)} ]` : "Analyzing..."}
                            position="relative"
                            interactionMode="passive"
                            badges={earnedBadges}
                            sysName={selectedLang?.ui?.minaSystem || "SEAN'S COMMENT"}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="mb-12 mt-40 md:mt-48 relative flex justify-center items-end h-24 gap-1.5 opacity-60 flex-shrink-0">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ height: ["20%", "100%", "20%"] }}
                        transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "easeInOut", delay: Math.random() * 0.5 }}
                        className="w-1.5 rounded-t-sm border border-black/20"
                        style={{ backgroundColor: '#C5A059' }}
                    />
                ))}
            </div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 flex-shrink-0 px-4 w-full break-words ${currentTheme?.text || 'text-white'}`}
                style={{ textShadow: "0 0 20px rgba(197,160,89,0.3)" }}
            >
                {selectedLang?.ui?.comingSoon || "Coming Soon"}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-sm md:text-base font-bold italic max-w-sm w-full px-4 leading-relaxed opacity-90 break-keep word-break ${currentTheme?.text || 'text-white'}`}
            >
                "{selectedLang?.ui?.comingSoonDesc1 || "This is the current end of the line! Updates coming soon. However, you can continue listening to the music of each multiverse here."}"<br /><br />
                <span className="text-[#00E5FF] font-black drop-shadow-[0_0_10px_rgba(0,229,255,0.8)] block w-full">
                    {selectedLang?.ui?.comingSoonDesc2 || "There are a total of 2 tracks prepared for each language, so please enjoy them to the end!"}
                </span>
            </motion.p>

            <div className="flex flex-col gap-4 mt-10">
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    onClick={() => {
                        AudioManager.playSfx('shutter', 0.6);
                        setStep('dashboard');
                        setViewMode('gallery');
                    }}
                    className={`px-8 py-4 border active:scale-95 transition-all text-[10px] uppercase font-black font-sans tracking-[0.3em] backdrop-blur-md ${currentTheme?.border || 'border-[#C5A059]/40'} ${currentTheme?.text || 'text-white'} hover:bg-white/10 shadow-lg`}
                >
                    {selectedLang?.id === 'ko' ? "매너 갤러리" : "Enter Gallery"}
                </motion.button>
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    onClick={() => {
                        AudioManager.playSfx('click', 0.6);
                        setStep('language');
                    }}
                    className="px-8 py-3 opacity-60 hover:opacity-100 active:scale-95 transition-all text-[10px] uppercase font-black tracking-widest text-[#00E5FF] hover:text-white"
                >
                    {selectedLang?.id === 'ko' ? "다중 우주로 돌아가기" : "Return to Multiverse"}
                </motion.button>
            </div>
        </motion.div>
    );
};

const LanguageCard = ({ lang, isFocused, isStaged, isDimmable, onFocus, onReady, onSelect }) => {
    const [saturationProgress, setSaturationProgress] = useState(0);
    const [isShakePaused, setIsShakePaused] = useState(false);
    const animInterval = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        if (isFocused && !isStaged) {
            const startTime = Date.now();
            const duration = 5500; // 5.5s total time
            let stage = 0;

            animInterval.current = setInterval(() => {
                const elapsed = Date.now() - startTime;

                // Track percentage evenly from 0-100% over 5.5s
                const percentage = Math.min((elapsed / duration) * 100, 100);
                setSaturationProgress(percentage);

                if (elapsed >= 2500 && stage < 1) { // 2.5 sec jump
                    [...Array(3)].forEach(() => AudioManager.playSfx('piano-mystic-low', 0.7, true));
                    setTimeout(() => { setIsShakePaused(true); setTimeout(() => setIsShakePaused(false), 400); }, 100); // Freeze right as impact hits
                    stage = 1;
                } else if (elapsed >= 3500 && stage < 2) { // 3.5 sec jump
                    AudioManager.playSfx('piano-mystic-mid', 0.42, true);
                    setTimeout(() => { setIsShakePaused(true); setTimeout(() => setIsShakePaused(false), 400); }, 100);
                    stage = 2;
                } else if (elapsed >= 4500 && stage < 3) { // 4.5 sec (background switch + glow)
                    AudioManager.playSfx('piano-mystic-high', 0.56, true);
                    setTimeout(() => { setIsShakePaused(true); setTimeout(() => setIsShakePaused(false), 400); }, 100);
                    if (onReady) onReady({ ...lang, requestBackground: true });
                    stage = 3;
                }

                if (elapsed >= duration) { // 5.5 sec total completion
                    clearInterval(animInterval.current);

                    // Restore country theme playback
                    const currentSrc = AudioManager.currentTheme?.src || "";
                    if (currentSrc.split('/').pop() !== `${lang.id}-theme.mp3`) {
                        AudioManager.playTheme(lang.id, 0.28, 3000);
                    }

                    if (onReady) onReady({ ...lang, requestSequenceComplete: true });
                }
            }, 50);
        } else {
            setSaturationProgress(0);
            if (animInterval.current) clearInterval(animInterval.current);
            // Disabled stopping theme so BGM persists
            // AudioManager.stopTheme();
        }

        return () => {
            if (animInterval.current) clearInterval(animInterval.current);
        };
    }, [isFocused, isStaged]);

    const handleDragEnd = (event, info) => {
        if (!isFocused || saturationProgress < 100 || isStaged) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        let dropX = info.point.x;
        let dropY = info.point.y;

        // Use the visual center of the card for drop detection, not the pointer, to fix edge-card drag offsets
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            dropX = rect.left + rect.width / 2;
            dropY = rect.top + rect.height / 2;
        }

        const dist = Math.sqrt(Math.pow(dropX - centerX, 2) + Math.pow(dropY - centerY, 2));

        // Strict drop zone: 120px radius or 25% of smaller screen dimension, enforcing a true center-drop
        const dropRadius = Math.max(120, Math.min(window.innerWidth, window.innerHeight) * 0.25);

        if (dist < dropRadius) {
            AudioManager.playSfx('shutter', 0.6);
            onSelect(lang);
        }
    };

    const isDraggable = isFocused && saturationProgress === 100 && !isStaged;

    return (
        <motion.div
            ref={cardRef}
            onClick={() => {
                if (!isFocused && !isStaged) onFocus(lang);
            }}
            drag={isDraggable}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            whileDrag={isDraggable ? { scale: 1.1, zIndex: 1000, rotate: 2 } : {}}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isDimmable ? 0.3 : 1,
                // Only shake when progressing, stop shaking completely at 100% and just gently scale up
                scale: isStaged ? 1 : (isFocused ? (saturationProgress === 100 && !isStaged ? [1.05, 1.08, 1.05] : 1.05) : 1),
                zIndex: isFocused ? 100 : 1,
                // Shake effect while holding, maxes out right before 100%
                x: isFocused && saturationProgress > 0 && saturationProgress < 100 && !isStaged && !isShakePaused
                    ? [-1, 1, -1, 1, 0].map(v => v * (1 + (saturationProgress / 100) * 1.5))
                    : 0,
                y: isFocused && saturationProgress > 0 && saturationProgress < 100 && !isStaged && !isShakePaused
                    ? [1, -1, 1, -1, 0].map(v => v * (1 + (saturationProgress / 100) * 1.5))
                    : 0,
            }}
            transition={{
                x: { duration: 0.1, repeat: isFocused && saturationProgress < 100 && !isShakePaused ? Infinity : 0, ease: "linear" },
                y: { duration: 0.1, repeat: isFocused && saturationProgress < 100 && !isShakePaused ? Infinity : 0, ease: "linear" },
                opacity: { duration: 0.3 },
                scale: isFocused && saturationProgress === 100 && !isStaged
                    ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                    : { type: 'spring', damping: 25, stiffness: 120 }
            }}
            className={`relative w-full h-full rounded-lg overflow-hidden shadow-2xl select-none transition-shadow ${isFocused && !isStaged ? 'shadow-[0_0_80px_rgba(197,160,89,0.4)] ring-2 ring-[#C5A059]' : 'cursor-pointer hover:ring-1 hover:ring-white/20'}`}
            style={{ touchAction: 'none' }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-100"
                style={{
                    backgroundImage: `url(${lang.image})`,
                    transform: 'scale(1.5)',
                    filter: isFocused
                        ? (saturationProgress < 45.45 ? `saturate(${0.1 + (0.2 * (saturationProgress / 45.45))}) grayscale(${80 - (50 * (saturationProgress / 45.45))}%) brightness(${0.1 + (0.2 * (saturationProgress / 45.45))})`
                            : saturationProgress < 63.63 ? 'saturate(0.7) grayscale(30%) brightness(0.7)'
                                : saturationProgress < 81.81 ? 'saturate(1) grayscale(0%) brightness(1)'
                                    : 'saturate(1.2) grayscale(0%) brightness(1.3) drop-shadow(0 0 10px rgba(197,160,89,0.8))')
                        : (isStaged ? 'saturate(1) grayscale(0%)' : 'saturate(0) grayscale(100%) brightness(0.5)'),
                }}
            />

            {/* Hold/Focus Progress Bar */}
            {isFocused && saturationProgress < 100 && (
                <div className="absolute bottom-0 left-0 h-2 bg-[#C5A059] z-40 transition-all duration-75" style={{ width: `${saturationProgress}%` }} />
            )}

            {/* Glowing inner overlay for 100% saturation to invite dragging */}
            {isFocused && saturationProgress === 100 && !isStaged && (
                <motion.div
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 border-4 border-[#C5A059] pointer-events-none z-40"
                />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 opacity-60 pointer-events-none" />

            <div className="absolute inset-0 p-1 md:p-2 flex flex-col items-center justify-center z-30 text-center pointer-events-none">
                <h3 className={`text-base md:text-3xl font-black text-white font-serif uppercase tracking-widest leading-none mb-1 md:mb-2 transition-transform duration-500 ${isFocused ? 'scale-110 drop-shadow-[0_0_10px_rgba(197,160,89,0.8)] text-[#FDFCF0]' : ''}`}>
                    {lang.name}
                </h3>
                <div className="w-full flex justify-center items-center px-1 overflow-visible">
                    <motion.span
                        animate={{ y: isFocused || isStaged ? 0 : 10 }}
                        className="text-xs md:text-lg text-[#C5A059] uppercase tracking-[0.1em] md:tracking-[0.2em] font-black block leading-tight text-center"
                    >
                        {isStaged ? lang.ui.fateSealed : (saturationProgress === 100 ? lang.ui.drag : (isFocused ? `${lang.ui.sync} ${Math.round(saturationProgress)}%` : lang.ui.tap))}
                    </motion.span>
                </div>
            </div>
        </motion.div>
    );
};

const LanguageView = ({ LANGUAGES, handleLanguageSelect, setSpiritHint, cardsExplored, setCardsExplored, isMinaSpeaking, earnedBadges, onEarnBadge }) => {
    const [focusedLang, setFocusedLang] = useState(null);
    const [stagedLang, setStagedLang] = useState(null);
    const [minaText, setMinaText] = useState("");
    const [activeBackground, setActiveBackground] = useState(null);
    const [isIntroActive, setIsIntroActive] = useState(true);

    // Use a ref to prevent double audio playback in React strict mode / dev
    const audioPlayedRef = useRef(false);

    const introSentences = [
        "Initiating dimensional shift.",
        "Anchor your consciousness.",
        "Await multiverse synchronization.",
        "Select your frequency.",
        "Choose your anchor point."
    ];
    const [introSentence] = useState(() => introSentences[Math.floor(Math.random() * introSentences.length)]);

    useEffect(() => {
        setMinaText(introSentence);

        // Drop overlay after 6 seconds (length of voice line)
        const overlayTimer = setTimeout(() => {
            setIsIntroActive(false);
        }, 6000);

        return () => clearTimeout(overlayTimer);
    }, [introSentence]);

    const onCardFocus = (lang) => {
        // Track unique card views
        if (setCardsExplored) {
            setCardsExplored(prev => {
                const newSet = new Set(prev);
                newSet.add(lang.id);
                return newSet;
            });
        }
        // Reset the background to normal dark when preparing to pick again
        setActiveBackground(null);
        setFocusedLang(lang);
        setStagedLang(null);
        setMinaText(lang.ui.sync + "...");
    };

    const onCardReady = (payload) => {
        // [V30 UPDATE: Track Archetypes in Real-Time during exploration]
        if (onEarnBadge) {
            const metrics = {
                totalClicks: payload.clickCount || cardsExplored.size,
                uniqueCards: cardsExplored.size,
                sessionTimeSeconds: 5,
                selectedLangId: payload.id
            };
            const calculated = calculateArchetype(metrics);
            if (calculated && calculated.length > 0) {
                onEarnBadge(calculated);
            }
        }

        if (payload.requestBackground) {
            setActiveBackground(payload.image);
        }
        if (payload.requestSequenceComplete) {
            setMinaText(payload.ui.directiveLanguage);
            // Play the dynamic language voice at exactly 5.5s
            AudioManager.playMina(payload.id, 'language');
        }
    };

    // V26: Center Hold Logic
    const [holdProgress, setHoldProgress] = useState(0);
    const holdIntervalRef = useRef(null);

    const startHold = () => {
        if (!stagedLang) return;
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

        // V28: Rich 4-string harmonic feedback instead of harsh metal
        // Increased by 30% volume
        AudioManager.playSfx('piano-mystic-low', 1.0, true);
        AudioManager.playSfx('piano-mystic-mid', 0.9, true);

        setMinaText(stagedLang.ui.sync + '...');
        setHoldProgress(0);
        holdIntervalRef.current = setInterval(() => {
            setHoldProgress(prev => {
                const next = prev + (100 / (5000 / 50)); // Fill 100% over 5s at 50ms intervals
                if (next >= 100) {
                    clearInterval(holdIntervalRef.current);
                    holdIntervalRef.current = null;
                    return 100;
                }
                return next;
            });
        }, 50);
    };

    // V29: Watch for completion cleanly to avoid setState-while-rendering warnings
    useEffect(() => {
        if (holdProgress >= 100 && stagedLang) {
            handleLanguageSelect(stagedLang);
            // Cancel hold right after to prevent duplicate firing
            cancelHold();
        }
    }, [holdProgress, stagedLang, handleLanguageSelect]);

    const cancelHold = () => {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setHoldProgress(0);
    };

    const handleAnchorSelect = (lang) => {
        setStagedLang(lang);

        // Complete the harmonic string flourish
        AudioManager.playSfx('piano-mystic-high', 1.0, true);
        AudioManager.playSfx('transition', 0.7, true);

        setMinaText(lang.ui.directiveConfirm);
        AudioManager.playMina(lang.id, 'confirm');
    };

    const onCardSelect = (lang) => {
        setFocusedLang(lang);
        handleAnchorSelect(lang);
    };

    return (
        <div className="w-full mx-auto h-full flex flex-col items-center justify-center p-0 md:p-4 overflow-visible relative" style={{ touchAction: 'none', overscrollBehavior: 'none' }}>

            {/* Static SEAN flows background (User provided) */}
            <div
                className="fixed inset-0 z-[-1] bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none"
                style={{ backgroundImage: "url('/assets/click_anywhere_bg.jpg')", filter: "blur(6px)" }}
            />

            {/* Dynamic Native Image Background */}
            <div
                className={`fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-[3000ms] pointer-events-none ${activeBackground ? 'opacity-70' : 'opacity-0'}`}
                style={activeBackground ? { backgroundImage: `url(${activeBackground})` } : {}}
            />

            <div id="language-grid" className={`w-full grid grid-cols-3 grid-rows-3 gap-1 md:gap-4 bg-black/40 backdrop-blur-3xl p-1 md:p-6 border border-white/5 rounded-lg md:rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-1000 ${isIntroActive ? 'opacity-40 blur-sm scale-95 pointer-events-none' : 'opacity-100 blur-0 scale-100'}`}>
                {/* Background "Flow" Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] animate-pulse pointer-events-none" />

                {/* Grid Mapping */}
                {[0, 1, 2, 3, 'center', 4, 5, 6, 7].map((pos, i) => {
                    if (pos === 'center') {
                        return (
                            <div key="center-slot" className="relative z-50">
                                <AnimatePresence mode="wait">
                                    {stagedLang ? (
                                        <motion.div
                                            key={stagedLang.id}
                                            initial={{ scale: 0, opacity: 0, rotate: -20 }}
                                            animate={{ scale: holdProgress > 0 ? 1 + (holdProgress / 100) * 0.5 : 1, opacity: 1, rotate: 0 }}
                                            onMouseDown={startHold}
                                            onMouseUp={cancelHold}
                                            onMouseLeave={cancelHold}
                                            onTouchStart={startHold}
                                            onTouchEnd={cancelHold}
                                            className="w-full h-full z-[2000] cursor-pointer relative"
                                        >
                                            <div className="absolute -inset-4 bg-[#C5A059]/10 blur-xl pointer-events-none transition-opacity" style={{ opacity: holdProgress / 100 }} />
                                            <LanguageCard
                                                lang={stagedLang}
                                                isFocused={true}
                                                isStaged={true}
                                                onFocus={() => { }}
                                                onSelect={() => { }}
                                                onReady={() => { }}
                                            />
                                            {/* NOVEL UI: Orbital Resonance / Portal Collapse Mechanic */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/80 shadow-[inset_0_0_100px_rgba(0,0,0,1)] pointer-events-none rounded-2xl border border-[#C5A059]/30 backdrop-blur-xl overflow-hidden">

                                                {/* Expanding Resonance Rings */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                                                    <motion.div
                                                        className="absolute rounded-full border border-[#C5A059]"
                                                        animate={{
                                                            width: [`${100 - holdProgress}%`, `${150 - holdProgress}%`],
                                                            height: [`${100 - holdProgress}%`, `${150 - holdProgress}%`],
                                                            opacity: [0.8, 0],
                                                            rotate: holdProgress * 3
                                                        }}
                                                        transition={{ repeat: Infinity, duration: Math.max(0.5, 2 - holdProgress / 50) }}
                                                    />
                                                    <motion.div
                                                        className="absolute rounded-full border-2 border-dashed border-[#e5c996]"
                                                        style={{ width: `${holdProgress * 2.5}%`, height: `${holdProgress * 2.5}%` }}
                                                        animate={{ rotate: -holdProgress * 5 }}
                                                    />
                                                </div>

                                                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">

                                                    {/* The Core */}
                                                    <motion.div
                                                        className="relative flex items-center justify-center"
                                                        animate={{
                                                            scale: holdProgress >= 100 ? [1, 1.5, 1.2] : 1 + (holdProgress / 100),
                                                            filter: `drop-shadow(0 0 ${holdProgress}px rgba(197,160,89,1))`
                                                        }}
                                                    >
                                                        {/* Outer Energy Shell */}
                                                        <div
                                                            className="absolute rounded-full border-t-4 border-l-4 border-[#C5A059] transition-all"
                                                            style={{
                                                                width: '120px', height: '120px',
                                                                transform: `rotate(${holdProgress * 15}deg)`,
                                                                opacity: holdProgress / 100
                                                            }}
                                                        />
                                                        {/* Inner Core Pulsar */}
                                                        <div
                                                            className="absolute rounded-full bg-[#C5A059] transition-all mix-blend-screen"
                                                            style={{
                                                                width: `${Math.max(10, holdProgress)}px`,
                                                                height: `${Math.max(10, holdProgress)}px`,
                                                                boxShadow: `0 0 ${holdProgress * 2}px #FDFCF0`
                                                            }}
                                                        />

                                                        {holdProgress >= 100 ? (
                                                            <LucideLock className="text-black relative z-10 scale-[2.5]" size={40} />
                                                        ) : (
                                                            <LucideOrbit className="text-white relative z-10 scale-[2.0] animate-spin-slow opacity-80" size={40} />
                                                        )}
                                                    </motion.div>

                                                    {/* Data Readout */}
                                                    <div className="mt-16 flex flex-col items-center">
                                                        <span className="text-[#FDFCF0] text-3xl md:text-5xl font-black uppercase tracking-[0.4em] text-center mb-2 leading-tight mix-blend-screen"
                                                            style={{ textShadow: `0 0 ${holdProgress / 5}px #C5A059, 0 0 ${holdProgress / 2}px #e5c996` }}>
                                                            {holdProgress >= 100 ? "FATE SEALED" : "RESONATING"}
                                                        </span>
                                                        <span className="text-[#C5A059] text-xl font-mono tracking-widest">
                                                            [ {holdProgress.toFixed(1)}% ]
                                                        </span>
                                                    </div>

                                                    {/* Particle Accelerators (Lines) */}
                                                    <div className="w-full flex justify-between items-center px-8 mt-12 opacity-50">
                                                        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent flex-1" />
                                                        <LucideActivity className="text-[#C5A059] mx-4 animate-pulse" size={24} />
                                                        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent flex-1" />
                                                    </div>

                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="instruction"
                                            animate={{
                                                borderColor: focusedLang ? ['rgba(197,160,89,0.2)', 'rgba(197,160,89,0.8)', 'rgba(197,160,89,0.2)'] : 'rgba(255,255,255,0.1)',
                                                boxShadow: focusedLang ? ['0 0 10px rgba(197,160,89,0)', '0 0 30px rgba(197,160,89,0.4)', '0 0 10px rgba(197,160,89,0)'] : 'none'
                                            }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="flex flex-col items-center justify-center text-center p-2 md:p-4 bg-white/5 border-2 rounded-xl border-dashed w-full h-full"
                                        >
                                            <LucideCompass className={`${focusedLang ? 'text-[#C5A059] animate-spin-slow scale-150' : 'text-white/40 scale-125'} mb-4 transition-all`} size={40} />
                                            <h2 className={`text-[9px] sm:text-[10px] md:text-sm font-black ${focusedLang ? 'text-[#C5A059]' : 'text-white/40'} uppercase tracking-widest md:tracking-[0.3em] leading-snug px-1 break-words text-center transition-colors`}>
                                                {focusedLang ? focusedLang.ui.drag : 'ANCHOR'}
                                            </h2>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }

                    const lang = LANGUAGES[pos];
                    const isFocused = focusedLang?.id === lang.id;
                    const isStaged = stagedLang?.id === lang.id;
                    const isDimmable = focusedLang && focusedLang.id !== lang.id;
                    const isOriginalOfStaged = stagedLang && stagedLang.id === lang.id;

                    return (
                        <div
                            key={`slot-${i}`}
                            className={`relative aspect-[4/5] w-full transition-opacity duration-300 ${isFocused ? 'z-[50]' : ''}`}
                            style={{ opacity: isOriginalOfStaged ? 0 : Math.max(0, 1 - (holdProgress / 100) * 1.5) }}
                        >
                            {/* Hide the original slot card if it's currently staged in the center */}
                            {!isOriginalOfStaged && (
                                <LanguageCard
                                    lang={lang}
                                    idx={pos}
                                    isFocused={isFocused}
                                    isStaged={false}
                                    isDimmable={isDimmable || stagedLang}
                                    onFocus={onCardFocus}
                                    onReady={onCardReady}
                                    onSelect={onCardSelect}
                                />
                            )}
                        </div>
                    );
                })}
            </div>


            {/* Mina UI Scoreboard - Now strictly matching the Language Grid/Card width */}
            <div className={`fixed top-4 md:top-8 inset-x-0 pointer-events-none z-[5000] flex justify-center`}>
                <div className="w-full max-w-5xl px-4 md:px-8 mx-auto">
                    <MinaDirective
                        isVisible={true}
                        activeStep="language"
                        text={minaText}
                        position="top"
                        interactionMode={isIntroActive ? 'reading' : 'action'}
                        sysName={focusedLang?.ui?.minaSystem || "SEAN'S COMMENT"}
                        actionReq={focusedLang?.ui?.minaAction || ">> ACTION REQUIRED: SELECT A MULTIVERSE <<"}
                        isSpeaking={isMinaSpeaking}
                        badges={earnedBadges}
                    />
                </div>
            </div>
        </div>
    );
};

// All previous inline views have been moved to the top level

const ConfirmView = ({ selectedLang, confirmLanguage, theme }) => {
    useEffect(() => {
        // Flash and auto transition
        const timer = setTimeout(() => {
            confirmLanguage();
        }, 3500);
        return () => clearTimeout(timer);
    }, [confirmLanguage]);

    return (
        <div className="fixed inset-0 z-[10000] bg-transparent flex flex-col items-center justify-center overflow-hidden">
            {/* Massive Explosive Flare */}
            <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.1, 4, 15, 30], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.0, ease: "easeInOut" }}
                className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-yellow-300 via-[#C5A059] to-red-500 mix-blend-screen blur-3xl pointer-events-none"
            />

            {/* Expanding Shockwave */}
            <motion.div
                initial={{ scale: 1, opacity: 1, borderWidth: "20px" }}
                animate={{ scale: 10, opacity: 0, borderWidth: "1px" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute w-40 h-40 rounded-full border-white pointer-events-none"
            />

            <motion.h1
                initial={{ opacity: 0, filter: "blur(20px)", y: 50 }}
                animate={{ opacity: [0, 1, 1, 0], filter: ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"], scale: [0.8, 1, 1.1, 1.3], y: [50, 0, 0, -50] }}
                transition={{ duration: 3.5, ease: "circIn" }}
                className="text-black font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-center w-full px-4 break-words z-10 leading-tight"
                style={{ fontSize: "clamp(36px, 8vw, 120px)", textShadow: "0 0 40px rgba(197,160,89,1)" }}
            >
                {selectedLang?.ui?.confirmTitle || "ALIGNED"}
            </motion.h1>

            {/* The Flag merging into the light */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 2, 4, 8], filter: ["blur(20px)", "blur(0px)", "blur(10px)", "blur(40px)"] }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
                className="absolute z-0 text-[10rem] md:text-[20rem] opacity-30 pointer-events-none mix-blend-multiply"
            >
                {selectedLang?.flag}
            </motion.div>
        </div>
    );
};

const App = () => {
    const [isOpeningFinished, setIsOpeningFinished] = useState(false);
    const [step, setStep] = useState('language');
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[1]); // V20: English (GB)

    const [isMinaSpeaking, setIsMinaSpeaking] = useState(false);

    useEffect(() => {
        window.setMinaSpeaking = setIsMinaSpeaking;
        return () => {
            window.setMinaSpeaking = null;
        };
    }, []);

    // User Achievement Tracking State
    const [appStartTime] = useState(Date.now());
    const [totalClicks, setTotalClicks] = useState(0);

    // [V29 UPDATE: Lifted state to persist earned titles]
    const [earnedBadges, setEarnedBadges] = useState([]);

    // Track clicks for archetype calculation
    const [cardsExplored, setCardsExplored] = useState(new Set());

    // V20: Immediate voice guidance on load (ENSURE EN-GB)
    useEffect(() => {
        if (step === 'language' && !isOpeningFinished) {
            // Wait for opening to start
        }
    }, [step]);
    const [votedId, setVotedId] = useState(null);
    const [viewMode, setViewMode] = useState('gallery');
    const [previewId, setPreviewId] = useState(null);

    const [todos, setTodos] = useState({ avatar: false, home: false, voted: false });
    const [showTodo, setShowTodo] = useState(false);

    const [userAvatar, setUserAvatar] = useState(null);
    const [avatarLore, setAvatarLore] = useState("");
    const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [userName, setUserName] = useState('');

    const [candleLit, setCandleLit] = useState(true);
    const [gearsSpinning, setGearsSpinning] = useState(false);
    const [spiritHint, setSpiritHint] = useState("");
    const [isSpiritSensing, setIsSpiritSensing] = useState(false);
    const [whisper, setWhisper] = useState("");

    // [V9 UPDATE: Layered Audio & BGM]
    const bgmRef = useRef(null);
    const [bgmVol, setBgmVol] = useState(0.2);

    useEffect(() => {
        // [V8 UPDATE: Ambient whispers cycle]
        const whisperInterval = setInterval(async () => {
            if (apiKey && step !== 'language') {
                try {
                    const res = await callGemini({
                        contents: [{ parts: [{ text: "Generate 1 cryptic steampunk word or very short phrase (max 2 words) about souls, gears, or time. Uppercase only." }] }]
                    });
                    setWhisper(res?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "");
                } catch (e) { /* silent */ }
            }
        }, 15000);
        return () => clearInterval(whisperInterval);
    }, [step]);

    useEffect(() => {
        // Initialize BGM
        bgmRef.current = new Audio('/assets/sounds/manor-ambience.mp3'); // Use local ambience
        bgmRef.current.loop = true;
        bgmRef.current.volume = bgmVol;

        // Background TTS preloading to minimize network latency when user gets to Coming Soon
        AudioManager.preloadTTS();

        return () => bgmRef.current.pause();
    }, []);

    useEffect(() => {
        if (bgmRef.current) bgmRef.current.volume = bgmVol;
    }, [bgmVol]);

    // Accumulate sound layers as user progresses
    useEffect(() => {
        if (step === 'dashboard') setBgmVol(0.4);
        if (todos.voted) setBgmVol(0.6);
    }, [step, todos]);

    const playSfx = (type) => {
        const currentTheme = THEME_CONFIG[selectedLang?.id] || THEME_CONFIG.en;

        const sounds = {
            click: `/assets/sounds/${selectedLang?.id || 'en'}-click.mp3`,
            transition: `/assets/sounds/${selectedLang?.id || 'en'}-transition.mp3`,
            welcome: '/assets/sounds/welcome-voice.mp3'
        };

        const audioSrc = sounds[type] || sounds.click;
        const audio = new Audio(audioSrc);

        audio.play().catch(e => {
            console.warn(`Sound ${type} for ${selectedLang?.id} not found, using default.`);
            // Silent fallback to avoid breaking UI
        });
    };

    const [loreText, setLoreText] = useState("");

    useEffect(() => {
        if (viewMode === 'home_interior' && userAvatar?.lore) {
            let i = 0;
            setLoreText("");
            const timer = setInterval(() => {
                setLoreText(prev => prev + userAvatar.lore.charAt(i));
                i++;
                if (i >= userAvatar.lore.length) {
                    clearInterval(timer);
                    // [V9: Pre-fetch next logic after lore finished]
                    preFetchVoice(selectedLang?.ui?.todoDone, selectedLang?.voice, selectedLang?.name);
                }
            }, 30);
            return () => clearInterval(timer);
        }
    }, [viewMode, userAvatar]);

    const callGemini = async (payload, endpoint = "generateContent", model = "gemini-1.5-flash-latest") => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`;
        for (let i = 0; i < 5; i++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('API request failed');
                return await response.json();
            } catch (err) {
                if (i === 4) throw err;
                await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
            }
        }
    };

    const speakText = async (text) => {
        if (!apiKey || !text) return;

        // [V8 UPDATE: Check Cache Path first]
        if (audioCache[text]) {
            new Audio(audioCache[text]).play();
            return;
        }

        try {
            const prompt = `Speak with a bright, cheerful, expressive, and highly human-like voice in ${selectedLang.name} language: ${text}`;
            const response = await callGemini({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedLang.voice || "Zephyr" } } }
                }
            }, "generateContent", "gemini-1.5-flash-latest");

            if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                const audioData = response.candidates[0].content.parts[0].inlineData.data;
                const sampleRate = 24000;
                const wavUrl = pcmToWav(audioData, sampleRate);

                // Cache for later
                setAudioCache(prev => ({ ...prev, [text]: wavUrl }));
                new Audio(wavUrl).play();
            }
        } catch (err) { console.error("TTS Error:", err); }
    };

    // [V8 UPDATE: Pre-fetch Logic to eliminate sync issues]
    const preFetchVoice = async (text, langVoice, langName) => {
        if (!apiKey || !text || audioCache[text]) return;
        try {
            const response = await callGemini({
                contents: [{ parts: [{ text: `Speak with a bright, cheerful, expressive, and highly human-like voice in ${langName} language: ${text}` }] }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: langVoice || "Zephyr" } } }
                }
            }, "generateContent", "gemini-1.5-flash-latest");

            if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
                const audioData = response.candidates[0].content.parts[0].inlineData.data;
                const wavUrl = pcmToWav(audioData, 24000);
                setAudioCache(prev => ({ ...prev, [text]: wavUrl }));
            }
        } catch (err) { /* Silent fail for pre-fetch */ }
    };

    // [V7 UPDATE: Restored robust audio buffer processing, hoisted standard function]
    function pcmToWav(base64, sampleRate) {
        const buffer = Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
        const view = new DataView(new ArrayBuffer(44 + buffer.byteLength));
        const writeString = (offset, string) => { for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i)); };
        writeString(0, 'RIFF'); view.setUint32(4, 36 + buffer.byteLength, true); writeString(8, 'WAVE'); writeString(12, 'fmt ');
        view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(36, 'data');
        view.setUint32(40, buffer.byteLength, true); new Uint8Array(view.buffer, 44).set(new Uint8Array(buffer));
        return URL.createObjectURL(new Blob([view], { type: 'audio/wav' }));
    };

    // [V19] Consolidated Language Selection Logic
    const handleLanguageSelect = useCallback((lang) => {
        setSelectedLang(lang);
        setStep('coming_soon');
        setViewMode('coming_soon');
        AudioManager.playSfx('click');

        // Main BGM stops completely
        if (AudioManager.mainTheme) {
            AudioManager.mainTheme.pause();
            AudioManager.mainTheme.currentTime = 0;
        }

        // Enhance specific country theme volume to 70% with crossfade
        AudioManager.playTheme(lang.id, 0.7, 3000);

        AudioManager.playMina(lang.id, 'comingsoon');
    }, []);

    const confirmLanguage = useCallback(() => {
        // Obsolete: We bypass ConfirmView now.
    }, [selectedLang.id]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUploadedImage(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        }
    };

    const generateTextCharacter = async () => {
        if (!userName.trim()) return;
        setIsAvatarGenerating(true);
        try {
            // [V7 UPDATE: Synchronized text avatar prompt from user source]
            const prompt = `Create a short, mysterious 19th-century steampunk persona for someone named "${userName}". Output in ${selectedLang.name}. Max 40 words.`;
            const loreResult = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            const lore = loreResult?.candidates?.[0]?.content?.parts?.[0]?.text || `The enigmatic ${userName}.`;
            setUserAvatar({ image: null, textName: userName, lore, isTextAvatar: true });
            setTodos(p => ({ ...p, avatar: true }));
            AudioManager.playMina(selectedLang.id, 'avatar');
            setStep('dashboard');
        } catch (err) {
            console.error(err);
            setUserAvatar({ image: null, textName: userName, lore: `The enigmatic ${userName}.`, isTextAvatar: true });
            setTodos(p => ({ ...p, avatar: true }));
            AudioManager.playMina(selectedLang.id, 'avatar');
            setStep('dashboard');
        } finally {
            setIsAvatarGenerating(false);
        }
    };

    const generateCharacter = async () => {
        if (!uploadedImage) return;
        setIsAvatarGenerating(true);

        // [V7 UPDATE: Restored atmospheric fallback lore and Imagen race logic from user source]
        let generatedLore = "A mysterious soul whose visage the machine could not fully comprehend.";

        try {
            const loreResult = await callGemini({
                contents: [{
                    role: "user",
                    parts: [
                        { text: `Analyze this image and create a 19th-century steampunk persona. Output in ${selectedLang.name} language. Max 50 words.` },
                        { inlineData: { mimeType: "image/png", data: uploadedImage } }
                    ]
                }]
            });
            if (loreResult?.candidates?.[0]?.content?.parts?.[0]?.text) {
                generatedLore = loreResult.candidates[0].content.parts[0].text;
            }
            setAvatarLore(generatedLore);

            // 20 Seconds Timeout Promise
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 20000));

            const imageFetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    instances: { prompt: `Vintage oil painting style, steampunk character portrait based on description: ${generatedLore}. Sepia tones, victorian clothing, brass goggles, etching texture.` },
                    parameters: { sampleCount: 1 }
                }),
            }).then(res => res.json());

            // Race between Image API and 20s Timeout
            const imageData = await Promise.race([imageFetchPromise, timeoutPromise]);

            if (!imageData || !imageData.predictions || !imageData.predictions[0]) {
                throw new Error("Invalid image data structure");
            }

            const generatedUrl = `data:image/png;base64,${imageData.predictions[0].bytesBase64Encoded}`;

            setUserAvatar({ image: generatedUrl, lore: generatedLore, isTextAvatar: false });
            setTodos(p => ({ ...p, avatar: true }));
            AudioManager.playMina(selectedLang.id, 'avatar');
            setStep('dashboard');
        } catch (err) {
            console.error("Generation Error or Timeout:", err);
            // Fallback: Use Text Avatar if image generation hangs/fails
            setUserAvatar({ image: null, textName: "Architect", lore: generatedLore, isTextAvatar: true });
            setTodos(p => ({ ...p, avatar: true }));
            AudioManager.playMina(selectedLang.id, 'avatar');
            setStep('dashboard');
        } finally {
            setIsAvatarGenerating(false);
        }
    };

    const handlePreviewVote = async (id) => {
        if (!isAuthenticated) return;
        setPreviewId(id);
        const proj = PROJECTS.find(p => p.id === id);
        try {
            // [V7 UPDATE: Restored detailed prophecy prompt from user source]
            const prompt = `The user is considering the path: "${proj.title}". Write a mysterious, victorian-style prophecy about this choice. Output in ${selectedLang.name}. Max 30 words.`;
            const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            setOracleMessage(result.candidates?.[0]?.content?.parts?.[0]?.text || "...");
        } catch (err) { console.error(err); }
    };



    const useSpiritSense = async () => {
        if (!apiKey || isSpiritSensing) return;
        setIsSpiritSensing(true);
        playSfx('click');
        try {
            const prompt = `You are the House Spirit of the Lord Manor. Give a very short, cryptic, steampunk-style hint about what the guest should do next. Current step: ${step}, View: ${viewMode}. Output in ${selectedLang.name}. Max 15 words.`;
            const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
            setSpiritHint(result.candidates?.[0]?.content?.parts?.[0]?.text || "...");
            setTimeout(() => setSpiritHint(""), 5000);
        } catch (err) { console.error(err); }
        finally { setIsSpiritSensing(false); }
    };

    // [V19] Duplicate implementations removed and consolidated above.
    // The previous block was erroneously duplicated during the V19 refactor.
    // Functions handleLanguageSelect and confirmLanguage are now uniquely defined at L1038.

    const resetStates = () => {
        setPreviewId(null);
        setOracleMessage("");
        setTodos({ avatar: false, home: false, voted: false });
    };

    const currentTheme = THEME_CONFIG[selectedLang?.id] || THEME_CONFIG.ko;

    // [V19] Effect to handle TTS for later steps
    // V20: Fix default language logic & first voice trigger
    useEffect(() => {
        if (isOpeningFinished && step === 'language') {
            // [V22] - Removed duplicate English playMina trigger
            // AudioManager.playMina('en', 'language');
        }
    }, [isOpeningFinished]);

    return (
        <div
            onClick={() => setTotalClicks(prev => prev + 1)}
            className={`relative w-full h-screen ${currentTheme.bg} ${currentTheme.text} ${currentTheme.font} overflow-hidden transition-colors duration-1000`}
        >

            {/* [BOLD UI OVERHAUL] Panning Atmospheric Collage Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    initial={{ scale: 1.2, x: "-5%", y: "-5%" }}
                    animate={{
                        x: ["-5%", "5%", "-5%"],
                        y: ["-5%", "5%", "-5%"],
                    }}
                    transition={{
                        x: { duration: 120, repeat: Infinity, ease: "linear" },
                        y: { duration: 150, repeat: Infinity, ease: "linear" },
                    }}
                    className="absolute inset-[-10%] bg-cover bg-center grayscale-[40%] blur-[8px]"
                    style={{ backgroundImage: "url('/assets/intro-collage.png')", backgroundSize: 'cover' }}
                />

                {/* Heavy Dark Overlays for "Flashy but Restrained" feel */}
                <div className="absolute inset-0 bg-black/80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/60 to-black/95" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)]" />

                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/film-grain.png')] opacity-30 mix-blend-overlay" />
            </div>

            <AnimatePresence>
                {!isOpeningFinished && (
                    <div className="relative z-[10000]">
                        <CinematicOpening
                            onStart={() => AudioManager.playMainTheme(0.70, 4000)}
                            onComplete={() => {
                                AudioManager.fadeMainTheme(0.42, 3000);
                                setIsOpeningFinished(true);
                            }}
                        />
                    </div>
                )}
            </AnimatePresence>

            {isOpeningFinished && (
                <>
                    {/* API Status Banner */}
                    {!apiKey && (
                        <div className="fixed top-0 left-0 w-full z-[1000] bg-[#5C1A1A] text-[#f4e4bc] py-2 px-4 shadow-xl border-b border-[#C5A059] flex items-center justify-center gap-3">
                            <LucideZap size={16} className="text-[#C5A059] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                Linking to Aether... Set VITE_GEMINI_API_KEY
                            </span>
                        </div>
                    )}

                    <AetherWhispers text={whisper} theme={currentTheme} />

                    {/* Main Content Area: V9 Focus-Fixed Layout */}
                    <main className="relative z-10 w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4">

                        <SimpleErrorBoundary>
                            {/* REMOVED: AnimatePresence mode="wait" to fix layout blanking crashes */}
                            <div className="flex flex-col items-center w-full h-full flex-1 relative">
                                {step === 'language' && (
                                    <LanguageView
                                        LANGUAGES={LANGUAGES}
                                        handleLanguageSelect={handleLanguageSelect}
                                        setSpiritHint={setSpiritHint}
                                        cardsExplored={cardsExplored}
                                        setCardsExplored={setCardsExplored}
                                        isMinaSpeaking={isMinaSpeaking}
                                        earnedBadges={earnedBadges}
                                        onEarnBadge={(newBadges) => {
                                            setEarnedBadges(prev => {
                                                const existingIds = new Set(prev.map(b => b.id));
                                                const toAdd = newBadges.filter(b => !existingIds.has(b.id));
                                                return [...toAdd, ...prev];
                                            });
                                        }}
                                    />
                                )}
                                {step === 'confirm' && (
                                    <ConfirmView selectedLang={selectedLang} confirmLanguage={confirmLanguage} theme={currentTheme} />
                                )}
                                {step === 'coming_soon' && (
                                    <ComingSoonView
                                        selectedLang={selectedLang}
                                        currentTheme={currentTheme}
                                        setViewMode={setViewMode}
                                        setStep={setStep}
                                        metrics={{
                                            totalClicks,
                                            uniqueCards: cardsExplored.size,
                                            timeSpentMs: Date.now() - appStartTime
                                        }}
                                        onEarnBadge={(newBadges) => {
                                            setEarnedBadges(prev => {
                                                const existingIds = new Set(prev.map(b => b.id));
                                                const toAdd = newBadges.filter(b => !existingIds.has(b.id));
                                                return [...toAdd, ...prev];
                                            });
                                        }}
                                        earnedBadges={earnedBadges}
                                    />
                                )}
                                {/* More steps would follow, refactored to use currentTheme classes */}
                                {step === 'intro' && (
                                    <IntroView
                                        selectedLang={selectedLang}
                                        userName={userName}
                                        setUserName={setUserName}
                                        generateTextCharacter={generateTextCharacter}
                                        isAvatarGenerating={isAvatarGenerating}
                                        handleImageUpload={handleImageUpload}
                                        uploadedImage={uploadedImage}
                                        generateCharacter={generateCharacter}
                                        playSfx={playSfx}
                                    />
                                )}
                                {step === 'dashboard' && (
                                    <div className="w-full h-full flex flex-col items-center justify-center absolute inset-0 bg-black/80 backdrop-blur-md">
                                        {viewMode === 'gallery' && (
                                            <GalleryView
                                                selectedLang={selectedLang}
                                                userAvatar={userAvatar}
                                                setViewMode={setViewMode}
                                                setTodos={setTodos}
                                                todos={todos}
                                                playSfx={playSfx}
                                            />
                                        )}
                                        {viewMode === 'home_interior' && (
                                            <ManorView
                                                selectedLang={selectedLang}
                                                setViewMode={setViewMode}
                                                userAvatar={userAvatar}
                                                candleLit={candleLit}
                                                setCandleLit={setCandleLit}
                                                gearsSpinning={gearsSpinning}
                                                setGearsSpinning={setGearsSpinning}
                                                loreText={loreText}
                                                playSfx={playSfx}
                                            />
                                        )}
                                        {viewMode === 'mission_active' && (
                                            <MissionView
                                                selectedLang={selectedLang}
                                                setViewMode={setViewMode}
                                                PROJECTS={PROJECTS}
                                                previewId={previewId}
                                                handlePreviewVote={handlePreviewVote}
                                                isAuthenticated={isAuthenticated}
                                                setIsAuthenticated={setIsAuthenticated}
                                                oracleMessage={oracleMessage}
                                                setStep={setStep}
                                                setTodos={setTodos}
                                                playSfx={playSfx}
                                            />
                                        )}
                                    </div>
                                )}
                                {step === 'trailer' && (
                                    <TrailerView selectedLang={selectedLang} resetStates={resetStates} setStep={setStep} playSfx={playSfx} />
                                )}
                            </div>
                        </SimpleErrorBoundary>
                    </main>

                    {/* [V25] Mina's Directive global guidance (Post-Language selection) */}
                    {step !== 'language' && (
                        <MinaDirective
                            isVisible={true}
                            activeStep={step}
                            text={
                                step === 'confirm' ? selectedLang?.ui?.directiveConfirm :
                                    !todos.avatar ? selectedLang?.ui?.directiveAuth :
                                        !todos.home ? selectedLang?.ui?.directiveAvatar :
                                            selectedLang?.ui?.directiveDashboard
                            }
                            position="top"
                            interactionMode="action"
                            isSpeaking={isMinaSpeaking}
                        />
                    )}

                    {/* Status Widgets: Integrated Assistant Only */}
                    <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-4 items-start pointer-events-none">
                        <AnimatePresence>
                            {spiritHint && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="bg-white/5 backdrop-blur-2xl text-white/90 p-5 border border-white/10 shadow-2xl max-w-[280px] text-[11px] font-medium tracking-wide leading-relaxed relative flex flex-col gap-3 rounded-xl"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                                        <div className="text-[8px] text-white/30 tracking-[0.4em] font-black uppercase">Manor Intelligence</div>
                                    </div>
                                    <div className="italic opacity-80 font-serif text-[13px]">
                                        "{spiritHint}"
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </>
            )
            }
        </div >
    );
};

export default App;

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
    LucideOrbit
} from 'lucide-react';
import MinaDirective from './components/MinaDirective';
import { calculateArchetype } from './components/Archetypes';

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

    playSfx: (id, volume = 0.5, overlap = false) => {
        if (id === 'transition') {
            // [V26] Hack to triple the amplitude of the transition effect natively
            [...Array(3)].forEach(() => {
                const audio = new Audio(`/assets/sounds/${id}.mp3`);
                audio.volume = volume;
                audio.play().catch(() => { });
            });
            return;
        }

        if (AudioManager.currentSfx && !overlap) {
            AudioManager.currentSfx.pause();
            AudioManager.currentSfx = null;
        }
        const audio = new Audio(`/assets/sounds/${id}.mp3`);
        audio.volume = volume;
        audio.play().catch(() => { });
        if (!overlap) AudioManager.currentSfx = audio;
    },

    playTheme: (langId, targetVolume = 0.4, fadeDuration = 3000) => {
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

        // Randomly pick if mapped
        if (THEME_TRACKS[langId] && THEME_TRACKS[langId].length > 0) {
            const tracks = THEME_TRACKS[langId];
            trackName = tracks[Math.floor(Math.random() * tracks.length)];
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

    playMainTheme: (targetVolume = 0.5, fadeDuration = 3000) => {
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
    baseThemeVolume: 0.4,
    baseMainThemeVolume: 0.6,

    playMina: (langId, step, volume = 1.0) => {
        if (AudioManager.currentMina) {
            AudioManager.currentMina.pause();
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

            // Fade down to 20% of the explicitly set base volume over 2 seconds
            const duckThemeVolume = AudioManager.baseThemeVolume * 0.2;
            const duckMainVolume = AudioManager.baseMainThemeVolume * 0.2;
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

        const signatureAudio = new Audio(`/assets/sounds/signature/sig-${langId}.mp3`);
        signatureAudio.volume = volume;

        const minaAudio = new Audio(`/assets/sounds/mina/mina-${langId}-${step}.mp3`);
        minaAudio.volume = volume;

        const randomHumanSfx = Math.floor(Math.random() * 10) + 1;
        const humanAudio = new Audio(`/assets/sounds/mina-human/human-${randomHumanSfx}.mp3`);
        humanAudio.volume = volume * 0.8;

        // --- 2. Restore Volume upon Complete ---
        minaAudio.onended = () => {
            if (window.setMinaSpeaking) window.setMinaSpeaking(false);
            const hasTheme = AudioManager.currentTheme && !AudioManager.currentTheme.paused;
            const hasMain = AudioManager.mainTheme && !AudioManager.mainTheme.paused;

            if (hasTheme || hasMain) {
                if (AudioManager.duckInterval) clearInterval(AudioManager.duckInterval);
                if (AudioManager.restoreInterval) clearInterval(AudioManager.restoreInterval);

                // Fade up to base volume over 4 seconds
                const restoreDuration = 4000;
                const steps = 80; // 50ms intervals
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

        humanAudio.onended = () => {
            minaAudio.play().catch(() => { if (window.setMinaSpeaking) window.setMinaSpeaking(false); });
        };

        signatureAudio.onended = () => {
            humanAudio.play().catch(() => {
                minaAudio.play().catch(() => { if (window.setMinaSpeaking) window.setMinaSpeaking(false); });
            });
        };

        signatureAudio.play().catch(() => {
            // Fallback if signature fails
            humanAudio.play().catch(() => {
                minaAudio.play().catch(() => { if (window.setMinaSpeaking) window.setMinaSpeaking(false); });
            });
        });
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
            directiveLanguage: "동기화 완료. 선택한 포트레잇을 중앙으로 끌어와 멀티버스를 확정하세요. 시간은 가연성 높은 자원이니 지체하지 마시길.",
            directiveConfirm: "탁월한 결단입니다. 이제 지문을 찍어 운명을 봉인하세요. 폭발은 면할 겁니다.",
            directiveAuth: "이름을 등록하거나 초상화를 제출해 신원을 인증하세요. 기계는 유령을 태우지 않습니다.",
            directiveAvatar: "페르소나 연성 완료. 꽤 봐줄 만하군요. 이제 저택의 기록 보관소로 이동하시죠.",
            directiveDashboard: "기록 보관소 진입 성공. 각 기록을 탭하여 조사하세요. 복도에서 길을 잃어도 구하러 가지 않습니다.",
            comingSoon: "곧 돌아옵니다",
            minaSystem: "시스템 구조체 : 미나", minaAction: ">> 행동 필요 : 언어를 선택하십시오 <<",
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
            directiveLanguage: "Synchronization achieved. Drag the chosen portrait to the center to lock your multiverse. Time is highly flammable, do not dawdle.",
            directiveConfirm: "A calculated choice. Imprint your thumb to seal this fate. We should avoid any spontaneous combustion.",
            directiveAuth: "Identity verification required. Ink your name or submit a scan. The machine does not transport ghosts.",
            directiveAvatar: "Persona forged. Passable, I suppose. Proceed to the Manor archives immediately.",
            directiveDashboard: "Archive breach successful. Tap the records to investigate. If you get lost in the halls, I will not search for you.",
            comingSoon: "Coming Soon",
            minaSystem: "SYSTEM CONSTRUCT: MINA", minaAction: ">> ACTION REQUIRED: SELECT A MULTIVERSE <<",
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
            directiveLanguage: "Sincronización lograda. Arrastra el retrato elegido al centro para fijar tu multiverso. El tiempo es muy inflamable, no te demores.",
            directiveConfirm: "Una elección calculada. Imprime tu huella para sellar este destino. Deberíamos evitar la combustión espontánea.",
            directiveAuth: "Se requiere verificación. Escribe tu nombre o escanea tu retrato. La máquina no transporta fantasmas.",
            directiveAvatar: "Persona forjada. Pasable, supongo. Proceda a los archivos de la Mansión inmediatamente.",
            directiveDashboard: "Infiltración al archivo exitosa. Toca los registros para investigar. Si te pierdes, no iré a buscarte.",
            comingSoon: "Próximamente",
            minaSystem: "CONSTRUCTO DE SISTEMA: MINA", minaAction: ">> ACCIÓN REQUERIDA: SELECCIONA UN MULTIVERSO <<",
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
            directiveLanguage: "तुल्यकालन पूरा हुआ। अपने मल्टीवर्स को लॉक करने के लिए चुने गए चित्र को केंद्र में खींचें। समय अत्यधिक ज्वलनशील है, देर न करें।",
            directiveConfirm: "एक सोची-समझी पसंद। इस भाग्य को सील करने के लिए अपना अंगूठा छापें। हमें किसी भी विस्फोट से बचना चाहिए।",
            directiveAuth: "पहचान सत्यापन आवश्यक है। अपना नाम लिखें या चित्र स्कैन करें। मशीन भूतों को नहीं ले जाती।",
            directiveAvatar: "व्यक्तित्व गढ़ा गया। ठीक-ठाक है। तुरंत मैनर के अभिलेखागार में आगे बढ़ें।",
            directiveDashboard: "अभिलेखागार में प्रवेश सफल। जांच के लिए रिकॉर्ड पर टैप करें। यदि आप खो जाते हैं, तो मैं आपको नहीं ढूंढूंगी।",
            comingSoon: "जल्द आ रहा है",
            minaSystem: "सिस्टम निर्माण: मीना", minaAction: ">> कार्रवाई आवश्यक: एक मल्टीवर्स चुनें <<",
            inviting: "मल्टीवर्स को आमंत्रित किया जा रहा है...", awaiting: "मैनर आपकी आत्मा की यात्रा की प्रतीक्षा कर रहा है।",
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
            directiveLanguage: "Synchronisation erreicht. Ziehen Sie das Porträt in die Mitte, um Ihr Multiversum zu sperren. Zeit ist hochentzündlich, trödeln Sie nicht.",
            directiveConfirm: "Eine kalkulierte Wahl. Drücken Sie Ihren Daumen darauf, um dieses Schicksal zu besiegeln. Wir sollten spontane Selbstentzündung vermeiden.",
            directiveAuth: "Identitätsprüfung erforderlich. Tragen Sie Ihren Namen ein oder scannen Sie Ihr Porträt. Die Maschine transportiert keine Geister.",
            directiveAvatar: "Persona geschmiedet. Akzeptabel, nehme ich an. Begeben Sie sich umgehend in das Manor-Archiv.",
            directiveDashboard: "Archivzugriff erfolgreich. Tippen Sie auf die Akten, um zu untersuchen. Wenn Sie sich verirren, werde ich nicht nach Ihnen suchen.",
            comingSoon: "Demnächst",
            minaSystem: "SYSTEMKONSTRUKT: MINA", minaAction: ">> AKTION ERFORDERLICH: WÄHLEN SIE EIN MULTIVERSUM <<",
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
            directiveLanguage: "同期完了。選択した肖像を中央にドラッグしてマルチバースを確定しなさい。時間は引火性が高いので、ぐずぐずしないでください。",
            directiveConfirm: "計算された選択です。指紋を押してこの運命を封印しなさい。自然発火は避けるべきです。",
            directiveAuth: "身元確認が必要です。署名するか肖像をスキャンしなさい。この機械は幽霊を運びません。",
            directiveAvatar: "ペルソナ錬成完了。まあまあですね。直ちに館の記録保管所へ進みなさい。",
            directiveDashboard: "アーカイブへの侵入成功。各記録をタップして調査しなさい。廊下で迷子になっても探しに行きませんよ。",
            comingSoon: "近日公開",
            minaSystem: "システム構造体：ミナ", minaAction: ">> アクション要求：マルチバースを選択してください <<",
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
            directiveLanguage: "تمت المزامنة. اسحب الصورة المختارة إلى المركز لقفل الكون المتعدد الخاص بك. الوقت سريع الاشتعال، لا تتباطأ.",
            directiveConfirm: "اختيار محسوب. اطبع إبهامك لختم هذا القدر. يجب أن نتجنب الاحتراق التلقائي.",
            directiveAuth: "مطلوب التحقق من الهوية. اكتب اسمك أو قم بمسح صورتك. الآلة لا تنقل الأشباح.",
            directiveAvatar: "تمت صياغة الشخصية. مقبولة، على ما أظن. تقدم إلى أرشيفات القصر على الفور.",
            directiveDashboard: "اقتحام الأرشيف ناجح. اضغط على السجلات للتحقيق. إذا ضللت طريقك، فلن أبحث عنك.",
            comingSoon: "قريباً",
            minaSystem: "بناء النظام: مينا", minaAction: ">> الإجراء المطلوب: حدد كونًا متعددًا <<",
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
            directiveLanguage: "Synchronizacja zakończona. Przeciągnij portret na środek, aby zablokować multiversum. Czas jest wysoce łatwopalny, nie zwlekaj.",
            directiveConfirm: "Wyrachowany wybór. Odciśnij kciuk, aby przypieczętować ten los. Powinniśmy unikać samozapłonu.",
            directiveAuth: "Wymagana weryfikacja. Wpisz imię lub zeskanuj portret. Maszyna nie transportuje duchów.",
            directiveAvatar: "Persona wykuta. Znośna, jak sądzę. Natychmiast udaj się do Archiwum Dworu.",
            directiveDashboard: "Włamanie do Archiwum udane. Dotknij akt, aby zbadać. Jeśli się zgubisz, nie będę cię szukać.",
            comingSoon: "Wkrótce",
            minaSystem: "KONSTRUKT SYSTEMU: MINA", minaAction: ">> WYMAGANE DZIAŁANIE: WYBIERZ MULTIWERSUM <<",
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
        { id: 1, type: 'text', title: 'START THE JOURNEY', subtitle: 'Enter the Core' },
        { id: 2, type: 'image', title: 'MEMORY', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=300' },
        { id: 3, type: 'text', title: 'NEXT STOP: SEOUL', subtitle: 'Flight 88' },
        { id: 4, type: 'image', title: 'ARCHIVE', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=300' },
        { id: 5, type: 'current', title: '퇴근하고 곧 돌아오겠습니다.', isCenter: true },
        { id: 6, type: 'manor', title: selectedLang.ui.manorTitle },
        { id: 7, type: 'text', title: 'DIGITAL SOUL', subtitle: 'Humanity in Code' },
        { id: 8, type: 'image', title: 'VISION', image: 'https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?auto=format&fit=crop&w=300&q=80' },
        { id: 9, type: 'rules', title: 'HOUSE RULES', subtitle: 'No Artificial Empathy' },
    ];

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-6 h-full py-4 overflow-hidden">
            <div className="text-center">
                <h1 className={`text-4xl font-black ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} mb-1 uppercase tracking-widest leading-none filter drop-shadow-md`}>{selectedLang.ui.galleryTitle}</h1>
                <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white/50'}`}>Cinematic Editorial</p>
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
                                onClick={() => { setViewMode('mission_active'); playSfx?.('click'); }}
                                onMouseEnter={() => playSfx?.('hover')}
                                className={`w-full h-full relative bg-[#0A0A0B] border border-white/20 overflow-hidden group active:scale-95 transition-transform hover:border-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] flex flex-col justify-center items-center`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                                <div className="absolute inset-0 flex items-center justify-center p-2 z-0">
                                    {userAvatar?.isTextAvatar ? (
                                        <span className={`font-black text-2xl uppercase text-center leading-tight ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} opacity-80 mix-blend-screen`}>{userAvatar.textName}</span>
                                    ) : (
                                        <img src={userAvatar?.image} className="w-full h-full object-cover opacity-60 mix-blend-luminosity" alt="avatar" />
                                    )}
                                </div>
                                <div className="relative z-20 text-center px-1">
                                    <p className={`text-[8px] font-serif italic mb-1 opacity-70 ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'}`}>Sean's Persona</p>
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
                                <span className="text-white/60 text-[8px] font-black uppercase tracking-widest">{slot.title}</span>
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
                                <span className={`font-black text-[9px] uppercase leading-tight mb-1 ${THEME_CONFIG[selectedLang.id]?.text || 'text-white/80'}`}>{slot.title}</span>
                                <span className={`text-[7px] font-serif italic leading-none ${THEME_CONFIG[selectedLang.id]?.accent || 'text-white/40'}`}>{slot.subtitle}</span>
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
                            <span className="text-[#C5A059] font-black text-xl text-center uppercase drop-shadow-md">{userAvatar?.textName?.charAt(0)}</span>
                        )}
                    </div>
                </div>

                <h3 className={`text-xl font-serif font-black ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} mb-6 uppercase tracking-[0.3em] text-center leading-none`}>{selectedLang.ui.manorTitle}</h3>

                <div className={`w-full flex-1 bg-black/40 backdrop-blur-sm p-5 border-l border-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}]/30 rounded-r-lg font-mono text-[10px] ${THEME_CONFIG[selectedLang.id]?.text || 'text-white/80'} leading-relaxed relative overflow-y-auto no-scrollbar shadow-inner`}>
                    {loreText}<span className={`inline-block w-1.5 h-3 bg-[${THEME_CONFIG[selectedLang.id]?.accent || '#FFF'}] ml-1 animate-ping`} />
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

const ComingSoonView = ({ selectedLang, currentTheme, setViewMode, setStep, metrics }) => {
    const [archetype, setArchetype] = useState(null);

    // Calculate Archetype Title on Load
    useEffect(() => {
        if (!metrics) return;
        const enhancedMetrics = {
            ...metrics,
            sessionTimeSeconds: metrics.timeSpentMs / 1000,
            selectedLangId: selectedLang?.id
        };
        const calculated = calculateArchetype(enhancedMetrics);
        setArchetype(calculated);
    }, [metrics, selectedLang]);

    // Attempt to play the localized coming soon TTS
    useEffect(() => {
        if (selectedLang) {
            AudioManager.playMina(selectedLang.id, 'comingsoon', 1.0);
        }
    }, [selectedLang]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-lg h-full flex flex-col items-center justify-center p-6 text-center z-50`}
        >

            {/* Archetype Badge */}
            <AnimatePresence>
                {archetype && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1.5, type: "spring" }}
                        className="mb-12 flex flex-col items-center"
                    >
                        <span className="text-white/40 text-[10px] font-black tracking-widest uppercase mb-4 border border-white/20 px-3 py-1 rounded-full">
                            관측된 영혼의 형태
                        </span>
                        <h1 className={`text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r ${archetype.color} text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`}>
                            [ {archetype.title} ]
                        </h1>
                        <h2 className="text-white/60 text-xs md:text-sm font-black tracking-[0.3em] uppercase mb-4">
                            {archetype.sub}
                        </h2>
                        <p className="text-white/80 text-sm italic font-serif max-w-sm leading-relaxed">
                            "{archetype.desc}"
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="mb-12 relative flex justify-center items-end h-24 gap-1.5 opacity-60">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            height: ["20%", "100%", "20%"],
                        }}
                        transition={{
                            duration: 0.5 + Math.random(),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 0.5
                        }}
                        className={`w-1.5 rounded-t-sm border border-black/20 ${currentTheme?.bg || 'bg-[#C5A059]'}`}
                        style={{ backgroundColor: '#C5A059' }} // Force gold color for visibility
                    />
                ))}
            </div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={`text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 ${currentTheme?.text || 'text-white'}`}
                style={{ textShadow: "0 0 20px rgba(197,160,89,0.3)" }}
            >
                {selectedLang?.ui?.comingSoon || "Coming Soon"}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`text-sm md:text-base font-bold italic max-w-sm leading-relaxed opacity-90 ${currentTheme?.text || 'text-white'}`}
            >
                "일단은 여기 까지입니다! Coming soon! 추후 업데이트 됩니다. 하지만 여기서 각 세계관의 음악은 계속 들을 수 있죠."<br /><br />
                <span className="text-[#00E5FF] font-black drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]">각 언어별로 총 2곡</span>이 준비되어 있으니깐, 끝까지 감상해보세요!
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                onClick={() => {
                    AudioManager.playSfx('shutter', 0.6);
                    setStep('dashboard');
                    setViewMode('gallery');
                }}
                className={`mt-10 px-8 py-4 border active:scale-95 transition-all text-[10px] uppercase font-black font-sans tracking-[0.3em] backdrop-blur-md ${currentTheme?.border || 'border-[#C5A059]/40'} ${currentTheme?.text || 'text-white'} hover:bg-white/10 shadow-lg`}
            >
                Enter Gallery
            </motion.button>
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
                        AudioManager.playTheme(lang.id, 0.4, 3000);
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
        const dist = Math.sqrt(Math.pow(info.point.x - centerX, 2) + Math.pow(info.point.y - centerY, 2));

        if (dist < 150) {
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

            <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 ${isFocused ? 'opacity-80' : 'opacity-60'}`} />

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

const LanguageView = ({ LANGUAGES, handleLanguageSelect, setSpiritHint, cardsExplored, setCardsExplored, isMinaSpeaking }) => {
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

        let i = 0;
        setMinaText("");

        // Drop overlay after 6 seconds (length of voice line)
        const overlayTimer = setTimeout(() => {
            setIsIntroActive(false);
        }, 6000);
        const typingInterval = setInterval(() => {
            if (i <= introSentence.length) {
                setMinaText(introSentence.slice(0, i));
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 75);

        return () => {
            clearInterval(typingInterval);
            clearTimeout(overlayTimer);
        };
    }, []);

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
        AudioManager.playSfx('click');
    };

    const onCardReady = (payload) => {
        if (payload.requestBackground) {
            setActiveBackground(payload.image);
        }
        if (payload.requestSequenceComplete) {
            setMinaText(payload.langData.ui.directiveLanguage);
            // Play the dynamic language voice at exactly 5.5s
            AudioManager.playMina(payload.id, 'language');
        }
    };

    // V26: Center Hold Logic
    const [holdProgress, setHoldProgress] = useState(0);
    const holdIntervalRef = useRef(null);

    const startHold = () => {
        if (!stagedLang) return;
        AudioManager.playSfx('shutter', 0.6); // Feedback sound
        setMinaText("MAINTAIN FOCUS.");
        setHoldProgress(0);
        holdIntervalRef.current = setInterval(() => {
            setHoldProgress(prev => {
                const next = prev + (100 / (5000 / 50)); // Fill 100% over 5s at 50ms intervals
                if (next >= 100) {
                    clearInterval(holdIntervalRef.current);
                    handleLanguageSelect(stagedLang);
                    return 100;
                }
                return next;
            });
        }, 50);
    };

    const cancelHold = () => {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        setHoldProgress(0);
    };

    const handleAnchorSelect = (lang) => {
        setStagedLang(lang);
        AudioManager.playSfx('confirm', 0.8);
        setMinaText(lang.ui.directiveConfirm);
        AudioManager.playMina(lang.id, 'confirm');
    };

    const onCardSelect = (lang) => {
        setFocusedLang(lang);
        handleAnchorSelect(lang);
    };

    return (
        <div className="w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-2 md:p-4 mt-24 md:mt-16 overflow-visible relative" style={{ touchAction: 'none', overscrollBehavior: 'none' }}>

            {/* Dynamic Native Image Background */}
            <div
                className={`fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-[3000ms] pointer-events-none ${activeBackground ? 'opacity-70' : 'opacity-0'}`}
                style={activeBackground ? { backgroundImage: `url(${activeBackground})` } : {}}
            />

            <div id="language-grid" className={`w-full aspect-square grid grid-cols-3 grid-rows-3 gap-2 md:gap-4 bg-black/40 backdrop-blur-3xl p-3 md:p-6 border border-white/5 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-1000 ${isIntroActive ? 'opacity-40 blur-sm scale-95 pointer-events-none' : 'opacity-100 blur-0 scale-100'}`}>
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
                                            <h2 className={`text-xs md:text-base font-black ${focusedLang ? 'text-[#C5A059]' : 'text-white/40'} uppercase tracking-[0.4em] leading-tight text-center transition-colors`}>
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
                            className="relative h-full w-full transition-opacity duration-300"
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

            <motion.p
                animate={{ opacity: stagedLang ? 0.8 : 0.2 }}
                className="text-xs md:text-base font-black uppercase tracking-[0.8em] text-white mt-12 text-center"
            >
                {stagedLang ? stagedLang.ui.inviting : (focusedLang ? focusedLang.ui.awaiting : "THE MANOR AWAITS YOUR SOUL'S VOYAGE.")}
            </motion.p>

            {/* Mina UI Scoreboard - Now strictly matching the Language Grid/Card width */}
            <div className={`fixed top-4 md:top-8 inset-x-0 pointer-events-none z-[5000] flex justify-center`}>
                <div className="w-full w-[95vw] md:w-auto md:min-w-[480px] max-w-4xl px-2 md:px-4">
                    <MinaDirective
                        isVisible={true}
                        activeStep="language"
                        text={minaText}
                        position="top"
                        interactionMode={isIntroActive ? 'reading' : 'action'}
                        sysName={focusedLang?.ui?.minaSystem || "SYSTEM CONSTRUCT: MINA"}
                        actionReq={focusedLang?.ui?.minaAction || ">> ACTION REQUIRED: SELECT A MULTIVERSE <<"}
                        isSpeaking={isMinaSpeaking}
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
                {selectedLang.ui.confirmTitle || "ALIGNED"}
            </motion.h1>

            {/* The Flag merging into the light */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 2, 4, 8], filter: ["blur(20px)", "blur(0px)", "blur(10px)", "blur(40px)"] }}
                transition={{ duration: 3.5, ease: "easeInOut" }}
                className="absolute z-0 text-[10rem] md:text-[20rem] opacity-30 pointer-events-none mix-blend-multiply"
            >
                {selectedLang.flag}
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
                    preFetchVoice(selectedLang.ui.todoDone, selectedLang.voice);
                }
            }, 30);
            return () => clearInterval(timer);
        }
    }, [viewMode, userAvatar]);

    const callGemini = async (payload, endpoint = "generateContent", model = "gemini-2.5-flash-preview-09-2025") => {
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
            }, "generateContent", "gemini-1.5-flash");

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
            }, "generateContent", "gemini-1.5-flash");

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
    const handleLanguageSelect = (lang) => {
        setSelectedLang(lang);
        setStep('confirm');
        setViewMode(null);
        AudioManager.playSfx('click');
        AudioManager.playMina(lang.id, 'confirm');

        // Main BGM stops completely
        if (AudioManager.mainTheme) {
            AudioManager.mainTheme.pause();
            AudioManager.mainTheme.currentTime = 0;
        }

        // Enhance specific country theme volume to 70% with crossfade
        AudioManager.playTheme(lang.id, 0.7, 3000);

        // [V10: Sequence pre-fetching]
        setTimeout(() => {
            preFetchVoice(lang.ui.confirmTitle, lang.voice, lang.name);
            preFetchVoice(lang.welcome, lang.voice, lang.name);
        }, 300);
    };

    const confirmLanguage = useCallback(() => {
        setStep('coming_soon');
        setViewMode('coming_soon');
    }, []);

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

    // --- View Templates ---

    // GalleryView, ManorView, MissionView, TrailerView, LanguageView, ConfirmView 
    // were manually defined inside App previously, causing the re-render focus bug.
    // They are now properly hoisted and we removed the duplicate legacy ones.

    const ManorView = ({ selectedLang, setViewMode, userAvatar, candleLit, setCandleLit, gearsSpinning, setGearsSpinning, loreText }) => (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-2 py-4">
            <button onClick={() => setViewMode('gallery')} className="text-white/40 hover:text-white uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1">
                <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
            </button>

            <GlassCard className="w-full flex-1 max-h-[70vh] p-0 border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                <div className="relative z-10 flex flex-col items-center p-6 h-full overflow-y-auto no-scrollbar">
                    <div className="w-full flex justify-between mb-4 px-2">
                        <div className="cursor-pointer hover:scale-110 transition-transform opacity-30 hover:opacity-100" onClick={() => setCandleLit(!candleLit)}>
                            <LucideFlame size={24} className={candleLit ? 'text-white' : 'text-white/20'} />
                        </div>
                        <div className="cursor-pointer hover:rotate-90 transition-transform opacity-30 hover:opacity-100" onClick={() => setGearsSpinning(!gearsSpinning)}>
                            <motion.div animate={{ rotate: gearsSpinning ? 360 : 0 }} transition={{ duration: 4, repeat: gearsSpinning ? Infinity : 0, ease: "linear" }}>
                                <LucideSettings size={24} className="text-white" />
                            </motion.div>
                        </div>
                    </div>

                    <div className={`relative w-28 h-28 mb-4 transition-all duration-700 ${candleLit ? '' : 'brightness-50'}`}>
                        <div className="absolute inset-0 border border-white/20 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]" />
                        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-1">
                            {userAvatar?.image ? (
                                <img src={userAvatar.image} className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <span className="text-white/50 font-black text-xl text-center uppercase">{userAvatar?.textName?.charAt(0)}</span>
                            )}
                        </div>
                    </div>

                    <h3 className="text-xl font-black text-white mb-4 uppercase tracking-[0.3em] text-center leading-none tracking-widest">{selectedLang.ui.manorTitle || "THE CLOCKWORK HEART"}</h3>

                    <div id="lore-box" className="w-full flex-1 bg-black/40 p-5 border border-white/5 rounded-xl font-mono text-[11px] text-white/70 leading-relaxed overflow-y-auto no-scrollbar backdrop-blur-md">
                        {loreText}<span className="inline-block w-1.5 h-3 bg-white/50 ml-1 animate-ping" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-white/10">
                        <motion.div whileHover={{ y: -2 }} className="flex flex-col items-center gap-2 cursor-pointer group">
                            <LucideTrophy size={18} className="text-white/40 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-black uppercase text-white/40 group-hover:text-white tracking-widest transition-colors">{selectedLang.ui.manorHeirlooms || "HEIRLOOMS"}</span>
                        </motion.div>
                        <div className="flex flex-col items-center gap-2 opacity-30 cursor-not-allowed">
                            <LucideMapPin size={18} className="text-white/40" />
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{selectedLang.ui.manorEstate || "ESTATE"}</span>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );

    const MissionView = ({ selectedLang, setViewMode, PROJECTS, previewId, handlePreviewVote, isAuthenticated, setIsAuthenticated, oracleMessage, setStep, setTodos }) => (
        <div className="w-full max-w-lg h-full flex flex-col items-center justify-center space-y-4 py-4 overflow-hidden">
            <button onClick={() => setViewMode('gallery')} className="text-white/40 hover:text-white uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1 px-2">
                <LucideChevronLeft size={16} /> {selectedLang.ui.returnGallery}
            </button>

            <div className="w-full space-y-4 overflow-y-auto no-scrollbar flex-1 pb-10 px-2 lg:px-4">
                <GlassCard className="py-4 px-6 border-white/10 shadow-2xl">
                    <h3 className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-3">
                        <LucideInfo size={14} /> {selectedLang.ui.authTitle}
                    </h3>
                    {!isAuthenticated ? (
                        <button onClick={() => setIsAuthenticated(true)} className="w-full mt-3 py-3 bg-white/5 text-white/80 text-[10px] font-black uppercase border border-white/10 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md active:scale-95">
                            {selectedLang.ui.authBtn}
                        </button>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-white/80 font-black bg-white/5 p-3 mt-3 border border-white/10 uppercase text-[10px] backdrop-blur-md">
                            <LucideCheckCircle size={16} className="text-green-500/80" /> {selectedLang.ui.authDone}
                        </div>
                    )}
                </GlassCard>

                <div className="space-y-4">
                    {PROJECTS.map((proj) => {
                        const isSelected = previewId === proj.id;
                        const isInactive = previewId && !isSelected;
                        return (
                            <motion.div key={proj.id} layout className={`${isInactive ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                                <GlassCard
                                    onClick={() => !isInactive && isAuthenticated && handlePreviewVote(proj.id)}
                                    className={`cursor-pointer transition-all duration-500 overflow-hidden border p-0 ${isSelected ? 'border-white/30 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'border-white/5 opacity-80 hover:border-white/20 hover:bg-white/5'}`}
                                >
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className={`text-[9px] font-mono mb-1 block uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-white/30'}`}>Case #0{proj.id}</span>
                                            <h4 className={`text-base font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-white/60'}`}>{proj.title}</h4>
                                        </div>
                                        {isSelected && <LucideSparkles className="text-white/80 animate-pulse" size={18} />}
                                    </div>
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-5 pt-0 border-t border-white/5 bg-black/40 backdrop-blur-md">
                                                <div className="mb-5 p-4 bg-white/5 border border-white/10 rounded-sm">
                                                    <p className="text-white/80 text-[11px] italic leading-relaxed text-center font-serif">"{oracleMessage || selectedLang.ui.consulting}"</p>
                                                </div>
                                                <button onClick={() => { setStep('trailer'); setTodos(p => ({ ...p, voted: true })); }} className="w-full py-4 bg-white/10 text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white/20 active:scale-95 transition-all border border-white/20">
                                                    {selectedLang.ui.sealBtn}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const TrailerView = ({ selectedLang, resetStates, setStep }) => (
        <GlassCard className="text-center w-full max-w-sm mx-auto p-10 shadow-2xl relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
            >
                <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-md">
                    <LucideLock className="w-8 h-8 text-white/80" />
                </div>
            </motion.div>

            <div className="space-y-4 mb-10 w-full">
                <h2 className="text-2xl font-black uppercase tracking-[0.4em] text-white leading-tight">
                    {selectedLang.ui.fateSealed}
                </h2>
                <div className="w-12 h-[1px] bg-white/20 mx-auto" />
                <p className="text-white/50 italic text-[11px] leading-relaxed font-serif tracking-widest uppercase">
                    The network sleeps.
                </p>
            </div>

            <button
                onClick={() => { setStep('language'); resetStates(); }}
                className="w-full py-4 bg-white/5 text-white/80 font-black uppercase tracking-[0.3em] text-[10px] border border-white/10 hover:bg-white/10 hover:text-white active:scale-95 transition-all"
            >
                {selectedLang.ui.returnGallery}
            </button>
        </GlassCard>
    );

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

            {/* [V12] Cinematic Video Background */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute min-w-full min-h-full object-cover opacity-50 mix-blend-screen scale-105"
                    src="https://assets.codepen.io/3364143/7btrrd.mp4"
                />
                {/* Dark Cinematic Gradient & Blur Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 backdrop-blur-[2px]" />
            </div>

            <AnimatePresence>
                {!isOpeningFinished && (
                    <div className="relative z-[10000]">
                        <CinematicOpening
                            onStart={() => AudioManager.playMainTheme(1.0, 4000)}
                            onComplete={() => {
                                AudioManager.fadeMainTheme(0.6, 3000);
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
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step + (selectedLang?.id || '')}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                                className="flex flex-col items-center w-full"
                            >
                                {(step === 'language' || step === 'confirm') && (
                                    <LanguageView
                                        LANGUAGES={LANGUAGES}
                                        handleLanguageSelect={handleLanguageSelect}
                                        setSpiritHint={setSpiritHint}
                                        cardsExplored={cardsExplored}
                                        setCardsExplored={setCardsExplored}
                                        isMinaSpeaking={isMinaSpeaking}
                                    />
                                )}
                                {step === 'confirm' && (
                                    <ConfirmView selectedLang={selectedLang} confirmLanguage={confirmLanguage} theme={currentTheme} />
                                )}
                                {viewMode === 'coming_soon' && (
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
                                    <div className="w-full h-full flex flex-col items-center justify-center">
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
                            </motion.div>
                        </AnimatePresence>
                    </main>

                    {/* [V25] Mina's Directive global guidance (Post-Language selection) */}
                    {step !== 'language' && (
                        <MinaDirective
                            isVisible={true}
                            activeStep={step}
                            text={
                                step === 'confirm' ? selectedLang.ui.directiveConfirm :
                                    !todos.avatar ? selectedLang.ui.directiveAuth :
                                        !todos.home ? selectedLang.ui.directiveAvatar :
                                            selectedLang.ui.directiveDashboard
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
            )}
        </div>
    );
};

export default App;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicOpening from './components/CinematicOpening';
import LanguageSelector from './src/components/LanguageSelector';
import IntroEngraveView from './src/components/IntroEngraveView';

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
import { callGemini } from './src/services/aiService';
import { speakText, preFetchVoice } from './src/services/audioService';

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
            tabGuide: '가이드', tabArchive: '기록 보관소', guideHeader: '1. 세계관 및 흐름', guideStep1: '1-1. 시스템 부팅 및 동기화', guideStep2: '1-2. 다중우주 접속', guideStep3: '1-3. 주파수를 선택하세요.', guideComplete: '완료', archiveTitle: '기록 보관소', earned: '획득', noRecords: '기록이 없습니다.', exploreMore: '다중우주를 탐험하여 기억을 수집하세요.',
            authTitle: "신원 인증", authBtn: "영혼의 자격 증명", authDone: "신원 기록 완료",
            galleryTitle: "매너 기록 보관소", gallerySub: "역사적 기록 1899",
            manorTitle: "기계동력 심장부", manorHeirlooms: "선조의 유물", manorEstate: "저택 부지",
            returnGallery: "보관소로 돌아가기", textOptionTitle: "당신의 이름을 기록하세요",
            textInputPlaceholder: "방문자 이름...", textSubmitBtn: "이름 남기기",
            uploadTitle: "에테르 포트레잇 스캔", generateBtn: "자아 연성", generating: "변환 중...",
            confirmTitle: "당신의 세계가 맞습니까?", confirmBtn: "확정합니다", confirmDone: "언어 동기화 완료",
            todoTitle: "선언문", todo1: "신원 확립", todo2: "심장 점검", todo3: "운명 봉인", todoDone: "운명이 발현되었습니다.",
            consulting: "알고리즘이 속삭입니다...", sealBtn: "이 운명을 봉인하기", fateSealed: "운명 확정",
            directiveLanguage: "▶️ 원하는 세계를 중앙으로 [드래그] 하세요.",
            directiveConfirm: "📜 마지막 맹세입니다. 낙인을 [클릭] 하세요.",
            directiveAuth: "👤 자아 증명 대기중... [이름] 입력 또는 [사진] 업로드",
            directiveAvatar: "✨ 그릇 완성! 하단 버튼 [클릭]",
            directiveDashboard: "🎭 막이 올랐습니다! 기록의 전당으로 입장하세요.",
            comingSoon: "곧 돌아옵니다",
            archetypeBadge: "관측된 영혼의 형태",
            comingSoonDesc1: "일단은 여기 까지입니다! Coming soon! 추후 업데이트 됩니다. 하지만 여기서 각 세계관의 음악은 계속 들을 수 있죠.",
            comingSoonDesc2: "각 언어별로 총 2곡이 준비되어 있으니깐, 끝까지 감상해보세요!",
            titleEarned: "새로운 칭호 획득",

            // ARCHETYPES
            badges: {
                lightspeed: { title: '빛의 속도를 넘은 자', sub: 'The Light-Speed Breaker', desc: '아무것도 보지 않고 직감만으로 돌파했다. (소요: {sec}초, 탐색: {uniqueCards}개, 클릭: {totalClicks}회)' },
                wanderer: { title: '우주의 방랑객', sub: 'The Cosmic Wanderer', desc: '5분 넘게 공허를 맴돌며 시공간을 관측했다. (소요: {sec}초, 탐색: {uniqueCards}개)' },
                destroyer: { title: '메뉴얼 파괴자', sub: 'The Manual Destroyer', desc: '광기로 화면을 찢어발겼다. (클릭: {totalClicks}회, 소요: {sec}초)' },
                indecision: { title: '선택 장애의 화신', sub: 'Master of Indecision', desc: '모든 선택지를 다 눌러보고도 한참을 고민했다. (탐색: {uniqueCards}개, 소요: {sec}초)' },
                razor: { title: '단호한 결단력', sub: 'The Absolute Razor', desc: '단 한 곳만 바라보고 주저 없이 선택했다. (탐색: 딱 {uniqueCards}개, 소요: {sec}초)' },
                silent: { title: '침묵의 관찰자', sub: 'The Silent Observer', desc: '거의 아무것도 만지지 않고 조용히 감상했다. (클릭: {totalClicks}회, 소요: {sec}초)' },
                octopus: { title: '문어발식 탐색가', sub: 'The Octopus Tactician', desc: '준비된 모든 다중우주를 꼼꼼히 확인했다. (탐색: {uniqueCards}개 완료)' },
                tester: { title: '시스템을 시험하는 자', sub: 'Tester of Systems', desc: '시스템을 파괴할 기세로 실험을 강행. QA팀이 두려워한다. (총 클릭: {totalClicks}회)' },
                hermit: { title: '음악 속의 은둔자', sub: 'The Musical Hermit', desc: '선택을 미루고 오직 멜로디에 몸을 맡겼다. (소요: {sec}초, 클릭: 불과 {totalClicks}회)' },
                defier: { title: '운명을 거스르는 자', sub: 'Defier of Fate', desc: '수많은 터치에도 고집스럽게 좁은 세계만을 파고듦. (클릭: {totalClicks}회, 탐색: 단 {uniqueCards}개)' },
                loyal: { title: 'SEAN의 모범 요원', sub: 'SEAN\'s Loyal Agent', desc: '의도대로 완벽하게 행동했다. (소요: {sec}초, 탐색: {uniqueCards}개)' },
                fortune: { title: '운명의 수레바퀴', sub: 'The Wheel of Fortune', desc: '자신만의 독특한 패턴으로 움직이는 변수. (소요: {sec}초, 조작: {totalClicks}회, 탐험: {uniqueCards}개)' },

                prophesied: { title: '향수병에 걸린 자', sub: 'The Nostalgic One', desc: '향수병에 걸린 듯 바로 {lang}를 택했다. (소요: {sec}초)' },
                pioneer: { title: '미지의 개척자', sub: 'The Unknown Pioneer', desc: '낯선 이국으로 기꺼이 발을 내디뎠다. (선택: {lang}, 소요: {sec}초)' },
                romantic: { title: '감성 충만 로맨티스트', sub: 'The Hopeless Romantic', desc: '열정적인 세계에 결국 정착했다. (선택: {lang}, 돌아본 세계: {uniqueCards}개)' },
                order: { title: '질서를 수호하는 자', sub: 'Guardian of Order', desc: '기계처럼 정확하고 필요한 조작만을 수행. (선택: {lang}, 단 {totalClicks}회 조작)' },
                samurai: { title: '벚꽃の무사', sub: 'The Sakura Samurai', desc: '관망하며 대기한 후 단호하게 검을 뽑았다. (선택: {lang}, 대기: {sec}초)' },
                polar: { title: '백야의 음유시인', sub: 'The Polar Bard', desc: '수많은 세계를 엿보고 북방으로 향했다. (선택: {lang}, 스쳐간 곳: {uniqueCards}개)' },
                shakespeare: { title: '글로벌 스탠다드', sub: 'The Global Standard', desc: '고민 없이 세계 공용어를 선택. (선택: {lang}, 고민: 단 {sec}초)' },
                chance: { title: '우연을 믿는 자', sub: 'Believer in Chance', desc: '오직 새로운 카드만을 뽑아든 타짜. (클릭 {totalClicks}회 = 탐색 {uniqueCards}개)' },

                m_firstStep: { title: '첫 걸음 👣', sub: 'First Step', desc: '시스템에 첫 흔적. (클릭: {totalClicks}회)' },
                m_spammer: { title: '광클러 ⚡', sub: 'Click Spammer', desc: '시스템 부하를 유발하는 연타. ({totalClicks}회)' },
                m_doubleTap: { title: '더블 탭 🎯', sub: 'Double Tap', desc: '정확하게 {totalClicks}번의 조작.' },
                m_safety: { title: '안전 제일 🛡️', sub: 'Safety First', desc: '딱 하나만 더 비교해보고 끝냈다. (본 카드: {uniqueCards}개)' },
                m_paranoid: { title: '의심병 환자 🕵️', sub: 'Paranoid', desc: '치밀한 더블 체크. ({uniqueCards}개에 {totalClicks}회 클릭)' },
                m_speedrunner: { title: '스피드 러너 🏃', sub: 'Speedrunner', desc: '빛과 같은 스피드. ({sec}초)' },
                m_marathon: { title: '마라토너 ⏱️', sub: 'Marathoner', desc: '오랜 시간 머무름. (총 체류: {sec}초)' },
                m_cautious: { title: '신중한 탐험가 🗺️', sub: 'Cautious Explorer', desc: '꼼꼼한 다중우주 탐색. (체류: {sec}초, 탐색: {uniqueCards}개)' },
                m_dualPersona: { title: '두 얼굴의 관찰자 🎭', sub: 'The Dual Observer', desc: 'SEAN과 수석 지휘자의 공존을 목격했다.' },
                keeper_of_rules: { title: '규칙의 수호자 ⚖️', sub: 'Keeper of Rules', desc: '다중우주의 이치를 깨달았습니다.' }
            },
            minaSystem: "🎻 수석 지휘자", minaAction: ">> 🎼 첫 막: 언어를 선택하세요 <<",
            inviting: "멀티버스로 진입 중...", awaiting: "저택이 당신의 영혼을 기다립니다.",
            tap: "탭하여 선택", sync: "동기화 중", drag: "가운데로 드래그",
            harmonizing: "운명 조율 중", aligned: "운명 정렬됨"
        }
    },
    {
        id: 'en', name: 'English', flag: '🇬🇧',
        image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop', // London fog/bridge
        welcome: "Welcome to the Lord Manor, guest. The gears of destiny await your touch.",
        loading: "Consulting the Chronometer...",
        ui: {
            tabGuide: 'GUIDE', tabArchive: 'ARCHIVE', guideHeader: '1. Language & Flow', guideStep1: '1-1. System boot & sync', guideStep2: '1-2. Multiverse Breach', guideStep3: '1-3. Select your frequency.', guideComplete: 'Complete', archiveTitle: 'Archive Records', earned: 'EARNED', noRecords: 'No records found.', exploreMore: 'Explore the multiverse to collect memories.',
            authTitle: "Aether Identity", authBtn: "Verify Soul Imprint", authDone: "Identity Sealed",
            galleryTitle: "MANOR ARCHIVE", gallerySub: "Historical Record 1899",
            manorTitle: "The Clockwork Heart", manorHeirlooms: "Ancestral Gears", manorEstate: "Manor Grounds",
            returnGallery: "Return to Archive", textOptionTitle: "Inscribe Your Name",
            textInputPlaceholder: "Guest Name...", textSubmitBtn: "Summon Identity",
            uploadTitle: "Scan Aether Portrait", generateBtn: "Forge Soul", generating: "Transmuting...",
            confirmTitle: "Is this your native tongue?", confirmBtn: "I Agree", confirmDone: "Language Bound",
            todoTitle: "Manifest", todo1: "Forge Identity", todo2: "Inspect Heart", todo3: "Seal Fate", todoDone: "Destiny manifested.",
            consulting: "The Algorithm whispers...", sealBtn: "Seal this fate", fateSealed: "Fate Locked",
            directiveLanguage: "Drag your chosen multiverse.",
            directiveConfirm: "Imprint to seal fate.",
            directiveAuth: "Verify identity now.",
            directiveAvatar: "Your persona is forged.",
            directiveDashboard: "Investigate the Manor archives.",
            comingSoon: "Coming Soon",
            archetypeBadge: "OBSERVED SOUL ARCHETYPE",
            comingSoonDesc1: "This is the current end of the line! Updates coming soon. However, you can continue listening to the music of each multiverse here.",
            comingSoonDesc2: "There are a total of 2 tracks prepared for each language, so please enjoy them to the end!",
            titleEarned: "NEW TITLE ACQUIRED",

            badges: {
                lightspeed: { title: 'The Light-Speed Breaker', sub: 'Beyond Velocity', desc: 'Passed through on instinct alone. (Time: {sec}s, Explored: {uniqueCards}, Clicks: {totalClicks})' },
                wanderer: { title: 'The Cosmic Wanderer', sub: 'Lost in the Void', desc: 'Observed the void for over 5 minutes. (Time: {sec}s, Explored: {uniqueCards})' },
                destroyer: { title: 'The Manual Destroyer', sub: 'System Bane', desc: 'Violently clicked through the UI. (Clicks: {totalClicks}, Time: {sec}s)' },
                indecision: { title: 'Master of Indecision', sub: 'Endless Debater', desc: 'Checked every option and hesitated. (Explored: {uniqueCards}, Time: {sec}s)' },
                razor: { title: 'The Absolute Razor', sub: 'Surgical Precision', desc: 'Chose a single path without hesitation. (Explored: {uniqueCards}, Time: {sec}s)' },
                silent: { title: 'The Silent Observer', sub: 'Quiet Listener', desc: 'Touched almost nothing, purely listening. (Clicks: {totalClicks}, Time: {sec}s)' },
                octopus: { title: 'The Octopus Tactician', sub: 'Thorough Explorer', desc: 'Meticulously examined every universe. (Explored: {uniqueCards})' },
                tester: { title: 'Tester of Systems', sub: 'QA Nightmare', desc: 'Stress-tested the interface like a developer. (Total Clicks: {totalClicks})' },
                hermit: { title: 'The Musical Hermit', sub: 'Audio Ascendant', desc: 'Delayed choice to simply bask in the melodies. (Time: {sec}s, Clicks: {totalClicks})' },
                defier: { title: 'Defier of Fate', sub: 'Stubborn Anchor', desc: 'Obsessively interacted with a narrow slice of worlds. (Clicks: {totalClicks}, Explored: {uniqueCards})' },
                loyal: { title: 'SEAN\'s Loyal Agent', sub: 'By the Book', desc: 'Acted exactly exactly as the system designers intended. (Time: {sec}s, Explored: {uniqueCards})' },
                fortune: { title: 'The Wheel of Fortune', sub: 'Variable Anomaly', desc: 'A true wildcard operating on their own unpredictable pattern. (Time: {sec}s, Clicks: {totalClicks}, Explored: {uniqueCards})' },

                prophesied: { title: 'The Nostalgic One', sub: 'Homesick Soul', desc: 'Immediately gravitated towards {lang}. (Time: {sec}s)' },
                pioneer: { title: 'The Unknown Pioneer', sub: 'Fearless Traveler', desc: 'Fearlessly stepped into a highly alien culture. (Selection: {lang}, Time: {sec}s)' },
                romantic: { title: 'The Hopeless Romantic', sub: 'Passionate Heart', desc: 'Eventually settled in an intensely passionate realm. (Selection: {lang}, Visited: {uniqueCards})' },
                order: { title: 'Guardian of Order', sub: 'Precision Machine', desc: 'Operated with machine-like minimum required effort. (Selection: {lang}, Clicks: {totalClicks})' },
                samurai: { title: 'The Sakura Samurai', sub: 'Patient Blade', desc: 'Waited in stillness before drawing the blade with finality. (Selection: {lang}, Wait: {sec}s)' },
                polar: { title: 'The Polar Bard', sub: 'Frost Singer', desc: 'Sampled many worlds to finally choose the frozen north. (Selection: {lang}, Sampled: {uniqueCards})' },
                shakespeare: { title: 'The Global Standard', sub: 'Default Path', desc: 'Instantly chose the most universally known path. (Selection: {lang}, Time: {sec}s)' },
                chance: { title: 'Believer in Chance', sub: 'Card Shark', desc: 'Pulled new cards exclusively without redundant clicks. (Clicks {totalClicks} = Checked {uniqueCards})' },

                m_firstStep: { title: 'First Step 👣', sub: 'Initiated', desc: 'Left your first mark on Mina\'s system. (Clicks: {totalClicks})' },
                m_spammer: { title: 'Click Spammer ⚡', sub: 'Overloader', desc: 'Almost induced a system overflow. ({totalClicks} clicks)' },
                m_doubleTap: { title: 'Double Tap 🎯', sub: 'Sniper', desc: 'Resolved fate in exactly {totalClicks} actions.' },
                m_safety: { title: 'Safety First 🛡️', sub: 'Cautious', desc: 'Checked exactly one alternative before committing. ({uniqueCards} seen)' },
                m_paranoid: { title: 'Paranoid 🕵️', sub: 'Hyper-skeptic', desc: 'Double checked everything redundantly. ({totalClicks} clicks on {uniqueCards} cards)' },
                m_speedrunner: { title: 'Speedrunner 🏃', sub: 'Swift', desc: 'Cleared the phase instantly. ({sec}s)' },
                m_marathon: { title: 'Marathoner ⏱️', sub: 'Endurance', desc: 'Lingered seemingly forever. ({sec}s)' },
                m_cautious: { title: 'Cautious Explorer 🗺️', sub: 'Cartographer', desc: 'Took their sweet time mapping the worlds. ({sec}s, {uniqueCards} domains)' },
                m_dualPersona: { title: 'The Dual Observer 🎭', sub: 'Two Faces', desc: 'Witnessed the coexistence of SEAN & Principal Conductor.' },
                keeper_of_rules: { title: 'Keeper of Rules ⚖️', sub: 'Awareness', desc: 'Internalized the rules of the multiverse.' }
            },
            minaSystem: "🎻 PRINCIPAL CONDUCTOR", minaAction: ">> 🎼 ACTION REQUIRED: SELECT A MULTIVERSE <<",
            inviting: "INVITING THE MULTIVERSE...", awaiting: "THE MANOR AWAITS YOUR SOUL'S VOYAGE.",
            tap: "TAP TO SELECT", sync: "SYNCHRONIZING", drag: "DRAG TO CENTER",
            harmonizing: "HARMONIZING", aligned: "ALIGNED"
        }
    },
    {
        id: 'es', name: 'Español', flag: '🇪🇸',
        image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop', // Madrid architecture
        welcome: "Bienvenido a Lord Manor. Los engranajes del destino esperan tu toque.",
        loading: "Consultando el Cronómetro...",
        ui: {
            tabGuide: 'GUÍA', tabArchive: 'ARCHIVO', guideHeader: '1. Idioma y Flujo', guideStep1: '1-1. Inicio y sincronización', guideStep2: '1-2. Brecha multiversal', guideStep3: '1-3. Selecciona tu frecuencia.', guideComplete: 'Completado', archiveTitle: 'Registros de Archivo', earned: 'OBTENIDOS', noRecords: 'No se encontraron registros.', exploreMore: 'Explora el multiverso para recopilar recuerdos.',
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

            badges: {
                lightspeed: { title: 'Ruptura de la Luz', sub: 'Beyond Velocity', desc: 'Pasó por puro instinto. (Tiempo: {sec}s, Cartas: {uniqueCards}, Clics: {totalClicks})' },
                wanderer: { title: 'Nómada Cósmico', sub: 'Lost in the Void', desc: 'Observó el vacío por más de 5 min. (Tiempo: {sec}s, Cartas: {uniqueCards})' },
                destroyer: { title: 'Destructor Manual', sub: 'System Bane', desc: 'Hizo clic de forma violenta. (Clics: {totalClicks}, Tiempo: {sec}s)' },
                indecision: { title: 'Maestro Indeciso', sub: 'Endless Debater', desc: 'Revisó todo y aún dudó. (Cartas: {uniqueCards}, Tiempo: {sec}s)' },
                razor: { title: 'Cuchilla Absoluta', sub: 'Surgical Precision', desc: 'Eligió un camino sin dudar. (Cartas: {uniqueCards}, Tiempo: {sec}s)' },
                silent: { title: 'Observador Silencioso', sub: 'Quiet Listener', desc: 'Casi no tocó nada, disfrutando de la música. (Clics: {totalClicks}, Tiempo: {sec}s)' },
                octopus: { title: 'Táctico Pulpo', sub: 'Thorough Explorer', desc: 'Examinó todas las opciones posibles. (Cartas: {uniqueCards})' },
                tester: { title: 'Probador del Sistema', sub: 'QA Nightmare', desc: 'Probó la resistencia de la interfaz. (Clics: {totalClicks})' },
                hermit: { title: 'Ermitaño Musical', sub: 'Audio Ascendant', desc: 'Retrasó su elección para escuchar. (Tiempo: {sec}s, Clics: {totalClicks})' },
                defier: { title: 'Desafiante del Destino', sub: 'Stubborn Anchor', desc: 'Interactuó obsesivamente con unas pocas mundos. (Clics: {totalClicks}, Cartas: {uniqueCards})' },
                loyal: { title: 'Agente Leal de SEAN', sub: 'By the Book', desc: 'Actuó exactamente como se esperaba. (Tiempo: {sec}s, Cartas: {uniqueCards})' },
                fortune: { title: 'Rueda de la Fortuna', sub: 'Variable Anomaly', desc: 'Un verdadero comodín con patrón propio. (Tiempo: {sec}s, Clics: {totalClicks}, Cartas: {uniqueCards})' },

                prophesied: { title: 'El Nostálgico', sub: 'Homesick Soul', desc: 'Gravitó inmediatamente hacia {lang}. (Tiempo: {sec}s)' },
                pioneer: { title: 'Pionero Desconocido', sub: 'Fearless Traveler', desc: 'Viajó valientemente a una cultura extraña. ({lang}, Tiempo: {sec}s)' },
                romantic: { title: 'El Romántico', sub: 'Passionate Heart', desc: 'Se instaló en un reino ardiente. ({lang}, Vistos: {uniqueCards})' },
                order: { title: 'Guardián del Orden', sub: 'Precision Machine', desc: 'Operó con precisión mecánica. ({lang}, {totalClicks} clics)' },
                samurai: { title: 'Samurái de Cerezo', sub: 'Patient Blade', desc: 'Esperó antes de desenfundar. ({lang}, Tiempo: {sec}s)' },
                polar: { title: 'Bardo Polar', sub: 'Frost Singer', desc: 'Miró las opciones y fue al norte helado. ({lang}, Vistos: {uniqueCards})' },
                shakespeare: { title: 'El Estándar', sub: 'Default Path', desc: 'Eligió el idioma más universal al instante. ({lang}, Tiempo: {sec}s)' },
                chance: { title: 'Creyente del Azar', sub: 'Card Shark', desc: 'Sacó cartas exclusivamente sin redundancias. (Clics {totalClicks} = Cartas {uniqueCards})' },

                m_firstStep: { title: 'Primer Paso 👣', sub: 'Initiated', desc: 'Tu primera marca en el sistema. ({totalClicks})' },
                m_spammer: { title: 'Spammer de Clics ⚡', sub: 'Overloader', desc: 'Casi fuerzas el sistema. ({totalClicks} clics)' },
                m_doubleTap: { title: 'Doble Toque 🎯', sub: 'Sniper', desc: 'Destino en {totalClicks} clics.' },
                m_safety: { title: 'Seguridad Primero 🛡️', sub: 'Cautious', desc: 'Viendo {uniqueCards} cartas.' },
                m_paranoid: { title: 'Paranoico 🕵️', sub: 'Hyper-skeptic', desc: 'Chequeo doble. ({totalClicks} clics / {uniqueCards} cartas)' },
                m_speedrunner: { title: 'Corredor Rápido 🏃', sub: 'Swift', desc: 'Acelerando... ({sec}s)' },
                m_marathon: { title: 'Maratonista ⏱️', sub: 'Endurance', desc: 'Una eternidad en el lobby. ({sec}s)' },
                m_cautious: { title: 'Explorador Cauto 🗺️', sub: 'Cartographer', desc: 'Mapeando. ({sec}s, {uniqueCards} zonas)' },
                m_dualPersona: { title: 'El Observador Dual 🎭', sub: 'Two Faces', desc: 'Presenció la coexistencia de SEAN y el Director Principal.' },
                keeper_of_rules: { title: 'Guardián de las Reglas ⚖️', sub: 'Awareness', desc: 'Ha internalizado las reglas del multiverso.' }
            },
            minaSystem: "🎻 DIRECTOR PRINCIPAL", minaAction: ">> 🎼 ACCIÓN REQUERIDA: SELECCIONA UN MULTIVERSO <<",
            inviting: "INVITANDO AL MULTIVERSO...", awaiting: "LA MANSIÓN ESPERA EL VIAJE DE TU ALMA.",
            tap: "TOCA PARA SELECCIONAR", sync: "SINCRONIZANDO", drag: "ARRASTRA AL CENTRO",
            harmonizing: "ARMONIZANDO", aligned: "ALINEADO"
        }
    },
    {
        id: 'hi', name: 'हिन्दी', flag: '🇮🇳',
        image: '/assets/images/countries/india_festival.png', // Indian Holi and Diwali festival fusion
        welcome: "लॉर्ड मैनर में आपका स्वागत है। भाग्य के पहिये आपकी प्रतीक्षा कर रहे हैं।",
        loading: "क्रोनोमीटर से परामर्श किया जा रहा है...",
        ui: {
            tabGuide: 'मार्गदर्शक', tabArchive: 'अभिलेखागार', guideHeader: '1. भाषा और प्रवाह', guideStep1: '1-1. सिस्टम बूट और सिंक', guideStep2: '1-2. मल्टीवर्स ब्रीच', guideStep3: '1-3. अपनी आवृत्ति चुनें।', guideComplete: 'पूरा', archiveTitle: 'अभिलेखागार रिकॉर्ड', earned: 'अर्जित', noRecords: 'कोई रिकॉर्ड नहीं मिला।', exploreMore: 'यादें इकट्ठा करने के लिए मल्टीवर्स खोजें।',
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

            badges: {
                lightspeed: { title: 'प्रकाश-गति', sub: 'Beyond Velocity', desc: 'अंतर्ज्ञान पर आधारित पारगमन। (समय: {sec}s, देखा: {uniqueCards}, क्लिक: {totalClicks})' },
                wanderer: { title: 'ब्रह्मांडीय घुमक्कड़', sub: 'Lost in the Void', desc: '5 मिनट से अधिक शून्य में। (समय: {sec}s, देखा: {uniqueCards})' },
                destroyer: { title: 'विनाशक', sub: 'System Bane', desc: 'लगातार क्लिक किया। (क्लिक: {totalClicks}, समय: {sec}s)' },
                indecision: { title: 'अनिर्णय के स्वामी', sub: 'Endless Debater', desc: 'सब जाँचा फिर भी हिचकिचाए। (देखा: {uniqueCards}, समय: {sec}s)' },
                razor: { title: 'सटीकता', sub: 'Surgical Precision', desc: 'बिना हिचकिचाहट चुना। (देखा: {uniqueCards}, समय: {sec}s)' },
                silent: { title: 'मौन श्रोता', sub: 'Quiet Listener', desc: 'कुछ नहीं छुआ, बस संगीत का आनंद लिया। (क्लिक: {totalClicks}, समय: {sec}s)' },
                octopus: { title: 'रणनीतिकार', sub: 'Thorough Explorer', desc: 'हर मल्टीवर्स की जाँच की। (देखा: {uniqueCards})' },
                tester: { title: 'परीक्षक', sub: 'QA Nightmare', desc: 'डेवलपर की तरह इंटरफ़ेस टेस्ट किया। (क्लिक: {totalClicks})' },
                hermit: { title: 'तपस्वी', sub: 'Audio Ascendant', desc: 'मेलोडी में खोये रहे। (समय: {sec}s, क्लिक: {totalClicks})' },
                defier: { title: 'विद्रोही', sub: 'Stubborn Anchor', desc: 'बस कुछ ही दुनिया जाँची। (क्लिक: {totalClicks}, देखा: {uniqueCards})' },
                loyal: { title: 'वफादार', sub: 'By the Book', desc: 'बिल्कुल सही तरीके से। (समय: {sec}s, देखा: {uniqueCards})' },
                fortune: { title: 'भाग्य का पहिया', sub: 'Variable Anomaly', desc: 'अप्रत्याशित व्यवहार। (समय: {sec}s, क्लिक: {totalClicks}, देखा: {uniqueCards})' },

                prophesied: { title: 'पुरानी यादें', sub: 'Homesick Soul', desc: '{lang} की ओर खिंचाव। (समय: {sec}s)' },
                pioneer: { title: 'अज्ञात पायनियर', sub: 'Fearless Traveler', desc: 'निर्भय होकर आगे बढ़े। ({lang}, समय: {sec}s)' },
                romantic: { title: 'रोमांटिक', sub: 'Passionate Heart', desc: 'जुनून वाले क्षेत्र में बसे। ({lang}, देखा: {uniqueCards})' },
                order: { title: 'व्यवस्था के रक्षक', sub: 'Precision Machine', desc: 'मशीन जैसा काम। ({lang}, {totalClicks} क्लिक)' },
                samurai: { title: 'समुराई', sub: 'Patient Blade', desc: 'शांत बैठ कर इंतज़ार किया। ({lang}, समय: {sec}s)' },
                polar: { title: 'गायक', sub: 'Frost Singer', desc: 'उत्तर का चयन। ({lang}, देखा: {uniqueCards})' },
                shakespeare: { title: 'मानक', sub: 'Default Path', desc: 'सबसे लोकप्रिय चयन। ({lang}, समय: {sec}s)' },
                chance: { title: 'संयोग', sub: 'Card Shark', desc: 'बिना दोबारा क्लिक किए कार्ड खींचे। (क्लिक {totalClicks} = देखा {uniqueCards})' },

                m_firstStep: { title: 'पहला कदम 👣', sub: 'Initiated', desc: 'पहला निशान छोड़ा। ({totalClicks} क्लिक)' },
                m_spammer: { title: 'तीव्र क्लिक ⚡', sub: 'Overloader', desc: 'सिस्टम ओवरफ्लो लगभग। ({totalClicks} क्लिक)' },
                m_doubleTap: { title: 'निशाना 🎯', sub: 'Sniper', desc: '{totalClicks} क्लिक में सब तय।' },
                m_safety: { title: 'सुरक्षा 🛡️', sub: 'Cautious', desc: 'बस एक विकल्प जाँचा। ({uniqueCards} कार्ड)' },
                m_paranoid: { title: 'संदेह 🕵️', sub: 'Hyper-skeptic', desc: 'सब कुछ दुबारा जाँचा। ({totalClicks} क्लिक / {uniqueCards} कार्ड)' },
                m_speedrunner: { title: 'दौड़ 🏃', sub: 'Swift', desc: 'तेज़ रफ़्तार। ({sec}s)' },
                m_marathon: { title: 'मैराथन ⏱️', sub: 'Endurance', desc: 'लंबे समय तक। ({sec}s)' },
                m_cautious: { title: 'खोजकर्ता 🗺️', sub: 'Cartographer', desc: 'आराम से खोजा। ({sec}s, {uniqueCards} दुनिया)' },
                m_dualPersona: { title: 'दोहरा पर्यवेक्षक 🎭', sub: 'Two Faces', desc: 'SEAN और प्रधान संवाहक दोनों को देखा।' },
                keeper_of_rules: { title: 'नियमों के रक्षक ⚖️', sub: 'Awareness', desc: 'मल्टीवर्स के नियमों को अपनाया।' }
            },
            minaSystem: "🎻 प्रधान संवाहक", minaAction: ">> 🎼 कार्रवाई आवश्यक: एक मल्टीवर्स चुनें <<",
            inviting: "मल्टीवर्स को आमंत्रित किया जा रहा है...", awaiting: "मैनर आपकी आत्मा की यात्रा की प्रतीक्षा कर रहा है。",
            tap: "चुनने के लिए टैप करें", sync: "सिंक्रनाइज़ कर रहा है", drag: "केंद्र में खींचें",
            harmonizing: "सामंजस्य", aligned: "संरेखित"
        }
    },
    {
        id: 'de', name: 'Deutsch', flag: '🇩🇪',
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop', // German Black Forest / Castle
        welcome: "Willkommen im Lord Manor. Die Zahnräder des Schicksals erwarten Sie.",
        loading: "Konsultiere das Chronometer...",
        ui: {
            tabGuide: 'LEITFADEN', tabArchive: 'ARCHIV', guideHeader: '1. Sprache & Ablauf', guideStep1: '1-1. Systemstart & Sync', guideStep2: '1-2. Multiversum-Riss', guideStep3: '1-3. Wähle deine Frequenz.', guideComplete: 'Abgeschlossen', archiveTitle: 'Archivaufzeichnungen', earned: 'VERDIENT', noRecords: 'Keine Aufzeichnungen gefunden.', exploreMore: 'Erkunde das Multiversum, um Erinnerungen zu sammeln.',
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

            badges: {
                lightspeed: { title: 'Lichtbrecher', sub: 'Beyond Velocity', desc: 'Passed through on instinct alone. (Time: {sec}s, Explored: {uniqueCards}, Clicks: {totalClicks})' },
                wanderer: { title: 'Kosmischer Wanderer', sub: 'Lost in the Void', desc: 'Observed the void for over 5 mins. (Time: {sec}s, Explored: {uniqueCards})' },
                destroyer: { title: 'Zerstörer', sub: 'System Bane', desc: 'Violently clicked through the UI. (Clicks: {totalClicks}, Time: {sec}s)' },
                indecision: { title: 'Meister der Unentschlossenheit', sub: 'Endless Debater', desc: 'Checked every option and hesitated. (Explored: {uniqueCards}, Time: {sec}s)' },
                razor: { title: 'Die Razor', sub: 'Surgical Precision', desc: 'Chose a single path without hesitation. (Explored: {uniqueCards}, Time: {sec}s)' },
                silent: { title: 'Stiller Beobachter', sub: 'Quiet Listener', desc: 'Touched almost nothing, purely listening. (Clicks: {totalClicks}, Time: {sec}s)' },
                octopus: { title: 'Der Oktopus-Taktiker', sub: 'Thorough Explorer', desc: 'Meticulously examined every multiverse. (Explored: {uniqueCards})' },
                tester: { title: 'Tester der Systeme', sub: 'QA Nightmare', desc: 'Stress-tested the interface like a developer. (Total Clicks: {totalClicks})' },
                hermit: { title: 'Der musikalische Einsiedler', sub: 'Audio Ascendant', desc: 'Delayed choice to bask in the melodies. (Time: {sec}s, Clicks: {totalClicks})' },
                defier: { title: 'Trotzer des Schicksals', sub: 'Stubborn Anchor', desc: 'Obsessively interacted with a narrow slice. (Clicks: {totalClicks}, Explored: {uniqueCards})' },
                loyal: { title: 'Loyaler Agent', sub: 'By the Book', desc: 'Acted exactly as intended. (Time: {sec}s, Explored: {uniqueCards})' },
                fortune: { title: 'Rad des Schicksals', sub: 'Variable Anomaly', desc: 'A true wildcard. (Time: {sec}s, Clicks: {totalClicks}, Explored: {uniqueCards})' },

                prophesied: { title: 'Der Nostalgiker', sub: 'Homesick Soul', desc: 'Immediately gravitated towards {lang}. (Time: {sec}s)' },
                pioneer: { title: 'Der Pionier', sub: 'Fearless Traveler', desc: 'Fearlessly stepped into an alien culture. (Selection: {lang}, Time: {sec}s)' },
                romantic: { title: 'Der Romantiker', sub: 'Passionate Heart', desc: 'Eventually settled in a passionate realm. (Selection: {lang}, Visited: {uniqueCards})' },
                order: { title: 'Wächter der Ordnung', sub: 'Precision Machine', desc: 'Operated with machine-like effort. (Selection: {lang}, Clicks: {totalClicks})' },
                samurai: { title: 'Der Sakura-Samurai', sub: 'Patient Blade', desc: 'Waited in stillness before drawing the blade. (Selection: {lang}, Wait: {sec}s)' },
                polar: { title: 'Der Polar-Barde', sub: 'Frost Singer', desc: 'Sampled many worlds for the frozen north. (Selection: {lang}, Sampled: {uniqueCards})' },
                shakespeare: { title: 'Der Standard', sub: 'Default Path', desc: 'Instantly chose the recognized path. (Selection: {lang}, Time: {sec}s)' },
                chance: { title: 'Der Glücksspieler', sub: 'Card Shark', desc: 'Pulled new cards exclusively. (Clicks {totalClicks} = Checked {uniqueCards})' },

                m_firstStep: { title: 'Erster Schritt 👣', sub: 'Initiated', desc: 'Left your first mark. (Clicks: {totalClicks})' },
                m_spammer: { title: 'Klick-Spammer ⚡', sub: 'Overloader', desc: 'Almost induced an overflow. ({totalClicks} clicks)' },
                m_doubleTap: { title: 'Doppeltipp 🎯', sub: 'Sniper', desc: 'Resolved fate in {totalClicks} actions.' },
                m_safety: { title: 'Sicherheit geht vor 🛡️', sub: 'Cautious', desc: 'Checked exactly one alternative. ({uniqueCards} seen)' },
                m_paranoid: { title: 'Paranoid 🕵️', sub: 'Hyper-skeptic', desc: 'Double checked redundantly. ({totalClicks} clicks / {uniqueCards} cards)' },
                m_speedrunner: { title: 'Speedrunner 🏃', sub: 'Swift', desc: 'Cleared instantly. ({sec}s)' },
                m_marathon: { title: 'Marathonläufer ⏱️', sub: 'Endurance', desc: 'Lingered forever. ({sec}s)' },
                m_cautious: { title: 'Vorsichtiger Entdecker 🗺️', sub: 'Cartographer', desc: 'Took time mapping the worlds. ({sec}s, {uniqueCards} domains)' },
                m_dualPersona: { title: 'Der Duale Beobachter 🎭', sub: 'Two Faces', desc: 'Zeuge der Koexistenz von SEAN und Chefdirigent.' },
                keeper_of_rules: { title: 'Hüter der Regeln ⚖️', sub: 'Awareness', desc: 'Hat die Regeln des Multiversums verinnerlicht.' }
            },
            minaSystem: "🎻 CHEFDIRIGENT", minaAction: ">> 🎼 AKTION ERFORDERLICH: WÄHLEN SIE EIN MULTIVERSUM <<",
            inviting: "LADE DAS MULTIVERSUM EIN...", awaiting: "DAS ANWESEN ERWARTET DIE REISE IHRER SEELE.",
            tap: "ZUM AUSWÄHLEN TIPPEN", sync: "SYNCHRONISIERE", drag: "ZUR MITTE ZIEHEN",
            harmonizing: "HARMONISIERUNG", aligned: "AUSGERICHTET"
        }
    },
    {
        id: 'ja', name: '日本語', flag: '🇯🇵',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', // Kyoto temples / Japan
        welcome: "ロード・マナーへようこそ。運命の歯車があなたを待っています。",
        loading: "クロノメーターを照合中...",
        ui: {
            tabGuide: 'ガイド', tabArchive: 'アーカイブ', guideHeader: '1. 言語とフロー', guideStep1: '1-1. システム起動と同期', guideStep2: '1-2. マルチバース突破', guideStep3: '1-3. 周波数を選択してください。', guideComplete: '完了', archiveTitle: 'アーカイブ記録', earned: '獲得', noRecords: '記録が見つかりません。', exploreMore: 'マルチバースを探索して記憶を集めましょう。',
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

            badges: {
                lightspeed: { title: '光速の突破者', sub: 'The Light-Speed Breaker', desc: '直感のみで突破した。(時間: {sec}秒, 探索: {uniqueCards}個, クリック: {totalClicks}回)' },
                wanderer: { title: '宇宙の放浪者', sub: 'The Cosmic Wanderer', desc: '5分以上虚空を彷徨った。(時間: {sec}秒, 探索: {uniqueCards}個)' },
                destroyer: { title: 'マニュアル破壊者', sub: 'The Manual Destroyer', desc: '狂気で画面を切り刻んだ。(クリック: {totalClicks}回, 時間: {sec}秒)' },
                indecision: { title: '優柔不断の化身', sub: 'Master of Indecision', desc: '全て見てから悩み続けた。(探索: {uniqueCards}個, 時間: {sec}秒)' },
                razor: { title: '断固たる決断力', sub: 'The Absolute Razor', desc: '踌躇なく選択した。(探索: 僅か {uniqueCards}個, 時間: {sec}秒)' },
                silent: { title: '沈黙の観察者', sub: 'The Silent Observer', desc: '何も触れず、ただ音楽を楽しんだ。(クリック: {totalClicks}回, 時間: {sec}秒)' },
                octopus: { title: '八方美人', sub: 'The Octopus Tactician', desc: '全ての宇宙を隅々まで確認した。(探索済: {uniqueCards}個)' },
                tester: { title: 'システムを試す者', sub: 'Tester of Systems', desc: '破壊する勢いでシステムを試した。(合計: {totalClicks}回)' },
                hermit: { title: '音楽の仙人', sub: 'The Musical Hermit', desc: '選択を後回しにメロディに身を任せた。(時間: {sec}秒, クリック: {totalClicks}回)' },
                defier: { title: '運命に逆らう者', sub: 'Defier of Fate', desc: '狭い世界に執着して何度も触れた。(クリック: {totalClicks}回, 探索: {uniqueCards}個)' },
                loyal: { title: 'SEANの優秀エージェント', sub: 'SEAN\'s Loyal Agent', desc: '設計通りに完璧に動いた。(時間: {sec}秒, 探索: {uniqueCards}個)' },
                fortune: { title: '運命の輪', sub: 'The Wheel of Fortune', desc: '不規則なパターンで動く変数。(時間: {sec}秒, クリック: {totalClicks}回, 探索: {uniqueCards}個)' },

                prophesied: { title: '郷愁に駆られる者', sub: 'The Nostalgic One', desc: '故郷を求めるように{lang}を選んだ。(時間: {sec}秒)' },
                pioneer: { title: '未知の開拓者', sub: 'The Unknown Pioneer', desc: '見知らぬ異国へ足を踏み入れた。(選択: {lang}, 時間: {sec}秒)' },
                romantic: { title: 'ロマンチスト', sub: 'The Hopeless Romantic', desc: '情熱的な世界に定住した。(選択: {lang}, 探索: {uniqueCards}個)' },
                order: { title: '秩序の守護者', sub: 'Guardian of Order', desc: '機械のように必要最低限の操作。(選択: {lang}, {totalClicks}回のクリック)' },
                samurai: { title: '桜の武士', sub: 'The Sakura Samurai', desc: 'じっと待った後、断固として刀を抜いた。(選択: {lang}, 待機: {sec}秒)' },
                polar: { title: '白夜の吟遊詩人', sub: 'The Polar Bard', desc: '多くの世界を見て北の地へ向かった。(選択: {lang}, 回った世界: {uniqueCards}個)' },
                shakespeare: { title: 'グローバルスタンダード', sub: 'The Global Standard', desc: '無難に世界公用語を選んだ。(選択: {lang}, 悩み: {sec}秒)' },
                chance: { title: '幸運を信じる者', sub: 'Believer in Chance', desc: '無駄な操作なく新カードを引き続けた。(クリック {totalClicks} = 探索 {uniqueCards})' },

                m_firstStep: { title: '最初の一歩 👣', sub: 'First Step', desc: '痕跡を残した。(クリック: {totalClicks}回)' },
                m_spammer: { title: '連続クリック魔 ⚡', sub: 'Click Spammer', desc: 'システムに負荷をかける連打。({totalClicks}回)' },
                m_doubleTap: { title: 'ダブルタップ 🎯', sub: 'Double Tap', desc: 'たった{totalClicks}回の操作で決心した。' },
                m_safety: { title: '安全第一 🛡️', sub: 'Safety First', desc: '1つだけ比較して決定した。(見たカード: {uniqueCards}個)' },
                m_paranoid: { title: '疑心暗鬼 🕵️', sub: 'Paranoid', desc: '何度も重複して確認した。({uniqueCards}個を{totalClicks}回操作)' },
                m_speedrunner: { title: 'スピードランナー 🏃', sub: 'Speedrunner', desc: '光の速さで通過。({sec}秒)' },
                m_marathon: { title: 'マラソンランナー ⏱️', sub: 'Marathoner', desc: '永遠に彷徨った。({sec}秒)' },
                m_cautious: { title: '慎重な探検家 🗺️', sub: 'Cautious Explorer', desc: '時間をかけてマッピングした。({sec}秒, {uniqueCards}個)' },
                m_dualPersona: { title: '二つの顔の観察者 🎭', sub: 'Two Faces', desc: 'SEANと首席指揮者の共存を目撃した。' },
                keeper_of_rules: { title: 'ルールの守護者 ⚖️', sub: 'Awareness', desc: 'マルチバースの原則を理解した。' }
            },
            minaSystem: "🎻 首席指揮者", minaAction: ">> 🎼 アクション要求：マルチバースを選択してください <<",
            inviting: "マルチバースを招待中...", awaiting: "館があなたの魂の旅立ちを待っています。",
            tap: "タップして選択", sync: "同期中", drag: "中央へドラッグ",
            harmonizing: "同期中", aligned: "同期完了"
        }
    },
    {
        id: 'ar', name: 'العربية', flag: '🇸🇦',
        image: '/assets/images/countries/arab_festival.png', // Vibrant Arab street market lantern festival
        welcome: "مرحبًا بكم في لورد مانور. تروس القدر في انتظار لمستك.",
        loading: "استشارة الكرونومتر...",
        ui: {
            tabGuide: 'دليل', tabArchive: 'أرشيف', guideHeader: '1. اللغة والمسار', guideStep1: '1-1. تمهيد النظام والمزامنة', guideStep2: '1-2. اختراق الأكوان المتعددة', guideStep3: '1-3. اختر التردد الخاص بك.', guideComplete: 'مكتمل', archiveTitle: 'سجلات الأرشيف', earned: 'مكتسب', noRecords: 'لم يتم العثور على سجلات.', exploreMore: 'استكشف الأكوان المتعددة لجمع الذكريات.',
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

            badges: {
                lightspeed: { title: 'سرعة الضوء', sub: 'Beyond Velocity', desc: 'Passed through on instinct alone. (Time: {sec}s, Cards: {uniqueCards}, Clicks: {totalClicks})' },
                wanderer: { title: 'متجول فلكي', sub: 'Lost in the Void', desc: 'Observed the void for over 5 minutes. (Time: {sec}s, Cards: {uniqueCards})' },
                destroyer: { title: 'المدمر', sub: 'System Bane', desc: 'Violently clicked. (Clicks: {totalClicks}, Time: {sec}s)' },
                indecision: { title: 'متردد', sub: 'Endless Debater', desc: 'Checked every option and hesitated. (Cards: {uniqueCards}, Time: {sec}s)' },
                razor: { title: 'قاطع', sub: 'Surgical Precision', desc: 'Chose a single path instantly. (Cards: {uniqueCards}, Time: {sec}s)' },
                silent: { title: 'المراقب الصامت', sub: 'Quiet Listener', desc: 'Touched nothing, enjoyed music. (Clicks: {totalClicks}, Time: {sec}s)' },
                octopus: { title: 'تكتيكي', sub: 'Thorough Explorer', desc: 'Meticulously examined all. (Cards: {uniqueCards})' },
                tester: { title: 'فاحص', sub: 'QA Nightmare', desc: 'Stress-tested the interface. (Clicks: {totalClicks})' },
                hermit: { title: 'الناسك', sub: 'Audio Ascendant', desc: 'Delayed choice to bask in music. (Time: {sec}s, Clicks: {totalClicks})' },
                defier: { title: 'المتحدي', sub: 'Stubborn Anchor', desc: 'Obsessively interacted with few. (Clicks: {totalClicks}, Cards: {uniqueCards})' },
                loyal: { title: 'عميل مخلص', sub: 'By the Book', desc: 'Acted as seamlessly as intended. (Time: {sec}s, Cards: {uniqueCards})' },
                fortune: { title: 'عجلة الحظ', sub: 'Variable Anomaly', desc: 'A true wildcard. (Time: {sec}s, Clicks: {totalClicks}, Cards: {uniqueCards})' },

                prophesied: { title: 'حنين', sub: 'Homesick Soul', desc: 'Immediately gravitated towards {lang}. (Time: {sec}s)' },
                pioneer: { title: 'رائد مجهول', sub: 'Fearless Traveler', desc: 'Stepped into alien culture. (Selection: {lang}, Time: {sec}s)' },
                romantic: { title: 'رومانسي', sub: 'Passionate Heart', desc: 'Settled in passionate realm. ({lang}, Visited: {uniqueCards})' },
                order: { title: 'حارس النظام', sub: 'Precision Machine', desc: 'Operated natively. (Selection: {lang}, {totalClicks} clicks)' },
                samurai: { title: 'ساموراي', sub: 'Patient Blade', desc: 'Waited before drawing blade. ({lang}, Wait: {sec}s)' },
                polar: { title: 'شاعر قطبي', sub: 'Frost Singer', desc: 'Sampled worlds then chose north. ({lang}, Sampled: {uniqueCards})' },
                shakespeare: { title: 'المعيار العالمي', sub: 'Default Path', desc: 'Instantly chose known path. ({lang}, Time: {sec}s)' },
                chance: { title: 'مؤمن بالفرصة', sub: 'Card Shark', desc: 'Pulled new cards without redundancy. (Clicks {totalClicks} = Checked {uniqueCards})' },

                m_firstStep: { title: 'مرحلة أولى 👣', sub: 'Initiated', desc: 'Left first mark. (Clicks: {totalClicks})' },
                m_spammer: { title: 'مسترسل ⚡', sub: 'Overloader', desc: 'Almost induced overflow. ({totalClicks} clicks)' },
                m_doubleTap: { title: 'نقرة مزدوجة 🎯', sub: 'Sniper', desc: 'Fate in {totalClicks} actions.' },
                m_safety: { title: 'أمان 🛡️', sub: 'Cautious', desc: 'Checked one alternative. ({uniqueCards} seen)' },
                m_paranoid: { title: 'مذعور 🕵️', sub: 'Hyper-skeptic', desc: 'Double checked everything. ({totalClicks} clicks / {uniqueCards} cards)' },
                m_speedrunner: { title: 'سريع 🏃', sub: 'Swift', desc: 'Cleared instantly. ({sec}s)' },
                m_marathon: { title: 'ماراثون ⏱️', sub: 'Endurance', desc: 'Lingered forever. ({sec}s)' },
                m_cautious: { title: 'مستكشف حذر 🗺️', sub: 'Cartographer', desc: 'Mapping worlds. ({sec}s, {uniqueCards} domains)' },
                m_dualPersona: { title: 'مراقب مزدوج 🎭', sub: 'Two Faces', desc: 'شهد تعايش SEAN والمايسترو.' },
                keeper_of_rules: { title: 'حارس القواعد ⚖️', sub: 'Awareness', desc: 'أدرك قواعد الأكوان المتعددة.' }
            },
            minaSystem: "🎻 المايسترو الرئيسي", minaAction: ">> 🎼 الإجراء المطلوب: حدد كونًا متعددًا <<",
            inviting: "دعوة الأكوان المتعددة...", awaiting: "القصر ينتظر رحلة روحك.",
            tap: "اضغط للاختيار", sync: "مزامنة", drag: "اسحب للمركز",
            harmonizing: "تناغم", aligned: "محاذاة"
        }
    },
    {
        id: 'pl', name: 'Polski', flag: '🇵🇱',
        image: '/assets/images/countries/poland_festival.png', // Polish traditional festival in Kraków market square
        welcome: "Witamy w Lord Manor. Tryby przeznaczenia czekają na twój dotyk.",
        loading: "Konsultacja z Chronometrem...",
        ui: {
            tabGuide: 'PRZEWODNIK', tabArchive: 'ARCHIWUM', guideHeader: '1. Język i Przepływ', guideStep1: '1-1. Rozruch systemu i synchronizacja', guideStep2: '1-2. Wyłom w multiwersum', guideStep3: '1-3. Wybierz swoją częstotliwość.', guideComplete: 'Zakończono', archiveTitle: 'Zapisy Archiwalne', earned: 'ZDOBYTE', noRecords: 'Nie znaleziono zapisów.', exploreMore: 'Eksploruj multiwersum, aby zbierać wspomnienia.',
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

            badges: {
                lightspeed: { title: 'Prędkość Światła', sub: 'Beyond Velocity', desc: 'Zrobił to instynktownie. (Czas: {sec}s, Odkryto: {uniqueCards}, Kliknięcia: {totalClicks})' },
                wanderer: { title: 'Kosmiczny Wędrowiec', sub: 'Lost in the Void', desc: 'Obserwował pustkę przez 5 minut. (Czas: {sec}s, Odkryto: {uniqueCards})' },
                destroyer: { title: 'Niszczyciel', sub: 'System Bane', desc: 'Szaleńczo klikał. (Kliknięcia: {totalClicks}, Czas: {sec}s)' },
                indecision: { title: 'Arcymistrz Niezdecydowania', sub: 'Endless Debater', desc: 'Sprawdził wszystko i wciąż się wahał. (Odkryto: {uniqueCards}, Czas: {sec}s)' },
                razor: { title: 'Absolutna Brzytwa', sub: 'Surgical Precision', desc: 'Wybrał drogę bez wahania. (Odkryto: {uniqueCards}, Czas: {sec}s)' },
                silent: { title: 'Cichy Obserwator', sub: 'Quiet Listener', desc: 'Nic nie dotykał, tylko słuchał. (Kliknięcia: {totalClicks}, Czas: {sec}s)' },
                octopus: { title: 'Ośmiornica', sub: 'Thorough Explorer', desc: 'Sprawdził każde możliwe multiwersum (Odkryto: {uniqueCards})' },
                tester: { title: 'Tester Systemów', sub: 'QA Nightmare', desc: 'Stresował system uderzeniami. (Kliknięcia: {totalClicks})' },
                hermit: { title: 'Muzyczny Pustelnik', sub: 'Audio Ascendant', desc: 'Zwlekał z wyborem, by słuchać. (Czas: {sec}s, Kliknięcia: {totalClicks})' },
                defier: { title: 'Buntownik Losu', sub: 'Stubborn Anchor', desc: 'Uparta interakcja z kilkoma światami. (Kliknięcia: {totalClicks}, Odkryto: {uniqueCards})' },
                loyal: { title: 'Lojalny Agent SEAN', sub: 'By the Book', desc: 'Działał dokładnie wedle przewidywań. (Czas: {sec}s, Odkryto: {uniqueCards})' },
                fortune: { title: 'Koło Fortuny', sub: 'Variable Anomaly', desc: 'Prawdziwa anomalia. (Czas: {sec}s, Kliknięcia: {totalClicks}, Odkryto: {uniqueCards})' },

                prophesied: { title: 'Nostalgik', sub: 'Homesick Soul', desc: 'Natychmiast poleciał w stronę: {lang}. (Czas: {sec}s)' },
                pioneer: { title: 'Nieznany Pionier', sub: 'Fearless Traveler', desc: 'Nieulękniony podróżnik. (Wybór: {lang}, Czas: {sec}s)' },
                romantic: { title: 'Beznadziejny Romantyk', sub: 'Passionate Heart', desc: 'Zatrzymał się w wielkiej namiętności. (Wybór: {lang}, Odkryto: {uniqueCards})' },
                order: { title: 'Strażnik Porządku', sub: 'Precision Machine', desc: 'Precyzja maszyny z minimalnym wkładem. (Wybór: {lang}, {totalClicks} kliknięcia)' },
                samurai: { title: 'Samuraj Wiśni', sub: 'Patient Blade', desc: 'Czekał cicho przed ruchem ostrza. (Wybór: {lang}, Czas: {sec}s)' },
                polar: { title: 'Polarny Bard', sub: 'Frost Singer', desc: 'Zobaczył wiele, by osiąść na północy. (Wybór: {lang}, Odkryto: {uniqueCards})' },
                shakespeare: { title: 'Globalny Standard', sub: 'Default Path', desc: 'Szybki powrót do normy. (Wybór: {lang}, Czas: {sec}s)' },
                chance: { title: 'Wyznawca Szansy', sub: 'Card Shark', desc: 'Odkrywał same nowości bez dubli. (Kliknięcia {totalClicks} = Odkrycia {uniqueCards})' },

                m_firstStep: { title: 'Pierwszy Krok 👣', sub: 'Initiated', desc: 'Zostawił swój znak dłoni. (Kliknięcia: {totalClicks})' },
                m_spammer: { title: 'Spammer Kliknięć ⚡', sub: 'Overloader', desc: 'Prawie przeciążył serwer. ({totalClicks} kliknięć)' },
                m_doubleTap: { title: 'Podwójny Stuk 🎯', sub: 'Sniper', desc: 'Zdefiniował los używając {totalClicks} akcji.' },
                m_safety: { title: 'Bezpieczeństwo Przede Wszystkim 🛡️', sub: 'Cautious', desc: 'Sprawdził tylko jedną opcję zanim wybrał. ({uniqueCards} odkryte)' },
                m_paranoid: { title: 'Paranoik 🕵️', sub: 'Hyper-skeptic', desc: 'Sprawdzał wszystko podwójnie. ({totalClicks} klik, {uniqueCards} kart)' },
                m_speedrunner: { title: 'Speedrunner 🏃', sub: 'Swift', desc: 'Szybciej niż światło. ({sec}s)' },
                m_marathon: { title: 'Maratończyk ⏱️', sub: 'Endurance', desc: 'Został na zawsze. ({sec}s)' },
                m_cautious: { title: 'Ostrożny Odkrywca 🗺️', sub: 'Cartographer', desc: 'Zmapował wszystkie obszary. ({sec}s, {uniqueCards} domeny)' },
                m_dualPersona: { title: 'Podwójny Obserwator 🎭', sub: 'Two Faces', desc: 'Był świadkiem współistnienia SEAN i Głównego Dyrygenta.' },
                keeper_of_rules: { title: 'Strażnik Zasad ⚖️', sub: 'Awareness', desc: 'Zrozumiał zasady multiwersum.' }
            },
            minaSystem: "🎻 GŁÓWNY DYRYGENT", minaAction: ">> 🎼 WYMAGANE DZIAŁANIE: WYBIERZ MULTIWERSUM <<",
            inviting: "ZAPRASZANIE MULTIWERSUM...", awaiting: "DWÓR CZEKA NA PODRÓŻ TWOJEJ DUSZY.",
            tap: "DOTKNIJ ABY WYBRAĆ", sync: "SYNCHRONIZACJA", drag: "PRZECIĄGNIJ DO ŚRODKA",
            harmonizing: "HARMONIZACJA", aligned: "WYRÓWNANE"
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

        // Bail out explicitly and correctly here as well to avoid calling the dispatcher unnecessarily
        const newBadges = calculated.filter(b => !earnedBadges.some(eb => eb.id === b.id));
        if (newBadges.length > 0) {
            onEarnBadge(newBadges);
        }
    }, [metrics.totalClicks, metrics.uniqueCards, metrics.timeSpentMs, selectedLang?.id, onEarnBadge, earnedBadges]);

    return (
        <motion.div
            key="coming-soon-wrapper"
            initial={{ opacity: 1, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[99999] bg-gradient-to-t from-black via-black/80 to-transparent w-full h-full flex flex-col items-center justify-start py-20 px-4 md:px-8 text-center overflow-y-auto overflow-x-hidden custom-scrollbar pointer-events-auto"
            style={{ minHeight: '100%' }}
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
                        {(() => {
                            let displayTitle = "Analyzing...";
                            if (primaryArchetype && selectedLang?.ui?.badges) {
                                const def = selectedLang.ui.badges[primaryArchetype.id];
                                if (def) {
                                    let localizedTitle = def.title;
                                    let localizedSub = def.sub || def.title;
                                    if (primaryArchetype.vars) {
                                        Object.entries(primaryArchetype.vars).forEach(([k, v]) => {
                                            localizedTitle = localizedTitle.replace(`{${k}}`, v);
                                            localizedSub = localizedSub.replace(`{${k}}`, v);
                                        });
                                    }
                                    displayTitle = `${selectedLang?.ui?.titleEarned || "NEW TITLE ACQUIRED"}: [ ${selectedLang?.id === 'ko' ? localizedTitle : localizedSub} ]`;
                                }
                            }
                            return (
                                <MinaDirective
                                    isVisible={true}
                                    activeStep="coming_soon"
                                    text={displayTitle}
                                    position="relative"
                                    interactionMode="passive"
                                    badges={earnedBadges}
                                    sysName={selectedLang?.ui?.minaSystem || "SEAN'S COMMENT"}
                                />
                            );
                        })()}
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


// Removed MultiverseGrid component definition per Phase 1 refactoring
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

    const handleEarnBadge = useCallback((newBadges) => {
        setEarnedBadges(prev => {
            const existingIds = new Set(prev.map(b => b.id));
            const toAdd = newBadges.filter(b => !existingIds.has(b.id));
            if (toAdd.length === 0) return prev;
            return [...toAdd, ...prev];
        });
    }, []);

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
    const [audioCache, setAudioCache] = useState({});

    // --- NEW: Phase 1.5 Path Selection ---
    const [showPathSelection, setShowPathSelection] = useState(false);
    const [selectedPath, setSelectedPath] = useState(null);

    // --- NEW: Phase 3 WIP State ---
    const [isWipReached, setIsWipReached] = useState(false);

    const handleWipReached = () => {
        if (isWipReached) return;
        setIsWipReached(true);

        const duckDuration = 2000;
        const duckTo = 0.2; // 20% of base

        const hasTheme = AudioManager.currentTheme && !AudioManager.currentTheme.paused;
        const hasMain = AudioManager.mainTheme && !AudioManager.mainTheme.paused;

        if (hasTheme || hasMain) {
            if (AudioManager.duckInterval) clearInterval(AudioManager.duckInterval);
            if (AudioManager.restoreInterval) clearInterval(AudioManager.restoreInterval);

            const duckThemeVolume = (AudioManager.baseThemeVolume || 0.15) * duckTo;
            const duckMainVolume = (AudioManager.baseMainThemeVolume || 0.20) * duckTo;

            let currentThemeVol = hasTheme ? AudioManager.currentTheme.volume : 0;
            let currentMainVol = hasMain ? AudioManager.mainTheme.volume : 0;
            let currentStep = 0;
            const steps = 40;

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
                }
            }, duckDuration / steps);
        }

        // Speak WIP message
        const ttsText = "훌륭한 선택입니다만, 아쉽게도 해당 차원의 건축이 아직 진행 중입니다. 조금만 더 기다려 주시죠.";
        speakText(
            ttsText,
            selectedLang?.name || '한국어',
            selectedLang?.voice || 'ko',
            apiKey,
            audioCache,
            setAudioCache,
            () => {
                // Restore audio
                const restoreDuration = 3000;
                const steps = 60;
                let currentStep = 0;

                if (hasTheme || hasMain) {
                    let volTheme = hasTheme ? AudioManager.currentTheme.volume : 0;
                    let volMain = hasMain ? AudioManager.mainTheme.volume : 0;

                    AudioManager.restoreInterval = setInterval(() => {
                        if (currentStep < steps) {
                            if (hasTheme && AudioManager.currentTheme) {
                                volTheme += ((AudioManager.baseThemeVolume || 0.15) - volTheme) / (steps - currentStep);
                                AudioManager.currentTheme.volume = Math.max(0, Math.min(1, volTheme));
                            }
                            if (hasMain && AudioManager.mainTheme) {
                                volMain += ((AudioManager.baseMainThemeVolume || 0.20) - volMain) / (steps - currentStep);
                                AudioManager.mainTheme.volume = Math.max(0, Math.min(1, volMain));
                            }
                            currentStep++;
                        } else {
                            clearInterval(AudioManager.restoreInterval);
                        }
                    }, restoreDuration / steps);
                }
            }
        ).catch(err => console.error("WIP TTS Failed:", err));
    };



    // Watch for keeper_of_rules badge (AWARENESS closed)
    useEffect(() => {
        if (earnedBadges.some(b => b.id === 'keeper_of_rules') && !selectedPath && !showPathSelection) {
            setShowPathSelection(true);

            // [Audio Ducking]
            const duckDuration = 2000;
            const duckTo = 0.2; // 20% of base

            const hasTheme = AudioManager.currentTheme && !AudioManager.currentTheme.paused;
            const hasMain = AudioManager.mainTheme && !AudioManager.mainTheme.paused;

            if (hasTheme || hasMain) {
                if (AudioManager.duckInterval) clearInterval(AudioManager.duckInterval);
                if (AudioManager.restoreInterval) clearInterval(AudioManager.restoreInterval);

                const duckThemeVolume = (AudioManager.baseThemeVolume || 0.15) * duckTo;
                const duckMainVolume = (AudioManager.baseMainThemeVolume || 0.20) * duckTo;

                let currentThemeVol = hasTheme ? AudioManager.currentTheme.volume : 0;
                let currentMainVol = hasMain ? AudioManager.mainTheme.volume : 0;
                let currentStep = 0;
                const steps = 40;

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
                    }
                }, duckDuration / steps);
            }

            // Speak warning
            const ttsText = "AWARENESS 규칙은 확인하셨습니까. 이제 당신의 템포를 증명할 시간입니다. 다음 차원을 향한 투표를 진행하시겠습니까, 아니면 저택의 게임에 참여하시겠습니까?";
            speakText(
                ttsText,
                selectedLang?.name || '한국어',
                selectedLang?.voice || 'ko',
                apiKey,
                audioCache,
                setAudioCache,
                () => {
                    // Restore audio after speech completes
                    const restoreDuration = 3000;
                    const steps = 60;
                    let currentStep = 0;

                    if (hasTheme || hasMain) {
                        let volTheme = hasTheme ? AudioManager.currentTheme.volume : 0;
                        let volMain = hasMain ? AudioManager.mainTheme.volume : 0;

                        AudioManager.restoreInterval = setInterval(() => {
                            if (currentStep < steps) {
                                if (hasTheme && AudioManager.currentTheme) {
                                    volTheme += ((AudioManager.baseThemeVolume || 0.15) - volTheme) / (steps - currentStep);
                                    AudioManager.currentTheme.volume = Math.max(0, Math.min(1, volTheme));
                                }
                                if (hasMain && AudioManager.mainTheme) {
                                    volMain += ((AudioManager.baseMainThemeVolume || 0.20) - volMain) / (steps - currentStep);
                                    AudioManager.mainTheme.volume = Math.max(0, Math.min(1, volMain));
                                }
                                currentStep++;
                            } else {
                                clearInterval(AudioManager.restoreInterval);
                            }
                        }, restoreDuration / steps);
                    }
                }
            ).catch(err => {
                console.error("TTS Failed:", err);
            });
        }
    }, [earnedBadges, selectedPath, showPathSelection, selectedLang, apiKey, audioCache]);

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

    // Legacy bgmRef and bgmVol (manor-ambience) removed to allow the newly selected 
    // multiversal language theme song to correctly persist continuously through Phase 2 & Dashboard.

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
                    preFetchVoice(selectedLang?.ui?.todoDone, selectedLang?.name, selectedLang?.voice, apiKey, audioCache, setAudioCache);
                }
            }, 30);
            return () => clearInterval(timer);
        }
    }, [viewMode, userAvatar]);

    // Extracted callGemini, speakText, pcmToWav to /src/services/

    // [V19] Consolidated Language Selection Logic
    const handleLanguageSelect = useCallback((lang) => {
        setSelectedLang(lang);
        // We no longer route away; Phase 1/2 keeps us on LanguageSelector screen
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
            const loreResult = await callGemini({ contents: [{ parts: [{ text: prompt }] }] }, apiKey);
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
            }, apiKey);
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
                                    <LanguageSelector
                                        LANGUAGES={LANGUAGES}
                                        handleLanguageSelect={handleLanguageSelect}
                                        setSpiritHint={setSpiritHint}
                                        cardsExplored={cardsExplored}
                                        setCardsExplored={setCardsExplored}
                                        isMinaSpeaking={isMinaSpeaking}
                                        earnedBadges={earnedBadges}
                                        onEarnBadge={handleEarnBadge}
                                        AudioManager={AudioManager}
                                        MinaDirective={MinaDirective}
                                        calculateArchetype={calculateArchetype}
                                        selectedPath={selectedPath}
                                        isWipReached={isWipReached}
                                        onWipReached={handleWipReached}
                                    />
                                )}
                                {step === 'confirm' && (
                                    <ConfirmView selectedLang={selectedLang} confirmLanguage={confirmLanguage} theme={currentTheme} />
                                )}
                                {/* {step === 'multiverse_grid' && (
                                    <MultiverseGrid
                                        selectedLang={selectedLang}
                                        currentTheme={currentTheme}
                                        setStep={setStep}
                                        setViewMode={setViewMode}
                                    />
                                )} */}
                                {/* ComingSoonView is preserved but functionally bypassed per Phase 1 */}
                                {/* {step === 'coming_soon' && (
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
                                        onEarnBadge={handleEarnBadge}
                                        earnedBadges={earnedBadges}
                                    />
                                )} */}
                                {/* More steps would follow, refactored to use currentTheme classes */}
                                {step === 'intro' && (
                                    <IntroEngraveView
                                        selectedLang={selectedLang}
                                        userName={userName}
                                        setUserName={setUserName}
                                        generateTextCharacter={generateTextCharacter}
                                        isAvatarGenerating={isAvatarGenerating}
                                        handleImageUpload={handleImageUpload}
                                        uploadedImage={uploadedImage}
                                        generateCharacter={generateCharacter}
                                        playSfx={playSfx}
                                        THEME_CONFIG={THEME_CONFIG}
                                    />
                                )}
                                {/* --- NEW: Phase 1.5 Path Selection UI --- */}
                                <AnimatePresence>
                                    {showPathSelection && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 1.5, ease: "easeInOut" }}
                                            className="fixed inset-0 z-[60000] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-8"
                                            style={{ minHeight: '100dvh' }}
                                        >
                                            {/* Ethereal Glow */}
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(197,160,89,0.1)_0%,_transparent_60%)] pointer-events-none" />

                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.0, duration: 1.0 }}
                                                className="flex flex-col items-center max-w-2xl w-full gap-8 z-10"
                                            >
                                                <div className="flex flex-col items-center gap-4 text-center">
                                                    <span className="text-[#C5A059] font-serif italic text-lg md:text-xl tracking-wide">Select your divergence</span>
                                                    <h2 className="text-[#FDFCF0] font-serif text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[0.2em] drop-shadow-[0_0_20px_rgba(197,160,89,0.4)]">
                                                        THE CROSSROADS
                                                    </h2>
                                                </div>

                                                <div className="flex flex-col sm:flex-row gap-6 w-full mt-6 justify-center">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05, borderColor: "rgba(197,160,89,0.8)", boxShadow: "0 0 30px rgba(197,160,89,0.2)" }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            AudioManager.playSfx('click', 0.6);
                                                            setSelectedPath('vote');
                                                            setShowPathSelection(false);
                                                        }}
                                                        className="flex-1 py-10 px-6 border border-[#C5A059]/30 bg-black/40 backdrop-blur-md rounded-lg flex flex-col items-center gap-4 transition-all group"
                                                    >
                                                        <LucideMapPin className="text-[#C5A059] opacity-70 group-hover:opacity-100 transition-opacity" size={32} />
                                                        <span className="text-[#FDFCF0] font-serif uppercase tracking-[0.3em] font-bold text-sm md:text-md">
                                                            컨텐츠 투표
                                                        </span>
                                                    </motion.button>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05, borderColor: "rgba(197,160,89,0.8)", boxShadow: "0 0 30px rgba(197,160,89,0.2)" }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            AudioManager.playSfx('click', 0.6);
                                                            setSelectedPath('game');
                                                            setShowPathSelection(false);
                                                        }}
                                                        className="flex-1 py-10 px-6 border border-[#C5A059]/30 bg-black/40 backdrop-blur-md rounded-lg flex flex-col items-center gap-4 transition-all group"
                                                    >
                                                        <LucideCompass className="text-[#C5A059] opacity-70 group-hover:opacity-100 transition-opacity" size={32} />
                                                        <span className="text-[#FDFCF0] font-serif uppercase tracking-[0.3em] font-bold text-sm md:text-md">
                                                            게임 시작
                                                        </span>
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

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
                                                THEME_CONFIG={THEME_CONFIG}
                                                AudioManager={AudioManager}
                                                setMinaText={setMinaText}
                                                onEarnBadge={handleEarnBadge}
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
                                                THEME_CONFIG={THEME_CONFIG}
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

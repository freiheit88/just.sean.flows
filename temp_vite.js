import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/prelude.jsx");import.meta.env = {"BASE_URL": "/", "DEV": true, "MODE": "development", "PROD": false, "SSR": false, "VITE_GEMINI_API_KEY": "AIzaSyD4EE-mG3t1ZrbVimkbjBYJVI40toU24J4"};import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=f7be628e"; const Fragment = __vite__cjsImport0_react_jsxDevRuntime["Fragment"]; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$(), _s2 = $RefreshSig$(), _s3 = $RefreshSig$(), _s4 = $RefreshSig$(), _s5 = $RefreshSig$();
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=f7be628e"; const React = __vite__cjsImport3_react.__esModule ? __vite__cjsImport3_react.default : __vite__cjsImport3_react; const useState = __vite__cjsImport3_react["useState"]; const useEffect = __vite__cjsImport3_react["useEffect"]; const useRef = __vite__cjsImport3_react["useRef"]; const useCallback = __vite__cjsImport3_react["useCallback"];
import { motion, AnimatePresence } from "/node_modules/.vite/deps/framer-motion.js?v=f7be628e";
import CinematicOpening from "/components/CinematicOpening.jsx?t=1772410496646";
import {
  LucideCheckCircle,
  LucideGlobe,
  LucideInstagram,
  LucideSparkles,
  LucideInfo,
  LucideVolume2,
  LucideLoader2,
  LucideChevronLeft,
  LucideTrophy,
  LucideLayout,
  LucideMapPin,
  LucideFeather,
  LucideScroll,
  LucideCompass,
  LucideUser,
  LucideUpload,
  LucideCheckSquare,
  LucideSquare,
  LucideFlame,
  LucideSettings,
  LucideCamera,
  LucideZap,
  LucideScale,
  LucideArrowLeft,
  LucideArrowRight,
  LucideLock,
  LucideOrbit
} from "/node_modules/.vite/deps/lucide-react.js?v=f7be628e";
import MinaDirective from "/components/MinaDirective.jsx?t=1772410129915";
import { calculateArchetype } from "/components/Archetypes.js";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const BUILD_VERSION = "v1.4.0-clockwork-masterpiece-final";
const AudioManager = {
  currentSfx: null,
  currentTheme: null,
  mainTheme: null,
  currentMina: null,
  playSfx: (id, volume = 0.5, overlap = false) => {
    if (id === "transition") {
      [...Array(3)].forEach(() => {
        const audio2 = new Audio(`/assets/sounds/${id}.mp3`);
        audio2.volume = volume;
        audio2.play().catch(() => {
        });
      });
      return;
    }
    if (AudioManager.currentSfx && !overlap) {
      AudioManager.currentSfx.pause();
      AudioManager.currentSfx = null;
    }
    const audio = new Audio(`/assets/sounds/${id}.mp3`);
    audio.volume = volume;
    audio.play().catch(() => {
    });
    if (!overlap) AudioManager.currentSfx = audio;
  },
  playTheme: (langId, targetVolume = 0.4, fadeDuration = 3e3) => {
    const THEME_TRACKS = {
      ar: ["ar_song1", "ar_song2"],
      de: ["de_song1", "de_song2"],
      en: ["en_song1", "en_song2"],
      es: ["es_song1", "es_song2"],
      hi: ["in_song1", "in_song2"],
      ja: ["jp_song1", "jp_song2"],
      ko: ["ko_song1", "ko_song2"],
      pl: ["po_song1", "po_song2"]
    };
    let audioSrc = `/assets/sounds/${langId}-theme.mp3`;
    let trackName = `${langId}-theme`;
    if (THEME_TRACKS[langId] && THEME_TRACKS[langId].length > 0) {
      const tracks = THEME_TRACKS[langId];
      trackName = tracks[Math.floor(Math.random() * tracks.length)];
      audioSrc = `/assets/manual_upload/language_thema/${trackName}.wav`;
    }
    if (AudioManager.currentTheme && !AudioManager.currentTheme.paused && AudioManager.currentTheme.src.includes(trackName)) return;
    if (AudioManager.mainTheme) {
      AudioManager.mainTheme.pause();
      AudioManager.mainTheme.currentTime = 0;
    }
    if (AudioManager.currentTheme) {
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
    audio.volume = 0;
    audio.loop = true;
    audio.play().catch(() => {
    });
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
  playMainTheme: (targetVolume = 0.5, fadeDuration = 3e3) => {
    if (AudioManager.mainTheme && !AudioManager.mainTheme.paused && AudioManager.mainTheme.src.includes(`background_candiate1.mp3`)) return;
    if (AudioManager.mainTheme) {
      AudioManager.mainTheme.pause();
      AudioManager.mainTheme.currentTime = 0;
    }
    const audio = new Audio("/assets/sounds/background_candiate1.mp3");
    audio.volume = 0;
    audio.loop = true;
    audio.play().catch(() => {
    });
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
  fadeMainTheme: (targetVolume, fadeDuration = 2e3) => {
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
  playMina: (langId, step, volume = 1) => {
    if (AudioManager.currentMina) {
      AudioManager.currentMina.pause();
    }
    const hasTheme = AudioManager.currentTheme && !AudioManager.currentTheme.paused;
    const hasMain = AudioManager.mainTheme && !AudioManager.mainTheme.paused;
    if (hasTheme || hasMain) {
      if (AudioManager.themeFadeInterval) clearInterval(AudioManager.themeFadeInterval);
      if (AudioManager.mainThemeFadeInterval) clearInterval(AudioManager.mainThemeFadeInterval);
      if (AudioManager.duckInterval) clearInterval(AudioManager.duckInterval);
      if (AudioManager.restoreInterval) clearInterval(AudioManager.restoreInterval);
      const duckThemeVolume = AudioManager.baseThemeVolume * 0.2;
      const duckMainVolume = AudioManager.baseMainThemeVolume * 0.2;
      const duckDuration = 2e3;
      const steps = 40;
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
    minaAudio.onended = () => {
      if (window.setMinaSpeaking) window.setMinaSpeaking(false);
      const hasTheme2 = AudioManager.currentTheme && !AudioManager.currentTheme.paused;
      const hasMain2 = AudioManager.mainTheme && !AudioManager.mainTheme.paused;
      if (hasTheme2 || hasMain2) {
        if (AudioManager.duckInterval) clearInterval(AudioManager.duckInterval);
        if (AudioManager.restoreInterval) clearInterval(AudioManager.restoreInterval);
        const restoreDuration = 4e3;
        const steps = 80;
        const stepTime = restoreDuration / steps;
        let currentThemeVol = hasTheme2 ? AudioManager.currentTheme.volume : 0;
        let currentMainVol = hasMain2 ? AudioManager.mainTheme.volume : 0;
        let currentStep = 0;
        AudioManager.restoreInterval = setInterval(() => {
          if (currentStep < steps) {
            if (hasTheme2 && AudioManager.currentTheme) {
              currentThemeVol += (AudioManager.baseThemeVolume - currentThemeVol) / (steps - currentStep);
              AudioManager.currentTheme.volume = Math.max(0, Math.min(1, currentThemeVol));
            }
            if (hasMain2 && AudioManager.mainTheme) {
              currentMainVol += (AudioManager.baseMainThemeVolume - currentMainVol) / (steps - currentStep);
              AudioManager.mainTheme.volume = Math.max(0, Math.min(1, currentMainVol));
            }
            currentStep++;
          } else {
            if (hasTheme2 && AudioManager.currentTheme) {
              AudioManager.currentTheme.volume = 1;
            }
            if (hasMain2 && AudioManager.mainTheme) {
              AudioManager.mainTheme.volume = AudioManager.baseMainThemeVolume;
            }
            clearInterval(AudioManager.restoreInterval);
            AudioManager.restoreInterval = null;
          }
        }, stepTime);
      }
    };
    humanAudio.onended = () => {
      minaAudio.play().catch(() => {
        if (window.setMinaSpeaking) window.setMinaSpeaking(false);
      });
    };
    signatureAudio.onended = () => {
      humanAudio.play().catch(() => {
        minaAudio.play().catch(() => {
          if (window.setMinaSpeaking) window.setMinaSpeaking(false);
        });
      });
    };
    signatureAudio.play().catch(() => {
      humanAudio.play().catch(() => {
        minaAudio.play().catch(() => {
          if (window.setMinaSpeaking) window.setMinaSpeaking(false);
        });
      });
    });
    AudioManager.currentMina = minaAudio;
  },
  preloadTTS: () => {
    const langs = ["en", "ko", "es", "hi", "de", "ja", "ar", "pl"];
    langs.forEach((langId) => {
      const audio = new Audio(`/assets/sounds/mina/mina-${langId}-comingsoon.mp3`);
      audio.preload = "auto";
    });
  }
};
const THEME_CONFIG = {
  ko: { bg: "bg-[#121114]", text: "text-[#EFEFF0]", accent: "text-[#9A8C9E]", border: "border-[#9A8C9E]/40", shadow: "shadow-[#9A8C9E]/10", blur: "backdrop-blur-sm", font: "font-serif" },
  // Muted Lavender
  en: { bg: "bg-[#0F1115]", text: "text-[#F0F2F5]", accent: "text-[#4A6478]", border: "border-[#4A6478]/40", shadow: "shadow-[#4A6478]/10", blur: "backdrop-blur-sm", font: "font-sans" },
  // Muted Electric Blue
  es: { bg: "bg-[#151211]", text: "text-[#F5EBE8]", accent: "text-[#A67B71]", border: "border-[#A67B71]/40", shadow: "shadow-[#A67B71]/10", blur: "backdrop-blur-sm", font: "font-serif" },
  // Muted Coral
  hi: { bg: "bg-[#14120F]", text: "text-[#F5F2EC]", accent: "text-[#B08D5B]", border: "border-[#B08D5B]/40", shadow: "shadow-[#B08D5B]/10", blur: "backdrop-blur-sm", font: "font-sans" },
  // Muted Amber
  de: { bg: "bg-[#101211]", text: "text-[#ECEFEF]", accent: "text-[#7D9185]", border: "border-[#7D9185]/40", shadow: "shadow-[#7D9185]/10", blur: "backdrop-blur-sm", font: "font-serif" },
  // Muted Sage Green
  ja: { bg: "bg-[#0E1112]", text: "text-[#EBF1F2]", accent: "text-[#6B8C96]", border: "border-[#6B8C96]/40", shadow: "shadow-[#6B8C96]/10", blur: "backdrop-blur-sm", font: "font-serif" },
  // Muted Cyan
  ar: { bg: "bg-[#131013]", text: "text-[#F4EEF4]", accent: "text-[#966B84]", border: "border-[#966B84]/40", shadow: "shadow-[#966B84]/10", blur: "backdrop-blur-sm", font: "font-serif" },
  // Muted Magenta
  pl: { bg: "bg-[#121212]", text: "text-[#EEEEEE]", accent: "text-[#8A8A8A]", border: "border-[#8A8A8A]/40", shadow: "shadow-[#8A8A8A]/10", blur: "backdrop-blur-sm", font: "font-serif" }
  // Muted Ash
};
const LANGUAGES = [
  {
    id: "ko",
    name: "한국어",
    flag: "🇰🇷",
    image: "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop",
    // Seoul neon night
    welcome: "로드 매너에 오신 것을 환영합니다. 운명의 톱니바퀴가 당신을 기다립니다.",
    loading: "크로노미터 컨설팅 중...",
    ui: {
      authTitle: "신원 인증",
      authBtn: "영혼의 자격 증명",
      authDone: "신원 기록 완료",
      galleryTitle: "매너 기록 보관소",
      gallerySub: "역사적 기록 1899",
      manorTitle: "기계동력 심장부",
      manorHeirlooms: "선조의 유물",
      manorEstate: "저택 부지",
      returnGallery: "보관소로 돌아가기",
      textOptionTitle: "당신의 이름을 기록하세요",
      textInputPlaceholder: "방문자 이름...",
      textSubmitBtn: "이름 남기기",
      uploadTitle: "에테르 포트레잇 스캔",
      generateBtn: "자아 연성",
      generating: "변환 중...",
      confirmTitle: "당신의 세계가 맞습니까?",
      confirmBtn: "확정합니다",
      confirmDone: "언어 동기화 완료",
      todoTitle: "선언문",
      todo1: "신원 확립",
      todo2: "심장 점검",
      todo3: "운명 봉인",
      todoDone: "운명이 발현되었습니다.",
      consulting: "알고리즘이 속삭입니다...",
      sealBtn: "이 운명을 봉인하기",
      fateSealed: "운명 확정",
      directiveLanguage: "동기화 완료. 선택한 포트레잇을 중앙으로 끌어와 멀티버스를 확정하세요. 시간은 가연성 높은 자원이니 지체하지 마시길.",
      directiveConfirm: "탁월한 결단입니다. 이제 지문을 찍어 운명을 봉인하세요. 폭발은 면할 겁니다.",
      directiveAuth: "이름을 등록하거나 초상화를 제출해 신원을 인증하세요. 기계는 유령을 태우지 않습니다.",
      directiveAvatar: "페르소나 연성 완료. 꽤 봐줄 만하군요. 이제 저택의 기록 보관소로 이동하시죠.",
      directiveDashboard: "기록 보관소 진입 성공. 각 기록을 탭하여 조사하세요. 복도에서 길을 잃어도 구하러 가지 않습니다.",
      comingSoon: "곧 돌아옵니다",
      minaSystem: "시스템 구조체 : 미나",
      minaAction: ">> 행동 필요 : 언어를 선택하십시오 <<",
      inviting: "멀티버스로 진입 중...",
      awaiting: "저택이 당신의 영혼을 기다립니다.",
      tap: "탭하여 선택",
      sync: "동기화 중",
      drag: "가운데로 드래그",
      fateSealed: "운명 확정"
    }
  },
  {
    id: "en",
    name: "English",
    flag: "🇬🇧",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
    // London fog/bridge
    welcome: "Welcome to the Lord Manor, guest. The gears of destiny await your touch.",
    loading: "Consulting the Chronometer...",
    ui: {
      authTitle: "Aether Identity",
      authBtn: "Verify Soul Imprint",
      authDone: "Identity Sealed",
      galleryTitle: "MANOR ARCHIVE",
      gallerySub: "Historical Record 1899",
      manorTitle: "The Clockwork Heart",
      manorHeirlooms: "Ancestral Gears",
      manorEstate: "Manor Grounds",
      returnGallery: "Return to Archive",
      textOptionTitle: "Inscribe Your Name",
      textInputPlaceholder: "Guest Name...",
      textSubmitBtn: "Summon Identity",
      uploadTitle: "Scan Aether Portrait",
      generateBtn: "Forge Soul",
      generating: "Transmuting...",
      confirmTitle: "Is this your native tongue?",
      confirmBtn: "I Agree",
      confirmDone: "Language Bound",
      todoTitle: "Manifest",
      todo1: "Forge Identity",
      todo2: "Inspect Heart",
      todo3: "Seal Fate",
      todoDone: "Destiny manifested.",
      consulting: "The Algorithm whispers...",
      sealBtn: "Seal this fate",
      fateSealed: "Fate Locked",
      directiveLanguage: "Synchronization achieved. Drag the chosen portrait to the center to lock your multiverse. Time is highly flammable, do not dawdle.",
      directiveConfirm: "A calculated choice. Imprint your thumb to seal this fate. We should avoid any spontaneous combustion.",
      directiveAuth: "Identity verification required. Ink your name or submit a scan. The machine does not transport ghosts.",
      directiveAvatar: "Persona forged. Passable, I suppose. Proceed to the Manor archives immediately.",
      directiveDashboard: "Archive breach successful. Tap the records to investigate. If you get lost in the halls, I will not search for you.",
      comingSoon: "Coming Soon",
      minaSystem: "SYSTEM CONSTRUCT: MINA",
      minaAction: ">> ACTION REQUIRED: SELECT A MULTIVERSE <<",
      inviting: "INVITING THE MULTIVERSE...",
      awaiting: "THE MANOR AWAITS YOUR SOUL'S VOYAGE.",
      tap: "TAP TO SELECT",
      sync: "SYNCHRONIZING",
      drag: "DRAG TO CENTER",
      fateSealed: "FATE SEALED"
    }
  },
  {
    id: "es",
    name: "Español",
    flag: "🇪🇸",
    image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop",
    // Madrid architecture
    welcome: "Bienvenido a Lord Manor. Los engranajes del destino esperan tu toque.",
    loading: "Consultando el Cronómetro...",
    ui: {
      authTitle: "Identidad Étérea",
      authBtn: "Verificar Huella del Alma",
      authDone: "Identidad Sellada",
      galleryTitle: "ARCHIVO DE LA MANSIÓN",
      gallerySub: "Registro Histórico 1899",
      manorTitle: "El Corazón de Relojería",
      manorHeirlooms: "Engranajes Ancestrales",
      manorEstate: "Terrenos de la Mansión",
      returnGallery: "Volver al Archivo",
      textOptionTitle: "Inscribe Tu Nombre",
      textInputPlaceholder: "Nombre del Huésped...",
      textSubmitBtn: "Invocar Identidad",
      uploadTitle: "Escanear Retrato de Éter",
      generateBtn: "Forjar Alma",
      generating: "Transmutando...",
      confirmTitle: "¿Es esta tu lengua materna?",
      confirmBtn: "Estoy de acuerdo",
      confirmDone: "Idioma Vinculado",
      todoTitle: "Manifiesto",
      todo1: "Forjar Identidad",
      todo2: "Inspeccionar Corazón",
      todo3: "Sellar Destino",
      todoDone: "Destino manifestado.",
      consulting: "El algoritmo susurra...",
      sealBtn: "Sellar este destino",
      fateSealed: "Destino bloqueado",
      directiveLanguage: "Sincronización lograda. Arrastra el retrato elegido al centro para fijar tu multiverso. El tiempo es muy inflamable, no te demores.",
      directiveConfirm: "Una elección calculada. Imprime tu huella para sellar este destino. Deberíamos evitar la combustión espontánea.",
      directiveAuth: "Se requiere verificación. Escribe tu nombre o escanea tu retrato. La máquina no transporta fantasmas.",
      directiveAvatar: "Persona forjada. Pasable, supongo. Proceda a los archivos de la Mansión inmediatamente.",
      directiveDashboard: "Infiltración al archivo exitosa. Toca los registros para investigar. Si te pierdes, no iré a buscarte.",
      comingSoon: "Próximamente",
      minaSystem: "CONSTRUCTO DE SISTEMA: MINA",
      minaAction: ">> ACCIÓN REQUERIDA: SELECCIONA UN MULTIVERSO <<",
      inviting: "INVITANDO AL MULTIVERSO...",
      awaiting: "LA MANSIÓN ESPERA EL VIAJE DE TU ALMA.",
      tap: "TOCA PARA SELECCIONAR",
      sync: "SINCRONIZANDO",
      drag: "ARRASTRA AL CENTRO",
      fateSealed: "DESTINO SELLADO"
    }
  },
  {
    id: "hi",
    name: "हिन्दी",
    flag: "🇮🇳",
    image: "/assets/images/countries/india_festival.png",
    // Indian Holi and Diwali festival fusion
    welcome: "लॉर्ड मैनर में आपका स्वागत है। भाग्य के पहिये आपकी प्रतीक्षा कर रहे हैं।",
    loading: "क्रोनोमीटर से परामर्श किया जा रहा है...",
    ui: {
      authTitle: "ईथर पहचान",
      authBtn: "आत्मा की छाप सत्यापित करें",
      authDone: "पहचान सील",
      galleryTitle: "मैनर पुरालेख",
      gallerySub: "ऐतिहासिक रिकॉर्ड 1899",
      manorTitle: "लॉर्ड मैनर",
      manorHeirlooms: "पैतृक गियर्स",
      manorEstate: "मैनर मैदान",
      returnGallery: "पुरालेख पर वापस",
      textOptionTitle: "अपना नाम दर्ज करें",
      textInputPlaceholder: "अतिथि का नाम...",
      textSubmitBtn: "पहचान बुलाएं",
      uploadTitle: "ईथर पोर्ट्रेट स्कैन करें",
      generateBtn: "आत्मा बनाएं",
      generating: "रूपांतरण...",
      confirmTitle: "क्या यह आपकी मातृभाषा है?",
      confirmBtn: "मैं सहमत हूँ",
      confirmDone: "भाषा बाध्य",
      todoTitle: "घोषणापत्र",
      todo1: "पहचान बनाएं",
      todo2: "हृदय का निरीक्षण करें",
      todo3: "भाग्य को सील करें",
      todoDone: "भाग्य प्रकट हुआ।",
      consulting: "एल्गोरिथम फुसफुसाता है...",
      sealBtn: "इस भाग्य को सील करें",
      fateSealed: "भाग्य लॉक हो गया",
      directiveLanguage: "तुल्यकालन पूरा हुआ। अपने मल्टीवर्स को लॉक करने के लिए चुने गए चित्र को केंद्र में खींचें। समय अत्यधिक ज्वलनशील है, देर न करें।",
      directiveConfirm: "एक सोची-समझी पसंद। इस भाग्य को सील करने के लिए अपना अंगूठा छापें। हमें किसी भी विस्फोट से बचना चाहिए।",
      directiveAuth: "पहचान सत्यापन आवश्यक है। अपना नाम लिखें या चित्र स्कैन करें। मशीन भूतों को नहीं ले जाती।",
      directiveAvatar: "व्यक्तित्व गढ़ा गया। ठीक-ठाक है। तुरंत मैनर के अभिलेखागार में आगे बढ़ें।",
      directiveDashboard: "अभिलेखागार में प्रवेश सफल। जांच के लिए रिकॉर्ड पर टैप करें। यदि आप खो जाते हैं, तो मैं आपको नहीं ढूंढूंगी।",
      comingSoon: "जल्द आ रहा है",
      minaSystem: "सिस्टम निर्माण: मीना",
      minaAction: ">> कार्रवाई आवश्यक: एक मल्टीवर्स चुनें <<",
      inviting: "मल्टीवर्स को आमंत्रित किया जा रहा है...",
      awaiting: "मैनर आपकी आत्मा की यात्रा की प्रतीक्षा कर रहा है।",
      tap: "चुनने के लिए टैप करें",
      sync: "सिंक्रनाइज़ कर रहा है",
      drag: "केंद्र में खींचें",
      fateSealed: "भाग्य सील"
    }
  },
  {
    id: "de",
    name: "Deutsch",
    flag: "🇩🇪",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop",
    // German Black Forest / Castle
    welcome: "Willkommen im Lord Manor. Die Zahnräder des Schicksals erwarten Sie.",
    loading: "Konsultiere das Chronometer...",
    ui: {
      authTitle: "Ätherische Identität",
      authBtn: "Seelenabdruck verifizieren",
      authDone: "Identität besiegelt",
      galleryTitle: "MANOR ARCHIV",
      gallerySub: "Historische Aufzeichnung 1899",
      manorTitle: "Das mechanische Herz",
      manorHeirlooms: "Ahnen-Zahnräder",
      manorEstate: "Anwesen",
      returnGallery: "Zurück zum Archiv",
      textOptionTitle: "Namen eintragen",
      textInputPlaceholder: "Gastname...",
      textSubmitBtn: "Identität beschwören",
      uploadTitle: "Äther-Porträt scannen",
      generateBtn: "Seele schmieden",
      generating: "Transmutiere...",
      confirmTitle: "Ist dies Ihre Muttersprache?",
      confirmBtn: "Ich stimme zu",
      confirmDone: "Sprache gebunden",
      todoTitle: "Manifest",
      todo1: "Identität schmieden",
      todo2: "Herz inspizieren",
      todo3: "Schicksal besiegeln",
      todoDone: "Schicksal manifestiert.",
      consulting: "Der Algorithmus flüstert...",
      sealBtn: "Schicksal besiegeln",
      fateSealed: "Schicksal gesperrt",
      directiveLanguage: "Synchronisation erreicht. Ziehen Sie das Porträt in die Mitte, um Ihr Multiversum zu sperren. Zeit ist hochentzündlich, trödeln Sie nicht.",
      directiveConfirm: "Eine kalkulierte Wahl. Drücken Sie Ihren Daumen darauf, um dieses Schicksal zu besiegeln. Wir sollten spontane Selbstentzündung vermeiden.",
      directiveAuth: "Identitätsprüfung erforderlich. Tragen Sie Ihren Namen ein oder scannen Sie Ihr Porträt. Die Maschine transportiert keine Geister.",
      directiveAvatar: "Persona geschmiedet. Akzeptabel, nehme ich an. Begeben Sie sich umgehend in das Manor-Archiv.",
      directiveDashboard: "Archivzugriff erfolgreich. Tippen Sie auf die Akten, um zu untersuchen. Wenn Sie sich verirren, werde ich nicht nach Ihnen suchen.",
      comingSoon: "Demnächst",
      minaSystem: "SYSTEMKONSTRUKT: MINA",
      minaAction: ">> AKTION ERFORDERLICH: WÄHLEN SIE EIN MULTIVERSUM <<",
      inviting: "LADE DAS MULTIVERSUM EIN...",
      awaiting: "DAS ANWESEN ERWARTET DIE REISE IHRER SEELE.",
      tap: "ZUM AUSWÄHLEN TIPPEN",
      sync: "SYNCHRONISIERE",
      drag: "ZUR MITTE ZIEHEN",
      fateSealed: "SCHICKSAL BESIEGELT"
    }
  },
  {
    id: "ja",
    name: "日本語",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    // Kyoto temples / Japan
    welcome: "ロード・マナーへようこそ。運命の歯車があなたを待っています。",
    loading: "クロノメーターを照合中...",
    ui: {
      authTitle: "エーテル身元確認",
      authBtn: "魂の刻印を確認",
      authDone: "身元封印完了",
      galleryTitle: "マナー・アーカイブ",
      gallerySub: "歴史的記録 1899",
      manorTitle: "時計仕掛けの心臓",
      manorHeirlooms: "祖先の歯車",
      manorEstate: "邸宅の敷地",
      returnGallery: "アーカイブへ戻る",
      textOptionTitle: "名を記す",
      textInputPlaceholder: "来客名...",
      textSubmitBtn: "身元を召喚",
      uploadTitle: "エーテル肖像をスキャン",
      generateBtn: "魂を錬成",
      generating: "錬成中...",
      confirmTitle: "この言語があなたの母国語ですか？",
      confirmBtn: "同意する",
      confirmDone: "言語バインド完了",
      todoTitle: "マニフェスト",
      todo1: "身元を錬成",
      todo2: "心臓を点検",
      todo3: "運命を封印",
      todoDone: "運命が具現化されました。",
      consulting: "アルゴリズムの囁き...",
      sealBtn: "運命を封印する",
      fateSealed: "運命確定",
      directiveLanguage: "同期完了。選択した肖像を中央にドラッグしてマルチバースを確定しなさい。時間は引火性が高いので、ぐずぐずしないでください。",
      directiveConfirm: "計算された選択です。指紋を押してこの運命を封印しなさい。自然発火は避けるべきです。",
      directiveAuth: "身元確認が必要です。署名するか肖像をスキャンしなさい。この機械は幽霊を運びません。",
      directiveAvatar: "ペルソナ錬成完了。まあまあですね。直ちに館の記録保管所へ進みなさい。",
      directiveDashboard: "アーカイブへの侵入成功。各記録をタップして調査しなさい。廊下で迷子になっても探しに行きませんよ。",
      comingSoon: "近日公開",
      minaSystem: "システム構造体：ミナ",
      minaAction: ">> アクション要求：マルチバースを選択してください <<",
      inviting: "マルチバースを招待中...",
      awaiting: "館があなたの魂の旅立ちを待っています。",
      tap: "タップして選択",
      sync: "同期中",
      drag: "中央へドラッグ",
      fateSealed: "運命確定"
    }
  },
  {
    id: "ar",
    name: "العربية",
    flag: "🇸🇦",
    image: "/assets/images/countries/arab_festival.png",
    // Vibrant Arab street market lantern festival
    welcome: "مرحبًا بكم في لورد مانور. تروس القدر في انتظار لمستك.",
    loading: "استشارة الكرونومتر...",
    ui: {
      authTitle: "هوية الأثير",
      authBtn: "التحقق من بصمة الروح",
      authDone: "تم ختم الهوية",
      galleryTitle: "أرشيف القصر",
      gallerySub: "سجل تاريخي 1899",
      manorTitle: "قلب الساعة",
      manorHeirlooms: "تروس الأجداد",
      manorEstate: "أراضي القصر",
      returnGallery: "العودة للأرشيف",
      textOptionTitle: "أدخل اسمك",
      textInputPlaceholder: "اسم الضيف...",
      textSubmitBtn: "استدعاء الهوية",
      uploadTitle: "مسح صورة الأثير",
      generateBtn: "صياغة الروح",
      generating: "تحويل...",
      confirmTitle: "هل هذه لغتك الأم؟",
      confirmBtn: "أوافق",
      confirmDone: "تم ربط اللغة",
      todoTitle: "البيان",
      todo1: "صياغة الهوية",
      todo2: "فحص القلب",
      todo3: "ختم القدر",
      todoDone: "القدر يتجلى.",
      consulting: "الخوارزمية تهمس...",
      sealBtn: "ختم هذا القدر",
      fateSealed: "القدر مغلق",
      directiveLanguage: "تمت المزامنة. اسحب الصورة المختارة إلى المركز لقفل الكون المتعدد الخاص بك. الوقت سريع الاشتعال، لا تتباطأ.",
      directiveConfirm: "اختيار محسوب. اطبع إبهامك لختم هذا القدر. يجب أن نتجنب الاحتراق التلقائي.",
      directiveAuth: "مطلوب التحقق من الهوية. اكتب اسمك أو قم بمسح صورتك. الآلة لا تنقل الأشباح.",
      directiveAvatar: "تمت صياغة الشخصية. مقبولة، على ما أظن. تقدم إلى أرشيفات القصر على الفور.",
      directiveDashboard: "اقتحام الأرشيف ناجح. اضغط على السجلات للتحقيق. إذا ضللت طريقك، فلن أبحث عنك.",
      comingSoon: "قريباً",
      minaSystem: "بناء النظام: مينا",
      minaAction: ">> الإجراء المطلوب: حدد كونًا متعددًا <<",
      inviting: "دعوة الأكوان المتعددة...",
      awaiting: "القصر ينتظر رحلة روحك.",
      tap: "اضغط للاختيار",
      sync: "مزامنة",
      drag: "اسحب للمركز",
      fateSealed: "تم ختم القدر"
    }
  },
  {
    id: "pl",
    name: "Polski",
    flag: "🇵🇱",
    image: "/assets/images/countries/poland_festival.png",
    // Polish traditional festival in Kraków market square
    welcome: "Witamy w Lord Manor. Tryby przeznaczenia czekają na twój dotyk.",
    loading: "Konsultacja z Chronometrem...",
    ui: {
      authTitle: "Eteryczna Tożsamość",
      authBtn: "Weryfikuj Duszę",
      authDone: "Tożsamość Zapieczętowana",
      galleryTitle: "ARCHIWUM DWORU",
      gallerySub: "Zapis Historyczny 1899",
      manorTitle: "Mechaniczne Serce",
      manorHeirlooms: "Zębatki Przodków",
      manorEstate: "Tereny Dworu",
      returnGallery: "Powrót do Archiwum",
      textOptionTitle: "Wpisz Swoje Imię",
      textInputPlaceholder: "Imię Gościa...",
      textSubmitBtn: "Przyzwij Tożsamość",
      uploadTitle: "Skanuj Eteryczny Portret",
      generateBtn: "Wykuj Duszę",
      generating: "Transmutacja...",
      confirmTitle: "Czy to twój język ojczysty?",
      confirmBtn: "Wyrażam zgodę",
      confirmDone: "Język Związany",
      todoTitle: "Manifest",
      todo1: "Wykuj Tożsamość",
      todo2: "Zbadaj Serce",
      todo3: "Zapieczętuj Los",
      todoDone: "Przeznaczenie zrealizowane.",
      consulting: "Algorytm Szepcze...",
      sealBtn: "Zapieczętuj ten los",
      fateSealed: "Los Zablokowany",
      directiveLanguage: "Synchronizacja zakończona. Przeciągnij portret na środek, aby zablokować multiversum. Czas jest wysoce łatwopalny, nie zwlekaj.",
      directiveConfirm: "Wyrachowany wybór. Odciśnij kciuk, aby przypieczętować ten los. Powinniśmy unikać samozapłonu.",
      directiveAuth: "Wymagana weryfikacja. Wpisz imię lub zeskanuj portret. Maszyna nie transportuje duchów.",
      directiveAvatar: "Persona wykuta. Znośna, jak sądzę. Natychmiast udaj się do Archiwum Dworu.",
      directiveDashboard: "Włamanie do Archiwum udane. Dotknij akt, aby zbadać. Jeśli się zgubisz, nie będę cię szukać.",
      comingSoon: "Wkrótce",
      minaSystem: "KONSTRUKT SYSTEMU: MINA",
      minaAction: ">> WYMAGANE DZIAŁANIE: WYBIERZ MULTIWERSUM <<",
      inviting: "ZAPRASZANIE MULTIWERSUM...",
      awaiting: "DWÓR CZEKA NA PODRÓŻ TWOJEJ DUSZY.",
      tap: "DOTKNIJ ABY WYBRAĆ",
      sync: "SYNCHRONIZACJA",
      drag: "PRZECIĄGNIJ DO ŚRODKA",
      fateSealed: "LOS ZAPIECZĘTOWANY"
    }
  }
];
const PROJECTS = [
  { id: 1, title: "The Automaton Survival", desc: "Surviving 24h guided only by the Machine Spirit." },
  { id: 2, title: "The Silent Builder", desc: "Constructing 3 inventions without uttering a single code." },
  { id: 3, title: "The Clockwork Servant", desc: "Forging a mechanical golem to labor in my stead." },
  { id: 4, title: "Séance with History", desc: "Interviewing great figures of the past via the Aether." },
  { id: 5, title: "The Alchemist's Coin", desc: "Surviving a week trading only in cryptographic tokens." },
  { id: 6, title: "The Virtual Voyage", desc: "Living 48 hours within the simulacrum visor." },
  { id: 7, title: "The Haunted Manor", desc: "Automating the estate to startle uninvited guests." },
  { id: 8, title: "The Calculated Feast", desc: "Dining only on what the Algorithm prescribes." }
];
const AetherWhispers = ({ text }) => /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-0 pointer-events-none flex items-center justify-center pointer-events-none select-none overflow-hidden", children: /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: text && /* @__PURE__ */ jsxDEV(
  motion.div,
  {
    initial: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
    animate: { opacity: 0.1, scale: 1, filter: "blur(2px)" },
    exit: { opacity: 0, scale: 1.2, filter: "blur(20px)" },
    transition: { duration: 5, ease: "linear" },
    className: "text-[12vw] font-black uppercase tracking-[1em] text-[#C5A059] text-center leading-none opacity-10 break-all select-none",
    children: text
  },
  text,
  false,
  {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 586,
    columnNumber: 5
  },
  this
) }, void 0, false, {
  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
  lineNumber: 584,
  columnNumber: 9
}, this) }, void 0, false, {
  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
  lineNumber: 583,
  columnNumber: 1
}, this);
_c = AetherWhispers;
const ShutterTransition = ({ isActive, children }) => /* @__PURE__ */ jsxDEV("div", { className: "relative w-full h-full flex flex-col items-center justify-center overflow-hidden", children: [
  /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: [
    !isActive && /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { y: "-100%" },
        animate: { y: "-101%" },
        exit: { y: "0%" },
        transition: { duration: 0.4, ease: "circIn" },
        className: "absolute top-0 left-0 w-full h-1/2 bg-[#1A1612] border-b-2 border-[#C5A059] z-[100] shadow-2xl"
      },
      "shutter-top",
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 606,
        columnNumber: 5
      },
      this
    ),
    !isActive && /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { y: "100%" },
        animate: { y: "101%" },
        exit: { y: "0%" },
        transition: { duration: 0.4, ease: "circIn" },
        className: "absolute bottom-0 left-0 w-full h-1/2 bg-[#1A1612] border-t-2 border-[#C5A059] z-[100] shadow-2xl"
      },
      "shutter-bottom",
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 616,
        columnNumber: 5
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 604,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 w-full h-full flex items-center justify-center p-4", children }, void 0, false, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 626,
    columnNumber: 9
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
  lineNumber: 603,
  columnNumber: 1
}, this);
_c2 = ShutterTransition;
const Background = () => /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black", children: [
  /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-b from-[#0A0A0B] via-[#050505] to-black" }, void 0, false, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 637,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 opacity-10 mix-blend-overlay bg-[url('/assets/steampunk_paper_texture.png')]" }, void 0, false, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 638,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.9)_100%)]" }, void 0, false, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 641,
    columnNumber: 9
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
  lineNumber: 635,
  columnNumber: 1
}, this);
_c3 = Background;
const GlassCard = ({ children, className = "", onClick, delay = 0 }) => /* @__PURE__ */ jsxDEV(
  motion.div,
  {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.8, ease: "easeOut" },
    onClick,
    className: `bg-[#050505]/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group ${className}`,
    children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 654,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "relative z-10", children }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 656,
        columnNumber: 9
      }, this)
    ]
  },
  void 0,
  true,
  {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 646,
    columnNumber: 1
  },
  this
);
_c4 = GlassCard;
const IntroView = ({ selectedLang, userName, setUserName, generateTextCharacter, isAvatarGenerating, handleImageUpload, uploadedImage, generateCharacter, playSfx }) => /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 max-w-md mx-auto overflow-y-auto no-scrollbar max-h-[85vh] px-4 py-4", children: [
  /* @__PURE__ */ jsxDEV(GlassCard, { className: "text-center italic text-sm border-l-4 border-l-white/50 py-4 mb-6", children: /* @__PURE__ */ jsxDEV("span", { className: "opacity-80", children: [
    '"',
    selectedLang.welcome,
    '"'
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 665,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 664,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV(GlassCard, { className: "py-6 px-4 flex flex-col items-center", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 right-0 w-8 h-8 opacity-20", children: /* @__PURE__ */ jsxDEV(LucideZap, { size: 32, className: "text-white" }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 669,
      columnNumber: 72
    }, this) }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 669,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("h3", { className: "text-xs font-black uppercase mb-4 tracking-[0.2em] flex items-center gap-2 text-white/50", children: [
      /* @__PURE__ */ jsxDEV(LucideFeather, { size: 16 }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 671,
        columnNumber: 17
      }, this),
      " ",
      selectedLang.ui.textOptionTitle
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 670,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      "input",
      {
        type: "text",
        value: userName,
        onChange: (e) => {
          setUserName(e.target.value);
        },
        onFocus: () => playSfx?.("click"),
        placeholder: selectedLang.ui.textInputPlaceholder,
        className: "w-full bg-transparent border-b border-white/20 p-3 mb-6 focus:outline-none font-sans text-lg transition-all focus:border-white text-center text-white placeholder-white/20"
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 673,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: generateTextCharacter,
        disabled: isAvatarGenerating || !userName.trim(),
        onMouseEnter: () => playSfx?.("hover"),
        className: "w-full py-4 bg-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/20 disabled:opacity-30 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 backdrop-blur-md",
        children: [
          isAvatarGenerating ? /* @__PURE__ */ jsxDEV(LucideLoader2, { className: "animate-spin", size: 16 }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 687,
            columnNumber: 39
          }, this) : null,
          isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.textSubmitBtn
        ]
      },
      void 0,
      true,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 681,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 668,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV("div", { className: "relative py-4", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxDEV("div", { className: "w-full border-t border-white/10" }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 693,
      columnNumber: 65
    }, this) }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 693,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em] bg-transparent", children: /* @__PURE__ */ jsxDEV("span", { className: "px-4 text-white/40 bg-[#0A0A0B]", children: "OR" }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 695,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 694,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 692,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV("label", { className: "block w-full cursor-pointer group", children: /* @__PURE__ */ jsxDEV("div", { className: "p-6 border border-dashed border-white/20 bg-white/5 hover:bg-white/10 rounded-sm flex flex-col items-center transition-all shadow-inner backdrop-blur-sm", children: [
    /* @__PURE__ */ jsxDEV("input", { type: "file", className: "hidden", onChange: handleImageUpload, accept: "image/*" }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 701,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV(LucideUpload, { className: "text-white/50 mb-3 group-hover:text-white transition-colors", size: 24 }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 702,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "font-black uppercase tracking-widest text-[10px] text-white/50 group-hover:text-white transition-colors", children: selectedLang.ui.uploadTitle }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 703,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 700,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 699,
    columnNumber: 9
  }, this),
  uploadedImage && !isAvatarGenerating && /* @__PURE__ */ jsxDEV(
    motion.button,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      onClick: generateCharacter,
      onMouseEnter: () => playSfx?.("hover"),
      className: `w-full py-4 bg-black/40 border border-white/10 backdrop-blur-md ${THEME_CONFIG[selectedLang.id]?.text || "text-white"} font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95`,
      children: [
        /* @__PURE__ */ jsxDEV(LucideCamera, { size: 16 }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 714,
          columnNumber: 17
        }, this),
        selectedLang.ui.generateBtn
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 708,
      columnNumber: 3
    },
    this
  ),
  isAvatarGenerating && /* @__PURE__ */ jsxDEV("div", { className: "text-center p-4", children: [
    /* @__PURE__ */ jsxDEV(LucideLoader2, { className: "animate-spin mx-auto text-[#5C1A1A] mb-2", size: 32 }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 721,
      columnNumber: 17
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] italic text-[#8B7355] animate-pulse", children: selectedLang.loading }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 722,
      columnNumber: 17
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 720,
    columnNumber: 3
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
  lineNumber: 663,
  columnNumber: 1
}, this);
_c5 = IntroView;
const GalleryView = ({ selectedLang, userAvatar, setViewMode, setTodos, playSfx, todos }) => {
  const gridItems = [
    { id: 1, type: "text", title: "START THE JOURNEY", subtitle: "Enter the Core" },
    { id: 2, type: "image", title: "MEMORY", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=300" },
    { id: 3, type: "text", title: "NEXT STOP: SEOUL", subtitle: "Flight 88" },
    { id: 4, type: "image", title: "ARCHIVE", image: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&q=80&w=300" },
    { id: 5, type: "current", title: "퇴근하고 곧 돌아오겠습니다.", isCenter: true },
    { id: 6, type: "manor", title: selectedLang.ui.manorTitle },
    { id: 7, type: "text", title: "DIGITAL SOUL", subtitle: "Humanity in Code" },
    { id: 8, type: "image", title: "VISION", image: "https://images.unsplash.com/photo-1440688807730-73e4e2169fb8?auto=format&fit=crop&w=300&q=80" },
    { id: 9, type: "rules", title: "HOUSE RULES", subtitle: "No Artificial Empathy" }
  ];
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-6 h-full py-4 overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV("h1", { className: `text-4xl font-black ${THEME_CONFIG[selectedLang.id]?.text || "text-white"} mb-1 uppercase tracking-widest leading-none filter drop-shadow-md`, children: selectedLang.ui.galleryTitle }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 745,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: `text-[10px] font-black uppercase tracking-[0.5em] ${THEME_CONFIG[selectedLang.id]?.accent || "text-white/50"}`, children: "Cinematic Editorial" }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 746,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 744,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "w-full aspect-square grid grid-cols-3 grid-rows-3 gap-[2px] p-2 bg-[#0A0A0B]/80 backdrop-blur-md border border-white/10 shadow-2xl relative", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay bg-[url('/assets/steampunk_paper_texture.png')]" }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 751,
        columnNumber: 17
      }, this),
      gridItems.map(
        (slot, idx) => /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: idx * 0.1, duration: 0.8, ease: "easeOut" },
            className: "w-full h-full relative",
            children: slot.type === "current" ? /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  setViewMode("mission_active");
                  playSfx?.("click");
                },
                onMouseEnter: () => playSfx?.("hover"),
                className: `w-full h-full relative bg-[#0A0A0B] border border-white/20 overflow-hidden group active:scale-95 transition-transform hover:border-[${THEME_CONFIG[selectedLang.id]?.accent || "#FFF"}] flex flex-col justify-center items-center`,
                children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 767,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 flex items-center justify-center p-2 z-0", children: userAvatar?.isTextAvatar ? /* @__PURE__ */ jsxDEV("span", { className: `font-black text-2xl uppercase text-center leading-tight ${THEME_CONFIG[selectedLang.id]?.text || "text-white"} opacity-80 mix-blend-screen`, children: userAvatar.textName }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 770,
                    columnNumber: 15
                  }, this) : /* @__PURE__ */ jsxDEV("img", { src: userAvatar?.image, className: "w-full h-full object-cover opacity-60 mix-blend-luminosity", alt: "avatar" }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 772,
                    columnNumber: 15
                  }, this) }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 768,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "relative z-20 text-center px-1", children: [
                    /* @__PURE__ */ jsxDEV("p", { className: `text-[8px] font-serif italic mb-1 opacity-70 ${THEME_CONFIG[selectedLang.id]?.text || "text-white"}`, children: "Sean's Persona" }, void 0, false, {
                      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                      lineNumber: 776,
                      columnNumber: 37
                    }, this),
                    /* @__PURE__ */ jsxDEV("h4", { className: `text-[10px] font-black uppercase tracking-widest leading-tight ${THEME_CONFIG[selectedLang.id]?.accent || "text-white"}`, children: slot.title }, void 0, false, {
                      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                      lineNumber: 777,
                      columnNumber: 37
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 775,
                    columnNumber: 33
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 762,
                columnNumber: 11
              },
              this
            ) : slot.type === "manor" ? /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  if (!todos?.home) AudioManager.playMina(selectedLang.id, "dashboard");
                  setViewMode("home_interior");
                  setTodos((p) => ({ ...p, home: true }));
                  playSfx?.("click");
                },
                onMouseEnter: () => playSfx?.("hover"),
                className: `w-full h-full relative bg-[#121214] flex flex-col items-center justify-center hover:bg-white/5 transition-colors group active:scale-95 border border-transparent hover:border-[${THEME_CONFIG[selectedLang.id]?.accent || "#FFF"}]/50`,
                children: [
                  /* @__PURE__ */ jsxDEV(LucideLayout, { size: 24, className: `mb-2 opacity-50 group-hover:opacity-100 transition-opacity ${THEME_CONFIG[selectedLang.id]?.accent || "text-white"}` }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 791,
                    columnNumber: 33
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "text-white/60 text-[8px] font-black uppercase tracking-widest", children: slot.title }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 792,
                    columnNumber: 33
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 781,
                columnNumber: 11
              },
              this
            ) : slot.type === "image" ? /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full relative overflow-hidden bg-black grayscale hover:grayscale-0 transition-all duration-1000 group", children: [
              /* @__PURE__ */ jsxDEV("img", { src: slot.image, className: "w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-opacity duration-1000 group-hover:scale-110", alt: "archive" }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 796,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-1 left-1 bg-black/80 px-1 py-0.5 text-white/80 text-[7px] font-black uppercase tracking-widest backdrop-blur-sm", children: slot.title }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 797,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 795,
              columnNumber: 11
            }, this) : slot.type === "rules" ? /* @__PURE__ */ jsxDEV("div", { className: `w-full h-full relative bg-[${THEME_CONFIG[selectedLang.id]?.accent || "#555"}]/10 flex flex-col items-center justify-center text-center p-2 border border-white/5 hover:bg-white/10 transition-colors`, children: [
              /* @__PURE__ */ jsxDEV(LucideInfo, { size: 16, className: `mb-1 opacity-60 ${THEME_CONFIG[selectedLang.id]?.accent || "text-white"}` }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 801,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: `font-black text-[9px] uppercase leading-none mb-1 ${THEME_CONFIG[selectedLang.id]?.text || "text-white"}`, children: slot.title }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 802,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[7px] font-serif italic text-white/50 leading-tight uppercase", children: slot.subtitle }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 803,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 800,
              columnNumber: 11
            }, this) : /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full relative bg-[#0D0D10] flex flex-col items-center justify-center p-2 text-center border border-white/5 hover:border-white/20 transition-colors", children: [
              /* @__PURE__ */ jsxDEV("span", { className: `font-black text-[9px] uppercase leading-tight mb-1 ${THEME_CONFIG[selectedLang.id]?.text || "text-white/80"}`, children: slot.title }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 807,
                columnNumber: 33
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: `text-[7px] font-serif italic leading-none ${THEME_CONFIG[selectedLang.id]?.accent || "text-white/40"}`, children: slot.subtitle }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 808,
                columnNumber: 33
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 806,
              columnNumber: 11
            }, this)
          },
          slot.id,
          false,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 754,
            columnNumber: 9
          },
          this
        )
      )
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 749,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("p", { className: "text-[8px] font-black uppercase tracking-[0.4em] text-white/30 text-center px-8 border-t border-white/10 pt-4", children: '"Digital Body. Analog Soul."' }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 815,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 743,
    columnNumber: 5
  }, this);
};
_c6 = GalleryView;
const ManorView = ({ selectedLang, setViewMode, userAvatar, candleLit, setCandleLit, gearsSpinning, setGearsSpinning, loreText, playSfx }) => /* @__PURE__ */ jsxDEV(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "w-full max-w-lg h-full flex flex-col items-center justify-center space-y-2 py-4", children: [
  /* @__PURE__ */ jsxDEV("button", { onClick: () => {
    setViewMode("gallery");
    playSfx?.("click");
  }, className: "text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1", children: [
    /* @__PURE__ */ jsxDEV(LucideChevronLeft, { size: 16 }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 825,
      columnNumber: 13
    }, this),
    " ",
    selectedLang.ui.returnGallery
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 824,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV(PaperCard, { className: `w-full flex-1 max-h-[75vh] p-0 border border-[${THEME_CONFIG[selectedLang.id]?.border || "#333"}] bg-transparent relative overflow-hidden shadow-2xl backdrop-blur-md`, children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: "absolute inset-0 bg-center bg-cover opacity-10 mix-blend-overlay",
        style: { backgroundImage: "url('/assets/steampunk_manor_background.png')" }
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 830,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 834,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 flex flex-col items-center p-6 h-full overflow-y-auto no-scrollbar", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "w-full flex justify-between mb-8 px-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "cursor-pointer hover:scale-110 transition-transform flex items-center gap-2", onClick: () => setCandleLit(!candleLit), onMouseEnter: () => playSfx?.("hover"), children: [
          /* @__PURE__ */ jsxDEV(LucideFlame, { size: 20, className: candleLit ? `text-[${THEME_CONFIG[selectedLang.id]?.accent || "#FFF"}] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]` : "text-white/20" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 839,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] uppercase tracking-widest text-white/30 font-black hidden sm:block", children: "Aether Core" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 840,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 838,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "cursor-pointer hover:rotate-90 transition-transform flex items-center gap-2", onClick: () => setGearsSpinning(!gearsSpinning), onMouseEnter: () => playSfx?.("hover"), children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] uppercase tracking-widest text-white/30 font-black hidden sm:block", children: "Sync" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 843,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV(motion.div, { animate: { rotate: gearsSpinning ? 360 : 0 }, transition: { duration: 4, repeat: gearsSpinning ? Infinity : 0, ease: "linear" }, children: /* @__PURE__ */ jsxDEV(LucideOrbit, { size: 20, className: `text-[${THEME_CONFIG[selectedLang.id]?.accent || "#FFF"}]` }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 845,
            columnNumber: 29
          }, this) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 844,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 842,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 837,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: `relative w-28 h-28 mb-4 transition-all duration-700 ${candleLit ? "" : "brightness-50"}`, children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 border-4 border-[#C5A059] rounded-full shadow-[0_0_20px_rgba(197,160,89,0.3)]" }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 851,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-2 border-2 border-[#8B7355]/40 shadow-inner", children: userAvatar?.image ? /* @__PURE__ */ jsxDEV("img", { src: userAvatar.image, className: "w-full h-full object-cover rounded-full" }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 854,
          columnNumber: 11
        }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-[#C5A059] font-black text-xl text-center uppercase drop-shadow-md", children: userAvatar?.textName?.charAt(0) }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 856,
          columnNumber: 11
        }, this) }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 852,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 850,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("h3", { className: `text-xl font-serif font-black ${THEME_CONFIG[selectedLang.id]?.text || "text-white"} mb-6 uppercase tracking-[0.3em] text-center leading-none`, children: selectedLang.ui.manorTitle }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 861,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: `w-full flex-1 bg-black/40 backdrop-blur-sm p-5 border-l border-[${THEME_CONFIG[selectedLang.id]?.accent || "#FFF"}]/30 rounded-r-lg font-mono text-[10px] ${THEME_CONFIG[selectedLang.id]?.text || "text-white/80"} leading-relaxed relative overflow-y-auto no-scrollbar shadow-inner`, children: [
        loreText,
        /* @__PURE__ */ jsxDEV("span", { className: `inline-block w-1.5 h-3 bg-[${THEME_CONFIG[selectedLang.id]?.accent || "#FFF"}] ml-1 animate-ping` }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 864,
          columnNumber: 31
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 863,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 w-full mt-6 pt-4 border-t border-white/10", children: [
        /* @__PURE__ */ jsxDEV(motion.div, { whileHover: { y: -2 }, className: "flex flex-col items-center gap-2 cursor-pointer group", onClick: () => playSfx?.("click"), onMouseEnter: () => playSfx?.("hover"), children: [
          /* @__PURE__ */ jsxDEV(LucideCompass, { size: 18, className: `text-white/40 group-hover:text-[${THEME_CONFIG[selectedLang.id]?.accent || "#FFF"}] transition-colors` }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 869,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] font-black uppercase text-white/40 group-hover:text-[${THEME_CONFIG[selectedLang.id]?.accent || "#FFF"}] tracking-widest`, children: selectedLang.ui.manorHeirlooms }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 870,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 868,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-2 opacity-20 pointer-events-none", children: [
          /* @__PURE__ */ jsxDEV(LucideMapPin, { size: 18, className: "text-white" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 873,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "text-[9px] font-black uppercase text-white tracking-widest", children: selectedLang.ui.manorEstate }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 874,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 872,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 867,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 836,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 828,
    columnNumber: 9
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
  lineNumber: 823,
  columnNumber: 1
}, this);
_c7 = ManorView;
const MissionView = ({ selectedLang, setViewMode, PROJECTS: PROJECTS2, previewId, handlePreviewVote, isAuthenticated: isAuthenticated2, setIsAuthenticated: setIsAuthenticated2, oracleMessage: oracleMessage2, setStep, setTodos, playSfx }) => /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-lg h-full flex flex-col items-center justify-center space-y-4 py-4 overflow-hidden px-4 scanline", children: [
  /* @__PURE__ */ jsxDEV(
    "button",
    {
      onClick: () => {
        setViewMode("gallery");
        playSfx?.("click");
      },
      className: "text-[#C5A059] hover:text-[#f4e4bc] uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1 transition-all hover:translate-x-1",
      children: [
        /* @__PURE__ */ jsxDEV(LucideChevronLeft, { size: 16 }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 889,
          columnNumber: 13
        }, this),
        " ",
        selectedLang.ui.returnGallery
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 885,
      columnNumber: 9
    },
    this
  ),
  /* @__PURE__ */ jsxDEV("div", { className: "w-full flex-1 flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV(PaperCard, { className: "py-4 px-6 border-[#C5A059] shadow-lg mb-4 shrink-0 bg-paper aether-glow", children: [
      /* @__PURE__ */ jsxDEV("h3", { className: "text-[10px] font-black text-[#5C1A1A] uppercase tracking-[0.2em] flex items-center gap-1 border-b border-black/5 pb-2", children: [
        /* @__PURE__ */ jsxDEV(LucideInfo, { size: 14 }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 895,
          columnNumber: 21
        }, this),
        " ",
        selectedLang.ui.authTitle
      ] }, void 0, true, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 894,
        columnNumber: 17
      }, this),
      !isAuthenticated2 ? /* @__PURE__ */ jsxDEV("button", { onClick: () => {
        setIsAuthenticated2(true);
        playSfx?.("forge");
      }, className: "w-full mt-2 py-3 bg-[#1A1612] text-[#C5A059] text-[10px] font-black uppercase border border-[#C5A059]/40 hover:bg-[#5C1A1A] hover:text-white transition-all shadow-md active:scale-95", children: selectedLang.ui.authBtn }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 898,
        columnNumber: 7
      }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-2 text-[#556B2F] font-black bg-[#556B2F]/10 p-2 mt-2 border border-[#556B2F]/30 uppercase text-[10px]", children: [
        /* @__PURE__ */ jsxDEV(LucideCheckCircle, { size: 16 }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 903,
          columnNumber: 25
        }, this),
        " ",
        selectedLang.ui.authDone
      ] }, void 0, true, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 902,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 893,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "flex-1 w-full overflow-x-auto no-scrollbar snap-x snap-mandatory flex items-start gap-4 pb-4 px-2", children: PROJECTS2.map((proj) => {
      const isSelected = previewId === proj.id;
      const isInactive = previewId && !isSelected;
      return /* @__PURE__ */ jsxDEV("div", { className: `min-w-[280px] h-full snap-center transition-all duration-500 ${isInactive ? "opacity-20 grayscale scale-90 blur-[1px]" : "scale-100"}`, children: /* @__PURE__ */ jsxDEV(
        PaperCard,
        {
          onClick: () => {
            if (!isInactive && isAuthenticated2) {
              handlePreviewVote(proj.id);
              playSfx?.("click");
            }
          },
          className: `h-full cursor-pointer transition-all duration-700 overflow-hidden border-2 p-0 shadow-2xl flex flex-col relative ${isSelected ? "border-[#C5A059] bg-[#2C241B]/20 aether-glow" : "border-[#2C241B] hover:border-[#8B7355] bg-black/5"}`,
          children: [
            isSelected && /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-[#C5A059]/5 animate-pulse pointer-events-none" }, void 0, false, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 918,
              columnNumber: 48
            }, this),
            /* @__PURE__ */ jsxDEV("div", { className: "p-6 flex flex-col flex-1 relative z-10", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "flex justify-between items-start mb-4", children: [
                /* @__PURE__ */ jsxDEV("span", { className: `text-[10px] font-mono uppercase px-2 py-1 border transition-colors ${isSelected ? "border-[#5C1A1A] text-[#5C1A1A] bg-[#5C1A1A]/10" : "border-[#8B7355] text-[#8B7355]"}`, children: [
                  "Case #0",
                  proj.id
                ] }, void 0, true, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 921,
                  columnNumber: 41
                }, this),
                isSelected && /* @__PURE__ */ jsxDEV(LucideSparkles, { className: "text-[#C5A059] animate-spin-slow", size: 18 }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 922,
                  columnNumber: 56
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 920,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV("h4", { className: `text-xl font-serif font-black uppercase tracking-wider mb-4 leading-tight transition-colors ${isSelected ? "text-[#C5A059]" : "text-[#8B7355]"}`, children: proj.title }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 924,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-[#8B7355] text-[11px] font-medium leading-relaxed italic opacity-80 mb-6 flex-1", children: proj.desc }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 925,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV(AnimatePresence, { children: isSelected && /* @__PURE__ */ jsxDEV(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 10 }, className: "mt-auto", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "bg-[#1A1612] p-6 border-l-4 border-[#C5A059] mb-4 shadow-inner relative overflow-hidden", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-[#C5A059]/30 animate-scan-line" }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 933,
                    columnNumber: 53
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute top-1 right-1", children: /* @__PURE__ */ jsxDEV(LucideFeather, { size: 14, className: "text-[#5C1A1A] opacity-30" }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 934,
                    columnNumber: 93
                  }, this) }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 934,
                    columnNumber: 53
                  }, this),
                  /* @__PURE__ */ jsxDEV("p", { className: "text-[#f4e4bc] text-[11px] leading-relaxed text-center font-serif italic", children: [
                    '"',
                    oracleMessage2 || selectedLang.ui.consulting,
                    '"'
                  ] }, void 0, true, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 935,
                    columnNumber: 53
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 932,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV(
                  "button",
                  {
                    onClick: () => {
                      playSfx?.("shutter");
                      setStep("trailer");
                      setTodos((p) => ({ ...p, voted: true }));
                    },
                    className: "w-full py-4 bg-[#5C1A1A] text-white font-black uppercase text-xs tracking-[0.2em] border-b-4 border-black active:scale-95 transition-transform shadow-2xl hover:bg-[#7D2626]",
                    children: selectedLang.ui.sealBtn
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 937,
                    columnNumber: 49
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 931,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 929,
                columnNumber: 37
              }, this),
              !isSelected && isAuthenticated2 && /* @__PURE__ */ jsxDEV("div", { className: "mt-auto pt-4 border-t border-[#8B7355]/10 text-[9px] font-black uppercase text-[#8B7355] text-center tracking-widest animate-pulse", children: "Tap to examine destiny" }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 947,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 919,
              columnNumber: 33
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 914,
          columnNumber: 29
        },
        this
      ) }, proj.id, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 913,
        columnNumber: 11
      }, this);
    }) }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 908,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "text-center py-2", children: /* @__PURE__ */ jsxDEV("span", { className: "text-[8px] font-black uppercase text-[#8B7355] tracking-widest opacity-60 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxDEV(LucideArrowLeft, { size: 10, className: "animate-bounce-x" }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 956,
        columnNumber: 17
      }, this),
      " Swipe Aether Cases ",
      /* @__PURE__ */ jsxDEV(LucideArrowRight, { size: 10, className: "animate-bounce-x" }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 956,
        columnNumber: 95
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 955,
      columnNumber: 47
    }, this) }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 955,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 892,
    columnNumber: 9
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
  lineNumber: 884,
  columnNumber: 1
}, this);
_c8 = MissionView;
const ComingSoonView = ({ selectedLang, currentTheme, setViewMode, setStep, metrics }) => {
  _s();
  const [archetype, setArchetype] = useState(null);
  useEffect(() => {
    if (!metrics) return;
    const enhancedMetrics = {
      ...metrics,
      sessionTimeSeconds: metrics.timeSpentMs / 1e3,
      selectedLangId: selectedLang?.id
    };
    const calculated = calculateArchetype(enhancedMetrics);
    setArchetype(calculated);
  }, [metrics, selectedLang]);
  useEffect(() => {
    if (selectedLang) {
      AudioManager.playMina(selectedLang.id, "comingsoon", 1);
    }
  }, [selectedLang]);
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      className: `w-full max-w-lg h-full flex flex-col items-center justify-center p-6 text-center z-50`,
      children: [
        /* @__PURE__ */ jsxDEV(AnimatePresence, { children: archetype && /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, y: -20, scale: 0.8 },
            animate: { opacity: 1, y: 0, scale: 1 },
            transition: { delay: 1.5, type: "spring" },
            className: "mb-12 flex flex-col items-center",
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-white/40 text-[10px] font-black tracking-widest uppercase mb-4 border border-white/20 px-3 py-1 rounded-full", children: "관측된 영혼의 형태" }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 1e3,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("h1", { className: `text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r ${archetype.color} text-transparent bg-clip-text drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]`, children: [
                "[ ",
                archetype.title,
                " ]"
              ] }, void 0, true, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 1003,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("h2", { className: "text-white/60 text-xs md:text-sm font-black tracking-[0.3em] uppercase mb-4", children: archetype.sub }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 1006,
                columnNumber: 25
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-white/80 text-sm italic font-serif max-w-sm leading-relaxed", children: [
                '"',
                archetype.desc,
                '"'
              ] }, void 0, true, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 1009,
                columnNumber: 25
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 994,
            columnNumber: 9
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 992,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "mb-12 relative flex justify-center items-end h-24 gap-1.5 opacity-60", children: [...Array(15)].map(
          (_, i) => /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              animate: {
                height: ["20%", "100%", "20%"]
              },
              transition: {
                duration: 0.5 + Math.random(),
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 0.5
              },
              className: `w-1.5 rounded-t-sm border border-black/20 ${currentTheme?.bg || "bg-[#C5A059]"}`,
              style: { backgroundColor: "#C5A059" }
            },
            i,
            false,
            {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 1017,
              columnNumber: 9
            },
            this
          )
        ) }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1015,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(
          motion.h2,
          {
            initial: { y: 20, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { delay: 0.3 },
            className: `text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 ${currentTheme?.text || "text-white"}`,
            style: { textShadow: "0 0 20px rgba(197,160,89,0.3)" },
            children: selectedLang?.ui?.comingSoon || "Coming Soon"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1034,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          motion.p,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { delay: 0.6 },
            className: `text-sm md:text-base font-bold italic max-w-sm leading-relaxed opacity-90 ${currentTheme?.text || "text-white"}`,
            children: [
              '"일단은 여기 까지입니다! Coming soon! 추후 업데이트 됩니다. 하지만 여기서 각 세계관의 음악은 계속 들을 수 있죠."',
              /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 1050,
                columnNumber: 89
              }, this),
              /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 1050,
                columnNumber: 95
              }, this),
              /* @__PURE__ */ jsxDEV("span", { className: "text-[#00E5FF] font-black drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]", children: "각 언어별로 총 2곡" }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 1051,
                columnNumber: 17
              }, this),
              "이 준비되어 있으니깐, 끝까지 감상해보세요!"
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1044,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          motion.button,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 1 },
            onClick: () => {
              AudioManager.playSfx("shutter", 0.6);
              setStep("dashboard");
              setViewMode("gallery");
            },
            className: `mt-10 px-8 py-4 border active:scale-95 transition-all text-[10px] uppercase font-black font-sans tracking-[0.3em] backdrop-blur-md ${currentTheme?.border || "border-[#C5A059]/40"} ${currentTheme?.text || "text-white"} hover:bg-white/10 shadow-lg`,
            children: "Enter Gallery"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1054,
            columnNumber: 13
          },
          this
        )
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 985,
      columnNumber: 5
    },
    this
  );
};
_s(ComingSoonView, "k+hdylQRVRNTB2Sfdv0//CwejUU=");
_c9 = ComingSoonView;
const LanguageCard = ({ lang, isFocused, isStaged, isDimmable, onFocus, onReady, onSelect }) => {
  _s2();
  const [saturationProgress, setSaturationProgress] = useState(0);
  const [isShakePaused, setIsShakePaused] = useState(false);
  const animInterval = useRef(null);
  const cardRef = useRef(null);
  useEffect(() => {
    if (isFocused && !isStaged) {
      const startTime = Date.now();
      const duration = 5500;
      let stage = 0;
      animInterval.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const percentage = Math.min(elapsed / duration * 100, 100);
        setSaturationProgress(percentage);
        if (elapsed >= 2500 && stage < 1) {
          [...Array(3)].forEach(() => AudioManager.playSfx("piano-mystic-low", 0.7, true));
          setTimeout(() => {
            setIsShakePaused(true);
            setTimeout(() => setIsShakePaused(false), 400);
          }, 100);
          stage = 1;
        } else if (elapsed >= 3500 && stage < 2) {
          AudioManager.playSfx("piano-mystic-mid", 0.42, true);
          setTimeout(() => {
            setIsShakePaused(true);
            setTimeout(() => setIsShakePaused(false), 400);
          }, 100);
          stage = 2;
        } else if (elapsed >= 4500 && stage < 3) {
          AudioManager.playSfx("piano-mystic-high", 0.56, true);
          setTimeout(() => {
            setIsShakePaused(true);
            setTimeout(() => setIsShakePaused(false), 400);
          }, 100);
          if (onReady) onReady({ ...lang, requestBackground: true });
          stage = 3;
        }
        if (elapsed >= duration) {
          clearInterval(animInterval.current);
          const currentSrc = AudioManager.currentTheme?.src || "";
          if (currentSrc.split("/").pop() !== `${lang.id}-theme.mp3`) {
            AudioManager.playTheme(lang.id, 0.4, 3e3);
          }
          if (onReady) onReady({ ...lang, requestSequenceComplete: true });
        }
      }, 50);
    } else {
      setSaturationProgress(0);
      if (animInterval.current) clearInterval(animInterval.current);
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
      AudioManager.playSfx("shutter", 0.6);
      onSelect(lang);
    }
  };
  const isDraggable = isFocused && saturationProgress === 100 && !isStaged;
  return /* @__PURE__ */ jsxDEV(
    motion.div,
    {
      ref: cardRef,
      onClick: () => {
        if (!isFocused && !isStaged) onFocus(lang);
      },
      drag: isDraggable,
      dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
      dragElastic: 0.8,
      onDragEnd: handleDragEnd,
      whileDrag: isDraggable ? { scale: 1.1, zIndex: 1e3, rotate: 2 } : {},
      initial: { opacity: 0, scale: 0.8 },
      animate: {
        opacity: isDimmable ? 0.3 : 1,
        // Only shake when progressing, stop shaking completely at 100% and just gently scale up
        scale: isStaged ? 1 : isFocused ? saturationProgress === 100 && !isStaged ? [1.05, 1.08, 1.05] : 1.05 : 1,
        zIndex: isFocused ? 100 : 1,
        // Shake effect while holding, maxes out right before 100%
        x: isFocused && saturationProgress > 0 && saturationProgress < 100 && !isStaged && !isShakePaused ? [-1, 1, -1, 1, 0].map((v) => v * (1 + saturationProgress / 100 * 1.5)) : 0,
        y: isFocused && saturationProgress > 0 && saturationProgress < 100 && !isStaged && !isShakePaused ? [1, -1, 1, -1, 0].map((v) => v * (1 + saturationProgress / 100 * 1.5)) : 0
      },
      transition: {
        x: { duration: 0.1, repeat: isFocused && saturationProgress < 100 && !isShakePaused ? Infinity : 0, ease: "linear" },
        y: { duration: 0.1, repeat: isFocused && saturationProgress < 100 && !isShakePaused ? Infinity : 0, ease: "linear" },
        opacity: { duration: 0.3 },
        scale: isFocused && saturationProgress === 100 && !isStaged ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : { type: "spring", damping: 25, stiffness: 120 }
      },
      className: `relative w-full h-full rounded-lg overflow-hidden shadow-2xl select-none transition-shadow ${isFocused && !isStaged ? "shadow-[0_0_80px_rgba(197,160,89,0.4)] ring-2 ring-[#C5A059]" : "cursor-pointer hover:ring-1 hover:ring-white/20"}`,
      style: { touchAction: "none" },
      children: [
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "absolute inset-0 bg-cover bg-center transition-all duration-100",
            style: {
              backgroundImage: `url(${lang.image})`,
              transform: "scale(1.5)",
              filter: isFocused ? saturationProgress < 45.45 ? `saturate(${0.1 + 0.2 * (saturationProgress / 45.45)}) grayscale(${80 - 50 * (saturationProgress / 45.45)}%) brightness(${0.1 + 0.2 * (saturationProgress / 45.45)})` : saturationProgress < 63.63 ? "saturate(0.7) grayscale(30%) brightness(0.7)" : saturationProgress < 81.81 ? "saturate(1) grayscale(0%) brightness(1)" : "saturate(1.2) grayscale(0%) brightness(1.3) drop-shadow(0 0 10px rgba(197,160,89,0.8))" : isStaged ? "saturate(1) grayscale(0%)" : "saturate(0) grayscale(100%) brightness(0.5)"
            }
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1180,
            columnNumber: 13
          },
          this
        ),
        isFocused && saturationProgress < 100 && /* @__PURE__ */ jsxDEV("div", { className: "absolute bottom-0 left-0 h-2 bg-[#C5A059] z-40 transition-all duration-75", style: { width: `${saturationProgress}%` } }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1196,
          columnNumber: 7
        }, this),
        isFocused && saturationProgress === 100 && !isStaged && /* @__PURE__ */ jsxDEV(
          motion.div,
          {
            animate: { opacity: [0, 0.3, 0] },
            transition: { repeat: Infinity, duration: 1.5 },
            className: "absolute inset-0 border-4 border-[#C5A059] pointer-events-none z-40"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1201,
            columnNumber: 7
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("div", { className: `absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-700 ${isFocused ? "opacity-80" : "opacity-60"}` }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1208,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 p-1 md:p-2 flex flex-col items-center justify-center z-30 text-center pointer-events-none", children: [
          /* @__PURE__ */ jsxDEV("h3", { className: `text-base md:text-3xl font-black text-white font-serif uppercase tracking-widest leading-none mb-1 md:mb-2 transition-transform duration-500 ${isFocused ? "scale-110 drop-shadow-[0_0_10px_rgba(197,160,89,0.8)] text-[#FDFCF0]" : ""}`, children: lang.name }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1211,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-full flex justify-center items-center px-1 overflow-visible", children: /* @__PURE__ */ jsxDEV(
            motion.span,
            {
              animate: { y: isFocused || isStaged ? 0 : 10 },
              className: "text-xs md:text-lg text-[#C5A059] uppercase tracking-[0.1em] md:tracking-[0.2em] font-black block leading-tight text-center",
              children: isStaged ? lang.ui.fateSealed : saturationProgress === 100 ? lang.ui.drag : isFocused ? `${lang.ui.sync} ${Math.round(saturationProgress)}%` : lang.ui.tap
            },
            void 0,
            false,
            {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 1215,
              columnNumber: 21
            },
            this
          ) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1214,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1210,
          columnNumber: 13
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 1145,
      columnNumber: 5
    },
    this
  );
};
_s2(LanguageCard, "3R7HEAjph08V+zDXZSLVqN0Fo98=");
_c0 = LanguageCard;
const LanguageView = ({ LANGUAGES: LANGUAGES2, handleLanguageSelect, setSpiritHint, cardsExplored, setCardsExplored, isMinaSpeaking }) => {
  _s3();
  const [focusedLang, setFocusedLang] = useState(null);
  const [stagedLang, setStagedLang] = useState(null);
  const [minaText, setMinaText] = useState("");
  const [activeBackground, setActiveBackground] = useState(null);
  const [isIntroActive, setIsIntroActive] = useState(true);
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
    const overlayTimer = setTimeout(() => {
      setIsIntroActive(false);
    }, 6e3);
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
    if (setCardsExplored) {
      setCardsExplored((prev) => {
        const newSet = new Set(prev);
        newSet.add(lang.id);
        return newSet;
      });
    }
    setActiveBackground(null);
    setFocusedLang(lang);
    setStagedLang(null);
    setMinaText(lang.ui.sync + "...");
    AudioManager.playSfx("click");
  };
  const onCardReady = (payload) => {
    if (payload.requestBackground) {
      setActiveBackground(payload.image);
    }
    if (payload.requestSequenceComplete) {
      setMinaText(payload.langData.ui.directiveLanguage);
      AudioManager.playMina(payload.id, "language");
    }
  };
  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef(null);
  const startHold = () => {
    if (!stagedLang) return;
    AudioManager.playSfx("shutter", 0.6);
    setMinaText("MAINTAIN FOCUS.");
    setHoldProgress(0);
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        const next = prev + 100 / (5e3 / 50);
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
    AudioManager.playSfx("confirm", 0.8);
    setMinaText(lang.ui.directiveConfirm);
    AudioManager.playMina(lang.id, "confirm");
  };
  const onCardSelect = (lang) => {
    setFocusedLang(lang);
    handleAnchorSelect(lang);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-4xl mx-auto h-full flex flex-col items-center justify-center p-2 md:p-4 mt-24 md:mt-16 overflow-visible relative", style: { touchAction: "none", overscrollBehavior: "none" }, children: [
    /* @__PURE__ */ jsxDEV(
      "div",
      {
        className: `fixed inset-0 z-0 bg-cover bg-center transition-opacity duration-[3000ms] pointer-events-none ${activeBackground ? "opacity-70" : "opacity-0"}`,
        style: activeBackground ? { backgroundImage: `url(${activeBackground})` } : {}
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1341,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { id: "language-grid", className: `w-full grid grid-cols-3 grid-rows-3 gap-2 md:gap-4 bg-black/40 backdrop-blur-3xl p-3 md:p-6 border border-white/5 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-1000 ${isIntroActive ? "opacity-40 blur-sm scale-95 pointer-events-none" : "opacity-100 blur-0 scale-100"}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.05)_0%,transparent_70%)] animate-pulse pointer-events-none" }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1348,
        columnNumber: 17
      }, this),
      [0, 1, 2, 3, "center", 4, 5, 6, 7].map((pos, i) => {
        if (pos === "center") {
          return /* @__PURE__ */ jsxDEV("div", { className: "relative z-50", children: /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: stagedLang ? /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: { scale: 0, opacity: 0, rotate: -20 },
              animate: { scale: holdProgress > 0 ? 1 + holdProgress / 100 * 0.5 : 1, opacity: 1, rotate: 0 },
              onMouseDown: startHold,
              onMouseUp: cancelHold,
              onMouseLeave: cancelHold,
              onTouchStart: startHold,
              onTouchEnd: cancelHold,
              className: "w-full h-full z-[2000] cursor-pointer relative",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "absolute -inset-4 bg-[#C5A059]/10 blur-xl pointer-events-none transition-opacity", style: { opacity: holdProgress / 100 } }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 1368,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV(
                  LanguageCard,
                  {
                    lang: stagedLang,
                    isFocused: true,
                    isStaged: true,
                    onFocus: () => {
                    },
                    onSelect: () => {
                    },
                    onReady: () => {
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 1369,
                    columnNumber: 45
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/80 shadow-[inset_0_0_100px_rgba(0,0,0,1)] pointer-events-none rounded-2xl border border-[#C5A059]/30 backdrop-blur-xl overflow-hidden", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 flex items-center justify-center opacity-40", children: [
                    /* @__PURE__ */ jsxDEV(
                      motion.div,
                      {
                        className: "absolute rounded-full border border-[#C5A059]",
                        animate: {
                          width: [`${100 - holdProgress}%`, `${150 - holdProgress}%`],
                          height: [`${100 - holdProgress}%`, `${150 - holdProgress}%`],
                          opacity: [0.8, 0],
                          rotate: holdProgress * 3
                        },
                        transition: { repeat: Infinity, duration: Math.max(0.5, 2 - holdProgress / 50) }
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                        lineNumber: 1382,
                        columnNumber: 53
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV(
                      motion.div,
                      {
                        className: "absolute rounded-full border-2 border-dashed border-[#e5c996]",
                        style: { width: `${holdProgress * 2.5}%`, height: `${holdProgress * 2.5}%` },
                        animate: { rotate: -holdProgress * 5 }
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                        lineNumber: 1392,
                        columnNumber: 53
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 1381,
                    columnNumber: 49
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 flex flex-col items-center justify-center w-full h-full", children: [
                    /* @__PURE__ */ jsxDEV(
                      motion.div,
                      {
                        className: "relative flex items-center justify-center",
                        animate: {
                          scale: holdProgress >= 100 ? [1, 1.5, 1.2] : 1 + holdProgress / 100,
                          filter: `drop-shadow(0 0 ${holdProgress}px rgba(197,160,89,1))`
                        },
                        children: [
                          /* @__PURE__ */ jsxDEV(
                            "div",
                            {
                              className: "absolute rounded-full border-t-4 border-l-4 border-[#C5A059] transition-all",
                              style: {
                                width: "120px",
                                height: "120px",
                                transform: `rotate(${holdProgress * 15}deg)`,
                                opacity: holdProgress / 100
                              }
                            },
                            void 0,
                            false,
                            {
                              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                              lineNumber: 1410,
                              columnNumber: 57
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDEV(
                            "div",
                            {
                              className: "absolute rounded-full bg-[#C5A059] transition-all mix-blend-screen",
                              style: {
                                width: `${Math.max(10, holdProgress)}px`,
                                height: `${Math.max(10, holdProgress)}px`,
                                boxShadow: `0 0 ${holdProgress * 2}px #FDFCF0`
                              }
                            },
                            void 0,
                            false,
                            {
                              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                              lineNumber: 1419,
                              columnNumber: 57
                            },
                            this
                          ),
                          holdProgress >= 100 ? /* @__PURE__ */ jsxDEV(LucideLock, { className: "text-black relative z-10 scale-[2.5]", size: 40 }, void 0, false, {
                            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                            lineNumber: 1429,
                            columnNumber: 27
                          }, this) : /* @__PURE__ */ jsxDEV(LucideOrbit, { className: "text-white relative z-10 scale-[2.0] animate-spin-slow opacity-80", size: 40 }, void 0, false, {
                            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                            lineNumber: 1431,
                            columnNumber: 27
                          }, this)
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                        lineNumber: 1402,
                        columnNumber: 53
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV("div", { className: "mt-16 flex flex-col items-center", children: [
                      /* @__PURE__ */ jsxDEV(
                        "span",
                        {
                          className: "text-[#FDFCF0] text-3xl md:text-5xl font-black uppercase tracking-[0.4em] text-center mb-2 leading-tight mix-blend-screen",
                          style: { textShadow: `0 0 ${holdProgress / 5}px #C5A059, 0 0 ${holdProgress / 2}px #e5c996` },
                          children: holdProgress >= 100 ? "FATE SEALED" : "RESONATING"
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                          lineNumber: 1437,
                          columnNumber: 57
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV("span", { className: "text-[#C5A059] text-xl font-mono tracking-widest", children: [
                        "[ ",
                        holdProgress.toFixed(1),
                        "% ]"
                      ] }, void 0, true, {
                        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                        lineNumber: 1441,
                        columnNumber: 57
                      }, this)
                    ] }, void 0, true, {
                      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                      lineNumber: 1436,
                      columnNumber: 53
                    }, this),
                    /* @__PURE__ */ jsxDEV("div", { className: "w-full flex justify-between items-center px-8 mt-12 opacity-50", children: [
                      /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent flex-1" }, void 0, false, {
                        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                        lineNumber: 1448,
                        columnNumber: 57
                      }, this),
                      /* @__PURE__ */ jsxDEV(LucideActivity, { className: "text-[#C5A059] mx-4 animate-pulse", size: 24 }, void 0, false, {
                        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                        lineNumber: 1449,
                        columnNumber: 57
                      }, this),
                      /* @__PURE__ */ jsxDEV("div", { className: "h-[1px] bg-gradient-to-r from-transparent via-[#C5A059] to-transparent flex-1" }, void 0, false, {
                        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                        lineNumber: 1450,
                        columnNumber: 57
                      }, this)
                    ] }, void 0, true, {
                      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                      lineNumber: 1447,
                      columnNumber: 53
                    }, this)
                  ] }, void 0, true, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 1399,
                    columnNumber: 49
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 1378,
                  columnNumber: 45
                }, this)
              ]
            },
            stagedLang.id,
            true,
            {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 1357,
              columnNumber: 19
            },
            this
          ) : /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              animate: {
                borderColor: focusedLang ? ["rgba(197,160,89,0.2)", "rgba(197,160,89,0.8)", "rgba(197,160,89,0.2)"] : "rgba(255,255,255,0.1)",
                boxShadow: focusedLang ? ["0 0 10px rgba(197,160,89,0)", "0 0 30px rgba(197,160,89,0.4)", "0 0 10px rgba(197,160,89,0)"] : "none"
              },
              transition: { duration: 1.5, repeat: Infinity },
              className: "flex flex-col items-center justify-center text-center p-2 md:p-4 bg-white/5 border-2 rounded-xl border-dashed w-full h-full",
              children: [
                /* @__PURE__ */ jsxDEV(LucideCompass, { className: `${focusedLang ? "text-[#C5A059] animate-spin-slow scale-150" : "text-white/40 scale-125"} mb-4 transition-all`, size: 40 }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 1466,
                  columnNumber: 45
                }, this),
                /* @__PURE__ */ jsxDEV("h2", { className: `text-xs md:text-base font-black ${focusedLang ? "text-[#C5A059]" : "text-white/40"} uppercase tracking-[0.4em] leading-tight text-center transition-colors`, children: focusedLang ? focusedLang.ui.drag : "ANCHOR" }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 1467,
                  columnNumber: 45
                }, this)
              ]
            },
            "instruction",
            true,
            {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 1457,
              columnNumber: 19
            },
            this
          ) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1355,
            columnNumber: 33
          }, this) }, "center-slot", false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1354,
            columnNumber: 15
          }, this);
        }
        const lang = LANGUAGES2[pos];
        const isFocused = focusedLang?.id === lang.id;
        const isStaged = stagedLang?.id === lang.id;
        const isDimmable = focusedLang && focusedLang.id !== lang.id;
        const isOriginalOfStaged = stagedLang && stagedLang.id === lang.id;
        return /* @__PURE__ */ jsxDEV(
          "div",
          {
            className: "relative aspect-[4/5] w-full transition-opacity duration-300 overflow-hidden",
            style: { opacity: isOriginalOfStaged ? 0 : Math.max(0, 1 - holdProgress / 100 * 1.5) },
            children: !isOriginalOfStaged && /* @__PURE__ */ jsxDEV(
              LanguageCard,
              {
                lang,
                idx: pos,
                isFocused,
                isStaged: false,
                isDimmable: isDimmable || stagedLang,
                onFocus: onCardFocus,
                onReady: onCardReady,
                onSelect: onCardSelect
              },
              void 0,
              false,
              {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 1491,
                columnNumber: 15
              },
              this
            )
          },
          `slot-${i}`,
          false,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1484,
            columnNumber: 13
          },
          this
        );
      })
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 1346,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      motion.p,
      {
        animate: { opacity: stagedLang ? 0.8 : 0.2 },
        className: "text-xs md:text-base font-black uppercase tracking-[0.8em] text-white mt-12 text-center",
        children: stagedLang ? stagedLang.ui.inviting : focusedLang ? focusedLang.ui.awaiting : "THE MANOR AWAITS YOUR SOUL'S VOYAGE."
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1507,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: `fixed top-4 md:top-8 inset-x-0 pointer-events-none z-[5000] flex justify-center`, children: /* @__PURE__ */ jsxDEV("div", { className: "w-full w-[95vw] md:w-auto md:min-w-[480px] max-w-4xl px-2 md:px-4", children: /* @__PURE__ */ jsxDEV(
      MinaDirective,
      {
        isVisible: true,
        activeStep: "language",
        text: minaText,
        position: "top",
        interactionMode: isIntroActive ? "reading" : "action",
        sysName: focusedLang?.ui?.minaSystem || "SYSTEM CONSTRUCT: MINA",
        actionReq: focusedLang?.ui?.minaAction || ">> ACTION REQUIRED: SELECT A MULTIVERSE <<",
        isSpeaking: isMinaSpeaking
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1517,
        columnNumber: 21
      },
      this
    ) }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 1516,
      columnNumber: 17
    }, this) }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 1515,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 1338,
    columnNumber: 5
  }, this);
};
_s3(LanguageView, "3oV4AZEvIgydrtruMx14aVF4jC4=");
_c1 = LanguageView;
const ConfirmView = ({ selectedLang, confirmLanguage, theme }) => {
  _s4();
  useEffect(() => {
    const timer = setTimeout(() => {
      confirmLanguage();
    }, 3500);
    return () => clearTimeout(timer);
  }, [confirmLanguage]);
  return /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-[10000] bg-transparent flex flex-col items-center justify-center overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { scale: 0.1, opacity: 0 },
        animate: { scale: [0.1, 4, 15, 30], opacity: [0, 1, 1, 0] },
        transition: { duration: 3, ease: "easeInOut" },
        className: "absolute w-64 h-64 rounded-full bg-gradient-to-r from-yellow-300 via-[#C5A059] to-red-500 mix-blend-screen blur-3xl pointer-events-none"
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1547,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { scale: 1, opacity: 1, borderWidth: "20px" },
        animate: { scale: 10, opacity: 0, borderWidth: "1px" },
        transition: { duration: 1.5, ease: "easeOut" },
        className: "absolute w-40 h-40 rounded-full border-white pointer-events-none"
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1555,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      motion.h1,
      {
        initial: { opacity: 0, filter: "blur(20px)", y: 50 },
        animate: { opacity: [0, 1, 1, 0], filter: ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"], scale: [0.8, 1, 1.1, 1.3], y: [50, 0, 0, -50] },
        transition: { duration: 3.5, ease: "circIn" },
        className: "text-black font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-center w-full px-4 break-words z-10 leading-tight",
        style: { fontSize: "clamp(36px, 8vw, 120px)", textShadow: "0 0 40px rgba(197,160,89,1)" },
        children: selectedLang.ui.confirmTitle || "ALIGNED"
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1562,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.5, filter: "blur(20px)" },
        animate: { opacity: [0, 1, 1, 0], scale: [0.5, 2, 4, 8], filter: ["blur(20px)", "blur(0px)", "blur(10px)", "blur(40px)"] },
        transition: { duration: 3.5, ease: "easeInOut" },
        className: "absolute z-0 text-[10rem] md:text-[20rem] opacity-30 pointer-events-none mix-blend-multiply",
        children: selectedLang.flag
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1573,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 1545,
    columnNumber: 5
  }, this);
};
_s4(ConfirmView, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c10 = ConfirmView;
const App = () => {
  _s5();
  const [isOpeningFinished, setIsOpeningFinished] = useState(false);
  const [step, setStep] = useState("language");
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[1]);
  const [isMinaSpeaking, setIsMinaSpeaking] = useState(false);
  useEffect(() => {
    window.setMinaSpeaking = setIsMinaSpeaking;
    return () => {
      window.setMinaSpeaking = null;
    };
  }, []);
  const [appStartTime] = useState(Date.now());
  const [totalClicks, setTotalClicks] = useState(0);
  const [cardsExplored, setCardsExplored] = useState(/* @__PURE__ */ new Set());
  useEffect(() => {
    if (step === "language" && !isOpeningFinished) {
    }
  }, [step]);
  const [votedId, setVotedId] = useState(null);
  const [viewMode, setViewMode] = useState("gallery");
  const [previewId, setPreviewId] = useState(null);
  const [todos, setTodos] = useState({ avatar: false, home: false, voted: false });
  const [showTodo, setShowTodo] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const [avatarLore, setAvatarLore] = useState("");
  const [isAvatarGenerating, setIsAvatarGenerating] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [candleLit, setCandleLit] = useState(true);
  const [gearsSpinning, setGearsSpinning] = useState(false);
  const [spiritHint, setSpiritHint] = useState("");
  const [isSpiritSensing, setIsSpiritSensing] = useState(false);
  const [whisper, setWhisper] = useState("");
  const bgmRef = useRef(null);
  const [bgmVol, setBgmVol] = useState(0.2);
  useEffect(() => {
    const whisperInterval = setInterval(async () => {
      if (apiKey && step !== "language") {
        try {
          const res = await callGemini({
            contents: [{ parts: [{ text: "Generate 1 cryptic steampunk word or very short phrase (max 2 words) about souls, gears, or time. Uppercase only." }] }]
          });
          setWhisper(res?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "");
        } catch (e) {
        }
      }
    }, 15e3);
    return () => clearInterval(whisperInterval);
  }, [step]);
  useEffect(() => {
    bgmRef.current = new Audio("/assets/sounds/manor-ambience.mp3");
    bgmRef.current.loop = true;
    bgmRef.current.volume = bgmVol;
    AudioManager.preloadTTS();
    return () => bgmRef.current.pause();
  }, []);
  useEffect(() => {
    if (bgmRef.current) bgmRef.current.volume = bgmVol;
  }, [bgmVol]);
  useEffect(() => {
    if (step === "dashboard") setBgmVol(0.4);
    if (todos.voted) setBgmVol(0.6);
  }, [step, todos]);
  const playSfx = (type) => {
    const currentTheme2 = THEME_CONFIG[selectedLang?.id] || THEME_CONFIG.en;
    const sounds = {
      click: `/assets/sounds/${selectedLang?.id || "en"}-click.mp3`,
      transition: `/assets/sounds/${selectedLang?.id || "en"}-transition.mp3`,
      welcome: "/assets/sounds/welcome-voice.mp3"
    };
    const audioSrc = sounds[type] || sounds.click;
    const audio = new Audio(audioSrc);
    audio.play().catch((e) => {
      console.warn(`Sound ${type} for ${selectedLang?.id} not found, using default.`);
    });
  };
  const [loreText, setLoreText] = useState("");
  useEffect(() => {
    if (viewMode === "home_interior" && userAvatar?.lore) {
      let i = 0;
      setLoreText("");
      const timer = setInterval(() => {
        setLoreText((prev) => prev + userAvatar.lore.charAt(i));
        i++;
        if (i >= userAvatar.lore.length) {
          clearInterval(timer);
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
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("API request failed");
        return await response.json();
      } catch (err) {
        if (i === 4) throw err;
        await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1e3));
      }
    }
  };
  const speakText = async (text) => {
    if (!apiKey || !text) return;
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
        const sampleRate = 24e3;
        const wavUrl = pcmToWav(audioData, sampleRate);
        setAudioCache((prev) => ({ ...prev, [text]: wavUrl }));
        new Audio(wavUrl).play();
      }
    } catch (err) {
      console.error("TTS Error:", err);
    }
  };
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
        const wavUrl = pcmToWav(audioData, 24e3);
        setAudioCache((prev) => ({ ...prev, [text]: wavUrl }));
      }
    } catch (err) {
    }
  };
  function pcmToWav(base64, sampleRate) {
    const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
    const view = new DataView(new ArrayBuffer(44 + buffer.byteLength));
    const writeString = (offset, string) => {
      for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + buffer.byteLength, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, buffer.byteLength, true);
    new Uint8Array(view.buffer, 44).set(new Uint8Array(buffer));
    return URL.createObjectURL(new Blob([view], { type: "audio/wav" }));
  }
  ;
  const handleLanguageSelect = (lang) => {
    setSelectedLang(lang);
    setStep("confirm");
    setViewMode(null);
    AudioManager.playSfx("click");
    AudioManager.playMina(lang.id, "confirm");
    if (AudioManager.mainTheme) {
      AudioManager.mainTheme.pause();
      AudioManager.mainTheme.currentTime = 0;
    }
    AudioManager.playTheme(lang.id, 0.7, 3e3);
    setTimeout(() => {
      preFetchVoice(lang.ui.confirmTitle, lang.voice, lang.name);
      preFetchVoice(lang.welcome, lang.voice, lang.name);
    }, 300);
  };
  const confirmLanguage = useCallback(() => {
    setStep("coming_soon");
    setViewMode("coming_soon");
  }, []);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    }
  };
  const generateTextCharacter = async () => {
    if (!userName.trim()) return;
    setIsAvatarGenerating(true);
    try {
      const prompt = `Create a short, mysterious 19th-century steampunk persona for someone named "${userName}". Output in ${selectedLang.name}. Max 40 words.`;
      const loreResult = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
      const lore = loreResult?.candidates?.[0]?.content?.parts?.[0]?.text || `The enigmatic ${userName}.`;
      setUserAvatar({ image: null, textName: userName, lore, isTextAvatar: true });
      setTodos((p) => ({ ...p, avatar: true }));
      AudioManager.playMina(selectedLang.id, "avatar");
      setStep("dashboard");
    } catch (err) {
      console.error(err);
      setUserAvatar({ image: null, textName: userName, lore: `The enigmatic ${userName}.`, isTextAvatar: true });
      setTodos((p) => ({ ...p, avatar: true }));
      AudioManager.playMina(selectedLang.id, "avatar");
      setStep("dashboard");
    } finally {
      setIsAvatarGenerating(false);
    }
  };
  const generateCharacter = async () => {
    if (!uploadedImage) return;
    setIsAvatarGenerating(true);
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
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), 2e4));
      const imageFetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: { prompt: `Vintage oil painting style, steampunk character portrait based on description: ${generatedLore}. Sepia tones, victorian clothing, brass goggles, etching texture.` },
          parameters: { sampleCount: 1 }
        })
      }).then((res) => res.json());
      const imageData = await Promise.race([imageFetchPromise, timeoutPromise]);
      if (!imageData || !imageData.predictions || !imageData.predictions[0]) {
        throw new Error("Invalid image data structure");
      }
      const generatedUrl = `data:image/png;base64,${imageData.predictions[0].bytesBase64Encoded}`;
      setUserAvatar({ image: generatedUrl, lore: generatedLore, isTextAvatar: false });
      setTodos((p) => ({ ...p, avatar: true }));
      AudioManager.playMina(selectedLang.id, "avatar");
      setStep("dashboard");
    } catch (err) {
      console.error("Generation Error or Timeout:", err);
      setUserAvatar({ image: null, textName: "Architect", lore: generatedLore, isTextAvatar: true });
      setTodos((p) => ({ ...p, avatar: true }));
      AudioManager.playMina(selectedLang.id, "avatar");
      setStep("dashboard");
    } finally {
      setIsAvatarGenerating(false);
    }
  };
  const handlePreviewVote = async (id) => {
    if (!isAuthenticated) return;
    setPreviewId(id);
    const proj = PROJECTS.find((p) => p.id === id);
    try {
      const prompt = `The user is considering the path: "${proj.title}". Write a mysterious, victorian-style prophecy about this choice. Output in ${selectedLang.name}. Max 30 words.`;
      const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
      setOracleMessage(result.candidates?.[0]?.content?.parts?.[0]?.text || "...");
    } catch (err) {
      console.error(err);
    }
  };
  const ManorView2 = ({ selectedLang: selectedLang2, setViewMode: setViewMode2, userAvatar: userAvatar2, candleLit: candleLit2, setCandleLit: setCandleLit2, gearsSpinning: gearsSpinning2, setGearsSpinning: setGearsSpinning2, loreText: loreText2 }) => /* @__PURE__ */ jsxDEV(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "w-full max-w-lg h-full flex flex-col items-center justify-center space-y-2 py-4", children: [
    /* @__PURE__ */ jsxDEV("button", { onClick: () => setViewMode2("gallery"), className: "text-white/40 hover:text-white uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1", children: [
      /* @__PURE__ */ jsxDEV(LucideChevronLeft, { size: 16 }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1929,
        columnNumber: 17
      }, this),
      " ",
      selectedLang2.ui.returnGallery
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 1928,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(GlassCard, { className: "w-full flex-1 max-h-[70vh] p-0 border-white/10 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1933,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "relative z-10 flex flex-col items-center p-6 h-full overflow-y-auto no-scrollbar", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "w-full flex justify-between mb-4 px-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "cursor-pointer hover:scale-110 transition-transform opacity-30 hover:opacity-100", onClick: () => setCandleLit2(!candleLit2), children: /* @__PURE__ */ jsxDEV(LucideFlame, { size: 24, className: candleLit2 ? "text-white" : "text-white/20" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1938,
            columnNumber: 29
          }, this) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1937,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "cursor-pointer hover:rotate-90 transition-transform opacity-30 hover:opacity-100", onClick: () => setGearsSpinning2(!gearsSpinning2), children: /* @__PURE__ */ jsxDEV(motion.div, { animate: { rotate: gearsSpinning2 ? 360 : 0 }, transition: { duration: 4, repeat: gearsSpinning2 ? Infinity : 0, ease: "linear" }, children: /* @__PURE__ */ jsxDEV(LucideSettings, { size: 24, className: "text-white" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1942,
            columnNumber: 33
          }, this) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1941,
            columnNumber: 29
          }, this) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1940,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1936,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: `relative w-28 h-28 mb-4 transition-all duration-700 ${candleLit2 ? "" : "brightness-50"}`, children: [
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 border border-white/20 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1948,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center p-1", children: userAvatar2?.image ? /* @__PURE__ */ jsxDEV("img", { src: userAvatar2.image, className: "w-full h-full object-cover rounded-full" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1951,
            columnNumber: 13
          }, this) : /* @__PURE__ */ jsxDEV("span", { className: "text-white/50 font-black text-xl text-center uppercase", children: userAvatar2?.textName?.charAt(0) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1953,
            columnNumber: 13
          }, this) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1949,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1947,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("h3", { className: "text-xl font-black text-white mb-4 uppercase tracking-[0.3em] text-center leading-none tracking-widest", children: selectedLang2.ui.manorTitle || "THE CLOCKWORK HEART" }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1958,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { id: "lore-box", className: "w-full flex-1 bg-black/40 p-5 border border-white/5 rounded-xl font-mono text-[11px] text-white/70 leading-relaxed overflow-y-auto no-scrollbar backdrop-blur-md", children: [
          loreText2,
          /* @__PURE__ */ jsxDEV("span", { className: "inline-block w-1.5 h-3 bg-white/50 ml-1 animate-ping" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1961,
            columnNumber: 35
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1960,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 gap-4 w-full mt-4 pt-4 border-t border-white/10", children: [
          /* @__PURE__ */ jsxDEV(motion.div, { whileHover: { y: -2 }, className: "flex flex-col items-center gap-2 cursor-pointer group", children: [
            /* @__PURE__ */ jsxDEV(LucideTrophy, { size: 18, className: "text-white/40 group-hover:text-white transition-colors" }, void 0, false, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 1966,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-white/40 group-hover:text-white tracking-widest transition-colors", children: selectedLang2.ui.manorHeirlooms || "HEIRLOOMS" }, void 0, false, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 1967,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1965,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col items-center gap-2 opacity-30 cursor-not-allowed", children: [
            /* @__PURE__ */ jsxDEV(LucideMapPin, { size: 18, className: "text-white/40" }, void 0, false, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 1970,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase text-white/40 tracking-widest", children: selectedLang2.ui.manorEstate || "ESTATE" }, void 0, false, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 1971,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1969,
            columnNumber: 25
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1964,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1935,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 1932,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 1927,
    columnNumber: 3
  }, this);
  const MissionView2 = ({ selectedLang: selectedLang2, setViewMode: setViewMode2, PROJECTS: PROJECTS2, previewId: previewId2, handlePreviewVote: handlePreviewVote2, isAuthenticated: isAuthenticated2, setIsAuthenticated: setIsAuthenticated2, oracleMessage: oracleMessage2, setStep: setStep2, setTodos: setTodos2 }) => /* @__PURE__ */ jsxDEV("div", { className: "w-full max-w-lg h-full flex flex-col items-center justify-center space-y-4 py-4 overflow-hidden", children: [
    /* @__PURE__ */ jsxDEV("button", { onClick: () => setViewMode2("gallery"), className: "text-white/40 hover:text-white uppercase text-[10px] font-black tracking-widest mb-2 self-start flex items-center gap-1 px-2", children: [
      /* @__PURE__ */ jsxDEV(LucideChevronLeft, { size: 16 }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1982,
        columnNumber: 17
      }, this),
      " ",
      selectedLang2.ui.returnGallery
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 1981,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "w-full space-y-4 overflow-y-auto no-scrollbar flex-1 pb-10 px-2 lg:px-4", children: [
      /* @__PURE__ */ jsxDEV(GlassCard, { className: "py-4 px-6 border-white/10 shadow-2xl", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-[10px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 pb-3", children: [
          /* @__PURE__ */ jsxDEV(LucideInfo, { size: 14 }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1988,
            columnNumber: 25
          }, this),
          " ",
          selectedLang2.ui.authTitle
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1987,
          columnNumber: 21
        }, this),
        !isAuthenticated2 ? /* @__PURE__ */ jsxDEV("button", { onClick: () => setIsAuthenticated2(true), className: "w-full mt-3 py-3 bg-white/5 text-white/80 text-[10px] font-black uppercase border border-white/10 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md active:scale-95", children: selectedLang2.ui.authBtn }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1991,
          columnNumber: 9
        }, this) : /* @__PURE__ */ jsxDEV("div", { className: "flex items-center justify-center gap-2 text-white/80 font-black bg-white/5 p-3 mt-3 border border-white/10 uppercase text-[10px] backdrop-blur-md", children: [
          /* @__PURE__ */ jsxDEV(LucideCheckCircle, { size: 16, className: "text-green-500/80" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 1996,
            columnNumber: 29
          }, this),
          " ",
          selectedLang2.ui.authDone
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 1995,
          columnNumber: 9
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 1986,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "space-y-4", children: PROJECTS2.map((proj) => {
        const isSelected = previewId2 === proj.id;
        const isInactive = previewId2 && !isSelected;
        return /* @__PURE__ */ jsxDEV(motion.div, { layout: true, className: `${isInactive ? "opacity-20 grayscale pointer-events-none" : ""}`, children: /* @__PURE__ */ jsxDEV(
          GlassCard,
          {
            onClick: () => !isInactive && isAuthenticated2 && handlePreviewVote2(proj.id),
            className: `cursor-pointer transition-all duration-500 overflow-hidden border p-0 ${isSelected ? "border-white/30 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "border-white/5 opacity-80 hover:border-white/20 hover:bg-white/5"}`,
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "p-5 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsxDEV("span", { className: `text-[9px] font-mono mb-1 block uppercase tracking-widest ${isSelected ? "text-white/70" : "text-white/30"}`, children: [
                    "Case #0",
                    proj.id
                  ] }, void 0, true, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 2013,
                    columnNumber: 45
                  }, this),
                  /* @__PURE__ */ jsxDEV("h4", { className: `text-base font-black uppercase tracking-widest ${isSelected ? "text-white" : "text-white/60"}`, children: proj.title }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 2014,
                    columnNumber: 45
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2012,
                  columnNumber: 41
                }, this),
                isSelected && /* @__PURE__ */ jsxDEV(LucideSparkles, { className: "text-white/80 animate-pulse", size: 18 }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2016,
                  columnNumber: 56
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 2011,
                columnNumber: 37
              }, this),
              /* @__PURE__ */ jsxDEV(AnimatePresence, { children: isSelected && /* @__PURE__ */ jsxDEV(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: "auto", opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "p-5 pt-0 border-t border-white/5 bg-black/40 backdrop-blur-md", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "mb-5 p-4 bg-white/5 border border-white/10 rounded-sm", children: /* @__PURE__ */ jsxDEV("p", { className: "text-white/80 text-[11px] italic leading-relaxed text-center font-serif", children: [
                  '"',
                  oracleMessage2 || selectedLang2.ui.consulting,
                  '"'
                ] }, void 0, true, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2022,
                  columnNumber: 53
                }, this) }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2021,
                  columnNumber: 49
                }, this),
                /* @__PURE__ */ jsxDEV("button", { onClick: () => {
                  setStep2("trailer");
                  setTodos2((p) => ({ ...p, voted: true }));
                }, className: "w-full py-4 bg-white/10 text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-white/20 active:scale-95 transition-all border border-white/20", children: selectedLang2.ui.sealBtn }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2024,
                  columnNumber: 49
                }, this)
              ] }, void 0, true, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 2020,
                columnNumber: 19
              }, this) }, void 0, false, {
                fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                lineNumber: 2018,
                columnNumber: 37
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2007,
            columnNumber: 33
          },
          this
        ) }, proj.id, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 2006,
          columnNumber: 13
        }, this);
      }) }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 2001,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 1985,
      columnNumber: 13
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 1980,
    columnNumber: 3
  }, this);
  const TrailerView = ({ selectedLang: selectedLang2, resetStates: resetStates2, setStep: setStep2 }) => /* @__PURE__ */ jsxDEV(GlassCard, { className: "text-center w-full max-w-sm mx-auto p-10 shadow-2xl relative overflow-hidden flex flex-col items-center", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" }, void 0, false, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 2041,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      motion.div,
      {
        animate: { scale: [1, 1.05, 1] },
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        className: "mb-8",
        children: /* @__PURE__ */ jsxDEV("div", { className: "w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-md", children: /* @__PURE__ */ jsxDEV(LucideLock, { className: "w-8 h-8 text-white/80" }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 2048,
          columnNumber: 21
        }, this) }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 2047,
          columnNumber: 17
        }, this)
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 2042,
        columnNumber: 13
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-4 mb-10 w-full", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-black uppercase tracking-[0.4em] text-white leading-tight", children: selectedLang2.ui.fateSealed }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 2053,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "w-12 h-[1px] bg-white/20 mx-auto" }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 2056,
        columnNumber: 17
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-white/50 italic text-[11px] leading-relaxed font-serif tracking-widest uppercase", children: "The network sleeps." }, void 0, false, {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 2057,
        columnNumber: 17
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 2052,
      columnNumber: 13
    }, this),
    /* @__PURE__ */ jsxDEV(
      "button",
      {
        onClick: () => {
          setStep2("language");
          resetStates2();
        },
        className: "w-full py-4 bg-white/5 text-white/80 font-black uppercase tracking-[0.3em] text-[10px] border border-white/10 hover:bg-white/10 hover:text-white active:scale-95 transition-all",
        children: selectedLang2.ui.returnGallery
      },
      void 0,
      false,
      {
        fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
        lineNumber: 2062,
        columnNumber: 13
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
    lineNumber: 2040,
    columnNumber: 3
  }, this);
  const useSpiritSense = async () => {
    if (!apiKey || isSpiritSensing) return;
    setIsSpiritSensing(true);
    playSfx("click");
    try {
      const prompt = `You are the House Spirit of the Lord Manor. Give a very short, cryptic, steampunk-style hint about what the guest should do next. Current step: ${step}, View: ${viewMode}. Output in ${selectedLang.name}. Max 15 words.`;
      const result = await callGemini({ contents: [{ parts: [{ text: prompt }] }] });
      setSpiritHint(result.candidates?.[0]?.content?.parts?.[0]?.text || "...");
      setTimeout(() => setSpiritHint(""), 5e3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSpiritSensing(false);
    }
  };
  const resetStates = () => {
    setPreviewId(null);
    setOracleMessage("");
    setTodos({ avatar: false, home: false, voted: false });
  };
  const currentTheme = THEME_CONFIG[selectedLang?.id] || THEME_CONFIG.ko;
  useEffect(() => {
    if (isOpeningFinished && step === "language") {
    }
  }, [isOpeningFinished]);
  return /* @__PURE__ */ jsxDEV(
    "div",
    {
      onClick: () => setTotalClicks((prev) => prev + 1),
      className: `relative w-full h-screen ${currentTheme.bg} ${currentTheme.text} ${currentTheme.font} overflow-hidden transition-colors duration-1000`,
      children: [
        /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 w-full h-full z-0 overflow-hidden", children: [
          /* @__PURE__ */ jsxDEV(
            "video",
            {
              autoPlay: true,
              loop: true,
              muted: true,
              playsInline: true,
              className: "absolute min-w-full min-h-full object-cover opacity-50 mix-blend-screen scale-105",
              src: "https://assets.codepen.io/3364143/7btrrd.mp4"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 2113,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40 backdrop-blur-[2px]" }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2122,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 2112,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV(AnimatePresence, { children: !isOpeningFinished && /* @__PURE__ */ jsxDEV("div", { className: "relative z-[10000]", children: /* @__PURE__ */ jsxDEV(
          CinematicOpening,
          {
            onStart: () => AudioManager.playMainTheme(1, 4e3),
            onComplete: () => {
              AudioManager.fadeMainTheme(0.6, 3e3);
              setIsOpeningFinished(true);
            }
          },
          void 0,
          false,
          {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2128,
            columnNumber: 25
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 2127,
          columnNumber: 9
        }, this) }, void 0, false, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 2125,
          columnNumber: 13
        }, this),
        isOpeningFinished && /* @__PURE__ */ jsxDEV(Fragment, { children: [
          !apiKey && /* @__PURE__ */ jsxDEV("div", { className: "fixed top-0 left-0 w-full z-[1000] bg-[#5C1A1A] text-[#f4e4bc] py-2 px-4 shadow-xl border-b border-[#C5A059] flex items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxDEV(LucideZap, { size: 16, className: "text-[#C5A059] animate-pulse" }, void 0, false, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 2144,
              columnNumber: 29
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-[0.2em]", children: "Linking to Aether... Set VITE_GEMINI_API_KEY" }, void 0, false, {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 2145,
              columnNumber: 29
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2143,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDEV(AetherWhispers, { text: whisper, theme: currentTheme }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2151,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("main", { className: "relative z-10 w-full h-screen flex flex-col items-center justify-center overflow-hidden px-4", children: /* @__PURE__ */ jsxDEV(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.98 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 1.02 },
              transition: { duration: 0.8, ease: "easeInOut" },
              className: "flex flex-col items-center w-full",
              children: [
                (step === "language" || step === "confirm") && /* @__PURE__ */ jsxDEV(
                  LanguageView,
                  {
                    LANGUAGES,
                    handleLanguageSelect,
                    setSpiritHint,
                    cardsExplored,
                    setCardsExplored,
                    isMinaSpeaking
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 2165,
                    columnNumber: 15
                  },
                  this
                ),
                step === "confirm" && /* @__PURE__ */ jsxDEV(ConfirmView, { selectedLang, confirmLanguage, theme: currentTheme }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2175,
                  columnNumber: 15
                }, this),
                viewMode === "coming_soon" && /* @__PURE__ */ jsxDEV(
                  ComingSoonView,
                  {
                    selectedLang,
                    currentTheme,
                    setViewMode,
                    setStep,
                    metrics: {
                      totalClicks,
                      uniqueCards: cardsExplored.size,
                      timeSpentMs: Date.now() - appStartTime
                    }
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 2178,
                    columnNumber: 15
                  },
                  this
                ),
                step === "intro" && /* @__PURE__ */ jsxDEV(
                  IntroView,
                  {
                    selectedLang,
                    userName,
                    setUserName,
                    generateTextCharacter,
                    isAvatarGenerating,
                    handleImageUpload,
                    uploadedImage,
                    generateCharacter,
                    playSfx
                  },
                  void 0,
                  false,
                  {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 2192,
                    columnNumber: 15
                  },
                  this
                ),
                step === "dashboard" && /* @__PURE__ */ jsxDEV("div", { className: "w-full h-full flex flex-col items-center justify-center", children: [
                  viewMode === "gallery" && /* @__PURE__ */ jsxDEV(
                    GalleryView,
                    {
                      selectedLang,
                      userAvatar,
                      setViewMode,
                      setTodos,
                      todos,
                      playSfx
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                      lineNumber: 2207,
                      columnNumber: 17
                    },
                    this
                  ),
                  viewMode === "home_interior" && /* @__PURE__ */ jsxDEV(
                    ManorView2,
                    {
                      selectedLang,
                      setViewMode,
                      userAvatar,
                      candleLit,
                      setCandleLit,
                      gearsSpinning,
                      setGearsSpinning,
                      loreText,
                      playSfx
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                      lineNumber: 2217,
                      columnNumber: 17
                    },
                    this
                  ),
                  viewMode === "mission_active" && /* @__PURE__ */ jsxDEV(
                    MissionView2,
                    {
                      selectedLang,
                      setViewMode,
                      PROJECTS,
                      previewId,
                      handlePreviewVote,
                      isAuthenticated,
                      setIsAuthenticated,
                      oracleMessage,
                      setStep,
                      setTodos,
                      playSfx
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                      lineNumber: 2230,
                      columnNumber: 17
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2205,
                  columnNumber: 15
                }, this),
                step === "trailer" && /* @__PURE__ */ jsxDEV(TrailerView, { selectedLang, resetStates, setStep, playSfx }, void 0, false, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2247,
                  columnNumber: 15
                }, this)
              ]
            },
            step + (selectedLang?.id || ""),
            true,
            {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 2156,
              columnNumber: 29
            },
            this
          ) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2155,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2154,
            columnNumber: 21
          }, this),
          step !== "language" && /* @__PURE__ */ jsxDEV(
            MinaDirective,
            {
              isVisible: true,
              activeStep: step,
              text: step === "confirm" ? selectedLang.ui.directiveConfirm : !todos.avatar ? selectedLang.ui.directiveAuth : !todos.home ? selectedLang.ui.directiveAvatar : selectedLang.ui.directiveDashboard,
              position: "top",
              interactionMode: "action",
              isSpeaking: isMinaSpeaking
            },
            void 0,
            false,
            {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 2255,
              columnNumber: 9
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("div", { className: "fixed bottom-8 left-8 z-[100] flex flex-col gap-4 items-start pointer-events-none", children: /* @__PURE__ */ jsxDEV(AnimatePresence, { children: spiritHint && /* @__PURE__ */ jsxDEV(
            motion.div,
            {
              initial: { opacity: 0, x: -20, scale: 0.8 },
              animate: { opacity: 1, x: 0, scale: 1 },
              exit: { opacity: 0, scale: 0.8 },
              className: "bg-white/5 backdrop-blur-2xl text-white/90 p-5 border border-white/10 shadow-2xl max-w-[280px] text-[11px] font-medium tracking-wide leading-relaxed relative flex flex-col gap-3 rounded-xl",
              children: [
                /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDEV("div", { className: "w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 2281,
                    columnNumber: 41
                  }, this),
                  /* @__PURE__ */ jsxDEV("div", { className: "text-[8px] text-white/30 tracking-[0.4em] font-black uppercase", children: "Manor Intelligence" }, void 0, false, {
                    fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                    lineNumber: 2282,
                    columnNumber: 41
                  }, this)
                ] }, void 0, true, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2280,
                  columnNumber: 37
                }, this),
                /* @__PURE__ */ jsxDEV("div", { className: "italic opacity-80 font-serif text-[13px]", children: [
                  '"',
                  spiritHint,
                  '"'
                ] }, void 0, true, {
                  fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
                  lineNumber: 2284,
                  columnNumber: 37
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
              lineNumber: 2274,
              columnNumber: 13
            },
            this
          ) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2272,
            columnNumber: 25
          }, this) }, void 0, false, {
            fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
            lineNumber: 2271,
            columnNumber: 21
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
          lineNumber: 2140,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx",
      lineNumber: 2106,
      columnNumber: 5
    },
    this
  );
};
_s5(App, "fZ//oYwXoYx7mz1kyxEhF6LmrFU=");
_c11 = App;
export default App;
var _c, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c0, _c1, _c10, _c11;
$RefreshReg$(_c, "AetherWhispers");
$RefreshReg$(_c2, "ShutterTransition");
$RefreshReg$(_c3, "Background");
$RefreshReg$(_c4, "GlassCard");
$RefreshReg$(_c5, "IntroView");
$RefreshReg$(_c6, "GalleryView");
$RefreshReg$(_c7, "ManorView");
$RefreshReg$(_c8, "MissionView");
$RefreshReg$(_c9, "ComingSoonView");
$RefreshReg$(_c0, "LanguageCard");
$RefreshReg$(_c1, "LanguageView");
$RefreshReg$(_c10, "ConfirmView");
$RefreshReg$(_c11, "App");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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QTJDO0FBQUE7QUFBQSxrQkFDcER3TjtBQUFBQSxrQkFBVztBQUFBLHFCQURqQjtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUVBO0FBQUE7QUFBQTtBQUFBLFlBWko7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBYUEsS0FmUjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQWlCQSxLQWxCSjtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQW1CQTtBQUFBLGFBdEpKO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUF3SkE7QUFBQTtBQUFBO0FBQUEsSUExTFI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBNExBO0FBRVI7QUFBRXBCLElBdnNCSUQsS0FBRztBQUFBLE9BQUhBO0FBeXNCTixlQUFlQTtBQUFJLElBQUEvTCxJQUFBSyxLQUFBRSxLQUFBSyxLQUFBYyxLQUFBaUIsS0FBQVksS0FBQVksS0FBQStQLEtBQUFDLEtBQUFDLEtBQUFDLE1BQUFDO0FBQUEsYUFBQXRVLElBQUE7QUFBQSxhQUFBSyxLQUFBO0FBQUEsYUFBQUUsS0FBQTtBQUFBLGFBQUFLLEtBQUE7QUFBQSxhQUFBYyxLQUFBO0FBQUEsYUFBQWlCLEtBQUE7QUFBQSxhQUFBWSxLQUFBO0FBQUEsYUFBQVksS0FBQTtBQUFBLGFBQUErUCxLQUFBO0FBQUEsYUFBQUMsS0FBQTtBQUFBLGFBQUFDLEtBQUE7QUFBQSxhQUFBQyxNQUFBO0FBQUEsYUFBQUMsTUFBQSIsIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJ1c2VDYWxsYmFjayIsIm1vdGlvbiIsIkFuaW1hdGVQcmVzZW5jZSIsIkNpbmVtYXRpY09wZW5pbmciLCJMdWNpZGVDaGVja0NpcmNsZSIsIkx1Y2lkZUdsb2JlIiwiTHVjaWRlSW5zdGFncmFtIiwiTHVjaWRlU3BhcmtsZXMiLCJMdWNpZGVJbmZvIiwiTHVjaWRlVm9sdW1lMiIsIkx1Y2lkZUxvYWRlcjIiLCJMdWNpZGVDaGV2cm9uTGVmdCIsIkx1Y2lkZVRyb3BoeSIsIkx1Y2lkZUxheW91dCIsIkx1Y2lkZU1hcFBpbiIsIkx1Y2lkZUZlYXRoZXIiLCJMdWNpZGVTY3JvbGwiLCJMdWNpZGVDb21wYXNzIiwiTHVjaWRlVXNlciIsIkx1Y2lkZVVwbG9hZCIsIkx1Y2lkZUNoZWNrU3F1YXJlIiwiTHVjaWRlU3F1YXJlIiwiTHVjaWRlRmxhbWUiLCJMdWNpZGVTZXR0aW5ncyIsIkx1Y2lkZUNhbWVyYSIsIkx1Y2lkZVphcCIsIkx1Y2lkZVNjYWxlIiwiTHVjaWRlQXJyb3dMZWZ0IiwiTHVjaWRlQXJyb3dSaWdodCIsIkx1Y2lkZUxvY2siLCJMdWNpZGVPcmJpdCIsIk1pbmFEaXJlY3RpdmUiLCJjYWxjdWxhdGVBcmNoZXR5cGUiLCJhcGlLZXkiLCJpbXBvcnQiLCJlbnYiLCJWSVRFX0dFTUlOSV9BUElfS0VZIiwiQlVJTERfVkVSU0lPTiIsIkF1ZGlvTWFuYWdlciIsImN1cnJlbnRTZngiLCJjdXJyZW50VGhlbWUiLCJtYWluVGhlbWUiLCJjdXJyZW50TWluYSIsInBsYXlTZngiLCJpZCIsInZvbHVtZSIsIm92ZXJsYXAiLCJBcnJheSIsImZvckVhY2giLCJhdWRpbyIsIkF1ZGlvIiwicGxheSIsImNhdGNoIiwicGF1c2UiLCJwbGF5VGhlbWUiLCJsYW5nSWQiLCJ0YXJnZXRWb2x1bWUiLCJmYWRlRHVyYXRpb24iLCJUSEVNRV9UUkFDS1MiLCJhciIsImRlIiwiZW4iLCJlcyIsImhpIiwiamEiLCJrbyIsInBsIiwiYXVkaW9TcmMiLCJ0cmFja05hbWUiLCJsZW5ndGgiLCJ0cmFja3MiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJwYXVzZWQiLCJzcmMiLCJpbmNsdWRlcyIsImN1cnJlbnRUaW1lIiwib2xkVGhlbWUiLCJvbGRWb2wiLCJmYWRlT3V0SW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJsb29wIiwic3RlcHMiLCJzdGVwVGltZSIsInZvbHVtZVN0ZXAiLCJjdXJyZW50U3RlcCIsImJhc2VUaGVtZVZvbHVtZSIsInRoZW1lRmFkZUludGVydmFsIiwibWluIiwid2luZG93Iiwiam91cm5leVRoZW1lIiwic3RvcFRoZW1lIiwicGxheU1haW5UaGVtZSIsImJhc2VNYWluVGhlbWVWb2x1bWUiLCJtYWluVGhlbWVGYWRlSW50ZXJ2YWwiLCJmYWRlTWFpblRoZW1lIiwic3RhcnRWb2x1bWUiLCJkdWNrSW50ZXJ2YWwiLCJyZXN0b3JlSW50ZXJ2YWwiLCJwbGF5TWluYSIsInN0ZXAiLCJoYXNUaGVtZSIsImhhc01haW4iLCJkdWNrVGhlbWVWb2x1bWUiLCJkdWNrTWFpblZvbHVtZSIsImR1Y2tEdXJhdGlvbiIsImN1cnJlbnRUaGVtZVZvbCIsImN1cnJlbnRNYWluVm9sIiwibWF4Iiwic2V0TWluYVNwZWFraW5nIiwic2lnbmF0dXJlQXVkaW8iLCJtaW5hQXVkaW8iLCJyYW5kb21IdW1hblNmeCIsImh1bWFuQXVkaW8iLCJvbmVuZGVkIiwicmVzdG9yZUR1cmF0aW9uIiwicHJlbG9hZFRUUyIsImxhbmdzIiwicHJlbG9hZCIsIlRIRU1FX0NPTkZJRyIsImJnIiwidGV4dCIsImFjY2VudCIsImJvcmRlciIsInNoYWRvdyIsImJsdXIiLCJmb250IiwiTEFOR1VBR0VTIiwibmFtZSIsImZsYWciLCJpbWFnZSIsIndlbGNvbWUiLCJsb2FkaW5nIiwidWkiLCJhdXRoVGl0bGUiLCJhdXRoQnRuIiwiYXV0aERvbmUiLCJnYWxsZXJ5VGl0bGUiLCJnYWxsZXJ5U3ViIiwibWFub3JUaXRsZSIsIm1hbm9ySGVpcmxvb21zIiwibWFub3JFc3RhdGUiLCJyZXR1cm5HYWxsZXJ5IiwidGV4dE9wdGlvblRpdGxlIiwidGV4dElucHV0UGxhY2Vob2xkZXIiLCJ0ZXh0U3VibWl0QnRuIiwidXBsb2FkVGl0bGUiLCJnZW5lcmF0ZUJ0biIsImdlbmVyYXRpbmciLCJjb25maXJtVGl0bGUiLCJjb25maXJtQnRuIiwiY29uZmlybURvbmUiLCJ0b2RvVGl0bGUiLCJ0b2RvMSIsInRvZG8yIiwidG9kbzMiLCJ0b2RvRG9uZSIsImNvbnN1bHRpbmciLCJzZWFsQnRuIiwiZmF0ZVNlYWxlZCIsImRpcmVjdGl2ZUxhbmd1YWdlIiwiZGlyZWN0aXZlQ29uZmlybSIsImRpcmVjdGl2ZUF1dGgiLCJkaXJlY3RpdmVBdmF0YXIiLCJkaXJlY3RpdmVEYXNoYm9hcmQiLCJjb21pbmdTb29uIiwibWluYVN5c3RlbSIsIm1pbmFBY3Rpb24iLCJpbnZpdGluZyIsImF3YWl0aW5nIiwidGFwIiwic3luYyIsImRyYWciLCJQUk9KRUNUUyIsInRpdGxlIiwiZGVzYyIsIkFldGhlcldoaXNwZXJzIiwib3BhY2l0eSIsInNjYWxlIiwiZmlsdGVyIiwiZHVyYXRpb24iLCJlYXNlIiwiX2MiLCJTaHV0dGVyVHJhbnNpdGlvbiIsImlzQWN0aXZlIiwiY2hpbGRyZW4iLCJ5IiwiX2MyIiwiQmFja2dyb3VuZCIsIl9jMyIsIkdsYXNzQ2FyZCIsImNsYXNzTmFtZSIsIm9uQ2xpY2siLCJkZWxheSIsIl9jNCIsIkludHJvVmlldyIsInNlbGVjdGVkTGFuZyIsInVzZXJOYW1lIiwic2V0VXNlck5hbWUiLCJnZW5lcmF0ZVRleHRDaGFyYWN0ZXIiLCJpc0F2YXRhckdlbmVyYXRpbmciLCJoYW5kbGVJbWFnZVVwbG9hZCIsInVwbG9hZGVkSW1hZ2UiLCJnZW5lcmF0ZUNoYXJhY3RlciIsImUiLCJ0YXJnZXQiLCJ2YWx1ZSIsInRyaW0iLCJfYzUiLCJHYWxsZXJ5VmlldyIsInVzZXJBdmF0YXIiLCJzZXRWaWV3TW9kZSIsInNldFRvZG9zIiwidG9kb3MiLCJncmlkSXRlbXMiLCJ0eXBlIiwic3VidGl0bGUiLCJpc0NlbnRlciIsIm1hcCIsInNsb3QiLCJpZHgiLCJpc1RleHRBdmF0YXIiLCJ0ZXh0TmFtZSIsImhvbWUiLCJwIiwiX2M2IiwiTWFub3JWaWV3IiwiY2FuZGxlTGl0Iiwic2V0Q2FuZGxlTGl0IiwiZ2VhcnNTcGlubmluZyIsInNldEdlYXJzU3Bpbm5pbmciLCJsb3JlVGV4dCIsImJhY2tncm91bmRJbWFnZSIsInJvdGF0ZSIsInJlcGVhdCIsIkluZmluaXR5IiwiY2hhckF0IiwiX2M3IiwiTWlzc2lvblZpZXciLCJwcmV2aWV3SWQiLCJoYW5kbGVQcmV2aWV3Vm90ZSIsImlzQXV0aGVudGljYXRlZCIsInNldElzQXV0aGVudGljYXRlZCIsIm9yYWNsZU1lc3NhZ2UiLCJzZXRTdGVwIiwicHJvaiIsImlzU2VsZWN0ZWQiLCJpc0luYWN0aXZlIiwidm90ZWQiLCJfYzgiLCJDb21pbmdTb29uVmlldyIsIm1ldHJpY3MiLCJfcyIsImFyY2hldHlwZSIsInNldEFyY2hldHlwZSIsImVuaGFuY2VkTWV0cmljcyIsInNlc3Npb25UaW1lU2Vjb25kcyIsInRpbWVTcGVudE1zIiwic2VsZWN0ZWRMYW5nSWQiLCJjYWxjdWxhdGVkIiwiY29sb3IiLCJzdWIiLCJfIiwiaSIsImhlaWdodCIsImJhY2tncm91bmRDb2xvciIsInRleHRTaGFkb3ciLCJMYW5ndWFnZUNhcmQiLCJsYW5nIiwiaXNGb2N1c2VkIiwiaXNTdGFnZWQiLCJpc0RpbW1hYmxlIiwib25Gb2N1cyIsIm9uUmVhZHkiLCJvblNlbGVjdCIsIl9zMiIsInNhdHVyYXRpb25Qcm9ncmVzcyIsInNldFNhdHVyYXRpb25Qcm9ncmVzcyIsImlzU2hha2VQYXVzZWQiLCJzZXRJc1NoYWtlUGF1c2VkIiwiYW5pbUludGVydmFsIiwiY2FyZFJlZiIsInN0YXJ0VGltZSIsIkRhdGUiLCJub3ciLCJzdGFnZSIsImN1cnJlbnQiLCJlbGFwc2VkIiwicGVyY2VudGFnZSIsInNldFRpbWVvdXQiLCJyZXF1ZXN0QmFja2dyb3VuZCIsImN1cnJlbnRTcmMiLCJzcGxpdCIsInBvcCIsInJlcXVlc3RTZXF1ZW5jZUNvbXBsZXRlIiwiaGFuZGxlRHJhZ0VuZCIsImV2ZW50IiwiaW5mbyIsImNlbnRlclgiLCJpbm5lcldpZHRoIiwiY2VudGVyWSIsImlubmVySGVpZ2h0IiwiZGlzdCIsInNxcnQiLCJwb3ciLCJwb2ludCIsIngiLCJpc0RyYWdnYWJsZSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInpJbmRleCIsInYiLCJkYW1waW5nIiwic3RpZmZuZXNzIiwidG91Y2hBY3Rpb24iLCJ0cmFuc2Zvcm0iLCJ3aWR0aCIsInJvdW5kIiwiTGFuZ3VhZ2VWaWV3IiwiaGFuZGxlTGFuZ3VhZ2VTZWxlY3QiLCJzZXRTcGlyaXRIaW50IiwiY2FyZHNFeHBsb3JlZCIsInNldENhcmRzRXhwbG9yZWQiLCJpc01pbmFTcGVha2luZyIsIl9zMyIsImZvY3VzZWRMYW5nIiwic2V0Rm9jdXNlZExhbmciLCJzdGFnZWRMYW5nIiwic2V0U3RhZ2VkTGFuZyIsIm1pbmFUZXh0Iiwic2V0TWluYVRleHQiLCJhY3RpdmVCYWNrZ3JvdW5kIiwic2V0QWN0aXZlQmFja2dyb3VuZCIsImlzSW50cm9BY3RpdmUiLCJzZXRJc0ludHJvQWN0aXZlIiwiYXVkaW9QbGF5ZWRSZWYiLCJpbnRyb1NlbnRlbmNlcyIsImludHJvU2VudGVuY2UiLCJvdmVybGF5VGltZXIiLCJ0eXBpbmdJbnRlcnZhbCIsInNsaWNlIiwiY2xlYXJUaW1lb3V0Iiwib25DYXJkRm9jdXMiLCJwcmV2IiwibmV3U2V0IiwiU2V0IiwiYWRkIiwib25DYXJkUmVhZHkiLCJwYXlsb2FkIiwibGFuZ0RhdGEiLCJob2xkUHJvZ3Jlc3MiLCJzZXRIb2xkUHJvZ3Jlc3MiLCJob2xkSW50ZXJ2YWxSZWYiLCJzdGFydEhvbGQiLCJuZXh0IiwiY2FuY2VsSG9sZCIsImhhbmRsZUFuY2hvclNlbGVjdCIsIm9uQ2FyZFNlbGVjdCIsIm92ZXJzY3JvbGxCZWhhdmlvciIsInBvcyIsImJveFNoYWRvdyIsInRvRml4ZWQiLCJib3JkZXJDb2xvciIsImlzT3JpZ2luYWxPZlN0YWdlZCIsIkNvbmZpcm1WaWV3IiwiY29uZmlybUxhbmd1YWdlIiwidGhlbWUiLCJfczQiLCJ0aW1lciIsImJvcmRlcldpZHRoIiwiZm9udFNpemUiLCJBcHAiLCJfczUiLCJpc09wZW5pbmdGaW5pc2hlZCIsInNldElzT3BlbmluZ0ZpbmlzaGVkIiwic2V0U2VsZWN0ZWRMYW5nIiwic2V0SXNNaW5hU3BlYWtpbmciLCJhcHBTdGFydFRpbWUiLCJ0b3RhbENsaWNrcyIsInNldFRvdGFsQ2xpY2tzIiwidm90ZWRJZCIsInNldFZvdGVkSWQiLCJ2aWV3TW9kZSIsInNldFByZXZpZXdJZCIsImF2YXRhciIsInNob3dUb2RvIiwic2V0U2hvd1RvZG8iLCJzZXRVc2VyQXZhdGFyIiwiYXZhdGFyTG9yZSIsInNldEF2YXRhckxvcmUiLCJzZXRJc0F2YXRhckdlbmVyYXRpbmciLCJzZXRVcGxvYWRlZEltYWdlIiwic3Bpcml0SGludCIsImlzU3Bpcml0U2Vuc2luZyIsInNldElzU3Bpcml0U2Vuc2luZyIsIndoaXNwZXIiLCJzZXRXaGlzcGVyIiwiYmdtUmVmIiwiYmdtVm9sIiwic2V0QmdtVm9sIiwid2hpc3BlckludGVydmFsIiwicmVzIiwiY2FsbEdlbWluaSIsImNvbnRlbnRzIiwicGFydHMiLCJjYW5kaWRhdGVzIiwiY29udGVudCIsInNvdW5kcyIsImNsaWNrIiwidHJhbnNpdGlvbiIsImNvbnNvbGUiLCJ3YXJuIiwic2V0TG9yZVRleHQiLCJsb3JlIiwicHJlRmV0Y2hWb2ljZSIsInZvaWNlIiwiZW5kcG9pbnQiLCJtb2RlbCIsInVybCIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJvayIsIkVycm9yIiwianNvbiIsImVyciIsIlByb21pc2UiLCJyIiwic3BlYWtUZXh0IiwiYXVkaW9DYWNoZSIsInByb21wdCIsImdlbmVyYXRpb25Db25maWciLCJyZXNwb25zZU1vZGFsaXRpZXMiLCJzcGVlY2hDb25maWciLCJ2b2ljZUNvbmZpZyIsInByZWJ1aWx0Vm9pY2VDb25maWciLCJ2b2ljZU5hbWUiLCJpbmxpbmVEYXRhIiwiYXVkaW9EYXRhIiwiZGF0YSIsInNhbXBsZVJhdGUiLCJ3YXZVcmwiLCJwY21Ub1dhdiIsInNldEF1ZGlvQ2FjaGUiLCJlcnJvciIsImxhbmdWb2ljZSIsImxhbmdOYW1lIiwiYmFzZTY0IiwiYnVmZmVyIiwiVWludDhBcnJheSIsImZyb20iLCJhdG9iIiwiYyIsImNoYXJDb2RlQXQiLCJ2aWV3IiwiRGF0YVZpZXciLCJBcnJheUJ1ZmZlciIsImJ5dGVMZW5ndGgiLCJ3cml0ZVN0cmluZyIsIm9mZnNldCIsInN0cmluZyIsInNldFVpbnQ4Iiwic2V0VWludDMyIiwic2V0VWludDE2Iiwic2V0IiwiVVJMIiwiY3JlYXRlT2JqZWN0VVJMIiwiQmxvYiIsImZpbGUiLCJmaWxlcyIsInJlYWRlciIsIkZpbGVSZWFkZXIiLCJvbmxvYWRlbmQiLCJyZXN1bHQiLCJyZWFkQXNEYXRhVVJMIiwibG9yZVJlc3VsdCIsImdlbmVyYXRlZExvcmUiLCJyb2xlIiwibWltZVR5cGUiLCJ0aW1lb3V0UHJvbWlzZSIsInJlamVjdCIsImltYWdlRmV0Y2hQcm9taXNlIiwiaW5zdGFuY2VzIiwicGFyYW1ldGVycyIsInNhbXBsZUNvdW50IiwidGhlbiIsImltYWdlRGF0YSIsInJhY2UiLCJwcmVkaWN0aW9ucyIsImdlbmVyYXRlZFVybCIsImJ5dGVzQmFzZTY0RW5jb2RlZCIsImZpbmQiLCJzZXRPcmFjbGVNZXNzYWdlIiwiVHJhaWxlclZpZXciLCJyZXNldFN0YXRlcyIsInVzZVNwaXJpdFNlbnNlIiwidW5pcXVlQ2FyZHMiLCJzaXplIiwiX2M5IiwiX2MwIiwiX2MxIiwiX2MxMCIsIl9jMTEiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsicHJlbHVkZS5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IG1vdGlvbiwgQW5pbWF0ZVByZXNlbmNlIH0gZnJvbSAnZnJhbWVyLW1vdGlvbic7XHJcbmltcG9ydCBDaW5lbWF0aWNPcGVuaW5nIGZyb20gJy4vY29tcG9uZW50cy9DaW5lbWF0aWNPcGVuaW5nJztcclxuaW1wb3J0IHtcclxuICAgIEx1Y2lkZUNoZWNrQ2lyY2xlLCBMdWNpZGVHbG9iZSwgTHVjaWRlSW5zdGFncmFtLFxyXG4gICAgTHVjaWRlU3BhcmtsZXMsIEx1Y2lkZUluZm8sIEx1Y2lkZVZvbHVtZTIsXHJcbiAgICBMdWNpZGVMb2FkZXIyLCBMdWNpZGVDaGV2cm9uTGVmdCxcclxuICAgIEx1Y2lkZVRyb3BoeSwgTHVjaWRlTGF5b3V0LCBMdWNpZGVNYXBQaW4sXHJcbiAgICBMdWNpZGVGZWF0aGVyLCBMdWNpZGVTY3JvbGwsIEx1Y2lkZUNvbXBhc3MsIEx1Y2lkZVVzZXIsIEx1Y2lkZVVwbG9hZCxcclxuICAgIEx1Y2lkZUNoZWNrU3F1YXJlLCBMdWNpZGVTcXVhcmUsIEx1Y2lkZUZsYW1lLCBMdWNpZGVTZXR0aW5ncywgTHVjaWRlQ2FtZXJhLCBMdWNpZGVaYXAsIEx1Y2lkZVNjYWxlLFxyXG4gICAgTHVjaWRlQXJyb3dMZWZ0LCBMdWNpZGVBcnJvd1JpZ2h0LCBMdWNpZGVMb2NrLFxyXG4gICAgTHVjaWRlT3JiaXRcclxufSBmcm9tICdsdWNpZGUtcmVhY3QnO1xyXG5pbXBvcnQgTWluYURpcmVjdGl2ZSBmcm9tICcuL2NvbXBvbmVudHMvTWluYURpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IGNhbGN1bGF0ZUFyY2hldHlwZSB9IGZyb20gJy4vY29tcG9uZW50cy9BcmNoZXR5cGVzJztcclxuXHJcbmNvbnN0IGFwaUtleSA9IGltcG9ydC5tZXRhLmVudi5WSVRFX0dFTUlOSV9BUElfS0VZIHx8IFwiXCI7XHJcbmNvbnN0IEJVSUxEX1ZFUlNJT04gPSBcInYxLjQuMC1jbG9ja3dvcmstbWFzdGVycGllY2UtZmluYWxcIjtcclxuXHJcbi8qKlxyXG4gKiBbVjE5XSBTaW5nbGV0b24gQXVkaW9NYW5hZ2VyXHJcbiAqIFByZXZlbnRzIG92ZXJsYXBwaW5nIHNvdW5kcyBhbmQgbWFuYWdlcyBwZXJzaXN0ZW50IHRoZW1lcy5cclxuICovXHJcbmNvbnN0IEF1ZGlvTWFuYWdlciA9IHtcclxuICAgIGN1cnJlbnRTZng6IG51bGwsXHJcbiAgICBjdXJyZW50VGhlbWU6IG51bGwsXHJcbiAgICBtYWluVGhlbWU6IG51bGwsXHJcbiAgICBjdXJyZW50TWluYTogbnVsbCxcclxuXHJcbiAgICBwbGF5U2Z4OiAoaWQsIHZvbHVtZSA9IDAuNSwgb3ZlcmxhcCA9IGZhbHNlKSA9PiB7XHJcbiAgICAgICAgaWYgKGlkID09PSAndHJhbnNpdGlvbicpIHtcclxuICAgICAgICAgICAgLy8gW1YyNl0gSGFjayB0byB0cmlwbGUgdGhlIGFtcGxpdHVkZSBvZiB0aGUgdHJhbnNpdGlvbiBlZmZlY3QgbmF0aXZlbHlcclxuICAgICAgICAgICAgWy4uLkFycmF5KDMpXS5mb3JFYWNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKGAvYXNzZXRzL3NvdW5kcy8ke2lkfS5tcDNgKTtcclxuICAgICAgICAgICAgICAgIGF1ZGlvLnZvbHVtZSA9IHZvbHVtZTtcclxuICAgICAgICAgICAgICAgIGF1ZGlvLnBsYXkoKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEF1ZGlvTWFuYWdlci5jdXJyZW50U2Z4ICYmICFvdmVybGFwKSB7XHJcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5jdXJyZW50U2Z4LnBhdXNlKCk7XHJcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5jdXJyZW50U2Z4ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYXVkaW8gPSBuZXcgQXVkaW8oYC9hc3NldHMvc291bmRzLyR7aWR9Lm1wM2ApO1xyXG4gICAgICAgIGF1ZGlvLnZvbHVtZSA9IHZvbHVtZTtcclxuICAgICAgICBhdWRpby5wbGF5KCkuY2F0Y2goKCkgPT4geyB9KTtcclxuICAgICAgICBpZiAoIW92ZXJsYXApIEF1ZGlvTWFuYWdlci5jdXJyZW50U2Z4ID0gYXVkaW87XHJcbiAgICB9LFxyXG5cclxuICAgIHBsYXlUaGVtZTogKGxhbmdJZCwgdGFyZ2V0Vm9sdW1lID0gMC40LCBmYWRlRHVyYXRpb24gPSAzMDAwKSA9PiB7XHJcbiAgICAgICAgLy8gVjI3OiBNYXAgYXZhaWxhYmxlIG5ldyB0cmFja3NcclxuICAgICAgICBjb25zdCBUSEVNRV9UUkFDS1MgPSB7XHJcbiAgICAgICAgICAgIGFyOiBbJ2FyX3NvbmcxJywgJ2FyX3NvbmcyJ10sXHJcbiAgICAgICAgICAgIGRlOiBbJ2RlX3NvbmcxJywgJ2RlX3NvbmcyJ10sXHJcbiAgICAgICAgICAgIGVuOiBbJ2VuX3NvbmcxJywgJ2VuX3NvbmcyJ10sXHJcbiAgICAgICAgICAgIGVzOiBbJ2VzX3NvbmcxJywgJ2VzX3NvbmcyJ10sXHJcbiAgICAgICAgICAgIGhpOiBbJ2luX3NvbmcxJywgJ2luX3NvbmcyJ10sXHJcbiAgICAgICAgICAgIGphOiBbJ2pwX3NvbmcxJywgJ2pwX3NvbmcyJ10sXHJcbiAgICAgICAgICAgIGtvOiBbJ2tvX3NvbmcxJywgJ2tvX3NvbmcyJ10sXHJcbiAgICAgICAgICAgIHBsOiBbJ3BvX3NvbmcxJywgJ3BvX3NvbmcyJ11cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgYXVkaW9TcmMgPSBgL2Fzc2V0cy9zb3VuZHMvJHtsYW5nSWR9LXRoZW1lLm1wM2A7IC8vIGZhbGxiYWNrXHJcbiAgICAgICAgbGV0IHRyYWNrTmFtZSA9IGAke2xhbmdJZH0tdGhlbWVgO1xyXG5cclxuICAgICAgICAvLyBSYW5kb21seSBwaWNrIGlmIG1hcHBlZFxyXG4gICAgICAgIGlmIChUSEVNRV9UUkFDS1NbbGFuZ0lkXSAmJiBUSEVNRV9UUkFDS1NbbGFuZ0lkXS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYWNrcyA9IFRIRU1FX1RSQUNLU1tsYW5nSWRdO1xyXG4gICAgICAgICAgICB0cmFja05hbWUgPSB0cmFja3NbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdHJhY2tzLmxlbmd0aCldO1xyXG4gICAgICAgICAgICBhdWRpb1NyYyA9IGAvYXNzZXRzL21hbnVhbF91cGxvYWQvbGFuZ3VhZ2VfdGhlbWEvJHt0cmFja05hbWV9LndhdmA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBQb2ludCA2OiBJbW1lZGlhdGUgc3dpdGNoLiBJZiBhbHJlYWR5IHBsYXlpbmcgdGhpcyB0aGVtZSBmcm9tIHJhbmRvbSBhcnJheSwganVzdCBleGl0LlxyXG4gICAgICAgIGlmIChBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lICYmICFBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lLnBhdXNlZCAmJiBBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lLnNyYy5pbmNsdWRlcyh0cmFja05hbWUpKSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIEZvcmNlIHN0b3AgbWFpblRoZW1lIHRvIGVuc3VyZSBubyBvdmVybGFwXHJcbiAgICAgICAgaWYgKEF1ZGlvTWFuYWdlci5tYWluVGhlbWUpIHtcclxuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZS5wYXVzZSgpO1xyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIubWFpblRoZW1lLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lKSB7XHJcbiAgICAgICAgICAgIC8vIFF1aWNrIGZhZGUgb3V0IG9mIHRoZSBvbGQgdGhlbWVcclxuICAgICAgICAgICAgY29uc3Qgb2xkVGhlbWUgPSBBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lO1xyXG4gICAgICAgICAgICBsZXQgb2xkVm9sID0gb2xkVGhlbWUudm9sdW1lO1xyXG4gICAgICAgICAgICBjb25zdCBmYWRlT3V0SW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvbGRWb2wgLT0gMC4wNTtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRWb2wgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZFRoZW1lLnBhdXNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkVGhlbWUuY3VycmVudFRpbWUgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoZmFkZU91dEludGVydmFsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2xkVGhlbWUudm9sdW1lID0gb2xkVm9sO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCA1MCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhdWRpbyA9IG5ldyBBdWRpbyhhdWRpb1NyYyk7XHJcblxyXG4gICAgICAgIC8vIFNldHVwIGZhZGUtaW5cclxuICAgICAgICBhdWRpby52b2x1bWUgPSAwO1xyXG4gICAgICAgIGF1ZGlvLmxvb3AgPSB0cnVlO1xyXG4gICAgICAgIGF1ZGlvLnBsYXkoKS5jYXRjaCgoKSA9PiB7IH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzdGVwcyA9IDIwO1xyXG4gICAgICAgIGNvbnN0IHN0ZXBUaW1lID0gZmFkZUR1cmF0aW9uIC8gc3RlcHM7XHJcbiAgICAgICAgY29uc3Qgdm9sdW1lU3RlcCA9IHRhcmdldFZvbHVtZSAvIHN0ZXBzO1xyXG4gICAgICAgIGxldCBjdXJyZW50U3RlcCA9IDA7XHJcblxyXG4gICAgICAgIEF1ZGlvTWFuYWdlci5iYXNlVGhlbWVWb2x1bWUgPSB0YXJnZXRWb2x1bWU7XHJcbiAgICAgICAgaWYgKEF1ZGlvTWFuYWdlci50aGVtZUZhZGVJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbChBdWRpb01hbmFnZXIudGhlbWVGYWRlSW50ZXJ2YWwpO1xyXG5cclxuICAgICAgICBBdWRpb01hbmFnZXIudGhlbWVGYWRlSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3RlcCA8IHN0ZXBzICYmIGF1ZGlvID09PSBBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBhdWRpby52b2x1bWUgPSBNYXRoLm1pbih0YXJnZXRWb2x1bWUsIGF1ZGlvLnZvbHVtZSArIHZvbHVtZVN0ZXApO1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFN0ZXArKztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoQXVkaW9NYW5hZ2VyLnRoZW1lRmFkZUludGVydmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHN0ZXBUaW1lKTtcclxuXHJcbiAgICAgICAgQXVkaW9NYW5hZ2VyLmN1cnJlbnRUaGVtZSA9IGF1ZGlvO1xyXG4gICAgICAgIHdpbmRvdy5qb3VybmV5VGhlbWUgPSBhdWRpbztcclxuICAgIH0sXHJcblxyXG4gICAgc3RvcFRoZW1lOiAoKSA9PiB7XHJcbiAgICAgICAgaWYgKEF1ZGlvTWFuYWdlci5jdXJyZW50VGhlbWUpIHtcclxuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmN1cnJlbnRUaGVtZS5wYXVzZSgpO1xyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHBsYXlNYWluVGhlbWU6ICh0YXJnZXRWb2x1bWUgPSAwLjUsIGZhZGVEdXJhdGlvbiA9IDMwMDApID0+IHtcclxuICAgICAgICBpZiAoQXVkaW9NYW5hZ2VyLm1haW5UaGVtZSAmJiAhQXVkaW9NYW5hZ2VyLm1haW5UaGVtZS5wYXVzZWQgJiYgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZS5zcmMuaW5jbHVkZXMoYGJhY2tncm91bmRfY2FuZGlhdGUxLm1wM2ApKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmIChBdWRpb01hbmFnZXIubWFpblRoZW1lKSB7XHJcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5tYWluVGhlbWUucGF1c2UoKTtcclxuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBhdWRpbyA9IG5ldyBBdWRpbygnL2Fzc2V0cy9zb3VuZHMvYmFja2dyb3VuZF9jYW5kaWF0ZTEubXAzJyk7XHJcbiAgICAgICAgYXVkaW8udm9sdW1lID0gMDtcclxuICAgICAgICBhdWRpby5sb29wID0gdHJ1ZTtcclxuICAgICAgICBhdWRpby5wbGF5KCkuY2F0Y2goKCkgPT4geyB9KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3RlcHMgPSAyMDtcclxuICAgICAgICBjb25zdCBzdGVwVGltZSA9IGZhZGVEdXJhdGlvbiAvIHN0ZXBzO1xyXG4gICAgICAgIGNvbnN0IHZvbHVtZVN0ZXAgPSB0YXJnZXRWb2x1bWUgLyBzdGVwcztcclxuICAgICAgICBsZXQgY3VycmVudFN0ZXAgPSAwO1xyXG5cclxuICAgICAgICBBdWRpb01hbmFnZXIuYmFzZU1haW5UaGVtZVZvbHVtZSA9IHRhcmdldFZvbHVtZTtcclxuICAgICAgICBpZiAoQXVkaW9NYW5hZ2VyLm1haW5UaGVtZUZhZGVJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbChBdWRpb01hbmFnZXIubWFpblRoZW1lRmFkZUludGVydmFsKTtcclxuXHJcbiAgICAgICAgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZUZhZGVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGVwIDwgc3RlcHMgJiYgYXVkaW8gPT09IEF1ZGlvTWFuYWdlci5tYWluVGhlbWUpIHtcclxuICAgICAgICAgICAgICAgIGF1ZGlvLnZvbHVtZSA9IE1hdGgubWluKHRhcmdldFZvbHVtZSwgYXVkaW8udm9sdW1lICsgdm9sdW1lU3RlcCk7XHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RlcCsrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChBdWRpb01hbmFnZXIubWFpblRoZW1lRmFkZUludGVydmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHN0ZXBUaW1lKTtcclxuXHJcbiAgICAgICAgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZSA9IGF1ZGlvO1xyXG4gICAgfSxcclxuXHJcbiAgICBmYWRlTWFpblRoZW1lOiAodGFyZ2V0Vm9sdW1lLCBmYWRlRHVyYXRpb24gPSAyMDAwKSA9PiB7XHJcbiAgICAgICAgaWYgKCFBdWRpb01hbmFnZXIubWFpblRoZW1lKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgYXVkaW8gPSBBdWRpb01hbmFnZXIubWFpblRoZW1lO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0Vm9sdW1lID0gYXVkaW8udm9sdW1lO1xyXG4gICAgICAgIGNvbnN0IHN0ZXBzID0gNDA7XHJcbiAgICAgICAgY29uc3Qgc3RlcFRpbWUgPSBmYWRlRHVyYXRpb24gLyBzdGVwcztcclxuICAgICAgICBsZXQgY3VycmVudFN0ZXAgPSAwO1xyXG5cclxuICAgICAgICBBdWRpb01hbmFnZXIuYmFzZU1haW5UaGVtZVZvbHVtZSA9IHRhcmdldFZvbHVtZTtcclxuICAgICAgICBpZiAoQXVkaW9NYW5hZ2VyLm1haW5UaGVtZUZhZGVJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbChBdWRpb01hbmFnZXIubWFpblRoZW1lRmFkZUludGVydmFsKTtcclxuXHJcbiAgICAgICAgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZUZhZGVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGN1cnJlbnRTdGVwIDwgc3RlcHMgJiYgYXVkaW8gPT09IEF1ZGlvTWFuYWdlci5tYWluVGhlbWUpIHtcclxuICAgICAgICAgICAgICAgIGF1ZGlvLnZvbHVtZSA9IHN0YXJ0Vm9sdW1lICsgKHRhcmdldFZvbHVtZSAtIHN0YXJ0Vm9sdW1lKSAqIChjdXJyZW50U3RlcCAvIHN0ZXBzKTtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRTdGVwKys7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXVkaW8gPT09IEF1ZGlvTWFuYWdlci5tYWluVGhlbWUpIGF1ZGlvLnZvbHVtZSA9IHRhcmdldFZvbHVtZTtcclxuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoQXVkaW9NYW5hZ2VyLm1haW5UaGVtZUZhZGVJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCBzdGVwVGltZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGR1Y2tJbnRlcnZhbDogbnVsbCxcclxuICAgIHJlc3RvcmVJbnRlcnZhbDogbnVsbCxcclxuICAgIGJhc2VUaGVtZVZvbHVtZTogMC40LFxyXG4gICAgYmFzZU1haW5UaGVtZVZvbHVtZTogMC42LFxyXG5cclxuICAgIHBsYXlNaW5hOiAobGFuZ0lkLCBzdGVwLCB2b2x1bWUgPSAxLjApID0+IHtcclxuICAgICAgICBpZiAoQXVkaW9NYW5hZ2VyLmN1cnJlbnRNaW5hKSB7XHJcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5jdXJyZW50TWluYS5wYXVzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gLS0tIDEuIEF1ZGlvIER1Y2tpbmcgRG93biB0byAyMCUgLS0tXHJcbiAgICAgICAgY29uc3QgaGFzVGhlbWUgPSBBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lICYmICFBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lLnBhdXNlZDtcclxuICAgICAgICBjb25zdCBoYXNNYWluID0gQXVkaW9NYW5hZ2VyLm1haW5UaGVtZSAmJiAhQXVkaW9NYW5hZ2VyLm1haW5UaGVtZS5wYXVzZWQ7XHJcblxyXG4gICAgICAgIGlmIChoYXNUaGVtZSB8fCBoYXNNYWluKSB7XHJcbiAgICAgICAgICAgIC8vIENhbmNlbCBhbnkgb25nb2luZyBmYWRlcyB0byBwcmV2ZW50IGZpZ2h0aW5nIHdpdGggZHVja2luZ1xyXG4gICAgICAgICAgICBpZiAoQXVkaW9NYW5hZ2VyLnRoZW1lRmFkZUludGVydmFsKSBjbGVhckludGVydmFsKEF1ZGlvTWFuYWdlci50aGVtZUZhZGVJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIGlmIChBdWRpb01hbmFnZXIubWFpblRoZW1lRmFkZUludGVydmFsKSBjbGVhckludGVydmFsKEF1ZGlvTWFuYWdlci5tYWluVGhlbWVGYWRlSW50ZXJ2YWwpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2xlYXIgYW55IGV4aXN0aW5nIGR1Y2svcmVzdG9yZSBpbnRlcnZhbHNcclxuICAgICAgICAgICAgaWYgKEF1ZGlvTWFuYWdlci5kdWNrSW50ZXJ2YWwpIGNsZWFySW50ZXJ2YWwoQXVkaW9NYW5hZ2VyLmR1Y2tJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIGlmIChBdWRpb01hbmFnZXIucmVzdG9yZUludGVydmFsKSBjbGVhckludGVydmFsKEF1ZGlvTWFuYWdlci5yZXN0b3JlSW50ZXJ2YWwpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmFkZSBkb3duIHRvIDIwJSBvZiB0aGUgZXhwbGljaXRseSBzZXQgYmFzZSB2b2x1bWUgb3ZlciAyIHNlY29uZHNcclxuICAgICAgICAgICAgY29uc3QgZHVja1RoZW1lVm9sdW1lID0gQXVkaW9NYW5hZ2VyLmJhc2VUaGVtZVZvbHVtZSAqIDAuMjtcclxuICAgICAgICAgICAgY29uc3QgZHVja01haW5Wb2x1bWUgPSBBdWRpb01hbmFnZXIuYmFzZU1haW5UaGVtZVZvbHVtZSAqIDAuMjtcclxuICAgICAgICAgICAgY29uc3QgZHVja0R1cmF0aW9uID0gMjAwMDtcclxuICAgICAgICAgICAgY29uc3Qgc3RlcHMgPSA0MDsgLy8gNTBtcyBpbnRlcnZhbHNcclxuICAgICAgICAgICAgY29uc3Qgc3RlcFRpbWUgPSBkdWNrRHVyYXRpb24gLyBzdGVwcztcclxuXHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50VGhlbWVWb2wgPSBoYXNUaGVtZSA/IEF1ZGlvTWFuYWdlci5jdXJyZW50VGhlbWUudm9sdW1lIDogMDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRNYWluVm9sID0gaGFzTWFpbiA/IEF1ZGlvTWFuYWdlci5tYWluVGhlbWUudm9sdW1lIDogMDtcclxuICAgICAgICAgICAgbGV0IGN1cnJlbnRTdGVwID0gMDtcclxuXHJcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5kdWNrSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFN0ZXAgPCBzdGVwcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNUaGVtZSAmJiBBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRUaGVtZVZvbCAtPSAoY3VycmVudFRoZW1lVm9sIC0gZHVja1RoZW1lVm9sdW1lKSAvIChzdGVwcyAtIGN1cnJlbnRTdGVwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmN1cnJlbnRUaGVtZS52b2x1bWUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBjdXJyZW50VGhlbWVWb2wpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc01haW4gJiYgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TWFpblZvbCAtPSAoY3VycmVudE1haW5Wb2wgLSBkdWNrTWFpblZvbHVtZSkgLyAoc3RlcHMgLSBjdXJyZW50U3RlcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5tYWluVGhlbWUudm9sdW1lID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgY3VycmVudE1haW5Wb2wpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFN0ZXArKztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChBdWRpb01hbmFnZXIuZHVja0ludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIuZHVja0ludGVydmFsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgc3RlcFRpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcpIHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcodHJ1ZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZUF1ZGlvID0gbmV3IEF1ZGlvKGAvYXNzZXRzL3NvdW5kcy9zaWduYXR1cmUvc2lnLSR7bGFuZ0lkfS5tcDNgKTtcclxuICAgICAgICBzaWduYXR1cmVBdWRpby52b2x1bWUgPSB2b2x1bWU7XHJcblxyXG4gICAgICAgIGNvbnN0IG1pbmFBdWRpbyA9IG5ldyBBdWRpbyhgL2Fzc2V0cy9zb3VuZHMvbWluYS9taW5hLSR7bGFuZ0lkfS0ke3N0ZXB9Lm1wM2ApO1xyXG4gICAgICAgIG1pbmFBdWRpby52b2x1bWUgPSB2b2x1bWU7XHJcblxyXG4gICAgICAgIGNvbnN0IHJhbmRvbUh1bWFuU2Z4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApICsgMTtcclxuICAgICAgICBjb25zdCBodW1hbkF1ZGlvID0gbmV3IEF1ZGlvKGAvYXNzZXRzL3NvdW5kcy9taW5hLWh1bWFuL2h1bWFuLSR7cmFuZG9tSHVtYW5TZnh9Lm1wM2ApO1xyXG4gICAgICAgIGh1bWFuQXVkaW8udm9sdW1lID0gdm9sdW1lICogMC44O1xyXG5cclxuICAgICAgICAvLyAtLS0gMi4gUmVzdG9yZSBWb2x1bWUgdXBvbiBDb21wbGV0ZSAtLS1cclxuICAgICAgICBtaW5hQXVkaW8ub25lbmRlZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcpIHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcoZmFsc2UpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNUaGVtZSA9IEF1ZGlvTWFuYWdlci5jdXJyZW50VGhlbWUgJiYgIUF1ZGlvTWFuYWdlci5jdXJyZW50VGhlbWUucGF1c2VkO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNNYWluID0gQXVkaW9NYW5hZ2VyLm1haW5UaGVtZSAmJiAhQXVkaW9NYW5hZ2VyLm1haW5UaGVtZS5wYXVzZWQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoaGFzVGhlbWUgfHwgaGFzTWFpbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKEF1ZGlvTWFuYWdlci5kdWNrSW50ZXJ2YWwpIGNsZWFySW50ZXJ2YWwoQXVkaW9NYW5hZ2VyLmR1Y2tJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoQXVkaW9NYW5hZ2VyLnJlc3RvcmVJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbChBdWRpb01hbmFnZXIucmVzdG9yZUludGVydmFsKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBGYWRlIHVwIHRvIGJhc2Ugdm9sdW1lIG92ZXIgNCBzZWNvbmRzXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN0b3JlRHVyYXRpb24gPSA0MDAwO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcHMgPSA4MDsgLy8gNTBtcyBpbnRlcnZhbHNcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0ZXBUaW1lID0gcmVzdG9yZUR1cmF0aW9uIC8gc3RlcHM7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRUaGVtZVZvbCA9IGhhc1RoZW1lID8gQXVkaW9NYW5hZ2VyLmN1cnJlbnRUaGVtZS52b2x1bWUgOiAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRNYWluVm9sID0gaGFzTWFpbiA/IEF1ZGlvTWFuYWdlci5tYWluVGhlbWUudm9sdW1lIDogMDtcclxuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50U3RlcCA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnJlc3RvcmVJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFN0ZXAgPCBzdGVwcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGFzVGhlbWUgJiYgQXVkaW9NYW5hZ2VyLmN1cnJlbnRUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRoZW1lVm9sICs9IChBdWRpb01hbmFnZXIuYmFzZVRoZW1lVm9sdW1lIC0gY3VycmVudFRoZW1lVm9sKSAvIChzdGVwcyAtIGN1cnJlbnRTdGVwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5jdXJyZW50VGhlbWUudm9sdW1lID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgY3VycmVudFRoZW1lVm9sKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc01haW4gJiYgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudE1haW5Wb2wgKz0gKEF1ZGlvTWFuYWdlci5iYXNlTWFpblRoZW1lVm9sdW1lIC0gY3VycmVudE1haW5Wb2wpIC8gKHN0ZXBzIC0gY3VycmVudFN0ZXApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZS52b2x1bWUgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCBjdXJyZW50TWFpblZvbCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTdGVwKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhhc1RoZW1lICYmIEF1ZGlvTWFuYWdlci5jdXJyZW50VGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5jdXJyZW50VGhlbWUudm9sdW1lID0gMS4wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoYXNNYWluICYmIEF1ZGlvTWFuYWdlci5tYWluVGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5tYWluVGhlbWUudm9sdW1lID0gQXVkaW9NYW5hZ2VyLmJhc2VNYWluVGhlbWVWb2x1bWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChBdWRpb01hbmFnZXIucmVzdG9yZUludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnJlc3RvcmVJbnRlcnZhbCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgc3RlcFRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaHVtYW5BdWRpby5vbmVuZGVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBtaW5hQXVkaW8ucGxheSgpLmNhdGNoKCgpID0+IHsgaWYgKHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcpIHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcoZmFsc2UpOyB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzaWduYXR1cmVBdWRpby5vbmVuZGVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBodW1hbkF1ZGlvLnBsYXkoKS5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBtaW5hQXVkaW8ucGxheSgpLmNhdGNoKCgpID0+IHsgaWYgKHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcpIHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcoZmFsc2UpOyB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgc2lnbmF0dXJlQXVkaW8ucGxheSgpLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgLy8gRmFsbGJhY2sgaWYgc2lnbmF0dXJlIGZhaWxzXHJcbiAgICAgICAgICAgIGh1bWFuQXVkaW8ucGxheSgpLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIG1pbmFBdWRpby5wbGF5KCkuY2F0Y2goKCkgPT4geyBpZiAod2luZG93LnNldE1pbmFTcGVha2luZykgd2luZG93LnNldE1pbmFTcGVha2luZyhmYWxzZSk7IH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBBdWRpb01hbmFnZXIuY3VycmVudE1pbmEgPSBtaW5hQXVkaW87XHJcbiAgICB9LFxyXG5cclxuICAgIHByZWxvYWRUVFM6ICgpID0+IHtcclxuICAgICAgICBjb25zdCBsYW5ncyA9IFsnZW4nLCAna28nLCAnZXMnLCAnaGknLCAnZGUnLCAnamEnLCAnYXInLCAncGwnXTtcclxuICAgICAgICBsYW5ncy5mb3JFYWNoKGxhbmdJZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKGAvYXNzZXRzL3NvdW5kcy9taW5hL21pbmEtJHtsYW5nSWR9LWNvbWluZ3Nvb24ubXAzYCk7XHJcbiAgICAgICAgICAgIGF1ZGlvLnByZWxvYWQgPSAnYXV0byc7IC8vIEZldGNoIGluIHRoZSBiYWNrZ3JvdW5kIGF1dG9tYXRpY2FsbHlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIFtWMTAgVVBEQVRFOiBDaW5lbWF0aWMgRWRpdG9yaWFsIC0gTXV0ZWQgVG9uZXMgJiBEaWZmdXNlZCBHbG93XVxyXG5jb25zdCBUSEVNRV9DT05GSUcgPSB7XHJcbiAgICBrbzogeyBiZzogJ2JnLVsjMTIxMTE0XScsIHRleHQ6ICd0ZXh0LVsjRUZFRkYwXScsIGFjY2VudDogJ3RleHQtWyM5QThDOUVdJywgYm9yZGVyOiAnYm9yZGVyLVsjOUE4QzlFXS80MCcsIHNoYWRvdzogJ3NoYWRvdy1bIzlBOEM5RV0vMTAnLCBibHVyOiAnYmFja2Ryb3AtYmx1ci1zbScsIGZvbnQ6ICdmb250LXNlcmlmJyB9LCAvLyBNdXRlZCBMYXZlbmRlclxyXG4gICAgZW46IHsgYmc6ICdiZy1bIzBGMTExNV0nLCB0ZXh0OiAndGV4dC1bI0YwRjJGNV0nLCBhY2NlbnQ6ICd0ZXh0LVsjNEE2NDc4XScsIGJvcmRlcjogJ2JvcmRlci1bIzRBNjQ3OF0vNDAnLCBzaGFkb3c6ICdzaGFkb3ctWyM0QTY0NzhdLzEwJywgYmx1cjogJ2JhY2tkcm9wLWJsdXItc20nLCBmb250OiAnZm9udC1zYW5zJyB9LCAvLyBNdXRlZCBFbGVjdHJpYyBCbHVlXHJcbiAgICBlczogeyBiZzogJ2JnLVsjMTUxMjExXScsIHRleHQ6ICd0ZXh0LVsjRjVFQkU4XScsIGFjY2VudDogJ3RleHQtWyNBNjdCNzFdJywgYm9yZGVyOiAnYm9yZGVyLVsjQTY3QjcxXS80MCcsIHNoYWRvdzogJ3NoYWRvdy1bI0E2N0I3MV0vMTAnLCBibHVyOiAnYmFja2Ryb3AtYmx1ci1zbScsIGZvbnQ6ICdmb250LXNlcmlmJyB9LCAvLyBNdXRlZCBDb3JhbFxyXG4gICAgaGk6IHsgYmc6ICdiZy1bIzE0MTIwRl0nLCB0ZXh0OiAndGV4dC1bI0Y1RjJFQ10nLCBhY2NlbnQ6ICd0ZXh0LVsjQjA4RDVCXScsIGJvcmRlcjogJ2JvcmRlci1bI0IwOEQ1Ql0vNDAnLCBzaGFkb3c6ICdzaGFkb3ctWyNCMDhENUJdLzEwJywgYmx1cjogJ2JhY2tkcm9wLWJsdXItc20nLCBmb250OiAnZm9udC1zYW5zJyB9LCAvLyBNdXRlZCBBbWJlclxyXG4gICAgZGU6IHsgYmc6ICdiZy1bIzEwMTIxMV0nLCB0ZXh0OiAndGV4dC1bI0VDRUZFRl0nLCBhY2NlbnQ6ICd0ZXh0LVsjN0Q5MTg1XScsIGJvcmRlcjogJ2JvcmRlci1bIzdEOTE4NV0vNDAnLCBzaGFkb3c6ICdzaGFkb3ctWyM3RDkxODVdLzEwJywgYmx1cjogJ2JhY2tkcm9wLWJsdXItc20nLCBmb250OiAnZm9udC1zZXJpZicgfSwgLy8gTXV0ZWQgU2FnZSBHcmVlblxyXG4gICAgamE6IHsgYmc6ICdiZy1bIzBFMTExMl0nLCB0ZXh0OiAndGV4dC1bI0VCRjFGMl0nLCBhY2NlbnQ6ICd0ZXh0LVsjNkI4Qzk2XScsIGJvcmRlcjogJ2JvcmRlci1bIzZCOEM5Nl0vNDAnLCBzaGFkb3c6ICdzaGFkb3ctWyM2QjhDOTZdLzEwJywgYmx1cjogJ2JhY2tkcm9wLWJsdXItc20nLCBmb250OiAnZm9udC1zZXJpZicgfSwgLy8gTXV0ZWQgQ3lhblxyXG4gICAgYXI6IHsgYmc6ICdiZy1bIzEzMTAxM10nLCB0ZXh0OiAndGV4dC1bI0Y0RUVGNF0nLCBhY2NlbnQ6ICd0ZXh0LVsjOTY2Qjg0XScsIGJvcmRlcjogJ2JvcmRlci1bIzk2NkI4NF0vNDAnLCBzaGFkb3c6ICdzaGFkb3ctWyM5NjZCODRdLzEwJywgYmx1cjogJ2JhY2tkcm9wLWJsdXItc20nLCBmb250OiAnZm9udC1zZXJpZicgfSwgLy8gTXV0ZWQgTWFnZW50YVxyXG4gICAgcGw6IHsgYmc6ICdiZy1bIzEyMTIxMl0nLCB0ZXh0OiAndGV4dC1bI0VFRUVFRV0nLCBhY2NlbnQ6ICd0ZXh0LVsjOEE4QThBXScsIGJvcmRlcjogJ2JvcmRlci1bIzhBOEE4QV0vNDAnLCBzaGFkb3c6ICdzaGFkb3ctWyM4QThBOEFdLzEwJywgYmx1cjogJ2JhY2tkcm9wLWJsdXItc20nLCBmb250OiAnZm9udC1zZXJpZicgfSAgLy8gTXV0ZWQgQXNoXHJcbn07XHJcblxyXG5jb25zdCBMQU5HVUFHRVMgPSBbXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6ICdrbycsIG5hbWU6ICftlZzqta3slrQnLCBmbGFnOiAn8J+HsPCfh7cnLFxyXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTcxNTQ0MjE3NzMtMDUyOWYyOWVhNDUxP3E9ODAmdz04MDAmYXV0bz1mb3JtYXQmZml0PWNyb3AnLCAvLyBTZW91bCBuZW9uIG5pZ2h0XHJcbiAgICAgICAgd2VsY29tZTogXCLroZzrk5wg66ek64SI7JeQIOyYpOyLoCDqsoPsnYQg7ZmY7JiB7ZWp64uI64ukLiDsmrTrqoXsnZgg7Yax64uI67CU7YC06rCAIOuLueyLoOydhCDquLDri6Trpr3ri4jri6QuXCIsXHJcbiAgICAgICAgbG9hZGluZzogXCLtgazroZzrhbjrr7jthLAg7Luo7ISk7YyFIOykkS4uLlwiLFxyXG4gICAgICAgIHVpOiB7XHJcbiAgICAgICAgICAgIGF1dGhUaXRsZTogXCLsi6Dsm5Ag7J247KadXCIsIGF1dGhCdG46IFwi7JiB7Zi87J2YIOyekOqyqSDspp3rqoVcIiwgYXV0aERvbmU6IFwi7Iug7JuQIOq4sOuhnSDsmYTro4xcIixcclxuICAgICAgICAgICAgZ2FsbGVyeVRpdGxlOiBcIuunpOuEiCDquLDroZ0g67O06rSA7IaMXCIsIGdhbGxlcnlTdWI6IFwi7Jet7IKs7KCBIOq4sOuhnSAxODk5XCIsXHJcbiAgICAgICAgICAgIG1hbm9yVGl0bGU6IFwi6riw6rOE64+Z66ClIOyLrOyepeu2gFwiLCBtYW5vckhlaXJsb29tczogXCLshKDsobDsnZgg7Jyg66y8XCIsIG1hbm9yRXN0YXRlOiBcIuyggO2DnSDrtoDsp4BcIixcclxuICAgICAgICAgICAgcmV0dXJuR2FsbGVyeTogXCLrs7TqtIDshozroZwg64+M7JWE6rCA6riwXCIsIHRleHRPcHRpb25UaXRsZTogXCLri7nsi6DsnZgg7J2066aE7J2EIOq4sOuhne2VmOyEuOyalFwiLFxyXG4gICAgICAgICAgICB0ZXh0SW5wdXRQbGFjZWhvbGRlcjogXCLrsKnrrLjsnpAg7J2066aELi4uXCIsIHRleHRTdWJtaXRCdG46IFwi7J2066aEIOuCqOq4sOq4sFwiLFxyXG4gICAgICAgICAgICB1cGxvYWRUaXRsZTogXCLsl5DthYzrpbQg7Y+s7Yq466CI7J6HIOyKpOy6lFwiLCBnZW5lcmF0ZUJ0bjogXCLsnpDslYQg7Jew7ISxXCIsIGdlbmVyYXRpbmc6IFwi67OA7ZmYIOykkS4uLlwiLFxyXG4gICAgICAgICAgICBjb25maXJtVGl0bGU6IFwi64u57Iug7J2YIOyEuOqzhOqwgCDrp57sirXri4jquYw/XCIsIGNvbmZpcm1CdG46IFwi7ZmV7KCV7ZWp64uI64ukXCIsIGNvbmZpcm1Eb25lOiBcIuyWuOyWtCDrj5nquLDtmZQg7JmE66OMXCIsXHJcbiAgICAgICAgICAgIHRvZG9UaXRsZTogXCLshKDslrjrrLhcIiwgdG9kbzE6IFwi7Iug7JuQIO2ZleumvVwiLCB0b2RvMjogXCLsi6zsnqUg7KCQ6rKAXCIsIHRvZG8zOiBcIuyatOuqhSDrtInsnbhcIiwgdG9kb0RvbmU6IFwi7Jq066qF7J20IOuwnO2YhOuQmOyXiOyKteuLiOuLpC5cIixcclxuICAgICAgICAgICAgY29uc3VsdGluZzogXCLslYzqs6DrpqzsppjsnbQg7IaN7IKt7J6F64uI64ukLi4uXCIsIHNlYWxCdG46IFwi7J20IOyatOuqheydhCDrtInsnbjtlZjquLBcIiwgZmF0ZVNlYWxlZDogXCLsmrTrqoUg7ZmV7KCVXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUxhbmd1YWdlOiBcIuuPmeq4sO2ZlCDsmYTro4wuIOyEoO2Dne2VnCDtj6ztirjroIjsnofsnYQg7KSR7JWZ7Jy866GcIOuBjOyWtOyZgCDrqYDti7DrsoTsiqTrpbwg7ZmV7KCV7ZWY7IS47JqULiDsi5zqsITsnYAg6rCA7Jew7ISxIOuGkuydgCDsnpDsm5DsnbTri4gg7KeA7LK07ZWY7KeAIOuniOyLnOq4uC5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQ29uZmlybTogXCLtg4Hsm5TtlZwg6rKw64uo7J6F64uI64ukLiDsnbTsoJwg7KeA66y47J2EIOywjeyWtCDsmrTrqoXsnYQg67SJ7J247ZWY7IS47JqULiDtj63rsJzsnYAg66m07ZWgIOqygeuLiOuLpC5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQXV0aDogXCLsnbTrpoTsnYQg65Ox66Gd7ZWY6rGw64KYIOy0iOyDge2ZlOulvCDsoJzstpztlbQg7Iug7JuQ7J2EIOyduOymne2VmOyEuOyalC4g6riw6rOE64qUIOycoOugueydhCDtg5zsmrDsp4Ag7JWK7Iq164uI64ukLlwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVBdmF0YXI6IFwi7Y6Y66W07IaM64KYIOyXsOyEsSDsmYTro4wuIOq9pCDrtJDspIQg66eM7ZWY6rWw7JqULiDsnbTsoJwg7KCA7YOd7J2YIOq4sOuhnSDrs7TqtIDshozroZwg7J2064+Z7ZWY7Iuc7KOgLlwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVEYXNoYm9hcmQ6IFwi6riw66GdIOuztOq0gOyGjCDsp4TsnoUg7ISx6rO1LiDqsIEg6riw66Gd7J2EIO2Dre2VmOyXrCDsobDsgqztlZjshLjsmpQuIOuzteuPhOyXkOyEnCDquLjsnYQg7J6D7Ja064+EIOq1rO2VmOufrCDqsIDsp4Ag7JWK7Iq164uI64ukLlwiLFxyXG4gICAgICAgICAgICBjb21pbmdTb29uOiBcIuqzpyDrj4zslYTsmLXri4jri6RcIixcclxuICAgICAgICAgICAgbWluYVN5c3RlbTogXCLsi5zsiqTthZwg6rWs7KGw7LK0IDog66+464KYXCIsIG1pbmFBY3Rpb246IFwiPj4g7ZaJ64+ZIO2VhOyalCA6IOyWuOyWtOulvCDshKDtg53tlZjsi63si5zsmKQgPDxcIixcclxuICAgICAgICAgICAgaW52aXRpbmc6IFwi66mA7Yuw67KE7Iqk66GcIOynhOyehSDspJEuLi5cIiwgYXdhaXRpbmc6IFwi7KCA7YOd7J20IOuLueyLoOydmCDsmIHtmLzsnYQg6riw64uk66a964uI64ukLlwiLFxyXG4gICAgICAgICAgICB0YXA6IFwi7YOt7ZWY7JesIOyEoO2DnVwiLCBzeW5jOiBcIuuPmeq4sO2ZlCDspJFcIiwgZHJhZzogXCLqsIDsmrTrjbDroZwg65Oc656Y6re4XCIsIGZhdGVTZWFsZWQ6IFwi7Jq066qFIO2ZleyglVwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpZDogJ2VuJywgbmFtZTogJ0VuZ2xpc2gnLCBmbGFnOiAn8J+HrPCfh6cnLFxyXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTM2MzUyNjk5NzUtNTk2NjNlMGFjMWFkP3E9ODAmdz04MDAmYXV0bz1mb3JtYXQmZml0PWNyb3AnLCAvLyBMb25kb24gZm9nL2JyaWRnZVxyXG4gICAgICAgIHdlbGNvbWU6IFwiV2VsY29tZSB0byB0aGUgTG9yZCBNYW5vciwgZ3Vlc3QuIFRoZSBnZWFycyBvZiBkZXN0aW55IGF3YWl0IHlvdXIgdG91Y2guXCIsXHJcbiAgICAgICAgbG9hZGluZzogXCJDb25zdWx0aW5nIHRoZSBDaHJvbm9tZXRlci4uLlwiLFxyXG4gICAgICAgIHVpOiB7XHJcbiAgICAgICAgICAgIGF1dGhUaXRsZTogXCJBZXRoZXIgSWRlbnRpdHlcIiwgYXV0aEJ0bjogXCJWZXJpZnkgU291bCBJbXByaW50XCIsIGF1dGhEb25lOiBcIklkZW50aXR5IFNlYWxlZFwiLFxyXG4gICAgICAgICAgICBnYWxsZXJ5VGl0bGU6IFwiTUFOT1IgQVJDSElWRVwiLCBnYWxsZXJ5U3ViOiBcIkhpc3RvcmljYWwgUmVjb3JkIDE4OTlcIixcclxuICAgICAgICAgICAgbWFub3JUaXRsZTogXCJUaGUgQ2xvY2t3b3JrIEhlYXJ0XCIsIG1hbm9ySGVpcmxvb21zOiBcIkFuY2VzdHJhbCBHZWFyc1wiLCBtYW5vckVzdGF0ZTogXCJNYW5vciBHcm91bmRzXCIsXHJcbiAgICAgICAgICAgIHJldHVybkdhbGxlcnk6IFwiUmV0dXJuIHRvIEFyY2hpdmVcIiwgdGV4dE9wdGlvblRpdGxlOiBcIkluc2NyaWJlIFlvdXIgTmFtZVwiLFxyXG4gICAgICAgICAgICB0ZXh0SW5wdXRQbGFjZWhvbGRlcjogXCJHdWVzdCBOYW1lLi4uXCIsIHRleHRTdWJtaXRCdG46IFwiU3VtbW9uIElkZW50aXR5XCIsXHJcbiAgICAgICAgICAgIHVwbG9hZFRpdGxlOiBcIlNjYW4gQWV0aGVyIFBvcnRyYWl0XCIsIGdlbmVyYXRlQnRuOiBcIkZvcmdlIFNvdWxcIiwgZ2VuZXJhdGluZzogXCJUcmFuc211dGluZy4uLlwiLFxyXG4gICAgICAgICAgICBjb25maXJtVGl0bGU6IFwiSXMgdGhpcyB5b3VyIG5hdGl2ZSB0b25ndWU/XCIsIGNvbmZpcm1CdG46IFwiSSBBZ3JlZVwiLCBjb25maXJtRG9uZTogXCJMYW5ndWFnZSBCb3VuZFwiLFxyXG4gICAgICAgICAgICB0b2RvVGl0bGU6IFwiTWFuaWZlc3RcIiwgdG9kbzE6IFwiRm9yZ2UgSWRlbnRpdHlcIiwgdG9kbzI6IFwiSW5zcGVjdCBIZWFydFwiLCB0b2RvMzogXCJTZWFsIEZhdGVcIiwgdG9kb0RvbmU6IFwiRGVzdGlueSBtYW5pZmVzdGVkLlwiLFxyXG4gICAgICAgICAgICBjb25zdWx0aW5nOiBcIlRoZSBBbGdvcml0aG0gd2hpc3BlcnMuLi5cIiwgc2VhbEJ0bjogXCJTZWFsIHRoaXMgZmF0ZVwiLCBmYXRlU2VhbGVkOiBcIkZhdGUgTG9ja2VkXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUxhbmd1YWdlOiBcIlN5bmNocm9uaXphdGlvbiBhY2hpZXZlZC4gRHJhZyB0aGUgY2hvc2VuIHBvcnRyYWl0IHRvIHRoZSBjZW50ZXIgdG8gbG9jayB5b3VyIG11bHRpdmVyc2UuIFRpbWUgaXMgaGlnaGx5IGZsYW1tYWJsZSwgZG8gbm90IGRhd2RsZS5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQ29uZmlybTogXCJBIGNhbGN1bGF0ZWQgY2hvaWNlLiBJbXByaW50IHlvdXIgdGh1bWIgdG8gc2VhbCB0aGlzIGZhdGUuIFdlIHNob3VsZCBhdm9pZCBhbnkgc3BvbnRhbmVvdXMgY29tYnVzdGlvbi5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQXV0aDogXCJJZGVudGl0eSB2ZXJpZmljYXRpb24gcmVxdWlyZWQuIEluayB5b3VyIG5hbWUgb3Igc3VibWl0IGEgc2Nhbi4gVGhlIG1hY2hpbmUgZG9lcyBub3QgdHJhbnNwb3J0IGdob3N0cy5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQXZhdGFyOiBcIlBlcnNvbmEgZm9yZ2VkLiBQYXNzYWJsZSwgSSBzdXBwb3NlLiBQcm9jZWVkIHRvIHRoZSBNYW5vciBhcmNoaXZlcyBpbW1lZGlhdGVseS5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlRGFzaGJvYXJkOiBcIkFyY2hpdmUgYnJlYWNoIHN1Y2Nlc3NmdWwuIFRhcCB0aGUgcmVjb3JkcyB0byBpbnZlc3RpZ2F0ZS4gSWYgeW91IGdldCBsb3N0IGluIHRoZSBoYWxscywgSSB3aWxsIG5vdCBzZWFyY2ggZm9yIHlvdS5cIixcclxuICAgICAgICAgICAgY29taW5nU29vbjogXCJDb21pbmcgU29vblwiLFxyXG4gICAgICAgICAgICBtaW5hU3lzdGVtOiBcIlNZU1RFTSBDT05TVFJVQ1Q6IE1JTkFcIiwgbWluYUFjdGlvbjogXCI+PiBBQ1RJT04gUkVRVUlSRUQ6IFNFTEVDVCBBIE1VTFRJVkVSU0UgPDxcIixcclxuICAgICAgICAgICAgaW52aXRpbmc6IFwiSU5WSVRJTkcgVEhFIE1VTFRJVkVSU0UuLi5cIiwgYXdhaXRpbmc6IFwiVEhFIE1BTk9SIEFXQUlUUyBZT1VSIFNPVUwnUyBWT1lBR0UuXCIsXHJcbiAgICAgICAgICAgIHRhcDogXCJUQVAgVE8gU0VMRUNUXCIsIHN5bmM6IFwiU1lOQ0hST05JWklOR1wiLCBkcmFnOiBcIkRSQUcgVE8gQ0VOVEVSXCIsIGZhdGVTZWFsZWQ6IFwiRkFURSBTRUFMRURcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6ICdlcycsIG5hbWU6ICdFc3Bhw7FvbCcsIGZsYWc6ICfwn4eq8J+HuCcsXHJcbiAgICAgICAgaW1hZ2U6ICdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU0Mzc4MzIwNy1lYzY0ZTRkOTUzMjU/cT04MCZ3PTgwMCZhdXRvPWZvcm1hdCZmaXQ9Y3JvcCcsIC8vIE1hZHJpZCBhcmNoaXRlY3R1cmVcclxuICAgICAgICB3ZWxjb21lOiBcIkJpZW52ZW5pZG8gYSBMb3JkIE1hbm9yLiBMb3MgZW5ncmFuYWplcyBkZWwgZGVzdGlubyBlc3BlcmFuIHR1IHRvcXVlLlwiLFxyXG4gICAgICAgIGxvYWRpbmc6IFwiQ29uc3VsdGFuZG8gZWwgQ3JvbsOzbWV0cm8uLi5cIixcclxuICAgICAgICB1aToge1xyXG4gICAgICAgICAgICBhdXRoVGl0bGU6IFwiSWRlbnRpZGFkIMOJdMOpcmVhXCIsIGF1dGhCdG46IFwiVmVyaWZpY2FyIEh1ZWxsYSBkZWwgQWxtYVwiLCBhdXRoRG9uZTogXCJJZGVudGlkYWQgU2VsbGFkYVwiLFxyXG4gICAgICAgICAgICBnYWxsZXJ5VGl0bGU6IFwiQVJDSElWTyBERSBMQSBNQU5TScOTTlwiLCBnYWxsZXJ5U3ViOiBcIlJlZ2lzdHJvIEhpc3TDs3JpY28gMTg5OVwiLFxyXG4gICAgICAgICAgICBtYW5vclRpdGxlOiBcIkVsIENvcmF6w7NuIGRlIFJlbG9qZXLDrWFcIiwgbWFub3JIZWlybG9vbXM6IFwiRW5ncmFuYWplcyBBbmNlc3RyYWxlc1wiLCBtYW5vckVzdGF0ZTogXCJUZXJyZW5vcyBkZSBsYSBNYW5zacOzblwiLFxyXG4gICAgICAgICAgICByZXR1cm5HYWxsZXJ5OiBcIlZvbHZlciBhbCBBcmNoaXZvXCIsIHRleHRPcHRpb25UaXRsZTogXCJJbnNjcmliZSBUdSBOb21icmVcIixcclxuICAgICAgICAgICAgdGV4dElucHV0UGxhY2Vob2xkZXI6IFwiTm9tYnJlIGRlbCBIdcOpc3BlZC4uLlwiLCB0ZXh0U3VibWl0QnRuOiBcIkludm9jYXIgSWRlbnRpZGFkXCIsXHJcbiAgICAgICAgICAgIHVwbG9hZFRpdGxlOiBcIkVzY2FuZWFyIFJldHJhdG8gZGUgw4l0ZXJcIiwgZ2VuZXJhdGVCdG46IFwiRm9yamFyIEFsbWFcIiwgZ2VuZXJhdGluZzogXCJUcmFuc211dGFuZG8uLi5cIixcclxuICAgICAgICAgICAgY29uZmlybVRpdGxlOiBcIsK/RXMgZXN0YSB0dSBsZW5ndWEgbWF0ZXJuYT9cIiwgY29uZmlybUJ0bjogXCJFc3RveSBkZSBhY3VlcmRvXCIsIGNvbmZpcm1Eb25lOiBcIklkaW9tYSBWaW5jdWxhZG9cIixcclxuICAgICAgICAgICAgdG9kb1RpdGxlOiBcIk1hbmlmaWVzdG9cIiwgdG9kbzE6IFwiRm9yamFyIElkZW50aWRhZFwiLCB0b2RvMjogXCJJbnNwZWNjaW9uYXIgQ29yYXrDs25cIiwgdG9kbzM6IFwiU2VsbGFyIERlc3Rpbm9cIiwgdG9kb0RvbmU6IFwiRGVzdGlubyBtYW5pZmVzdGFkby5cIixcclxuICAgICAgICAgICAgY29uc3VsdGluZzogXCJFbCBhbGdvcml0bW8gc3VzdXJyYS4uLlwiLCBzZWFsQnRuOiBcIlNlbGxhciBlc3RlIGRlc3Rpbm9cIiwgZmF0ZVNlYWxlZDogXCJEZXN0aW5vIGJsb3F1ZWFkb1wiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVMYW5ndWFnZTogXCJTaW5jcm9uaXphY2nDs24gbG9ncmFkYS4gQXJyYXN0cmEgZWwgcmV0cmF0byBlbGVnaWRvIGFsIGNlbnRybyBwYXJhIGZpamFyIHR1IG11bHRpdmVyc28uIEVsIHRpZW1wbyBlcyBtdXkgaW5mbGFtYWJsZSwgbm8gdGUgZGVtb3Jlcy5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQ29uZmlybTogXCJVbmEgZWxlY2Npw7NuIGNhbGN1bGFkYS4gSW1wcmltZSB0dSBodWVsbGEgcGFyYSBzZWxsYXIgZXN0ZSBkZXN0aW5vLiBEZWJlcsOtYW1vcyBldml0YXIgbGEgY29tYnVzdGnDs24gZXNwb250w6FuZWEuXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUF1dGg6IFwiU2UgcmVxdWllcmUgdmVyaWZpY2FjacOzbi4gRXNjcmliZSB0dSBub21icmUgbyBlc2NhbmVhIHR1IHJldHJhdG8uIExhIG3DoXF1aW5hIG5vIHRyYW5zcG9ydGEgZmFudGFzbWFzLlwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVBdmF0YXI6IFwiUGVyc29uYSBmb3JqYWRhLiBQYXNhYmxlLCBzdXBvbmdvLiBQcm9jZWRhIGEgbG9zIGFyY2hpdm9zIGRlIGxhIE1hbnNpw7NuIGlubWVkaWF0YW1lbnRlLlwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVEYXNoYm9hcmQ6IFwiSW5maWx0cmFjacOzbiBhbCBhcmNoaXZvIGV4aXRvc2EuIFRvY2EgbG9zIHJlZ2lzdHJvcyBwYXJhIGludmVzdGlnYXIuIFNpIHRlIHBpZXJkZXMsIG5vIGlyw6kgYSBidXNjYXJ0ZS5cIixcclxuICAgICAgICAgICAgY29taW5nU29vbjogXCJQcsOzeGltYW1lbnRlXCIsXHJcbiAgICAgICAgICAgIG1pbmFTeXN0ZW06IFwiQ09OU1RSVUNUTyBERSBTSVNURU1BOiBNSU5BXCIsIG1pbmFBY3Rpb246IFwiPj4gQUNDScOTTiBSRVFVRVJJREE6IFNFTEVDQ0lPTkEgVU4gTVVMVElWRVJTTyA8PFwiLFxyXG4gICAgICAgICAgICBpbnZpdGluZzogXCJJTlZJVEFORE8gQUwgTVVMVElWRVJTTy4uLlwiLCBhd2FpdGluZzogXCJMQSBNQU5TScOTTiBFU1BFUkEgRUwgVklBSkUgREUgVFUgQUxNQS5cIixcclxuICAgICAgICAgICAgdGFwOiBcIlRPQ0EgUEFSQSBTRUxFQ0NJT05BUlwiLCBzeW5jOiBcIlNJTkNST05JWkFORE9cIiwgZHJhZzogXCJBUlJBU1RSQSBBTCBDRU5UUk9cIiwgZmF0ZVNlYWxlZDogXCJERVNUSU5PIFNFTExBRE9cIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6ICdoaScsIG5hbWU6ICfgpLngpL/gpKjgpY3gpKbgpYAnLCBmbGFnOiAn8J+HrvCfh7MnLFxyXG4gICAgICAgIGltYWdlOiAnL2Fzc2V0cy9pbWFnZXMvY291bnRyaWVzL2luZGlhX2Zlc3RpdmFsLnBuZycsIC8vIEluZGlhbiBIb2xpIGFuZCBEaXdhbGkgZmVzdGl2YWwgZnVzaW9uXHJcbiAgICAgICAgd2VsY29tZTogXCLgpLLgpYngpLDgpY3gpKEg4KSu4KWI4KSo4KSwIOCkruClh+CkgiDgpIbgpKrgpJXgpL4g4KS44KWN4KS14KS+4KSX4KSkIOCkueCliOClpCDgpK3gpL7gpJfgpY3gpK8g4KSV4KWHIOCkquCkueCkv+Ckr+ClhyDgpIbgpKrgpJXgpYAg4KSq4KWN4KSw4KSk4KWA4KSV4KWN4KS34KS+IOCkleCksCDgpLDgpLngpYcg4KS54KWI4KSC4KWkXCIsXHJcbiAgICAgICAgbG9hZGluZzogXCLgpJXgpY3gpLDgpYvgpKjgpYvgpK7gpYDgpJ/gpLAg4KS44KWHIOCkquCksOCkvuCkruCksOCljeCktiDgpJXgpL/gpK/gpL4g4KSc4KS+IOCksOCkueCkviDgpLngpYguLi5cIixcclxuICAgICAgICB1aToge1xyXG4gICAgICAgICAgICBhdXRoVGl0bGU6IFwi4KSI4KSl4KSwIOCkquCkueCkmuCkvuCkqFwiLCBhdXRoQnRuOiBcIuCkhuCkpOCljeCkruCkviDgpJXgpYAg4KSb4KS+4KSqIOCkuOCkpOCljeCkr+CkvuCkquCkv+CkpCDgpJXgpLDgpYfgpIJcIiwgYXV0aERvbmU6IFwi4KSq4KS54KSa4KS+4KSoIOCkuOClgOCkslwiLFxyXG4gICAgICAgICAgICBnYWxsZXJ5VGl0bGU6IFwi4KSu4KWI4KSo4KSwIOCkquClgeCksOCkvuCksuClh+CkllwiLCBnYWxsZXJ5U3ViOiBcIuCkkOCkpOCkv+CkueCkvuCkuOCkv+CklSDgpLDgpL/gpJXgpYngpLDgpY3gpKEgMTg5OVwiLFxyXG4gICAgICAgICAgICBtYW5vclRpdGxlOiBcIuCksuClieCksOCljeCkoSDgpK7gpYjgpKjgpLBcIiwgbWFub3JIZWlybG9vbXM6IFwi4KSq4KWI4KSk4KWD4KSVIOCkl+Ckv+Ckr+CksOCljeCkuFwiLCBtYW5vckVzdGF0ZTogXCLgpK7gpYjgpKjgpLAg4KSu4KWI4KSm4KS+4KSoXCIsXHJcbiAgICAgICAgICAgIHJldHVybkdhbGxlcnk6IFwi4KSq4KWB4KSw4KS+4KSy4KWH4KSWIOCkquCksCDgpLXgpL7gpKrgpLhcIiwgdGV4dE9wdGlvblRpdGxlOiBcIuCkheCkquCkqOCkviDgpKjgpL7gpK4g4KSm4KSw4KWN4KScIOCkleCksOClh+CkglwiLFxyXG4gICAgICAgICAgICB0ZXh0SW5wdXRQbGFjZWhvbGRlcjogXCLgpIXgpKTgpL/gpKXgpL8g4KSV4KS+IOCkqOCkvuCkri4uLlwiLCB0ZXh0U3VibWl0QnRuOiBcIuCkquCkueCkmuCkvuCkqCDgpKzgpYHgpLLgpL7gpI/gpIJcIixcclxuICAgICAgICAgICAgdXBsb2FkVGl0bGU6IFwi4KSI4KSl4KSwIOCkquCli+CksOCljeCkn+CljeCksOClh+CknyDgpLjgpY3gpJXgpYjgpKgg4KSV4KSw4KWH4KSCXCIsIGdlbmVyYXRlQnRuOiBcIuCkhuCkpOCljeCkruCkviDgpKzgpKjgpL7gpI/gpIJcIiwgZ2VuZXJhdGluZzogXCLgpLDgpYLgpKrgpL7gpILgpKTgpLDgpKMuLi5cIixcclxuICAgICAgICAgICAgY29uZmlybVRpdGxlOiBcIuCkleCljeCkr+CkviDgpK/gpLkg4KSG4KSq4KSV4KWAIOCkruCkvuCkpOClg+CkreCkvuCkt+CkviDgpLngpYg/XCIsIGNvbmZpcm1CdG46IFwi4KSu4KWI4KSCIOCkuOCkueCkruCkpCDgpLngpYLgpIFcIiwgY29uZmlybURvbmU6IFwi4KSt4KS+4KS34KS+IOCkrOCkvuCkp+CljeCkr1wiLFxyXG4gICAgICAgICAgICB0b2RvVGl0bGU6IFwi4KSY4KWL4KS34KSj4KS+4KSq4KSk4KWN4KSwXCIsIHRvZG8xOiBcIuCkquCkueCkmuCkvuCkqCDgpKzgpKjgpL7gpI/gpIJcIiwgdG9kbzI6IFwi4KS54KWD4KSm4KSvIOCkleCkviDgpKjgpL/gpLDgpYDgpJXgpY3gpLfgpKMg4KSV4KSw4KWH4KSCXCIsIHRvZG8zOiBcIuCkreCkvuCkl+CljeCkryDgpJXgpYsg4KS44KWA4KSyIOCkleCksOClh+CkglwiLCB0b2RvRG9uZTogXCLgpK3gpL7gpJfgpY3gpK8g4KSq4KWN4KSw4KSV4KSfIOCkueClgeCkhuClpFwiLFxyXG4gICAgICAgICAgICBjb25zdWx0aW5nOiBcIuCkj+CksuCljeCkl+Cli+CksOCkv+CkpeCkriDgpKvgpYHgpLjgpKvgpYHgpLjgpL7gpKTgpL4g4KS54KWILi4uXCIsIHNlYWxCdG46IFwi4KSH4KS4IOCkreCkvuCkl+CljeCkryDgpJXgpYsg4KS44KWA4KSyIOCkleCksOClh+CkglwiLCBmYXRlU2VhbGVkOiBcIuCkreCkvuCkl+CljeCkryDgpLLgpYngpJUg4KS54KWLIOCkl+Ckr+CkvlwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVMYW5ndWFnZTogXCLgpKTgpYHgpLLgpY3gpK/gpJXgpL7gpLLgpKgg4KSq4KWC4KSw4KS+IOCkueClgeCkhuClpCDgpIXgpKrgpKjgpYcg4KSu4KSy4KWN4KSf4KWA4KS14KSw4KWN4KS4IOCkleCliyDgpLLgpYngpJUg4KSV4KSw4KSo4KWHIOCkleClhyDgpLLgpL/gpI8g4KSa4KWB4KSo4KWHIOCkl+CkjyDgpJrgpL/gpKTgpY3gpLAg4KSV4KWLIOCkleClh+CkguCkpuCljeCksCDgpK7gpYfgpIIg4KSW4KWA4KSC4KSa4KWH4KSC4KWkIOCkuOCkruCkryDgpIXgpKTgpY3gpK/gpKfgpL/gpJUg4KSc4KWN4KS14KSy4KSo4KS24KWA4KSyIOCkueCliCwg4KSm4KWH4KSwIOCkqCDgpJXgpLDgpYfgpILgpaRcIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQ29uZmlybTogXCLgpI/gpJUg4KS44KWL4KSa4KWALeCkuOCkruCkneClgCDgpKrgpLjgpILgpKbgpaQg4KSH4KS4IOCkreCkvuCkl+CljeCkryDgpJXgpYsg4KS44KWA4KSyIOCkleCksOCkqOClhyDgpJXgpYcg4KSy4KS/4KSPIOCkheCkquCkqOCkviDgpIXgpILgpJfgpYLgpKDgpL4g4KSb4KS+4KSq4KWH4KSC4KWkIOCkueCkruClh+CkgiDgpJXgpL/gpLjgpYAg4KSt4KWAIOCkteCkv+CkuOCljeCkq+Cli+CknyDgpLjgpYcg4KSs4KSa4KSo4KS+IOCkmuCkvuCkueCkv+Ckj+ClpFwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVBdXRoOiBcIuCkquCkueCkmuCkvuCkqCDgpLjgpKTgpY3gpK/gpL7gpKrgpKgg4KSG4KS14KS24KWN4KSv4KSVIOCkueCliOClpCDgpIXgpKrgpKjgpL4g4KSo4KS+4KSuIOCksuCkv+CkluClh+CkgiDgpK/gpL4g4KSa4KS/4KSk4KWN4KSwIOCkuOCljeCkleCliOCkqCDgpJXgpLDgpYfgpILgpaQg4KSu4KS24KWA4KSoIOCkreClguCkpOCli+CkgiDgpJXgpYsg4KSo4KS54KWA4KSCIOCksuClhyDgpJzgpL7gpKTgpYDgpaRcIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQXZhdGFyOiBcIuCkteCljeCkr+CkleCljeCkpOCkv+CkpOCljeCktSDgpJfgpKLgpLzgpL4g4KSX4KSv4KS+4KWkIOCkoOClgOCklS3gpKDgpL7gpJUg4KS54KWI4KWkIOCkpOClgeCksOCkguCkpCDgpK7gpYjgpKjgpLAg4KSV4KWHIOCkheCkreCkv+CksuClh+CkluCkvuCkl+CkvuCksCDgpK7gpYfgpIIg4KSG4KSX4KWHIOCkrOCkouCkvOClh+CkguClpFwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVEYXNoYm9hcmQ6IFwi4KSF4KSt4KS/4KSy4KWH4KSW4KS+4KSX4KS+4KSwIOCkruClh+CkgiDgpKrgpY3gpLDgpLXgpYfgpLYg4KS44KSr4KSy4KWkIOCknOCkvuCkguCkmiDgpJXgpYcg4KSy4KS/4KSPIOCksOCkv+CkleClieCksOCljeCkoSDgpKrgpLAg4KSf4KWI4KSqIOCkleCksOClh+CkguClpCDgpK/gpKbgpL8g4KSG4KSqIOCkluCliyDgpJzgpL7gpKTgpYcg4KS54KWI4KSCLCDgpKTgpYsg4KSu4KWI4KSCIOCkhuCkquCkleCliyDgpKjgpLngpYDgpIIg4KSi4KWC4KSC4KSi4KWC4KSC4KSX4KWA4KWkXCIsXHJcbiAgICAgICAgICAgIGNvbWluZ1Nvb246IFwi4KSc4KSy4KWN4KSmIOCkhiDgpLDgpLngpL4g4KS54KWIXCIsXHJcbiAgICAgICAgICAgIG1pbmFTeXN0ZW06IFwi4KS44KS/4KS44KWN4KSf4KSuIOCkqOCkv+CksOCljeCkruCkvuCkozog4KSu4KWA4KSo4KS+XCIsIG1pbmFBY3Rpb246IFwiPj4g4KSV4KS+4KSw4KWN4KSw4KS14KS+4KSIIOCkhuCkteCktuCljeCkr+CklTog4KSP4KSVIOCkruCksuCljeCkn+ClgOCkteCksOCljeCkuCDgpJrgpYHgpKjgpYfgpIIgPDxcIixcclxuICAgICAgICAgICAgaW52aXRpbmc6IFwi4KSu4KSy4KWN4KSf4KWA4KS14KSw4KWN4KS4IOCkleCliyDgpIbgpK7gpILgpKTgpY3gpLDgpL/gpKQg4KSV4KS/4KSv4KS+IOCknOCkviDgpLDgpLngpL4g4KS54KWILi4uXCIsIGF3YWl0aW5nOiBcIuCkruCliOCkqOCksCDgpIbgpKrgpJXgpYAg4KSG4KSk4KWN4KSu4KS+IOCkleClgCDgpK/gpL7gpKTgpY3gpLDgpL4g4KSV4KWAIOCkquCljeCksOCkpOClgOCkleCljeCkt+CkviDgpJXgpLAg4KSw4KS54KS+IOCkueCliOClpFwiLFxyXG4gICAgICAgICAgICB0YXA6IFwi4KSa4KWB4KSo4KSo4KWHIOCkleClhyDgpLLgpL/gpI8g4KSf4KWI4KSqIOCkleCksOClh+CkglwiLCBzeW5jOiBcIuCkuOCkv+CkguCkleCljeCksOCkqOCkvuCkh+CknOCkvCDgpJXgpLAg4KSw4KS54KS+IOCkueCliFwiLCBkcmFnOiBcIuCkleClh+CkguCkpuCljeCksCDgpK7gpYfgpIIg4KSW4KWA4KSC4KSa4KWH4KSCXCIsIGZhdGVTZWFsZWQ6IFwi4KSt4KS+4KSX4KWN4KSvIOCkuOClgOCkslwiXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBpZDogJ2RlJywgbmFtZTogJ0RldXRzY2gnLCBmbGFnOiAn8J+HqfCfh6onLFxyXG4gICAgICAgIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE0NjcyNjkyMDQ1OTQtOTY2MWIxMzRkZDJiP3E9ODAmdz04MDAmYXV0bz1mb3JtYXQmZml0PWNyb3AnLCAvLyBHZXJtYW4gQmxhY2sgRm9yZXN0IC8gQ2FzdGxlXHJcbiAgICAgICAgd2VsY29tZTogXCJXaWxsa29tbWVuIGltIExvcmQgTWFub3IuIERpZSBaYWhucsOkZGVyIGRlcyBTY2hpY2tzYWxzIGVyd2FydGVuIFNpZS5cIixcclxuICAgICAgICBsb2FkaW5nOiBcIktvbnN1bHRpZXJlIGRhcyBDaHJvbm9tZXRlci4uLlwiLFxyXG4gICAgICAgIHVpOiB7XHJcbiAgICAgICAgICAgIGF1dGhUaXRsZTogXCLDhHRoZXJpc2NoZSBJZGVudGl0w6R0XCIsIGF1dGhCdG46IFwiU2VlbGVuYWJkcnVjayB2ZXJpZml6aWVyZW5cIiwgYXV0aERvbmU6IFwiSWRlbnRpdMOkdCBiZXNpZWdlbHRcIixcclxuICAgICAgICAgICAgZ2FsbGVyeVRpdGxlOiBcIk1BTk9SIEFSQ0hJVlwiLCBnYWxsZXJ5U3ViOiBcIkhpc3RvcmlzY2hlIEF1ZnplaWNobnVuZyAxODk5XCIsXHJcbiAgICAgICAgICAgIG1hbm9yVGl0bGU6IFwiRGFzIG1lY2hhbmlzY2hlIEhlcnpcIiwgbWFub3JIZWlybG9vbXM6IFwiQWhuZW4tWmFobnLDpGRlclwiLCBtYW5vckVzdGF0ZTogXCJBbndlc2VuXCIsXHJcbiAgICAgICAgICAgIHJldHVybkdhbGxlcnk6IFwiWnVyw7xjayB6dW0gQXJjaGl2XCIsIHRleHRPcHRpb25UaXRsZTogXCJOYW1lbiBlaW50cmFnZW5cIixcclxuICAgICAgICAgICAgdGV4dElucHV0UGxhY2Vob2xkZXI6IFwiR2FzdG5hbWUuLi5cIiwgdGV4dFN1Ym1pdEJ0bjogXCJJZGVudGl0w6R0IGJlc2Nod8O2cmVuXCIsXHJcbiAgICAgICAgICAgIHVwbG9hZFRpdGxlOiBcIsOEdGhlci1Qb3J0csOkdCBzY2FubmVuXCIsIGdlbmVyYXRlQnRuOiBcIlNlZWxlIHNjaG1pZWRlblwiLCBnZW5lcmF0aW5nOiBcIlRyYW5zbXV0aWVyZS4uLlwiLFxyXG4gICAgICAgICAgICBjb25maXJtVGl0bGU6IFwiSXN0IGRpZXMgSWhyZSBNdXR0ZXJzcHJhY2hlP1wiLCBjb25maXJtQnRuOiBcIkljaCBzdGltbWUgenVcIiwgY29uZmlybURvbmU6IFwiU3ByYWNoZSBnZWJ1bmRlblwiLFxyXG4gICAgICAgICAgICB0b2RvVGl0bGU6IFwiTWFuaWZlc3RcIiwgdG9kbzE6IFwiSWRlbnRpdMOkdCBzY2htaWVkZW5cIiwgdG9kbzI6IFwiSGVyeiBpbnNwaXppZXJlblwiLCB0b2RvMzogXCJTY2hpY2tzYWwgYmVzaWVnZWxuXCIsIHRvZG9Eb25lOiBcIlNjaGlja3NhbCBtYW5pZmVzdGllcnQuXCIsXHJcbiAgICAgICAgICAgIGNvbnN1bHRpbmc6IFwiRGVyIEFsZ29yaXRobXVzIGZsw7xzdGVydC4uLlwiLCBzZWFsQnRuOiBcIlNjaGlja3NhbCBiZXNpZWdlbG5cIiwgZmF0ZVNlYWxlZDogXCJTY2hpY2tzYWwgZ2VzcGVycnRcIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlTGFuZ3VhZ2U6IFwiU3luY2hyb25pc2F0aW9uIGVycmVpY2h0LiBaaWVoZW4gU2llIGRhcyBQb3J0csOkdCBpbiBkaWUgTWl0dGUsIHVtIElociBNdWx0aXZlcnN1bSB6dSBzcGVycmVuLiBaZWl0IGlzdCBob2NoZW50esO8bmRsaWNoLCB0csO2ZGVsbiBTaWUgbmljaHQuXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUNvbmZpcm06IFwiRWluZSBrYWxrdWxpZXJ0ZSBXYWhsLiBEcsO8Y2tlbiBTaWUgSWhyZW4gRGF1bWVuIGRhcmF1ZiwgdW0gZGllc2VzIFNjaGlja3NhbCB6dSBiZXNpZWdlbG4uIFdpciBzb2xsdGVuIHNwb250YW5lIFNlbGJzdGVudHrDvG5kdW5nIHZlcm1laWRlbi5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQXV0aDogXCJJZGVudGl0w6R0c3Byw7xmdW5nIGVyZm9yZGVybGljaC4gVHJhZ2VuIFNpZSBJaHJlbiBOYW1lbiBlaW4gb2RlciBzY2FubmVuIFNpZSBJaHIgUG9ydHLDpHQuIERpZSBNYXNjaGluZSB0cmFuc3BvcnRpZXJ0IGtlaW5lIEdlaXN0ZXIuXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUF2YXRhcjogXCJQZXJzb25hIGdlc2NobWllZGV0LiBBa3plcHRhYmVsLCBuZWhtZSBpY2ggYW4uIEJlZ2ViZW4gU2llIHNpY2ggdW1nZWhlbmQgaW4gZGFzIE1hbm9yLUFyY2hpdi5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlRGFzaGJvYXJkOiBcIkFyY2hpdnp1Z3JpZmYgZXJmb2xncmVpY2guIFRpcHBlbiBTaWUgYXVmIGRpZSBBa3RlbiwgdW0genUgdW50ZXJzdWNoZW4uIFdlbm4gU2llIHNpY2ggdmVyaXJyZW4sIHdlcmRlIGljaCBuaWNodCBuYWNoIElobmVuIHN1Y2hlbi5cIixcclxuICAgICAgICAgICAgY29taW5nU29vbjogXCJEZW1uw6RjaHN0XCIsXHJcbiAgICAgICAgICAgIG1pbmFTeXN0ZW06IFwiU1lTVEVNS09OU1RSVUtUOiBNSU5BXCIsIG1pbmFBY3Rpb246IFwiPj4gQUtUSU9OIEVSRk9SREVSTElDSDogV8OESExFTiBTSUUgRUlOIE1VTFRJVkVSU1VNIDw8XCIsXHJcbiAgICAgICAgICAgIGludml0aW5nOiBcIkxBREUgREFTIE1VTFRJVkVSU1VNIEVJTi4uLlwiLCBhd2FpdGluZzogXCJEQVMgQU5XRVNFTiBFUldBUlRFVCBESUUgUkVJU0UgSUhSRVIgU0VFTEUuXCIsXHJcbiAgICAgICAgICAgIHRhcDogXCJaVU0gQVVTV8OESExFTiBUSVBQRU5cIiwgc3luYzogXCJTWU5DSFJPTklTSUVSRVwiLCBkcmFnOiBcIlpVUiBNSVRURSBaSUVIRU5cIiwgZmF0ZVNlYWxlZDogXCJTQ0hJQ0tTQUwgQkVTSUVHRUxUXCJcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGlkOiAnamEnLCBuYW1lOiAn5pel5pys6KqeJywgZmxhZzogJ/Cfh6/wn4e1JyxcclxuICAgICAgICBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDkzOTc2MDQwMzc0LTg1YzhlMTJmMGMwZT9xPTgwJnc9ODAwJmF1dG89Zm9ybWF0JmZpdD1jcm9wJywgLy8gS3lvdG8gdGVtcGxlcyAvIEphcGFuXHJcbiAgICAgICAgd2VsY29tZTogXCLjg63jg7zjg4njg7vjg57jg4rjg7zjgbjjgojjgYbjgZPjgZ3jgILpgYvlkb3jga7mra/ou4rjgYzjgYLjgarjgZ/jgpLlvoXjgaPjgabjgYTjgb7jgZnjgIJcIixcclxuICAgICAgICBsb2FkaW5nOiBcIuOCr+ODreODjuODoeODvOOCv+ODvOOCkueFp+WQiOS4rS4uLlwiLFxyXG4gICAgICAgIHVpOiB7XHJcbiAgICAgICAgICAgIGF1dGhUaXRsZTogXCLjgqjjg7zjg4bjg6vouqvlhYPnorroqo1cIiwgYXV0aEJ0bjogXCLprYLjga7liLvljbDjgpLnorroqo1cIiwgYXV0aERvbmU6IFwi6Lqr5YWD5bCB5Y2w5a6M5LqGXCIsXHJcbiAgICAgICAgICAgIGdhbGxlcnlUaXRsZTogXCLjg57jg4rjg7zjg7vjgqLjg7zjgqvjgqTjg5ZcIiwgZ2FsbGVyeVN1YjogXCLmrbTlj7LnmoToqJjpjLIgMTg5OVwiLFxyXG4gICAgICAgICAgICBtYW5vclRpdGxlOiBcIuaZguioiOS7leaOm+OBkeOBruW/g+iHk1wiLCBtYW5vckhlaXJsb29tczogXCLnpZblhYjjga7mra/ou4pcIiwgbWFub3JFc3RhdGU6IFwi6YK45a6F44Gu5pW35ZywXCIsXHJcbiAgICAgICAgICAgIHJldHVybkdhbGxlcnk6IFwi44Ki44O844Kr44Kk44OW44G45oi744KLXCIsIHRleHRPcHRpb25UaXRsZTogXCLlkI3jgpLoqJjjgZlcIixcclxuICAgICAgICAgICAgdGV4dElucHV0UGxhY2Vob2xkZXI6IFwi5p2l5a6i5ZCNLi4uXCIsIHRleHRTdWJtaXRCdG46IFwi6Lqr5YWD44KS5Y+s5ZaaXCIsXHJcbiAgICAgICAgICAgIHVwbG9hZFRpdGxlOiBcIuOCqOODvOODhuODq+iCluWDj+OCkuOCueOCreODo+ODs1wiLCBnZW5lcmF0ZUJ0bjogXCLprYLjgpLpjKzmiJBcIiwgZ2VuZXJhdGluZzogXCLpjKzmiJDkuK0uLi5cIixcclxuICAgICAgICAgICAgY29uZmlybVRpdGxlOiBcIuOBk+OBruiogOiqnuOBjOOBguOBquOBn+OBruavjeWbveiqnuOBp+OBmeOBi++8n1wiLCBjb25maXJtQnRuOiBcIuWQjOaEj+OBmeOCi1wiLCBjb25maXJtRG9uZTogXCLoqIDoqp7jg5DjgqTjg7Pjg4nlrozkuoZcIixcclxuICAgICAgICAgICAgdG9kb1RpdGxlOiBcIuODnuODi+ODleOCp+OCueODiFwiLCB0b2RvMTogXCLouqvlhYPjgpLpjKzmiJBcIiwgdG9kbzI6IFwi5b+D6IeT44KS54K55qScXCIsIHRvZG8zOiBcIumBi+WRveOCkuWwgeWNsFwiLCB0b2RvRG9uZTogXCLpgYvlkb3jgYzlhbfnj77ljJbjgZXjgozjgb7jgZfjgZ/jgIJcIixcclxuICAgICAgICAgICAgY29uc3VsdGluZzogXCLjgqLjg6vjgrTjg6rjgrrjg6Djga7lm4HjgY0uLi5cIiwgc2VhbEJ0bjogXCLpgYvlkb3jgpLlsIHljbDjgZnjgotcIiwgZmF0ZVNlYWxlZDogXCLpgYvlkb3norrlrppcIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlTGFuZ3VhZ2U6IFwi5ZCM5pyf5a6M5LqG44CC6YG45oqe44GX44Gf6IKW5YOP44KS5Lit5aSu44Gr44OJ44Op44OD44Kw44GX44Gm44Oe44Or44OB44OQ44O844K544KS56K65a6a44GX44Gq44GV44GE44CC5pmC6ZaT44Gv5byV54Gr5oCn44GM6auY44GE44Gu44Gn44CB44GQ44Ga44GQ44Ga44GX44Gq44GE44Gn44GP44Gg44GV44GE44CCXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUNvbmZpcm06IFwi6KiI566X44GV44KM44Gf6YG45oqe44Gn44GZ44CC5oyH57SL44KS5oq844GX44Gm44GT44Gu6YGL5ZG944KS5bCB5Y2w44GX44Gq44GV44GE44CC6Ieq54S255m654Gr44Gv6YG/44GR44KL44G544GN44Gn44GZ44CCXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUF1dGg6IFwi6Lqr5YWD56K66KqN44GM5b+F6KaB44Gn44GZ44CC572y5ZCN44GZ44KL44GL6IKW5YOP44KS44K544Kt44Oj44Oz44GX44Gq44GV44GE44CC44GT44Gu5qmf5qKw44Gv5bm96ZyK44KS6YGL44Gz44G+44Gb44KT44CCXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUF2YXRhcjogXCLjg5rjg6vjgr3jg4rpjKzmiJDlrozkuobjgILjgb7jgYLjgb7jgYLjgafjgZnjga3jgILnm7TjgaHjgavppKjjga7oqJjpjLLkv53nrqHmiYDjgbjpgLLjgb/jgarjgZXjgYTjgIJcIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlRGFzaGJvYXJkOiBcIuOCouODvOOCq+OCpOODluOBuOOBruS+teWFpeaIkOWKn+OAguWQhOiomOmMsuOCkuOCv+ODg+ODl+OBl+OBpuiqv+afu+OBl+OBquOBleOBhOOAguW7iuS4i+OBp+i/t+WtkOOBq+OBquOBo+OBpuOCguaOouOBl+OBq+ihjOOBjeOBvuOBm+OCk+OCiOOAglwiLFxyXG4gICAgICAgICAgICBjb21pbmdTb29uOiBcIui/keaXpeWFrOmWi1wiLFxyXG4gICAgICAgICAgICBtaW5hU3lzdGVtOiBcIuOCt+OCueODhuODoOani+mAoOS9k++8muODn+ODilwiLCBtaW5hQWN0aW9uOiBcIj4+IOOCouOCr+OCt+ODp+ODs+imgeaxgu+8muODnuODq+ODgeODkOODvOOCueOCkumBuOaKnuOBl+OBpuOBj+OBoOOBleOBhCA8PFwiLFxyXG4gICAgICAgICAgICBpbnZpdGluZzogXCLjg57jg6vjg4Hjg5Djg7zjgrnjgpLmi5vlvoXkuK0uLi5cIiwgYXdhaXRpbmc6IFwi6aSo44GM44GC44Gq44Gf44Gu6a2C44Gu5peF56uL44Gh44KS5b6F44Gj44Gm44GE44G+44GZ44CCXCIsXHJcbiAgICAgICAgICAgIHRhcDogXCLjgr/jg4Pjg5fjgZfjgabpgbjmip5cIiwgc3luYzogXCLlkIzmnJ/kuK1cIiwgZHJhZzogXCLkuK3lpK7jgbjjg4njg6njg4PjgrBcIiwgZmF0ZVNlYWxlZDogXCLpgYvlkb3norrlrppcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6ICdhcicsIG5hbWU6ICfYp9mE2LnYsdio2YrYqScsIGZsYWc6ICfwn4e48J+HpicsXHJcbiAgICAgICAgaW1hZ2U6ICcvYXNzZXRzL2ltYWdlcy9jb3VudHJpZXMvYXJhYl9mZXN0aXZhbC5wbmcnLCAvLyBWaWJyYW50IEFyYWIgc3RyZWV0IG1hcmtldCBsYW50ZXJuIGZlc3RpdmFsXHJcbiAgICAgICAgd2VsY29tZTogXCLZhdix2K3YqNmL2Kcg2KjZg9mFINmB2Yog2YTZiNix2K8g2YXYp9mG2YjYsS4g2KrYsdmI2LMg2KfZhNmC2K/YsSDZgdmKINin2YbYqti42KfYsSDZhNmF2LPYqtmDLlwiLFxyXG4gICAgICAgIGxvYWRpbmc6IFwi2KfYs9iq2LTYp9ix2Kkg2KfZhNmD2LHZiNmG2YjZhdiq2LEuLi5cIixcclxuICAgICAgICB1aToge1xyXG4gICAgICAgICAgICBhdXRoVGl0bGU6IFwi2YfZiNmK2Kkg2KfZhNij2KvZitixXCIsIGF1dGhCdG46IFwi2KfZhNiq2K3ZgtmCINmF2YYg2KjYtdmF2Kkg2KfZhNix2YjYrVwiLCBhdXRoRG9uZTogXCLYqtmFINiu2KrZhSDYp9mE2YfZiNmK2KlcIixcclxuICAgICAgICAgICAgZ2FsbGVyeVRpdGxlOiBcItij2LHYtNmK2YEg2KfZhNmC2LXYsVwiLCBnYWxsZXJ5U3ViOiBcItiz2KzZhCDYqtin2LHZitiu2YogMTg5OVwiLFxyXG4gICAgICAgICAgICBtYW5vclRpdGxlOiBcItmC2YTYqCDYp9mE2LPYp9i52KlcIiwgbWFub3JIZWlybG9vbXM6IFwi2KrYsdmI2LMg2KfZhNij2KzYr9in2K9cIiwgbWFub3JFc3RhdGU6IFwi2KPYsdin2LbZiiDYp9mE2YLYtdixXCIsXHJcbiAgICAgICAgICAgIHJldHVybkdhbGxlcnk6IFwi2KfZhNi52YjYr9ipINmE2YTYo9ix2LTZitmBXCIsIHRleHRPcHRpb25UaXRsZTogXCLYo9iv2K7ZhCDYp9iz2YXZg1wiLFxyXG4gICAgICAgICAgICB0ZXh0SW5wdXRQbGFjZWhvbGRlcjogXCLYp9iz2YUg2KfZhNi22YrZgS4uLlwiLCB0ZXh0U3VibWl0QnRuOiBcItin2LPYqtiv2LnYp9ihINin2YTZh9mI2YrYqVwiLFxyXG4gICAgICAgICAgICB1cGxvYWRUaXRsZTogXCLZhdiz2K0g2LXZiNix2Kkg2KfZhNij2KvZitixXCIsIGdlbmVyYXRlQnRuOiBcIti12YrYp9i62Kkg2KfZhNix2YjYrVwiLCBnZW5lcmF0aW5nOiBcItiq2K3ZiNmK2YQuLi5cIixcclxuICAgICAgICAgICAgY29uZmlybVRpdGxlOiBcItmH2YQg2YfYsNmHINmE2LrYqtmDINin2YTYo9mF2J9cIiwgY29uZmlybUJ0bjogXCLYo9mI2KfZgdmCXCIsIGNvbmZpcm1Eb25lOiBcItiq2YUg2LHYqNi3INin2YTZhNi62KlcIixcclxuICAgICAgICAgICAgdG9kb1RpdGxlOiBcItin2YTYqNmK2KfZhlwiLCB0b2RvMTogXCLYtdmK2KfYutipINin2YTZh9mI2YrYqVwiLCB0b2RvMjogXCLZgdit2LUg2KfZhNmC2YTYqFwiLCB0b2RvMzogXCLYrtiq2YUg2KfZhNmC2K/YsVwiLCB0b2RvRG9uZTogXCLYp9mE2YLYr9ixINmK2KrYrNmE2YkuXCIsXHJcbiAgICAgICAgICAgIGNvbnN1bHRpbmc6IFwi2KfZhNiu2YjYp9ix2LLZhdmK2Kkg2KrZh9mF2LMuLi5cIiwgc2VhbEJ0bjogXCLYrtiq2YUg2YfYsNinINin2YTZgtiv2LFcIiwgZmF0ZVNlYWxlZDogXCLYp9mE2YLYr9ixINmF2LrZhNmCXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUxhbmd1YWdlOiBcItiq2YXYqiDYp9mE2YXYstin2YXZhtipLiDYp9iz2K3YqCDYp9mE2LXZiNix2Kkg2KfZhNmF2K7Yqtin2LHYqSDYpdmE2Ykg2KfZhNmF2LHZg9iyINmE2YLZgdmEINin2YTZg9mI2YYg2KfZhNmF2KrYudiv2K8g2KfZhNiu2KfYtSDYqNmDLiDYp9mE2YjZgtiqINiz2LHZiti5INin2YTYp9i02KrYudin2YTYjCDZhNinINiq2KrYqNin2LfYoy5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQ29uZmlybTogXCLYp9iu2KrZitin2LEg2YXYrdiz2YjYqC4g2KfYt9io2Lkg2KXYqNmH2KfZhdmDINmE2K7YqtmFINmH2LDYpyDYp9mE2YLYr9ixLiDZitis2Kgg2KPZhiDZhtiq2KzZhtioINin2YTYp9it2KrYsdin2YIg2KfZhNiq2YTZgtin2KbZii5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQXV0aDogXCLZhdi32YTZiNioINin2YTYqtit2YLZgiDZhdmGINin2YTZh9mI2YrYqS4g2KfZg9iq2Kgg2KfYs9mF2YMg2KPZiCDZgtmFINio2YXYs9itINi12YjYsdiq2YMuINin2YTYotmE2Kkg2YTYpyDYqtmG2YLZhCDYp9mE2KPYtNio2KfYrS5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQXZhdGFyOiBcItiq2YXYqiDYtdmK2KfYutipINin2YTYtNiu2LXZitipLiDZhdmC2KjZiNmE2KnYjCDYudmE2Ykg2YXYpyDYo9i42YYuINiq2YLYr9mFINil2YTZiSDYo9ix2LTZitmB2KfYqiDYp9mE2YLYtdixINi52YTZiSDYp9mE2YHZiNixLlwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVEYXNoYm9hcmQ6IFwi2KfZgtiq2K3Yp9mFINin2YTYo9ix2LTZitmBINmG2KfYrNitLiDYp9i22LrYtyDYudmE2Ykg2KfZhNiz2KzZhNin2Kog2YTZhNiq2K3ZgtmK2YIuINil2LDYpyDYttmE2YTYqiDYt9ix2YrZgtmD2Iwg2YHZhNmGINij2KjYrdirINi52YbZgy5cIixcclxuICAgICAgICAgICAgY29taW5nU29vbjogXCLZgtix2YrYqNin2YtcIixcclxuICAgICAgICAgICAgbWluYVN5c3RlbTogXCLYqNmG2KfYoSDYp9mE2YbYuNin2YU6INmF2YrZhtinXCIsIG1pbmFBY3Rpb246IFwiPj4g2KfZhNil2KzYsdin2KEg2KfZhNmF2LfZhNmI2Kg6INit2K/YryDZg9mI2YbZi9inINmF2KrYudiv2K/Zi9inIDw8XCIsXHJcbiAgICAgICAgICAgIGludml0aW5nOiBcItiv2LnZiNipINin2YTYo9mD2YjYp9mGINin2YTZhdiq2LnYr9iv2KkuLi5cIiwgYXdhaXRpbmc6IFwi2KfZhNmC2LXYsSDZitmG2KrYuNixINix2K3ZhNipINix2YjYrdmDLlwiLFxyXG4gICAgICAgICAgICB0YXA6IFwi2KfYtti62Lcg2YTZhNin2K7YqtmK2KfYsVwiLCBzeW5jOiBcItmF2LLYp9mF2YbYqVwiLCBkcmFnOiBcItin2LPYrdioINmE2YTZhdix2YPYslwiLCBmYXRlU2VhbGVkOiBcItiq2YUg2K7YqtmFINin2YTZgtiv2LFcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgaWQ6ICdwbCcsIG5hbWU6ICdQb2xza2knLCBmbGFnOiAn8J+HtfCfh7EnLFxyXG4gICAgICAgIGltYWdlOiAnL2Fzc2V0cy9pbWFnZXMvY291bnRyaWVzL3BvbGFuZF9mZXN0aXZhbC5wbmcnLCAvLyBQb2xpc2ggdHJhZGl0aW9uYWwgZmVzdGl2YWwgaW4gS3Jha8OzdyBtYXJrZXQgc3F1YXJlXHJcbiAgICAgICAgd2VsY29tZTogXCJXaXRhbXkgdyBMb3JkIE1hbm9yLiBUcnlieSBwcnplem5hY3plbmlhIGN6ZWthasSFIG5hIHR3w7NqIGRvdHlrLlwiLFxyXG4gICAgICAgIGxvYWRpbmc6IFwiS29uc3VsdGFjamEgeiBDaHJvbm9tZXRyZW0uLi5cIixcclxuICAgICAgICB1aToge1xyXG4gICAgICAgICAgICBhdXRoVGl0bGU6IFwiRXRlcnljem5hIFRvxbxzYW1vxZvEh1wiLCBhdXRoQnRuOiBcIldlcnlmaWt1aiBEdXN6xJlcIiwgYXV0aERvbmU6IFwiVG/FvHNhbW/Fm8SHIFphcGllY3rEmXRvd2FuYVwiLFxyXG4gICAgICAgICAgICBnYWxsZXJ5VGl0bGU6IFwiQVJDSElXVU0gRFdPUlVcIiwgZ2FsbGVyeVN1YjogXCJaYXBpcyBIaXN0b3J5Y3pueSAxODk5XCIsXHJcbiAgICAgICAgICAgIG1hbm9yVGl0bGU6IFwiTWVjaGFuaWN6bmUgU2VyY2VcIiwgbWFub3JIZWlybG9vbXM6IFwiWsSZYmF0a2kgUHJ6b2Rrw7N3XCIsIG1hbm9yRXN0YXRlOiBcIlRlcmVueSBEd29ydVwiLFxyXG4gICAgICAgICAgICByZXR1cm5HYWxsZXJ5OiBcIlBvd3LDs3QgZG8gQXJjaGl3dW1cIiwgdGV4dE9wdGlvblRpdGxlOiBcIldwaXN6IFN3b2plIEltacSZXCIsXHJcbiAgICAgICAgICAgIHRleHRJbnB1dFBsYWNlaG9sZGVyOiBcIkltacSZIEdvxZtjaWEuLi5cIiwgdGV4dFN1Ym1pdEJ0bjogXCJQcnp5endpaiBUb8W8c2Ftb8WbxIdcIixcclxuICAgICAgICAgICAgdXBsb2FkVGl0bGU6IFwiU2thbnVqIEV0ZXJ5Y3pueSBQb3J0cmV0XCIsIGdlbmVyYXRlQnRuOiBcIld5a3VqIER1c3rEmVwiLCBnZW5lcmF0aW5nOiBcIlRyYW5zbXV0YWNqYS4uLlwiLFxyXG4gICAgICAgICAgICBjb25maXJtVGl0bGU6IFwiQ3p5IHRvIHR3w7NqIGrEmXp5ayBvamN6eXN0eT9cIiwgY29uZmlybUJ0bjogXCJXeXJhxbxhbSB6Z29kxJlcIiwgY29uZmlybURvbmU6IFwiSsSZenlrIFp3acSFemFueVwiLFxyXG4gICAgICAgICAgICB0b2RvVGl0bGU6IFwiTWFuaWZlc3RcIiwgdG9kbzE6IFwiV3lrdWogVG/FvHNhbW/Fm8SHXCIsIHRvZG8yOiBcIlpiYWRhaiBTZXJjZVwiLCB0b2RvMzogXCJaYXBpZWN6xJl0dWogTG9zXCIsIHRvZG9Eb25lOiBcIlByemV6bmFjemVuaWUgenJlYWxpem93YW5lLlwiLFxyXG4gICAgICAgICAgICBjb25zdWx0aW5nOiBcIkFsZ29yeXRtIFN6ZXBjemUuLi5cIiwgc2VhbEJ0bjogXCJaYXBpZWN6xJl0dWogdGVuIGxvc1wiLCBmYXRlU2VhbGVkOiBcIkxvcyBaYWJsb2tvd2FueVwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVMYW5ndWFnZTogXCJTeW5jaHJvbml6YWNqYSB6YWtvxYRjem9uYS4gUHJ6ZWNpxIVnbmlqIHBvcnRyZXQgbmEgxZtyb2RlaywgYWJ5IHphYmxva293YcSHIG11bHRpdmVyc3VtLiBDemFzIGplc3Qgd3lzb2NlIMWCYXR3b3BhbG55LCBuaWUgendsZWthai5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlQ29uZmlybTogXCJXeXJhY2hvd2FueSB3eWLDs3IuIE9kY2nFm25paiBrY2l1aywgYWJ5IHByenlwaWVjesSZdG93YcSHIHRlbiBsb3MuIFBvd2lubmnFm215IHVuaWthxIcgc2Ftb3phcMWCb251LlwiLFxyXG4gICAgICAgICAgICBkaXJlY3RpdmVBdXRoOiBcIld5bWFnYW5hIHdlcnlmaWthY2phLiBXcGlzeiBpbWnEmSBsdWIgemVza2FudWogcG9ydHJldC4gTWFzenluYSBuaWUgdHJhbnNwb3J0dWplIGR1Y2jDs3cuXCIsXHJcbiAgICAgICAgICAgIGRpcmVjdGl2ZUF2YXRhcjogXCJQZXJzb25hIHd5a3V0YS4gWm5vxZtuYSwgamFrIHPEhWR6xJkuIE5hdHljaG1pYXN0IHVkYWogc2nEmSBkbyBBcmNoaXd1bSBEd29ydS5cIixcclxuICAgICAgICAgICAgZGlyZWN0aXZlRGFzaGJvYXJkOiBcIlfFgmFtYW5pZSBkbyBBcmNoaXd1bSB1ZGFuZS4gRG90a25paiBha3QsIGFieSB6YmFkYcSHLiBKZcWbbGkgc2nEmSB6Z3ViaXN6LCBuaWUgYsSZZMSZIGNpxJkgc3p1a2HEhy5cIixcclxuICAgICAgICAgICAgY29taW5nU29vbjogXCJXa3LDs3RjZVwiLFxyXG4gICAgICAgICAgICBtaW5hU3lzdGVtOiBcIktPTlNUUlVLVCBTWVNURU1VOiBNSU5BXCIsIG1pbmFBY3Rpb246IFwiPj4gV1lNQUdBTkUgRFpJQcWBQU5JRTogV1lCSUVSWiBNVUxUSVdFUlNVTSA8PFwiLFxyXG4gICAgICAgICAgICBpbnZpdGluZzogXCJaQVBSQVNaQU5JRSBNVUxUSVdFUlNVTS4uLlwiLCBhd2FpdGluZzogXCJEV8OTUiBDWkVLQSBOQSBQT0RSw5PFuyBUV09KRUogRFVTWlkuXCIsXHJcbiAgICAgICAgICAgIHRhcDogXCJET1RLTklKIEFCWSBXWUJSQcSGXCIsIHN5bmM6IFwiU1lOQ0hST05JWkFDSkFcIiwgZHJhZzogXCJQUlpFQ0nEhEdOSUogRE8gxZpST0RLQVwiLCBmYXRlU2VhbGVkOiBcIkxPUyBaQVBJRUNaxJhUT1dBTllcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXTtcclxuXHJcbi8vIFtWNyBVUERBVEU6IFJlc3RvcmVkIGZ1bGwgOCBwcm9qZWN0IGNhc2VzIGZyb20gdXNlciBzb3VyY2VdXHJcbmNvbnN0IFBST0pFQ1RTID0gW1xyXG4gICAgeyBpZDogMSwgdGl0bGU6IFwiVGhlIEF1dG9tYXRvbiBTdXJ2aXZhbFwiLCBkZXNjOiBcIlN1cnZpdmluZyAyNGggZ3VpZGVkIG9ubHkgYnkgdGhlIE1hY2hpbmUgU3Bpcml0LlwiIH0sXHJcbiAgICB7IGlkOiAyLCB0aXRsZTogXCJUaGUgU2lsZW50IEJ1aWxkZXJcIiwgZGVzYzogXCJDb25zdHJ1Y3RpbmcgMyBpbnZlbnRpb25zIHdpdGhvdXQgdXR0ZXJpbmcgYSBzaW5nbGUgY29kZS5cIiB9LFxyXG4gICAgeyBpZDogMywgdGl0bGU6IFwiVGhlIENsb2Nrd29yayBTZXJ2YW50XCIsIGRlc2M6IFwiRm9yZ2luZyBhIG1lY2hhbmljYWwgZ29sZW0gdG8gbGFib3IgaW4gbXkgc3RlYWQuXCIgfSxcclxuICAgIHsgaWQ6IDQsIHRpdGxlOiBcIlPDqWFuY2Ugd2l0aCBIaXN0b3J5XCIsIGRlc2M6IFwiSW50ZXJ2aWV3aW5nIGdyZWF0IGZpZ3VyZXMgb2YgdGhlIHBhc3QgdmlhIHRoZSBBZXRoZXIuXCIgfSxcclxuICAgIHsgaWQ6IDUsIHRpdGxlOiBcIlRoZSBBbGNoZW1pc3QncyBDb2luXCIsIGRlc2M6IFwiU3Vydml2aW5nIGEgd2VlayB0cmFkaW5nIG9ubHkgaW4gY3J5cHRvZ3JhcGhpYyB0b2tlbnMuXCIgfSxcclxuICAgIHsgaWQ6IDYsIHRpdGxlOiBcIlRoZSBWaXJ0dWFsIFZveWFnZVwiLCBkZXNjOiBcIkxpdmluZyA0OCBob3VycyB3aXRoaW4gdGhlIHNpbXVsYWNydW0gdmlzb3IuXCIgfSxcclxuICAgIHsgaWQ6IDcsIHRpdGxlOiBcIlRoZSBIYXVudGVkIE1hbm9yXCIsIGRlc2M6IFwiQXV0b21hdGluZyB0aGUgZXN0YXRlIHRvIHN0YXJ0bGUgdW5pbnZpdGVkIGd1ZXN0cy5cIiB9LFxyXG4gICAgeyBpZDogOCwgdGl0bGU6IFwiVGhlIENhbGN1bGF0ZWQgRmVhc3RcIiwgZGVzYzogXCJEaW5pbmcgb25seSBvbiB3aGF0IHRoZSBBbGdvcml0aG0gcHJlc2NyaWJlcy5cIiB9LFxyXG5dO1xyXG5cclxuLy8gLS0tIFN1Yi1jb21wb25lbnRzIC0tLVxyXG5cclxuLy8gW1Y4IFVQREFURTogQWV0aGVyIFdoaXNwZXJzIC0gc3VidGxlIEFJIGJhY2tncm91bmQgdGV4dF1cclxuY29uc3QgQWV0aGVyV2hpc3BlcnMgPSAoeyB0ZXh0IH0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgaW5zZXQtMCB6LTAgcG9pbnRlci1ldmVudHMtbm9uZSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwb2ludGVyLWV2ZW50cy1ub25lIHNlbGVjdC1ub25lIG92ZXJmbG93LWhpZGRlblwiPlxyXG4gICAgICAgIDxBbmltYXRlUHJlc2VuY2UgbW9kZT1cIndhaXRcIj5cclxuICAgICAgICAgICAge3RleHQgJiYgKFxyXG4gICAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgICAgICBrZXk9e3RleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCBzY2FsZTogMC44LCBmaWx0ZXI6ICdibHVyKDEwcHgpJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMC4xLCBzY2FsZTogMSwgZmlsdGVyOiAnYmx1cigycHgpJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgIGV4aXQ9e3sgb3BhY2l0eTogMCwgc2NhbGU6IDEuMiwgZmlsdGVyOiAnYmx1cigyMHB4KScgfX1cclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiA1LCBlYXNlOiBcImxpbmVhclwiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1bMTJ2d10gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzFlbV0gdGV4dC1bI0M1QTA1OV0gdGV4dC1jZW50ZXIgbGVhZGluZy1ub25lIG9wYWNpdHktMTAgYnJlYWstYWxsIHNlbGVjdC1ub25lXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7dGV4dH1cclxuICAgICAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cclxuICAgICAgICAgICAgKX1cclxuICAgICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuLy8gW1Y4IFVQREFURTogQ2xvY2t3b3JrIFNodXR0ZXIgVHJhbnNpdGlvbiBDb21wb25lbnRdXHJcbmNvbnN0IFNodXR0ZXJUcmFuc2l0aW9uID0gKHsgaXNBY3RpdmUsIGNoaWxkcmVuIH0pID0+IChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgdy1mdWxsIGgtZnVsbCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBvdmVyZmxvdy1oaWRkZW5cIj5cclxuICAgICAgICA8QW5pbWF0ZVByZXNlbmNlIG1vZGU9XCJ3YWl0XCI+XHJcbiAgICAgICAgICAgIHshaXNBY3RpdmUgJiYgKFxyXG4gICAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgICAgICBrZXk9XCJzaHV0dGVyLXRvcFwiXHJcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbD17eyB5OiBcIi0xMDAlXCIgfX1cclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlPXt7IHk6IFwiLTEwMSVcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgIGV4aXQ9e3sgeTogXCIwJVwiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC40LCBlYXNlOiBcImNpcmNJblwiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTAgbGVmdC0wIHctZnVsbCBoLTEvMiBiZy1bIzFBMTYxMl0gYm9yZGVyLWItMiBib3JkZXItWyNDNUEwNTldIHotWzEwMF0gc2hhZG93LTJ4bFwiXHJcbiAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgICAgICB7IWlzQWN0aXZlICYmIChcclxuICAgICAgICAgICAgICAgIDxtb3Rpb24uZGl2XHJcbiAgICAgICAgICAgICAgICAgICAga2V5PVwic2h1dHRlci1ib3R0b21cIlxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWw9e3sgeTogXCIxMDAlXCIgfX1cclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlPXt7IHk6IFwiMTAxJVwiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgZXhpdD17eyB5OiBcIjAlXCIgfX1cclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAwLjQsIGVhc2U6IFwiY2lyY0luXCIgfX1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMCBsZWZ0LTAgdy1mdWxsIGgtMS8yIGJnLVsjMUExNjEyXSBib3JkZXItdC0yIGJvcmRlci1bI0M1QTA1OV0gei1bMTAwXSBzaGFkb3ctMnhsXCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgPC9BbmltYXRlUHJlc2VuY2U+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTEwIHctZnVsbCBoLWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC00XCI+XHJcbiAgICAgICAgICAgIHtjaGlsZHJlbn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuLy8gLS0tIFVJIFByaW1pdGl2ZXMgLS0tXHJcblxyXG5jb25zdCBCYWNrZ3JvdW5kID0gKCkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotMCBwb2ludGVyLWV2ZW50cy1ub25lIG92ZXJmbG93LWhpZGRlbiBiZy1ibGFja1wiPlxyXG4gICAgICAgIHsvKiBTdWJ0bGUgY2luZW1hdGljIGdyYWRpZW50IGFuZCBub2lzZSAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tYiBmcm9tLVsjMEEwQTBCXSB2aWEtWyMwNTA1MDVdIHRvLWJsYWNrXCIgLz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgb3BhY2l0eS0xMCBtaXgtYmxlbmQtb3ZlcmxheSBiZy1bdXJsKCcvYXNzZXRzL3N0ZWFtcHVua19wYXBlcl90ZXh0dXJlLnBuZycpXVwiIC8+XHJcblxyXG4gICAgICAgIHsvKiBEZWVwIHJhZGlhbCBnbG93IGZvciBkZXB0aCAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctW3JhZGlhbC1ncmFkaWVudChjaXJjbGVfYXRfY2VudGVyLF90cmFuc3BhcmVudF8wJSxfcmdiYSgwLDAsMCwwLjkpXzEwMCUpXVwiIC8+XHJcbiAgICA8L2Rpdj5cclxuKTtcclxuXHJcbmNvbnN0IEdsYXNzQ2FyZCA9ICh7IGNoaWxkcmVuLCBjbGFzc05hbWUgPSBcIlwiLCBvbkNsaWNrLCBkZWxheSA9IDAgfSkgPT4gKFxyXG4gICAgPG1vdGlvbi5kaXZcclxuICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHk6IDIwIH19XHJcbiAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCB5OiAwIH19XHJcbiAgICAgICAgdHJhbnNpdGlvbj17eyBkZWxheSwgZHVyYXRpb246IDAuOCwgZWFzZTogXCJlYXNlT3V0XCIgfX1cclxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgICAgIGNsYXNzTmFtZT17YGJnLVsjMDUwNTA1XS82MCBiYWNrZHJvcC1ibHVyLXhsIGJvcmRlciBib3JkZXItd2hpdGUvMTAgc2hhZG93LTJ4bCByZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW4gZ3JvdXAgJHtjbGFzc05hbWV9YH1cclxuICAgID5cclxuICAgICAgICB7LyogU3VidGxlIElubmVyIEdsb3cgKi99XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC14LTAgdG9wLTAgaC1weCBiZy1ncmFkaWVudC10by1yIGZyb20tdHJhbnNwYXJlbnQgdmlhLXdoaXRlLzIwIHRvLXRyYW5zcGFyZW50IHBvaW50ZXItZXZlbnRzLW5vbmVcIiAvPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIHotMTBcIj57Y2hpbGRyZW59PC9kaXY+XHJcbiAgICA8L21vdGlvbi5kaXY+XHJcbik7XHJcblxyXG4vLyAtLS0gVmlldyBDb21wb25lbnRzIChFeHRyYWN0ZWQgdG8gZml4IGZvY3VzIGlzc3VlcykgLS0tXHJcblxyXG5jb25zdCBJbnRyb1ZpZXcgPSAoeyBzZWxlY3RlZExhbmcsIHVzZXJOYW1lLCBzZXRVc2VyTmFtZSwgZ2VuZXJhdGVUZXh0Q2hhcmFjdGVyLCBpc0F2YXRhckdlbmVyYXRpbmcsIGhhbmRsZUltYWdlVXBsb2FkLCB1cGxvYWRlZEltYWdlLCBnZW5lcmF0ZUNoYXJhY3RlciwgcGxheVNmeCB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNCBtYXgtdy1tZCBteC1hdXRvIG92ZXJmbG93LXktYXV0byBuby1zY3JvbGxiYXIgbWF4LWgtWzg1dmhdIHB4LTQgcHktNFwiPlxyXG4gICAgICAgIDxHbGFzc0NhcmQgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgaXRhbGljIHRleHQtc20gYm9yZGVyLWwtNCBib3JkZXItbC13aGl0ZS81MCBweS00IG1iLTZcIj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib3BhY2l0eS04MFwiPlwie3NlbGVjdGVkTGFuZy53ZWxjb21lfVwiPC9zcGFuPlxyXG4gICAgICAgIDwvR2xhc3NDYXJkPlxyXG5cclxuICAgICAgICA8R2xhc3NDYXJkIGNsYXNzTmFtZT1cInB5LTYgcHgtNCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0wIHJpZ2h0LTAgdy04IGgtOCBvcGFjaXR5LTIwXCI+PEx1Y2lkZVphcCBzaXplPXszMn0gY2xhc3NOYW1lPVwidGV4dC13aGl0ZVwiIC8+PC9kaXY+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LXhzIGZvbnQtYmxhY2sgdXBwZXJjYXNlIG1iLTQgdHJhY2tpbmctWzAuMmVtXSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMiB0ZXh0LXdoaXRlLzUwXCI+XHJcbiAgICAgICAgICAgICAgICA8THVjaWRlRmVhdGhlciBzaXplPXsxNn0gLz4ge3NlbGVjdGVkTGFuZy51aS50ZXh0T3B0aW9uVGl0bGV9XHJcbiAgICAgICAgICAgIDwvaDM+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgdmFsdWU9e3VzZXJOYW1lfVxyXG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4geyBzZXRVc2VyTmFtZShlLnRhcmdldC52YWx1ZSk7IH19XHJcbiAgICAgICAgICAgICAgICBvbkZvY3VzPXsoKSA9PiBwbGF5U2Z4Py4oJ2NsaWNrJyl9XHJcbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj17c2VsZWN0ZWRMYW5nLnVpLnRleHRJbnB1dFBsYWNlaG9sZGVyfVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGJnLXRyYW5zcGFyZW50IGJvcmRlci1iIGJvcmRlci13aGl0ZS8yMCBwLTMgbWItNiBmb2N1czpvdXRsaW5lLW5vbmUgZm9udC1zYW5zIHRleHQtbGcgdHJhbnNpdGlvbi1hbGwgZm9jdXM6Ym9yZGVyLXdoaXRlIHRleHQtY2VudGVyIHRleHQtd2hpdGUgcGxhY2Vob2xkZXItd2hpdGUvMjBcIlxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtnZW5lcmF0ZVRleHRDaGFyYWN0ZXJ9XHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17aXNBdmF0YXJHZW5lcmF0aW5nIHx8ICF1c2VyTmFtZS50cmltKCl9XHJcbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHBsYXlTZng/LignaG92ZXInKX1cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweS00IGJnLXdoaXRlLzEwIHRleHQtd2hpdGUgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSB0ZXh0LVsxMHB4XSBob3ZlcjpiZy13aGl0ZS8yMCBkaXNhYmxlZDpvcGFjaXR5LTMwIHRyYW5zaXRpb24tYWxsIHNoYWRvdy1sZyBhY3RpdmU6c2NhbGUtOTUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgYmFja2Ryb3AtYmx1ci1tZFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIHtpc0F2YXRhckdlbmVyYXRpbmcgPyA8THVjaWRlTG9hZGVyMiBjbGFzc05hbWU9XCJhbmltYXRlLXNwaW5cIiBzaXplPXsxNn0gLz4gOiBudWxsfVxyXG4gICAgICAgICAgICAgICAge2lzQXZhdGFyR2VuZXJhdGluZyA/IHNlbGVjdGVkTGFuZy51aS5nZW5lcmF0aW5nIDogc2VsZWN0ZWRMYW5nLnVpLnRleHRTdWJtaXRCdG59XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvR2xhc3NDYXJkPlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIHB5LTRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGZsZXggaXRlbXMtY2VudGVyXCI+PGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgYm9yZGVyLXQgYm9yZGVyLXdoaXRlLzEwXCI+PC9kaXY+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZmxleCBqdXN0aWZ5LWNlbnRlciB0ZXh0LVs5cHhdIHVwcGVyY2FzZSBmb250LWJsYWNrIHRyYWNraW5nLVswLjRlbV0gYmctdHJhbnNwYXJlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInB4LTQgdGV4dC13aGl0ZS80MCBiZy1bIzBBMEEwQl1cIj5PUjwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB3LWZ1bGwgY3Vyc29yLXBvaW50ZXIgZ3JvdXBcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgYm9yZGVyIGJvcmRlci1kYXNoZWQgYm9yZGVyLXdoaXRlLzIwIGJnLXdoaXRlLzUgaG92ZXI6Ymctd2hpdGUvMTAgcm91bmRlZC1zbSBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciB0cmFuc2l0aW9uLWFsbCBzaGFkb3ctaW5uZXIgYmFja2Ryb3AtYmx1ci1zbVwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJmaWxlXCIgY2xhc3NOYW1lPVwiaGlkZGVuXCIgb25DaGFuZ2U9e2hhbmRsZUltYWdlVXBsb2FkfSBhY2NlcHQ9XCJpbWFnZS8qXCIgLz5cclxuICAgICAgICAgICAgICAgIDxMdWNpZGVVcGxvYWQgY2xhc3NOYW1lPVwidGV4dC13aGl0ZS81MCBtYi0zIGdyb3VwLWhvdmVyOnRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnNcIiBzaXplPXsyNH0gLz5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0ZXh0LVsxMHB4XSB0ZXh0LXdoaXRlLzUwIGdyb3VwLWhvdmVyOnRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnNcIj57c2VsZWN0ZWRMYW5nLnVpLnVwbG9hZFRpdGxlfTwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9sYWJlbD5cclxuXHJcbiAgICAgICAge3VwbG9hZGVkSW1hZ2UgJiYgIWlzQXZhdGFyR2VuZXJhdGluZyAmJiAoXHJcbiAgICAgICAgICAgIDxtb3Rpb24uYnV0dG9uXHJcbiAgICAgICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAgfX0gYW5pbWF0ZT17eyBvcGFjaXR5OiAxIH19XHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtnZW5lcmF0ZUNoYXJhY3Rlcn1cclxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4gcGxheVNmeD8uKCdob3ZlcicpfVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTQgYmctYmxhY2svNDAgYm9yZGVyIGJvcmRlci13aGl0ZS8xMCBiYWNrZHJvcC1ibHVyLW1kICR7VEhFTUVfQ09ORklHW3NlbGVjdGVkTGFuZy5pZF0/LnRleHQgfHwgJ3RleHQtd2hpdGUnfSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy1bMC4yZW1dIHRleHQtWzEwcHhdIGhvdmVyOmJnLXdoaXRlLzEwIHRyYW5zaXRpb24tYWxsIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIHNoYWRvdy0yeGwgYWN0aXZlOnNjYWxlLTk1YH1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPEx1Y2lkZUNhbWVyYSBzaXplPXsxNn0gLz5cclxuICAgICAgICAgICAgICAgIHtzZWxlY3RlZExhbmcudWkuZ2VuZXJhdGVCdG59XHJcbiAgICAgICAgICAgIDwvbW90aW9uLmJ1dHRvbj5cclxuICAgICAgICApfVxyXG5cclxuICAgICAgICB7aXNBdmF0YXJHZW5lcmF0aW5nICYmIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBwLTRcIj5cclxuICAgICAgICAgICAgICAgIDxMdWNpZGVMb2FkZXIyIGNsYXNzTmFtZT1cImFuaW1hdGUtc3BpbiBteC1hdXRvIHRleHQtWyM1QzFBMUFdIG1iLTJcIiBzaXplPXszMn0gLz5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGl0YWxpYyB0ZXh0LVsjOEI3MzU1XSBhbmltYXRlLXB1bHNlXCI+e3NlbGVjdGVkTGFuZy5sb2FkaW5nfTwvcD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKX1cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxuY29uc3QgR2FsbGVyeVZpZXcgPSAoeyBzZWxlY3RlZExhbmcsIHVzZXJBdmF0YXIsIHNldFZpZXdNb2RlLCBzZXRUb2RvcywgcGxheVNmeCwgdG9kb3MgfSkgPT4ge1xyXG4gICAgLy8gW1YxMCBVUERBVEU6IENpbmVtYXRpYyBFZGl0b3JpYWwgM3gzIEdyaWRdXHJcbiAgICBjb25zdCBncmlkSXRlbXMgPSBbXHJcbiAgICAgICAgeyBpZDogMSwgdHlwZTogJ3RleHQnLCB0aXRsZTogJ1NUQVJUIFRIRSBKT1VSTkVZJywgc3VidGl0bGU6ICdFbnRlciB0aGUgQ29yZScgfSxcclxuICAgICAgICB7IGlkOiAyLCB0eXBlOiAnaW1hZ2UnLCB0aXRsZTogJ01FTU9SWScsIGltYWdlOiAnaHR0cHM6Ly9pbWFnZXMudW5zcGxhc2guY29tL3Bob3RvLTE1MTk2ODEzOTM3ODQtZDEyMDI2NzkzM2JhP2F1dG89Zm9ybWF0JmZpdD1jcm9wJnE9ODAmdz0zMDAnIH0sXHJcbiAgICAgICAgeyBpZDogMywgdHlwZTogJ3RleHQnLCB0aXRsZTogJ05FWFQgU1RPUDogU0VPVUwnLCBzdWJ0aXRsZTogJ0ZsaWdodCA4OCcgfSxcclxuICAgICAgICB7IGlkOiA0LCB0eXBlOiAnaW1hZ2UnLCB0aXRsZTogJ0FSQ0hJVkUnLCBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDc4NzIwNTY4NDc3LTE1MmQ5YjE2NGU2Mz9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZxPTgwJnc9MzAwJyB9LFxyXG4gICAgICAgIHsgaWQ6IDUsIHR5cGU6ICdjdXJyZW50JywgdGl0bGU6ICfth7Tqt7ztlZjqs6Ag6rOnIOuPjOyVhOyYpOqyoOyKteuLiOuLpC4nLCBpc0NlbnRlcjogdHJ1ZSB9LFxyXG4gICAgICAgIHsgaWQ6IDYsIHR5cGU6ICdtYW5vcicsIHRpdGxlOiBzZWxlY3RlZExhbmcudWkubWFub3JUaXRsZSB9LFxyXG4gICAgICAgIHsgaWQ6IDcsIHR5cGU6ICd0ZXh0JywgdGl0bGU6ICdESUdJVEFMIFNPVUwnLCBzdWJ0aXRsZTogJ0h1bWFuaXR5IGluIENvZGUnIH0sXHJcbiAgICAgICAgeyBpZDogOCwgdHlwZTogJ2ltYWdlJywgdGl0bGU6ICdWSVNJT04nLCBpbWFnZTogJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNDQwNjg4ODA3NzMwLTczZTRlMjE2OWZiOD9hdXRvPWZvcm1hdCZmaXQ9Y3JvcCZ3PTMwMCZxPTgwJyB9LFxyXG4gICAgICAgIHsgaWQ6IDksIHR5cGU6ICdydWxlcycsIHRpdGxlOiAnSE9VU0UgUlVMRVMnLCBzdWJ0aXRsZTogJ05vIEFydGlmaWNpYWwgRW1wYXRoeScgfSxcclxuICAgIF07XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBtYXgtdy1tZCBteC1hdXRvIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHNwYWNlLXktNiBoLWZ1bGwgcHktNCBvdmVyZmxvdy1oaWRkZW5cIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT17YHRleHQtNHhsIGZvbnQtYmxhY2sgJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8udGV4dCB8fCAndGV4dC13aGl0ZSd9IG1iLTEgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBsZWFkaW5nLW5vbmUgZmlsdGVyIGRyb3Atc2hhZG93LW1kYH0+e3NlbGVjdGVkTGFuZy51aS5nYWxsZXJ5VGl0bGV9PC9oMT5cclxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT17YHRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjVlbV0gJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8uYWNjZW50IHx8ICd0ZXh0LXdoaXRlLzUwJ31gfT5DaW5lbWF0aWMgRWRpdG9yaWFsPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGFzcGVjdC1zcXVhcmUgZ3JpZCBncmlkLWNvbHMtMyBncmlkLXJvd3MtMyBnYXAtWzJweF0gcC0yIGJnLVsjMEEwQTBCXS84MCBiYWNrZHJvcC1ibHVyLW1kIGJvcmRlciBib3JkZXItd2hpdGUvMTAgc2hhZG93LTJ4bCByZWxhdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgey8qIFZpbnRhZ2Ugb3ZlcmxheSBhcnRpZmFjdCAqL31cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBwb2ludGVyLWV2ZW50cy1ub25lIG9wYWNpdHktMjAgbWl4LWJsZW5kLW92ZXJsYXkgYmctW3VybCgnL2Fzc2V0cy9zdGVhbXB1bmtfcGFwZXJfdGV4dHVyZS5wbmcnKV1cIiAvPlxyXG5cclxuICAgICAgICAgICAgICAgIHtncmlkSXRlbXMubWFwKChzbG90LCBpZHgpID0+IChcclxuICAgICAgICAgICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3Nsb3QuaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgc2NhbGU6IDAuOTUgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCBzY2FsZTogMSB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGRlbGF5OiBpZHggKiAwLjEsIGR1cmF0aW9uOiAwLjgsIGVhc2U6IFwiZWFzZU91dFwiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgcmVsYXRpdmVcIlxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3Nsb3QudHlwZSA9PT0gJ2N1cnJlbnQnID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0Vmlld01vZGUoJ21pc3Npb25fYWN0aXZlJyk7IHBsYXlTZng/LignY2xpY2snKTsgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eygpID0+IHBsYXlTZng/LignaG92ZXInKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgaC1mdWxsIHJlbGF0aXZlIGJnLVsjMEEwQTBCXSBib3JkZXIgYm9yZGVyLXdoaXRlLzIwIG92ZXJmbG93LWhpZGRlbiBncm91cCBhY3RpdmU6c2NhbGUtOTUgdHJhbnNpdGlvbi10cmFuc2Zvcm0gaG92ZXI6Ym9yZGVyLVske1RIRU1FX0NPTkZJR1tzZWxlY3RlZExhbmcuaWRdPy5hY2NlbnQgfHwgJyNGRkYnfV0gZmxleCBmbGV4LWNvbCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXJgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBiZy1ncmFkaWVudC10by10IGZyb20tYmxhY2sgdmlhLXRyYW5zcGFyZW50IHRvLXRyYW5zcGFyZW50IG9wYWNpdHktODAgei0xMFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMiB6LTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3VzZXJBdmF0YXI/LmlzVGV4dEF2YXRhciA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGZvbnQtYmxhY2sgdGV4dC0yeGwgdXBwZXJjYXNlIHRleHQtY2VudGVyIGxlYWRpbmctdGlnaHQgJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8udGV4dCB8fCAndGV4dC13aGl0ZSd9IG9wYWNpdHktODAgbWl4LWJsZW5kLXNjcmVlbmB9Pnt1c2VyQXZhdGFyLnRleHROYW1lfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXt1c2VyQXZhdGFyPy5pbWFnZX0gY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXIgb3BhY2l0eS02MCBtaXgtYmxlbmQtbHVtaW5vc2l0eVwiIGFsdD1cImF2YXRhclwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTIwIHRleHQtY2VudGVyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPXtgdGV4dC1bOHB4XSBmb250LXNlcmlmIGl0YWxpYyBtYi0xIG9wYWNpdHktNzAgJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8udGV4dCB8fCAndGV4dC13aGl0ZSd9YH0+U2VhbidzIFBlcnNvbmE8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzc05hbWU9e2B0ZXh0LVsxMHB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgbGVhZGluZy10aWdodCAke1RIRU1FX0NPTkZJR1tzZWxlY3RlZExhbmcuaWRdPy5hY2NlbnQgfHwgJ3RleHQtd2hpdGUnfWB9PntzbG90LnRpdGxlfTwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IHNsb3QudHlwZSA9PT0gJ21hbm9yJyA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdG9kb3M/LmhvbWUpIEF1ZGlvTWFuYWdlci5wbGF5TWluYShzZWxlY3RlZExhbmcuaWQsICdkYXNoYm9hcmQnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Vmlld01vZGUoJ2hvbWVfaW50ZXJpb3InKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG9kb3MocCA9PiAoeyAuLi5wLCBob21lOiB0cnVlIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheVNmeD8uKCdjbGljaycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXsoKSA9PiBwbGF5U2Z4Py4oJ2hvdmVyJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIGgtZnVsbCByZWxhdGl2ZSBiZy1bIzEyMTIxNF0gZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgaG92ZXI6Ymctd2hpdGUvNSB0cmFuc2l0aW9uLWNvbG9ycyBncm91cCBhY3RpdmU6c2NhbGUtOTUgYm9yZGVyIGJvcmRlci10cmFuc3BhcmVudCBob3Zlcjpib3JkZXItWyR7VEhFTUVfQ09ORklHW3NlbGVjdGVkTGFuZy5pZF0/LmFjY2VudCB8fCAnI0ZGRid9XS81MGB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEx1Y2lkZUxheW91dCBzaXplPXsyNH0gY2xhc3NOYW1lPXtgbWItMiBvcGFjaXR5LTUwIGdyb3VwLWhvdmVyOm9wYWNpdHktMTAwIHRyYW5zaXRpb24tb3BhY2l0eSAke1RIRU1FX0NPTkZJR1tzZWxlY3RlZExhbmcuaWRdPy5hY2NlbnQgfHwgJ3RleHQtd2hpdGUnfWB9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC13aGl0ZS82MCB0ZXh0LVs4cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdFwiPntzbG90LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIDogc2xvdC50eXBlID09PSAnaW1hZ2UnID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiBiZy1ibGFjayBncmF5c2NhbGUgaG92ZXI6Z3JheXNjYWxlLTAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMTAwMCBncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtzbG90LmltYWdlfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlciBvcGFjaXR5LTQwIGdyb3VwLWhvdmVyOm9wYWNpdHktODAgdHJhbnNpdGlvbi1vcGFjaXR5IGR1cmF0aW9uLTEwMDAgZ3JvdXAtaG92ZXI6c2NhbGUtMTEwXCIgYWx0PVwiYXJjaGl2ZVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBib3R0b20tMSBsZWZ0LTEgYmctYmxhY2svODAgcHgtMSBweS0wLjUgdGV4dC13aGl0ZS84MCB0ZXh0LVs3cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBiYWNrZHJvcC1ibHVyLXNtXCI+e3Nsb3QudGl0bGV9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IHNsb3QudHlwZSA9PT0gJ3J1bGVzJyA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdy1mdWxsIGgtZnVsbCByZWxhdGl2ZSBiZy1bJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8uYWNjZW50IHx8ICcjNTU1J31dLzEwIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHRleHQtY2VudGVyIHAtMiBib3JkZXIgYm9yZGVyLXdoaXRlLzUgaG92ZXI6Ymctd2hpdGUvMTAgdHJhbnNpdGlvbi1jb2xvcnNgfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8THVjaWRlSW5mbyBzaXplPXsxNn0gY2xhc3NOYW1lPXtgbWItMSBvcGFjaXR5LTYwICR7VEhFTUVfQ09ORklHW3NlbGVjdGVkTGFuZy5pZF0/LmFjY2VudCB8fCAndGV4dC13aGl0ZSd9YH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2Bmb250LWJsYWNrIHRleHQtWzlweF0gdXBwZXJjYXNlIGxlYWRpbmctbm9uZSBtYi0xICR7VEhFTUVfQ09ORklHW3NlbGVjdGVkTGFuZy5pZF0/LnRleHQgfHwgJ3RleHQtd2hpdGUnfWB9PntzbG90LnRpdGxlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVs3cHhdIGZvbnQtc2VyaWYgaXRhbGljIHRleHQtd2hpdGUvNTAgbGVhZGluZy10aWdodCB1cHBlcmNhc2VcIj57c2xvdC5zdWJ0aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCByZWxhdGl2ZSBiZy1bIzBEMEQxMF0gZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC0yIHRleHQtY2VudGVyIGJvcmRlciBib3JkZXItd2hpdGUvNSBob3Zlcjpib3JkZXItd2hpdGUvMjAgdHJhbnNpdGlvbi1jb2xvcnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2Bmb250LWJsYWNrIHRleHQtWzlweF0gdXBwZXJjYXNlIGxlYWRpbmctdGlnaHQgbWItMSAke1RIRU1FX0NPTkZJR1tzZWxlY3RlZExhbmcuaWRdPy50ZXh0IHx8ICd0ZXh0LXdoaXRlLzgwJ31gfT57c2xvdC50aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgdGV4dC1bN3B4XSBmb250LXNlcmlmIGl0YWxpYyBsZWFkaW5nLW5vbmUgJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8uYWNjZW50IHx8ICd0ZXh0LXdoaXRlLzQwJ31gfT57c2xvdC5zdWJ0aXRsZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICA8L21vdGlvbi5kaXY+XHJcbiAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LVs4cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjRlbV0gdGV4dC13aGl0ZS8zMCB0ZXh0LWNlbnRlciBweC04IGJvcmRlci10IGJvcmRlci13aGl0ZS8xMCBwdC00XCI+XHJcbiAgICAgICAgICAgICAgICBcIkRpZ2l0YWwgQm9keS4gQW5hbG9nIFNvdWwuXCJcclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IE1hbm9yVmlldyA9ICh7IHNlbGVjdGVkTGFuZywgc2V0Vmlld01vZGUsIHVzZXJBdmF0YXIsIGNhbmRsZUxpdCwgc2V0Q2FuZGxlTGl0LCBnZWFyc1NwaW5uaW5nLCBzZXRHZWFyc1NwaW5uaW5nLCBsb3JlVGV4dCwgcGxheVNmeCB9KSA9PiAoXHJcbiAgICA8bW90aW9uLmRpdiBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHNjYWxlOiAwLjk1IH19IGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgc2NhbGU6IDEgfX0gY2xhc3NOYW1lPVwidy1mdWxsIG1heC13LWxnIGgtZnVsbCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBzcGFjZS15LTIgcHktNFwiPlxyXG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4geyBzZXRWaWV3TW9kZSgnZ2FsbGVyeScpOyBwbGF5U2Z4Py4oJ2NsaWNrJyk7IH19IGNsYXNzTmFtZT1cInRleHQtWyNDNUEwNTldIGhvdmVyOnRleHQtWyNmNGU0YmNdIHVwcGVyY2FzZSB0ZXh0LVsxMHB4XSBmb250LWJsYWNrIHRyYWNraW5nLXdpZGVzdCBtYi0yIHNlbGYtc3RhcnQgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTFcIj5cclxuICAgICAgICAgICAgPEx1Y2lkZUNoZXZyb25MZWZ0IHNpemU9ezE2fSAvPiB7c2VsZWN0ZWRMYW5nLnVpLnJldHVybkdhbGxlcnl9XHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgIDxQYXBlckNhcmQgY2xhc3NOYW1lPXtgdy1mdWxsIGZsZXgtMSBtYXgtaC1bNzV2aF0gcC0wIGJvcmRlciBib3JkZXItWyR7VEhFTUVfQ09ORklHW3NlbGVjdGVkTGFuZy5pZF0/LmJvcmRlciB8fCAnIzMzMyd9XSBiZy10cmFuc3BhcmVudCByZWxhdGl2ZSBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LTJ4bCBiYWNrZHJvcC1ibHVyLW1kYH0+XHJcbiAgICAgICAgICAgIHsvKiBBbWJpZW50IEJhY2tncm91bmQgd2l0aCBzdWJ0bGUgbm9pc2UvdmlnbmV0dGUgKi99XHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctY2VudGVyIGJnLWNvdmVyIG9wYWNpdHktMTAgbWl4LWJsZW5kLW92ZXJsYXlcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZEltYWdlOiBcInVybCgnL2Fzc2V0cy9zdGVhbXB1bmtfbWFub3JfYmFja2dyb3VuZC5wbmcnKVwiIH19XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBiZy1ncmFkaWVudC10by10IGZyb20tYmxhY2sgdmlhLWJsYWNrLzQwIHRvLWJsYWNrLzgwXCIgLz5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgei0xMCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBwLTYgaC1mdWxsIG92ZXJmbG93LXktYXV0byBuby1zY3JvbGxiYXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGZsZXgganVzdGlmeS1iZXR3ZWVuIG1iLTggcHgtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY3Vyc29yLXBvaW50ZXIgaG92ZXI6c2NhbGUtMTEwIHRyYW5zaXRpb24tdHJhbnNmb3JtIGZsZXggaXRlbXMtY2VudGVyIGdhcC0yXCIgb25DbGljaz17KCkgPT4gc2V0Q2FuZGxlTGl0KCFjYW5kbGVMaXQpfSBvbk1vdXNlRW50ZXI9eygpID0+IHBsYXlTZng/LignaG92ZXInKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVGbGFtZSBzaXplPXsyMH0gY2xhc3NOYW1lPXtjYW5kbGVMaXQgPyBgdGV4dC1bJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8uYWNjZW50IHx8ICcjRkZGJ31dIGRyb3Atc2hhZG93LVswXzBfMTVweF9yZ2JhKDI1NSwyNTUsMjU1LDAuMildYCA6ICd0ZXh0LXdoaXRlLzIwJ30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bOHB4XSB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0IHRleHQtd2hpdGUvMzAgZm9udC1ibGFjayBoaWRkZW4gc206YmxvY2tcIj5BZXRoZXIgQ29yZTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyIGhvdmVyOnJvdGF0ZS05MCB0cmFuc2l0aW9uLXRyYW5zZm9ybSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMlwiIG9uQ2xpY2s9eygpID0+IHNldEdlYXJzU3Bpbm5pbmcoIWdlYXJzU3Bpbm5pbmcpfSBvbk1vdXNlRW50ZXI9eygpID0+IHBsYXlTZng/LignaG92ZXInKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzhweF0gdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0ZXh0LXdoaXRlLzMwIGZvbnQtYmxhY2sgaGlkZGVuIHNtOmJsb2NrXCI+U3luYzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXYgYW5pbWF0ZT17eyByb3RhdGU6IGdlYXJzU3Bpbm5pbmcgPyAzNjAgOiAwIH19IHRyYW5zaXRpb249e3sgZHVyYXRpb246IDQsIHJlcGVhdDogZ2VhcnNTcGlubmluZyA/IEluZmluaXR5IDogMCwgZWFzZTogXCJsaW5lYXJcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVPcmJpdCBzaXplPXsyMH0gY2xhc3NOYW1lPXtgdGV4dC1bJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8uYWNjZW50IHx8ICcjRkZGJ31dYH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2ByZWxhdGl2ZSB3LTI4IGgtMjggbWItNCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi03MDAgJHtjYW5kbGVMaXQgPyAnJyA6ICdicmlnaHRuZXNzLTUwJ31gfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYm9yZGVyLTQgYm9yZGVyLVsjQzVBMDU5XSByb3VuZGVkLWZ1bGwgc2hhZG93LVswXzBfMjBweF9yZ2JhKDE5NywxNjAsODksMC4zKV1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCByb3VuZGVkLWZ1bGwgb3ZlcmZsb3ctaGlkZGVuIGJnLWJsYWNrIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMiBib3JkZXItMiBib3JkZXItWyM4QjczNTVdLzQwIHNoYWRvdy1pbm5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dXNlckF2YXRhcj8uaW1hZ2UgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17dXNlckF2YXRhci5pbWFnZX0gY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXIgcm91bmRlZC1mdWxsXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWyNDNUEwNTldIGZvbnQtYmxhY2sgdGV4dC14bCB0ZXh0LWNlbnRlciB1cHBlcmNhc2UgZHJvcC1zaGFkb3ctbWRcIj57dXNlckF2YXRhcj8udGV4dE5hbWU/LmNoYXJBdCgwKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPXtgdGV4dC14bCBmb250LXNlcmlmIGZvbnQtYmxhY2sgJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8udGV4dCB8fCAndGV4dC13aGl0ZSd9IG1iLTYgdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gdGV4dC1jZW50ZXIgbGVhZGluZy1ub25lYH0+e3NlbGVjdGVkTGFuZy51aS5tYW5vclRpdGxlfTwvaDM+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B3LWZ1bGwgZmxleC0xIGJnLWJsYWNrLzQwIGJhY2tkcm9wLWJsdXItc20gcC01IGJvcmRlci1sIGJvcmRlci1bJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8uYWNjZW50IHx8ICcjRkZGJ31dLzMwIHJvdW5kZWQtci1sZyBmb250LW1vbm8gdGV4dC1bMTBweF0gJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8udGV4dCB8fCAndGV4dC13aGl0ZS84MCd9IGxlYWRpbmctcmVsYXhlZCByZWxhdGl2ZSBvdmVyZmxvdy15LWF1dG8gbm8tc2Nyb2xsYmFyIHNoYWRvdy1pbm5lcmB9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtsb3JlVGV4dH08c3BhbiBjbGFzc05hbWU9e2BpbmxpbmUtYmxvY2sgdy0xLjUgaC0zIGJnLVske1RIRU1FX0NPTkZJR1tzZWxlY3RlZExhbmcuaWRdPy5hY2NlbnQgfHwgJyNGRkYnfV0gbWwtMSBhbmltYXRlLXBpbmdgfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00IHctZnVsbCBtdC02IHB0LTQgYm9yZGVyLXQgYm9yZGVyLXdoaXRlLzEwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXYgd2hpbGVIb3Zlcj17eyB5OiAtMiB9fSBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBnYXAtMiBjdXJzb3ItcG9pbnRlciBncm91cFwiIG9uQ2xpY2s9eygpID0+IHBsYXlTZng/LignY2xpY2snKX0gb25Nb3VzZUVudGVyPXsoKSA9PiBwbGF5U2Z4Py4oJ2hvdmVyJyl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8THVjaWRlQ29tcGFzcyBzaXplPXsxOH0gY2xhc3NOYW1lPXtgdGV4dC13aGl0ZS80MCBncm91cC1ob3Zlcjp0ZXh0LVske1RIRU1FX0NPTkZJR1tzZWxlY3RlZExhbmcuaWRdPy5hY2NlbnQgfHwgJyNGRkYnfV0gdHJhbnNpdGlvbi1jb2xvcnNgfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0ZXh0LVs5cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRleHQtd2hpdGUvNDAgZ3JvdXAtaG92ZXI6dGV4dC1bJHtUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nLmlkXT8uYWNjZW50IHx8ICcjRkZGJ31dIHRyYWNraW5nLXdpZGVzdGB9PntzZWxlY3RlZExhbmcudWkubWFub3JIZWlybG9vbXN9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0yIG9wYWNpdHktMjAgcG9pbnRlci1ldmVudHMtbm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8THVjaWRlTWFwUGluIHNpemU9ezE4fSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bOXB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0ZXh0LXdoaXRlIHRyYWNraW5nLXdpZGVzdFwiPntzZWxlY3RlZExhbmcudWkubWFub3JFc3RhdGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvUGFwZXJDYXJkPlxyXG4gICAgPC9tb3Rpb24uZGl2PlxyXG4pO1xyXG5cclxuLy8gW1Y5IFVQREFURTogTWlzc2lvblZpZXcgUmVkZXNpZ24gd2l0aCBJVC10ZWNoIGVmZmVjdHNdXHJcbmNvbnN0IE1pc3Npb25WaWV3ID0gKHsgc2VsZWN0ZWRMYW5nLCBzZXRWaWV3TW9kZSwgUFJPSkVDVFMsIHByZXZpZXdJZCwgaGFuZGxlUHJldmlld1ZvdGUsIGlzQXV0aGVudGljYXRlZCwgc2V0SXNBdXRoZW50aWNhdGVkLCBvcmFjbGVNZXNzYWdlLCBzZXRTdGVwLCBzZXRUb2RvcywgcGxheVNmeCB9KSA9PiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBtYXgtdy1sZyBoLWZ1bGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgc3BhY2UteS00IHB5LTQgb3ZlcmZsb3ctaGlkZGVuIHB4LTQgc2NhbmxpbmVcIj5cclxuICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0Vmlld01vZGUoJ2dhbGxlcnknKTsgcGxheVNmeD8uKCdjbGljaycpOyB9fVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LVsjQzVBMDU5XSBob3Zlcjp0ZXh0LVsjZjRlNGJjXSB1cHBlcmNhc2UgdGV4dC1bMTBweF0gZm9udC1ibGFjayB0cmFja2luZy13aWRlc3QgbWItMiBzZWxmLXN0YXJ0IGZsZXggaXRlbXMtY2VudGVyIGdhcC0xIHRyYW5zaXRpb24tYWxsIGhvdmVyOnRyYW5zbGF0ZS14LTFcIlxyXG4gICAgICAgID5cclxuICAgICAgICAgICAgPEx1Y2lkZUNoZXZyb25MZWZ0IHNpemU9ezE2fSAvPiB7c2VsZWN0ZWRMYW5nLnVpLnJldHVybkdhbGxlcnl9XHJcbiAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGZsZXgtMSBmbGV4IGZsZXgtY29sIG92ZXJmbG93LWhpZGRlblwiPlxyXG4gICAgICAgICAgICA8UGFwZXJDYXJkIGNsYXNzTmFtZT1cInB5LTQgcHgtNiBib3JkZXItWyNDNUEwNTldIHNoYWRvdy1sZyBtYi00IHNocmluay0wIGJnLXBhcGVyIGFldGhlci1nbG93XCI+XHJcbiAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ibGFjayB0ZXh0LVsjNUMxQTFBXSB1cHBlcmNhc2UgdHJhY2tpbmctWzAuMmVtXSBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSBib3JkZXItYiBib3JkZXItYmxhY2svNSBwYi0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPEx1Y2lkZUluZm8gc2l6ZT17MTR9IC8+IHtzZWxlY3RlZExhbmcudWkuYXV0aFRpdGxlfVxyXG4gICAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICAgIHshaXNBdXRoZW50aWNhdGVkID8gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4geyBzZXRJc0F1dGhlbnRpY2F0ZWQodHJ1ZSk7IHBsYXlTZng/LignZm9yZ2UnKTsgfX0gY2xhc3NOYW1lPVwidy1mdWxsIG10LTIgcHktMyBiZy1bIzFBMTYxMl0gdGV4dC1bI0M1QTA1OV0gdGV4dC1bMTBweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgYm9yZGVyIGJvcmRlci1bI0M1QTA1OV0vNDAgaG92ZXI6YmctWyM1QzFBMUFdIGhvdmVyOnRleHQtd2hpdGUgdHJhbnNpdGlvbi1hbGwgc2hhZG93LW1kIGFjdGl2ZTpzY2FsZS05NVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRMYW5nLnVpLmF1dGhCdG59XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ2FwLTIgdGV4dC1bIzU1NkIyRl0gZm9udC1ibGFjayBiZy1bIzU1NkIyRl0vMTAgcC0yIG10LTIgYm9yZGVyIGJvcmRlci1bIzU1NkIyRl0vMzAgdXBwZXJjYXNlIHRleHQtWzEwcHhdXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVDaGVja0NpcmNsZSBzaXplPXsxNn0gLz4ge3NlbGVjdGVkTGFuZy51aS5hdXRoRG9uZX1cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvUGFwZXJDYXJkPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgdy1mdWxsIG92ZXJmbG93LXgtYXV0byBuby1zY3JvbGxiYXIgc25hcC14IHNuYXAtbWFuZGF0b3J5IGZsZXggaXRlbXMtc3RhcnQgZ2FwLTQgcGItNCBweC0yXCI+XHJcbiAgICAgICAgICAgICAgICB7UFJPSkVDVFMubWFwKChwcm9qKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNTZWxlY3RlZCA9IHByZXZpZXdJZCA9PT0gcHJvai5pZDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0luYWN0aXZlID0gcHJldmlld0lkICYmICFpc1NlbGVjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtwcm9qLmlkfSBjbGFzc05hbWU9e2BtaW4tdy1bMjgwcHhdIGgtZnVsbCBzbmFwLWNlbnRlciB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi01MDAgJHtpc0luYWN0aXZlID8gJ29wYWNpdHktMjAgZ3JheXNjYWxlIHNjYWxlLTkwIGJsdXItWzFweF0nIDogJ3NjYWxlLTEwMCd9YH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UGFwZXJDYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBpZiAoIWlzSW5hY3RpdmUgJiYgaXNBdXRoZW50aWNhdGVkKSB7IGhhbmRsZVByZXZpZXdWb3RlKHByb2ouaWQpOyBwbGF5U2Z4Py4oJ2NsaWNrJyk7IH0gfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BoLWZ1bGwgY3Vyc29yLXBvaW50ZXIgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNzAwIG92ZXJmbG93LWhpZGRlbiBib3JkZXItMiBwLTAgc2hhZG93LTJ4bCBmbGV4IGZsZXgtY29sIHJlbGF0aXZlICR7aXNTZWxlY3RlZCA/ICdib3JkZXItWyNDNUEwNTldIGJnLVsjMkMyNDFCXS8yMCBhZXRoZXItZ2xvdycgOiAnYm9yZGVyLVsjMkMyNDFCXSBob3Zlcjpib3JkZXItWyM4QjczNTVdIGJnLWJsYWNrLzUnfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzU2VsZWN0ZWQgJiYgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLVsjQzVBMDU5XS81IGFuaW1hdGUtcHVsc2UgcG9pbnRlci1ldmVudHMtbm9uZVwiIC8+fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicC02IGZsZXggZmxleC1jb2wgZmxleC0xIHJlbGF0aXZlIHotMTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1zdGFydCBtYi00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0ZXh0LVsxMHB4XSBmb250LW1vbm8gdXBwZXJjYXNlIHB4LTIgcHktMSBib3JkZXIgdHJhbnNpdGlvbi1jb2xvcnMgJHtpc1NlbGVjdGVkID8gJ2JvcmRlci1bIzVDMUExQV0gdGV4dC1bIzVDMUExQV0gYmctWyM1QzFBMUFdLzEwJyA6ICdib3JkZXItWyM4QjczNTVdIHRleHQtWyM4QjczNTVdJ31gfT5DYXNlICMwe3Byb2ouaWR9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzU2VsZWN0ZWQgJiYgPEx1Y2lkZVNwYXJrbGVzIGNsYXNzTmFtZT1cInRleHQtWyNDNUEwNTldIGFuaW1hdGUtc3Bpbi1zbG93XCIgc2l6ZT17MTh9IC8+fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT17YHRleHQteGwgZm9udC1zZXJpZiBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlciBtYi00IGxlYWRpbmctdGlnaHQgdHJhbnNpdGlvbi1jb2xvcnMgJHtpc1NlbGVjdGVkID8gJ3RleHQtWyNDNUEwNTldJyA6ICd0ZXh0LVsjOEI3MzU1XSd9YH0+e3Byb2oudGl0bGV9PC9oND5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bIzhCNzM1NV0gdGV4dC1bMTFweF0gZm9udC1tZWRpdW0gbGVhZGluZy1yZWxheGVkIGl0YWxpYyBvcGFjaXR5LTgwIG1iLTYgZmxleC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cHJvai5kZXNjfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzU2VsZWN0ZWQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxtb3Rpb24uZGl2IGluaXRpYWw9e3sgb3BhY2l0eTogMCwgeTogMTAgfX0gYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCB5OiAwIH19IGV4aXQ9e3sgb3BhY2l0eTogMCwgeTogMTAgfX0gY2xhc3NOYW1lPVwibXQtYXV0b1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLVsjMUExNjEyXSBwLTYgYm9yZGVyLWwtNCBib3JkZXItWyNDNUEwNTldIG1iLTQgc2hhZG93LWlubmVyIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSB0b3AtMCBsZWZ0LTAgdy1mdWxsIGgtWzFweF0gYmctWyNDNUEwNTldLzMwIGFuaW1hdGUtc2Nhbi1saW5lXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTEgcmlnaHQtMVwiPjxMdWNpZGVGZWF0aGVyIHNpemU9ezE0fSBjbGFzc05hbWU9XCJ0ZXh0LVsjNUMxQTFBXSBvcGFjaXR5LTMwXCIgLz48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtWyNmNGU0YmNdIHRleHQtWzExcHhdIGxlYWRpbmctcmVsYXhlZCB0ZXh0LWNlbnRlciBmb250LXNlcmlmIGl0YWxpY1wiPlwie29yYWNsZU1lc3NhZ2UgfHwgc2VsZWN0ZWRMYW5nLnVpLmNvbnN1bHRpbmd9XCI8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHBsYXlTZng/Lignc2h1dHRlcicpOyBzZXRTdGVwKCd0cmFpbGVyJyk7IHNldFRvZG9zKHAgPT4gKHsgLi4ucCwgdm90ZWQ6IHRydWUgfSkpOyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHB5LTQgYmctWyM1QzFBMUFdIHRleHQtd2hpdGUgZm9udC1ibGFjayB1cHBlcmNhc2UgdGV4dC14cyB0cmFja2luZy1bMC4yZW1dIGJvcmRlci1iLTQgYm9yZGVyLWJsYWNrIGFjdGl2ZTpzY2FsZS05NSB0cmFuc2l0aW9uLXRyYW5zZm9ybSBzaGFkb3ctMnhsIGhvdmVyOmJnLVsjN0QyNjI2XVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZExhbmcudWkuc2VhbEJ0bn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9BbmltYXRlUHJlc2VuY2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshaXNTZWxlY3RlZCAmJiBpc0F1dGhlbnRpY2F0ZWQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC1hdXRvIHB0LTQgYm9yZGVyLXQgYm9yZGVyLVsjOEI3MzU1XS8xMCB0ZXh0LVs5cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRleHQtWyM4QjczNTVdIHRleHQtY2VudGVyIHRyYWNraW5nLXdpZGVzdCBhbmltYXRlLXB1bHNlXCI+VGFwIHRvIGV4YW1pbmUgZGVzdGlueTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9QYXBlckNhcmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgcHktMlwiPjxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzhweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdGV4dC1bIzhCNzM1NV0gdHJhY2tpbmctd2lkZXN0IG9wYWNpdHktNjAgZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cclxuICAgICAgICAgICAgICAgIDxMdWNpZGVBcnJvd0xlZnQgc2l6ZT17MTB9IGNsYXNzTmFtZT1cImFuaW1hdGUtYm91bmNlLXhcIiAvPiBTd2lwZSBBZXRoZXIgQ2FzZXMgPEx1Y2lkZUFycm93UmlnaHQgc2l6ZT17MTB9IGNsYXNzTmFtZT1cImFuaW1hdGUtYm91bmNlLXhcIiAvPlxyXG4gICAgICAgICAgICA8L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuKTtcclxuXHJcbmNvbnN0IENvbWluZ1Nvb25WaWV3ID0gKHsgc2VsZWN0ZWRMYW5nLCBjdXJyZW50VGhlbWUsIHNldFZpZXdNb2RlLCBzZXRTdGVwLCBtZXRyaWNzIH0pID0+IHtcclxuICAgIGNvbnN0IFthcmNoZXR5cGUsIHNldEFyY2hldHlwZV0gPSB1c2VTdGF0ZShudWxsKTtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgQXJjaGV0eXBlIFRpdGxlIG9uIExvYWRcclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFtZXRyaWNzKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgZW5oYW5jZWRNZXRyaWNzID0ge1xyXG4gICAgICAgICAgICAuLi5tZXRyaWNzLFxyXG4gICAgICAgICAgICBzZXNzaW9uVGltZVNlY29uZHM6IG1ldHJpY3MudGltZVNwZW50TXMgLyAxMDAwLFxyXG4gICAgICAgICAgICBzZWxlY3RlZExhbmdJZDogc2VsZWN0ZWRMYW5nPy5pZFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlZCA9IGNhbGN1bGF0ZUFyY2hldHlwZShlbmhhbmNlZE1ldHJpY3MpO1xyXG4gICAgICAgIHNldEFyY2hldHlwZShjYWxjdWxhdGVkKTtcclxuICAgIH0sIFttZXRyaWNzLCBzZWxlY3RlZExhbmddKTtcclxuXHJcbiAgICAvLyBBdHRlbXB0IHRvIHBsYXkgdGhlIGxvY2FsaXplZCBjb21pbmcgc29vbiBUVFNcclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkTGFuZykge1xyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIucGxheU1pbmEoc2VsZWN0ZWRMYW5nLmlkLCAnY29taW5nc29vbicsIDEuMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW3NlbGVjdGVkTGFuZ10pO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCBzY2FsZTogMC45NSB9fVxyXG4gICAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEsIHNjYWxlOiAxIH19XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHctZnVsbCBtYXgtdy1sZyBoLWZ1bGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcC02IHRleHQtY2VudGVyIHotNTBgfVxyXG4gICAgICAgID5cclxuXHJcbiAgICAgICAgICAgIHsvKiBBcmNoZXR5cGUgQmFkZ2UgKi99XHJcbiAgICAgICAgICAgIDxBbmltYXRlUHJlc2VuY2U+XHJcbiAgICAgICAgICAgICAgICB7YXJjaGV0eXBlICYmIChcclxuICAgICAgICAgICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHk6IC0yMCwgc2NhbGU6IDAuOCB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlPXt7IG9wYWNpdHk6IDEsIHk6IDAsIHNjYWxlOiAxIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZGVsYXk6IDEuNSwgdHlwZTogXCJzcHJpbmdcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtYi0xMiBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzQwIHRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdHJhY2tpbmctd2lkZXN0IHVwcGVyY2FzZSBtYi00IGJvcmRlciBib3JkZXItd2hpdGUvMjAgcHgtMyBweS0xIHJvdW5kZWQtZnVsbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAg6rSA7Lih65CcIOyYge2YvOydmCDtmJXtg5xcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPXtgdGV4dC00eGwgbWQ6dGV4dC01eGwgZm9udC1ibGFjayBtYi0yIGJnLWdyYWRpZW50LXRvLXIgJHthcmNoZXR5cGUuY29sb3J9IHRleHQtdHJhbnNwYXJlbnQgYmctY2xpcC10ZXh0IGRyb3Atc2hhZG93LVswXzBfMjBweF9yZ2JhKDI1NSwyNTUsMjU1LDAuMyldYH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBbIHthcmNoZXR5cGUudGl0bGV9IF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQtd2hpdGUvNjAgdGV4dC14cyBtZDp0ZXh0LXNtIGZvbnQtYmxhY2sgdHJhY2tpbmctWzAuM2VtXSB1cHBlcmNhc2UgbWItNFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2FyY2hldHlwZS5zdWJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtd2hpdGUvODAgdGV4dC1zbSBpdGFsaWMgZm9udC1zZXJpZiBtYXgtdy1zbSBsZWFkaW5nLXJlbGF4ZWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwie2FyY2hldHlwZS5kZXNjfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L21vdGlvbi5kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi0xMiByZWxhdGl2ZSBmbGV4IGp1c3RpZnktY2VudGVyIGl0ZW1zLWVuZCBoLTI0IGdhcC0xLjUgb3BhY2l0eS02MFwiPlxyXG4gICAgICAgICAgICAgICAge1suLi5BcnJheSgxNSldLm1hcCgoXywgaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxtb3Rpb24uZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleT17aX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBbXCIyMCVcIiwgXCIxMDAlXCIsIFwiMjAlXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMC41ICsgTWF0aC5yYW5kb20oKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGVhdDogSW5maW5pdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNlOiBcImVhc2VJbk91dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXk6IE1hdGgucmFuZG9tKCkgKiAwLjVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy0xLjUgcm91bmRlZC10LXNtIGJvcmRlciBib3JkZXItYmxhY2svMjAgJHtjdXJyZW50VGhlbWU/LmJnIHx8ICdiZy1bI0M1QTA1OV0nfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogJyNDNUEwNTknIH19IC8vIEZvcmNlIGdvbGQgY29sb3IgZm9yIHZpc2liaWxpdHlcclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPG1vdGlvbi5oMlxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbD17eyB5OiAyMCwgb3BhY2l0eTogMCB9fVxyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZT17eyB5OiAwLCBvcGFjaXR5OiAxIH19XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGRlbGF5OiAwLjMgfX1cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHRleHQtM3hsIG1kOnRleHQtNXhsIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjJlbV0gbWItNCAke2N1cnJlbnRUaGVtZT8udGV4dCB8fCAndGV4dC13aGl0ZSd9YH1cclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHRleHRTaGFkb3c6IFwiMCAwIDIwcHggcmdiYSgxOTcsMTYwLDg5LDAuMylcIiB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7c2VsZWN0ZWRMYW5nPy51aT8uY29taW5nU29vbiB8fCBcIkNvbWluZyBTb29uXCJ9XHJcbiAgICAgICAgICAgIDwvbW90aW9uLmgyPlxyXG5cclxuICAgICAgICAgICAgPG1vdGlvbi5wXHJcbiAgICAgICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAgfX1cclxuICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSB9fVxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkZWxheTogMC42IH19XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2B0ZXh0LXNtIG1kOnRleHQtYmFzZSBmb250LWJvbGQgaXRhbGljIG1heC13LXNtIGxlYWRpbmctcmVsYXhlZCBvcGFjaXR5LTkwICR7Y3VycmVudFRoZW1lPy50ZXh0IHx8ICd0ZXh0LXdoaXRlJ31gfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICBcIuydvOuLqOydgCDsl6zquLAg6rmM7KeA7J6F64uI64ukISBDb21pbmcgc29vbiEg7LaU7ZuEIOyXheuNsOydtO2KuCDrkKnri4jri6QuIO2VmOyngOunjCDsl6zquLDshJwg6rCBIOyEuOqzhOq0gOydmCDsnYzslYXsnYAg6rOE7IaNIOuTpOydhCDsiJgg7J6I7KOgLlwiPGJyIC8+PGJyIC8+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsjMDBFNUZGXSBmb250LWJsYWNrIGRyb3Atc2hhZG93LVswXzBfMTBweF9yZ2JhKDAsMjI5LDI1NSwwLjgpXVwiPuqwgSDslrjslrTrs4TroZwg7LSdIDLqs6E8L3NwYW4+7J20IOykgOu5hOuQmOyWtCDsnojsnLzri4jquZAsIOuBneq5jOyngCDqsJDsg4HtlbTrs7TshLjsmpQhXHJcbiAgICAgICAgICAgIDwvbW90aW9uLnA+XHJcblxyXG4gICAgICAgICAgICA8bW90aW9uLmJ1dHRvblxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCB5OiAxMCB9fVxyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiAxLCB5OiAwIH19XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGRlbGF5OiAxLjAgfX1cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIucGxheVNmeCgnc2h1dHRlcicsIDAuNik7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0U3RlcCgnZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0Vmlld01vZGUoJ2dhbGxlcnknKTtcclxuICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BtdC0xMCBweC04IHB5LTQgYm9yZGVyIGFjdGl2ZTpzY2FsZS05NSB0cmFuc2l0aW9uLWFsbCB0ZXh0LVsxMHB4XSB1cHBlcmNhc2UgZm9udC1ibGFjayBmb250LXNhbnMgdHJhY2tpbmctWzAuM2VtXSBiYWNrZHJvcC1ibHVyLW1kICR7Y3VycmVudFRoZW1lPy5ib3JkZXIgfHwgJ2JvcmRlci1bI0M1QTA1OV0vNDAnfSAke2N1cnJlbnRUaGVtZT8udGV4dCB8fCAndGV4dC13aGl0ZSd9IGhvdmVyOmJnLXdoaXRlLzEwIHNoYWRvdy1sZ2B9XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIEVudGVyIEdhbGxlcnlcclxuICAgICAgICAgICAgPC9tb3Rpb24uYnV0dG9uPlxyXG4gICAgICAgIDwvbW90aW9uLmRpdj5cclxuICAgICk7XHJcbn07XHJcblxyXG5jb25zdCBMYW5ndWFnZUNhcmQgPSAoeyBsYW5nLCBpc0ZvY3VzZWQsIGlzU3RhZ2VkLCBpc0RpbW1hYmxlLCBvbkZvY3VzLCBvblJlYWR5LCBvblNlbGVjdCB9KSA9PiB7XHJcbiAgICBjb25zdCBbc2F0dXJhdGlvblByb2dyZXNzLCBzZXRTYXR1cmF0aW9uUHJvZ3Jlc3NdID0gdXNlU3RhdGUoMCk7XHJcbiAgICBjb25zdCBbaXNTaGFrZVBhdXNlZCwgc2V0SXNTaGFrZVBhdXNlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBhbmltSW50ZXJ2YWwgPSB1c2VSZWYobnVsbCk7XHJcbiAgICBjb25zdCBjYXJkUmVmID0gdXNlUmVmKG51bGwpO1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGlzRm9jdXNlZCAmJiAhaXNTdGFnZWQpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSA1NTAwOyAvLyA1LjVzIHRvdGFsIHRpbWVcclxuICAgICAgICAgICAgbGV0IHN0YWdlID0gMDtcclxuXHJcbiAgICAgICAgICAgIGFuaW1JbnRlcnZhbC5jdXJyZW50ID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWxhcHNlZCA9IERhdGUubm93KCkgLSBzdGFydFRpbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVHJhY2sgcGVyY2VudGFnZSBldmVubHkgZnJvbSAwLTEwMCUgb3ZlciA1LjVzXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwZXJjZW50YWdlID0gTWF0aC5taW4oKGVsYXBzZWQgLyBkdXJhdGlvbikgKiAxMDAsIDEwMCk7XHJcbiAgICAgICAgICAgICAgICBzZXRTYXR1cmF0aW9uUHJvZ3Jlc3MocGVyY2VudGFnZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVsYXBzZWQgPj0gMjUwMCAmJiBzdGFnZSA8IDEpIHsgLy8gMi41IHNlYyBqdW1wXHJcbiAgICAgICAgICAgICAgICAgICAgWy4uLkFycmF5KDMpXS5mb3JFYWNoKCgpID0+IEF1ZGlvTWFuYWdlci5wbGF5U2Z4KCdwaWFuby1teXN0aWMtbG93JywgMC43LCB0cnVlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldElzU2hha2VQYXVzZWQodHJ1ZSk7IHNldFRpbWVvdXQoKCkgPT4gc2V0SXNTaGFrZVBhdXNlZChmYWxzZSksIDQwMCk7IH0sIDEwMCk7IC8vIEZyZWV6ZSByaWdodCBhcyBpbXBhY3QgaGl0c1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlID0gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxhcHNlZCA+PSAzNTAwICYmIHN0YWdlIDwgMikgeyAvLyAzLjUgc2VjIGp1bXBcclxuICAgICAgICAgICAgICAgICAgICBBdWRpb01hbmFnZXIucGxheVNmeCgncGlhbm8tbXlzdGljLW1pZCcsIDAuNDIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBzZXRJc1NoYWtlUGF1c2VkKHRydWUpOyBzZXRUaW1lb3V0KCgpID0+IHNldElzU2hha2VQYXVzZWQoZmFsc2UpLCA0MDApOyB9LCAxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YWdlID0gMjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxhcHNlZCA+PSA0NTAwICYmIHN0YWdlIDwgMykgeyAvLyA0LjUgc2VjIChiYWNrZ3JvdW5kIHN3aXRjaCArIGdsb3cpXHJcbiAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlTZngoJ3BpYW5vLW15c3RpYy1oaWdoJywgMC41NiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHNldElzU2hha2VQYXVzZWQodHJ1ZSk7IHNldFRpbWVvdXQoKCkgPT4gc2V0SXNTaGFrZVBhdXNlZChmYWxzZSksIDQwMCk7IH0sIDEwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uUmVhZHkpIG9uUmVhZHkoeyAuLi5sYW5nLCByZXF1ZXN0QmFja2dyb3VuZDogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgICAgICAgICBzdGFnZSA9IDM7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVsYXBzZWQgPj0gZHVyYXRpb24pIHsgLy8gNS41IHNlYyB0b3RhbCBjb21wbGV0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChhbmltSW50ZXJ2YWwuY3VycmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc3RvcmUgY291bnRyeSB0aGVtZSBwbGF5YmFja1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTcmMgPSBBdWRpb01hbmFnZXIuY3VycmVudFRoZW1lPy5zcmMgfHwgXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNyYy5zcGxpdCgnLycpLnBvcCgpICE9PSBgJHtsYW5nLmlkfS10aGVtZS5tcDNgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5VGhlbWUobGFuZy5pZCwgMC40LCAzMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvblJlYWR5KSBvblJlYWR5KHsgLi4ubGFuZywgcmVxdWVzdFNlcXVlbmNlQ29tcGxldGU6IHRydWUgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzZXRTYXR1cmF0aW9uUHJvZ3Jlc3MoMCk7XHJcbiAgICAgICAgICAgIGlmIChhbmltSW50ZXJ2YWwuY3VycmVudCkgY2xlYXJJbnRlcnZhbChhbmltSW50ZXJ2YWwuY3VycmVudCk7XHJcbiAgICAgICAgICAgIC8vIERpc2FibGVkIHN0b3BwaW5nIHRoZW1lIHNvIEJHTSBwZXJzaXN0c1xyXG4gICAgICAgICAgICAvLyBBdWRpb01hbmFnZXIuc3RvcFRoZW1lKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYW5pbUludGVydmFsLmN1cnJlbnQpIGNsZWFySW50ZXJ2YWwoYW5pbUludGVydmFsLmN1cnJlbnQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9LCBbaXNGb2N1c2VkLCBpc1N0YWdlZF0pO1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZURyYWdFbmQgPSAoZXZlbnQsIGluZm8pID0+IHtcclxuICAgICAgICBpZiAoIWlzRm9jdXNlZCB8fCBzYXR1cmF0aW9uUHJvZ3Jlc3MgPCAxMDAgfHwgaXNTdGFnZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcclxuICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5zcXJ0KE1hdGgucG93KGluZm8ucG9pbnQueCAtIGNlbnRlclgsIDIpICsgTWF0aC5wb3coaW5mby5wb2ludC55IC0gY2VudGVyWSwgMikpO1xyXG5cclxuICAgICAgICBpZiAoZGlzdCA8IDE1MCkge1xyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIucGxheVNmeCgnc2h1dHRlcicsIDAuNik7XHJcbiAgICAgICAgICAgIG9uU2VsZWN0KGxhbmcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaXNEcmFnZ2FibGUgPSBpc0ZvY3VzZWQgJiYgc2F0dXJhdGlvblByb2dyZXNzID09PSAxMDAgJiYgIWlzU3RhZ2VkO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgcmVmPXtjYXJkUmVmfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzRm9jdXNlZCAmJiAhaXNTdGFnZWQpIG9uRm9jdXMobGFuZyk7XHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIGRyYWc9e2lzRHJhZ2dhYmxlfVxyXG4gICAgICAgICAgICBkcmFnQ29uc3RyYWludHM9e3sgbGVmdDogMCwgcmlnaHQ6IDAsIHRvcDogMCwgYm90dG9tOiAwIH19XHJcbiAgICAgICAgICAgIGRyYWdFbGFzdGljPXswLjh9XHJcbiAgICAgICAgICAgIG9uRHJhZ0VuZD17aGFuZGxlRHJhZ0VuZH1cclxuICAgICAgICAgICAgd2hpbGVEcmFnPXtpc0RyYWdnYWJsZSA/IHsgc2NhbGU6IDEuMSwgekluZGV4OiAxMDAwLCByb3RhdGU6IDIgfSA6IHt9fVxyXG4gICAgICAgICAgICBpbml0aWFsPXt7IG9wYWNpdHk6IDAsIHNjYWxlOiAwLjggfX1cclxuICAgICAgICAgICAgYW5pbWF0ZT17e1xyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogaXNEaW1tYWJsZSA/IDAuMyA6IDEsXHJcbiAgICAgICAgICAgICAgICAvLyBPbmx5IHNoYWtlIHdoZW4gcHJvZ3Jlc3NpbmcsIHN0b3Agc2hha2luZyBjb21wbGV0ZWx5IGF0IDEwMCUgYW5kIGp1c3QgZ2VudGx5IHNjYWxlIHVwXHJcbiAgICAgICAgICAgICAgICBzY2FsZTogaXNTdGFnZWQgPyAxIDogKGlzRm9jdXNlZCA/IChzYXR1cmF0aW9uUHJvZ3Jlc3MgPT09IDEwMCAmJiAhaXNTdGFnZWQgPyBbMS4wNSwgMS4wOCwgMS4wNV0gOiAxLjA1KSA6IDEpLFxyXG4gICAgICAgICAgICAgICAgekluZGV4OiBpc0ZvY3VzZWQgPyAxMDAgOiAxLFxyXG4gICAgICAgICAgICAgICAgLy8gU2hha2UgZWZmZWN0IHdoaWxlIGhvbGRpbmcsIG1heGVzIG91dCByaWdodCBiZWZvcmUgMTAwJVxyXG4gICAgICAgICAgICAgICAgeDogaXNGb2N1c2VkICYmIHNhdHVyYXRpb25Qcm9ncmVzcyA+IDAgJiYgc2F0dXJhdGlvblByb2dyZXNzIDwgMTAwICYmICFpc1N0YWdlZCAmJiAhaXNTaGFrZVBhdXNlZFxyXG4gICAgICAgICAgICAgICAgICAgID8gWy0xLCAxLCAtMSwgMSwgMF0ubWFwKHYgPT4gdiAqICgxICsgKHNhdHVyYXRpb25Qcm9ncmVzcyAvIDEwMCkgKiAxLjUpKVxyXG4gICAgICAgICAgICAgICAgICAgIDogMCxcclxuICAgICAgICAgICAgICAgIHk6IGlzRm9jdXNlZCAmJiBzYXR1cmF0aW9uUHJvZ3Jlc3MgPiAwICYmIHNhdHVyYXRpb25Qcm9ncmVzcyA8IDEwMCAmJiAhaXNTdGFnZWQgJiYgIWlzU2hha2VQYXVzZWRcclxuICAgICAgICAgICAgICAgICAgICA/IFsxLCAtMSwgMSwgLTEsIDBdLm1hcCh2ID0+IHYgKiAoMSArIChzYXR1cmF0aW9uUHJvZ3Jlc3MgLyAxMDApICogMS41KSlcclxuICAgICAgICAgICAgICAgICAgICA6IDAsXHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb249e3tcclxuICAgICAgICAgICAgICAgIHg6IHsgZHVyYXRpb246IDAuMSwgcmVwZWF0OiBpc0ZvY3VzZWQgJiYgc2F0dXJhdGlvblByb2dyZXNzIDwgMTAwICYmICFpc1NoYWtlUGF1c2VkID8gSW5maW5pdHkgOiAwLCBlYXNlOiBcImxpbmVhclwiIH0sXHJcbiAgICAgICAgICAgICAgICB5OiB7IGR1cmF0aW9uOiAwLjEsIHJlcGVhdDogaXNGb2N1c2VkICYmIHNhdHVyYXRpb25Qcm9ncmVzcyA8IDEwMCAmJiAhaXNTaGFrZVBhdXNlZCA/IEluZmluaXR5IDogMCwgZWFzZTogXCJsaW5lYXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogeyBkdXJhdGlvbjogMC4zIH0sXHJcbiAgICAgICAgICAgICAgICBzY2FsZTogaXNGb2N1c2VkICYmIHNhdHVyYXRpb25Qcm9ncmVzcyA9PT0gMTAwICYmICFpc1N0YWdlZFxyXG4gICAgICAgICAgICAgICAgICAgID8geyBkdXJhdGlvbjogMC42LCByZXBlYXQ6IEluZmluaXR5LCBlYXNlOiBcImVhc2VJbk91dFwiIH1cclxuICAgICAgICAgICAgICAgICAgICA6IHsgdHlwZTogJ3NwcmluZycsIGRhbXBpbmc6IDI1LCBzdGlmZm5lc3M6IDEyMCB9XHJcbiAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT17YHJlbGF0aXZlIHctZnVsbCBoLWZ1bGwgcm91bmRlZC1sZyBvdmVyZmxvdy1oaWRkZW4gc2hhZG93LTJ4bCBzZWxlY3Qtbm9uZSB0cmFuc2l0aW9uLXNoYWRvdyAke2lzRm9jdXNlZCAmJiAhaXNTdGFnZWQgPyAnc2hhZG93LVswXzBfODBweF9yZ2JhKDE5NywxNjAsODksMC40KV0gcmluZy0yIHJpbmctWyNDNUEwNTldJyA6ICdjdXJzb3ItcG9pbnRlciBob3ZlcjpyaW5nLTEgaG92ZXI6cmluZy13aGl0ZS8yMCd9YH1cclxuICAgICAgICAgICAgc3R5bGU9e3sgdG91Y2hBY3Rpb246ICdub25lJyB9fVxyXG4gICAgICAgID5cclxuICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBiZy1jb3ZlciBiZy1jZW50ZXIgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMTAwXCJcclxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBgdXJsKCR7bGFuZy5pbWFnZX0pYCxcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjUpJyxcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IGlzRm9jdXNlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IChzYXR1cmF0aW9uUHJvZ3Jlc3MgPCA0NS40NSA/IGBzYXR1cmF0ZSgkezAuMSArICgwLjIgKiAoc2F0dXJhdGlvblByb2dyZXNzIC8gNDUuNDUpKX0pIGdyYXlzY2FsZSgkezgwIC0gKDUwICogKHNhdHVyYXRpb25Qcm9ncmVzcyAvIDQ1LjQ1KSl9JSkgYnJpZ2h0bmVzcygkezAuMSArICgwLjIgKiAoc2F0dXJhdGlvblByb2dyZXNzIC8gNDUuNDUpKX0pYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzYXR1cmF0aW9uUHJvZ3Jlc3MgPCA2My42MyA/ICdzYXR1cmF0ZSgwLjcpIGdyYXlzY2FsZSgzMCUpIGJyaWdodG5lc3MoMC43KSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHNhdHVyYXRpb25Qcm9ncmVzcyA8IDgxLjgxID8gJ3NhdHVyYXRlKDEpIGdyYXlzY2FsZSgwJSkgYnJpZ2h0bmVzcygxKSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiAnc2F0dXJhdGUoMS4yKSBncmF5c2NhbGUoMCUpIGJyaWdodG5lc3MoMS4zKSBkcm9wLXNoYWRvdygwIDAgMTBweCByZ2JhKDE5NywxNjAsODksMC44KSknKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6IChpc1N0YWdlZCA/ICdzYXR1cmF0ZSgxKSBncmF5c2NhbGUoMCUpJyA6ICdzYXR1cmF0ZSgwKSBncmF5c2NhbGUoMTAwJSkgYnJpZ2h0bmVzcygwLjUpJyksXHJcbiAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgey8qIEhvbGQvRm9jdXMgUHJvZ3Jlc3MgQmFyICovfVxyXG4gICAgICAgICAgICB7aXNGb2N1c2VkICYmIHNhdHVyYXRpb25Qcm9ncmVzcyA8IDEwMCAmJiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGJvdHRvbS0wIGxlZnQtMCBoLTIgYmctWyNDNUEwNTldIHotNDAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNzVcIiBzdHlsZT17eyB3aWR0aDogYCR7c2F0dXJhdGlvblByb2dyZXNzfSVgIH19IC8+XHJcbiAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICB7LyogR2xvd2luZyBpbm5lciBvdmVybGF5IGZvciAxMDAlIHNhdHVyYXRpb24gdG8gaW52aXRlIGRyYWdnaW5nICovfVxyXG4gICAgICAgICAgICB7aXNGb2N1c2VkICYmIHNhdHVyYXRpb25Qcm9ncmVzcyA9PT0gMTAwICYmICFpc1N0YWdlZCAmJiAoXHJcbiAgICAgICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogWzAsIDAuMywgMF0gfX1cclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IHJlcGVhdDogSW5maW5pdHksIGR1cmF0aW9uOiAxLjUgfX1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJvcmRlci00IGJvcmRlci1bI0M1QTA1OV0gcG9pbnRlci1ldmVudHMtbm9uZSB6LTQwXCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tdCBmcm9tLWJsYWNrIHZpYS1ibGFjay80MCB0by10cmFuc3BhcmVudCB0cmFuc2l0aW9uLW9wYWNpdHkgZHVyYXRpb24tNzAwICR7aXNGb2N1c2VkID8gJ29wYWNpdHktODAnIDogJ29wYWNpdHktNjAnfWB9IC8+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgcC0xIG1kOnAtMiBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB6LTMwIHRleHQtY2VudGVyIHBvaW50ZXItZXZlbnRzLW5vbmVcIj5cclxuICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9e2B0ZXh0LWJhc2UgbWQ6dGV4dC0zeGwgZm9udC1ibGFjayB0ZXh0LXdoaXRlIGZvbnQtc2VyaWYgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCBsZWFkaW5nLW5vbmUgbWItMSBtZDptYi0yIHRyYW5zaXRpb24tdHJhbnNmb3JtIGR1cmF0aW9uLTUwMCAke2lzRm9jdXNlZCA/ICdzY2FsZS0xMTAgZHJvcC1zaGFkb3ctWzBfMF8xMHB4X3JnYmEoMTk3LDE2MCw4OSwwLjgpXSB0ZXh0LVsjRkRGQ0YwXScgOiAnJ31gfT5cclxuICAgICAgICAgICAgICAgICAgICB7bGFuZy5uYW1lfVxyXG4gICAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGZsZXgganVzdGlmeS1jZW50ZXIgaXRlbXMtY2VudGVyIHB4LTEgb3ZlcmZsb3ctdmlzaWJsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxtb3Rpb24uc3BhblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlPXt7IHk6IGlzRm9jdXNlZCB8fCBpc1N0YWdlZCA/IDAgOiAxMCB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXhzIG1kOnRleHQtbGcgdGV4dC1bI0M1QTA1OV0gdXBwZXJjYXNlIHRyYWNraW5nLVswLjFlbV0gbWQ6dHJhY2tpbmctWzAuMmVtXSBmb250LWJsYWNrIGJsb2NrIGxlYWRpbmctdGlnaHQgdGV4dC1jZW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAge2lzU3RhZ2VkID8gbGFuZy51aS5mYXRlU2VhbGVkIDogKHNhdHVyYXRpb25Qcm9ncmVzcyA9PT0gMTAwID8gbGFuZy51aS5kcmFnIDogKGlzRm9jdXNlZCA/IGAke2xhbmcudWkuc3luY30gJHtNYXRoLnJvdW5kKHNhdHVyYXRpb25Qcm9ncmVzcyl9JWAgOiBsYW5nLnVpLnRhcCkpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvbW90aW9uLnNwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IExhbmd1YWdlVmlldyA9ICh7IExBTkdVQUdFUywgaGFuZGxlTGFuZ3VhZ2VTZWxlY3QsIHNldFNwaXJpdEhpbnQsIGNhcmRzRXhwbG9yZWQsIHNldENhcmRzRXhwbG9yZWQsIGlzTWluYVNwZWFraW5nIH0pID0+IHtcclxuICAgIGNvbnN0IFtmb2N1c2VkTGFuZywgc2V0Rm9jdXNlZExhbmddID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgICBjb25zdCBbc3RhZ2VkTGFuZywgc2V0U3RhZ2VkTGFuZ10gPSB1c2VTdGF0ZShudWxsKTtcclxuICAgIGNvbnN0IFttaW5hVGV4dCwgc2V0TWluYVRleHRdID0gdXNlU3RhdGUoXCJcIik7XHJcbiAgICBjb25zdCBbYWN0aXZlQmFja2dyb3VuZCwgc2V0QWN0aXZlQmFja2dyb3VuZF0gPSB1c2VTdGF0ZShudWxsKTtcclxuICAgIGNvbnN0IFtpc0ludHJvQWN0aXZlLCBzZXRJc0ludHJvQWN0aXZlXSA9IHVzZVN0YXRlKHRydWUpO1xyXG5cclxuICAgIC8vIFVzZSBhIHJlZiB0byBwcmV2ZW50IGRvdWJsZSBhdWRpbyBwbGF5YmFjayBpbiBSZWFjdCBzdHJpY3QgbW9kZSAvIGRldlxyXG4gICAgY29uc3QgYXVkaW9QbGF5ZWRSZWYgPSB1c2VSZWYoZmFsc2UpO1xyXG5cclxuICAgIGNvbnN0IGludHJvU2VudGVuY2VzID0gW1xyXG4gICAgICAgIFwiSW5pdGlhdGluZyBkaW1lbnNpb25hbCBzaGlmdC5cIixcclxuICAgICAgICBcIkFuY2hvciB5b3VyIGNvbnNjaW91c25lc3MuXCIsXHJcbiAgICAgICAgXCJBd2FpdCBtdWx0aXZlcnNlIHN5bmNocm9uaXphdGlvbi5cIixcclxuICAgICAgICBcIlNlbGVjdCB5b3VyIGZyZXF1ZW5jeS5cIixcclxuICAgICAgICBcIkNob29zZSB5b3VyIGFuY2hvciBwb2ludC5cIlxyXG4gICAgXTtcclxuICAgIGNvbnN0IFtpbnRyb1NlbnRlbmNlXSA9IHVzZVN0YXRlKCgpID0+IGludHJvU2VudGVuY2VzW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGludHJvU2VudGVuY2VzLmxlbmd0aCldKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG5cclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgc2V0TWluYVRleHQoXCJcIik7XHJcblxyXG4gICAgICAgIC8vIERyb3Agb3ZlcmxheSBhZnRlciA2IHNlY29uZHMgKGxlbmd0aCBvZiB2b2ljZSBsaW5lKVxyXG4gICAgICAgIGNvbnN0IG92ZXJsYXlUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBzZXRJc0ludHJvQWN0aXZlKGZhbHNlKTtcclxuICAgICAgICB9LCA2MDAwKTtcclxuICAgICAgICBjb25zdCB0eXBpbmdJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGkgPD0gaW50cm9TZW50ZW5jZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHNldE1pbmFUZXh0KGludHJvU2VudGVuY2Uuc2xpY2UoMCwgaSkpO1xyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0eXBpbmdJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LCA3NSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodHlwaW5nSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICBjbGVhclRpbWVvdXQob3ZlcmxheVRpbWVyKTtcclxuICAgICAgICB9O1xyXG4gICAgfSwgW10pO1xyXG5cclxuICAgIGNvbnN0IG9uQ2FyZEZvY3VzID0gKGxhbmcpID0+IHtcclxuICAgICAgICAvLyBUcmFjayB1bmlxdWUgY2FyZCB2aWV3c1xyXG4gICAgICAgIGlmIChzZXRDYXJkc0V4cGxvcmVkKSB7XHJcbiAgICAgICAgICAgIHNldENhcmRzRXhwbG9yZWQocHJldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdTZXQgPSBuZXcgU2V0KHByZXYpO1xyXG4gICAgICAgICAgICAgICAgbmV3U2V0LmFkZChsYW5nLmlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXdTZXQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZXNldCB0aGUgYmFja2dyb3VuZCB0byBub3JtYWwgZGFyayB3aGVuIHByZXBhcmluZyB0byBwaWNrIGFnYWluXHJcbiAgICAgICAgc2V0QWN0aXZlQmFja2dyb3VuZChudWxsKTtcclxuICAgICAgICBzZXRGb2N1c2VkTGFuZyhsYW5nKTtcclxuICAgICAgICBzZXRTdGFnZWRMYW5nKG51bGwpO1xyXG4gICAgICAgIHNldE1pbmFUZXh0KGxhbmcudWkuc3luYyArIFwiLi4uXCIpO1xyXG4gICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5U2Z4KCdjbGljaycpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvbkNhcmRSZWFkeSA9IChwYXlsb2FkKSA9PiB7XHJcbiAgICAgICAgaWYgKHBheWxvYWQucmVxdWVzdEJhY2tncm91bmQpIHtcclxuICAgICAgICAgICAgc2V0QWN0aXZlQmFja2dyb3VuZChwYXlsb2FkLmltYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHBheWxvYWQucmVxdWVzdFNlcXVlbmNlQ29tcGxldGUpIHtcclxuICAgICAgICAgICAgc2V0TWluYVRleHQocGF5bG9hZC5sYW5nRGF0YS51aS5kaXJlY3RpdmVMYW5ndWFnZSk7XHJcbiAgICAgICAgICAgIC8vIFBsYXkgdGhlIGR5bmFtaWMgbGFuZ3VhZ2Ugdm9pY2UgYXQgZXhhY3RseSA1LjVzXHJcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5TWluYShwYXlsb2FkLmlkLCAnbGFuZ3VhZ2UnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFYyNjogQ2VudGVyIEhvbGQgTG9naWNcclxuICAgIGNvbnN0IFtob2xkUHJvZ3Jlc3MsIHNldEhvbGRQcm9ncmVzc10gPSB1c2VTdGF0ZSgwKTtcclxuICAgIGNvbnN0IGhvbGRJbnRlcnZhbFJlZiA9IHVzZVJlZihudWxsKTtcclxuXHJcbiAgICBjb25zdCBzdGFydEhvbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCFzdGFnZWRMYW5nKSByZXR1cm47XHJcbiAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlTZngoJ3NodXR0ZXInLCAwLjYpOyAvLyBGZWVkYmFjayBzb3VuZFxyXG4gICAgICAgIHNldE1pbmFUZXh0KFwiTUFJTlRBSU4gRk9DVVMuXCIpO1xyXG4gICAgICAgIHNldEhvbGRQcm9ncmVzcygwKTtcclxuICAgICAgICBob2xkSW50ZXJ2YWxSZWYuY3VycmVudCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgc2V0SG9sZFByb2dyZXNzKHByZXYgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbmV4dCA9IHByZXYgKyAoMTAwIC8gKDUwMDAgLyA1MCkpOyAvLyBGaWxsIDEwMCUgb3ZlciA1cyBhdCA1MG1zIGludGVydmFsc1xyXG4gICAgICAgICAgICAgICAgaWYgKG5leHQgPj0gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChob2xkSW50ZXJ2YWxSZWYuY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGFuZ3VhZ2VTZWxlY3Qoc3RhZ2VkTGFuZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LCA1MCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGNhbmNlbEhvbGQgPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGhvbGRJbnRlcnZhbFJlZi5jdXJyZW50KSBjbGVhckludGVydmFsKGhvbGRJbnRlcnZhbFJlZi5jdXJyZW50KTtcclxuICAgICAgICBzZXRIb2xkUHJvZ3Jlc3MoMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZUFuY2hvclNlbGVjdCA9IChsYW5nKSA9PiB7XHJcbiAgICAgICAgc2V0U3RhZ2VkTGFuZyhsYW5nKTtcclxuICAgICAgICBBdWRpb01hbmFnZXIucGxheVNmeCgnY29uZmlybScsIDAuOCk7XHJcbiAgICAgICAgc2V0TWluYVRleHQobGFuZy51aS5kaXJlY3RpdmVDb25maXJtKTtcclxuICAgICAgICBBdWRpb01hbmFnZXIucGxheU1pbmEobGFuZy5pZCwgJ2NvbmZpcm0nKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25DYXJkU2VsZWN0ID0gKGxhbmcpID0+IHtcclxuICAgICAgICBzZXRGb2N1c2VkTGFuZyhsYW5nKTtcclxuICAgICAgICBoYW5kbGVBbmNob3JTZWxlY3QobGFuZyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgbWF4LXctNHhsIG14LWF1dG8gaC1mdWxsIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMiBtZDpwLTQgbXQtMjQgbWQ6bXQtMTYgb3ZlcmZsb3ctdmlzaWJsZSByZWxhdGl2ZVwiIHN0eWxlPXt7IHRvdWNoQWN0aW9uOiAnbm9uZScsIG92ZXJzY3JvbGxCZWhhdmlvcjogJ25vbmUnIH19PlxyXG5cclxuICAgICAgICAgICAgey8qIER5bmFtaWMgTmF0aXZlIEltYWdlIEJhY2tncm91bmQgKi99XHJcbiAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGZpeGVkIGluc2V0LTAgei0wIGJnLWNvdmVyIGJnLWNlbnRlciB0cmFuc2l0aW9uLW9wYWNpdHkgZHVyYXRpb24tWzMwMDBtc10gcG9pbnRlci1ldmVudHMtbm9uZSAke2FjdGl2ZUJhY2tncm91bmQgPyAnb3BhY2l0eS03MCcgOiAnb3BhY2l0eS0wJ31gfVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e2FjdGl2ZUJhY2tncm91bmQgPyB7IGJhY2tncm91bmRJbWFnZTogYHVybCgke2FjdGl2ZUJhY2tncm91bmR9KWAgfSA6IHt9fVxyXG4gICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgPGRpdiBpZD1cImxhbmd1YWdlLWdyaWRcIiBjbGFzc05hbWU9e2B3LWZ1bGwgZ3JpZCBncmlkLWNvbHMtMyBncmlkLXJvd3MtMyBnYXAtMiBtZDpnYXAtNCBiZy1ibGFjay80MCBiYWNrZHJvcC1ibHVyLTN4bCBwLTMgbWQ6cC02IGJvcmRlciBib3JkZXItd2hpdGUvNSByb3VuZGVkLTN4bCBzaGFkb3ctWzBfMzBweF8xMDBweF9yZ2JhKDAsMCwwLDAuOCldIHJlbGF0aXZlIHotMTAgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tMTAwMCAke2lzSW50cm9BY3RpdmUgPyAnb3BhY2l0eS00MCBibHVyLXNtIHNjYWxlLTk1IHBvaW50ZXItZXZlbnRzLW5vbmUnIDogJ29wYWNpdHktMTAwIGJsdXItMCBzY2FsZS0xMDAnfWB9PlxyXG4gICAgICAgICAgICAgICAgey8qIEJhY2tncm91bmQgXCJGbG93XCIgRWZmZWN0ICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLVtyYWRpYWwtZ3JhZGllbnQoY2lyY2xlX2F0X2NlbnRlcixyZ2JhKDE5NywxNjAsODksMC4wNSlfMCUsdHJhbnNwYXJlbnRfNzAlKV0gYW5pbWF0ZS1wdWxzZSBwb2ludGVyLWV2ZW50cy1ub25lXCIgLz5cclxuXHJcbiAgICAgICAgICAgICAgICB7LyogR3JpZCBNYXBwaW5nICovfVxyXG4gICAgICAgICAgICAgICAge1swLCAxLCAyLCAzLCAnY2VudGVyJywgNCwgNSwgNiwgN10ubWFwKChwb3MsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zID09PSAnY2VudGVyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9XCJjZW50ZXItc2xvdFwiIGNsYXNzTmFtZT1cInJlbGF0aXZlIHotNTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QW5pbWF0ZVByZXNlbmNlIG1vZGU9XCJ3YWl0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzdGFnZWRMYW5nID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3N0YWdlZExhbmcuaWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbD17eyBzY2FsZTogMCwgb3BhY2l0eTogMCwgcm90YXRlOiAtMjAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlPXt7IHNjYWxlOiBob2xkUHJvZ3Jlc3MgPiAwID8gMSArIChob2xkUHJvZ3Jlc3MgLyAxMDApICogMC41IDogMSwgb3BhY2l0eTogMSwgcm90YXRlOiAwIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249e3N0YXJ0SG9sZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbk1vdXNlVXA9e2NhbmNlbEhvbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtjYW5jZWxIb2xkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uVG91Y2hTdGFydD17c3RhcnRIb2xkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uVG91Y2hFbmQ9e2NhbmNlbEhvbGR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCB6LVsyMDAwXSBjdXJzb3ItcG9pbnRlciByZWxhdGl2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtaW5zZXQtNCBiZy1bI0M1QTA1OV0vMTAgYmx1ci14bCBwb2ludGVyLWV2ZW50cy1ub25lIHRyYW5zaXRpb24tb3BhY2l0eVwiIHN0eWxlPXt7IG9wYWNpdHk6IGhvbGRQcm9ncmVzcyAvIDEwMCB9fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMYW5ndWFnZUNhcmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFuZz17c3RhZ2VkTGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNGb2N1c2VkPXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1N0YWdlZD17dHJ1ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Gb2N1cz17KCkgPT4geyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNlbGVjdD17KCkgPT4geyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblJlYWR5PXsoKSA9PiB7IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogTk9WRUwgVUk6IE9yYml0YWwgUmVzb25hbmNlIC8gUG9ydGFsIENvbGxhcHNlIE1lY2hhbmljICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBwLTQgYmctYmxhY2svODAgc2hhZG93LVtpbnNldF8wXzBfMTAwcHhfcmdiYSgwLDAsMCwxKV0gcG9pbnRlci1ldmVudHMtbm9uZSByb3VuZGVkLTJ4bCBib3JkZXIgYm9yZGVyLVsjQzVBMDU5XS8zMCBiYWNrZHJvcC1ibHVyLXhsIG92ZXJmbG93LWhpZGRlblwiPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIEV4cGFuZGluZyBSZXNvbmFuY2UgUmluZ3MgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBvcGFjaXR5LTQwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLVsjQzVBMDU5XVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogW2AkezEwMCAtIGhvbGRQcm9ncmVzc30lYCwgYCR7MTUwIC0gaG9sZFByb2dyZXNzfSVgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBbYCR7MTAwIC0gaG9sZFByb2dyZXNzfSVgLCBgJHsxNTAgLSBob2xkUHJvZ3Jlc3N9JWBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBbMC44LCAwXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm90YXRlOiBob2xkUHJvZ3Jlc3MgKiAzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IHJlcGVhdDogSW5maW5pdHksIGR1cmF0aW9uOiBNYXRoLm1heCgwLjUsIDIgLSBob2xkUHJvZ3Jlc3MgLyA1MCkgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHJvdW5kZWQtZnVsbCBib3JkZXItMiBib3JkZXItZGFzaGVkIGJvcmRlci1bI2U1Yzk5Nl1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHtob2xkUHJvZ3Jlc3MgKiAyLjV9JWAsIGhlaWdodDogYCR7aG9sZFByb2dyZXNzICogMi41fSVgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZT17eyByb3RhdGU6IC1ob2xkUHJvZ3Jlc3MgKiA1IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgei0xMCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB3LWZ1bGwgaC1mdWxsXCI+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIFRoZSBDb3JlICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2FsZTogaG9sZFByb2dyZXNzID49IDEwMCA/IFsxLCAxLjUsIDEuMl0gOiAxICsgKGhvbGRQcm9ncmVzcyAvIDEwMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogYGRyb3Atc2hhZG93KDAgMCAke2hvbGRQcm9ncmVzc31weCByZ2JhKDE5NywxNjAsODksMSkpYFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIE91dGVyIEVuZXJneSBTaGVsbCAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHJvdW5kZWQtZnVsbCBib3JkZXItdC00IGJvcmRlci1sLTQgYm9yZGVyLVsjQzVBMDU5XSB0cmFuc2l0aW9uLWFsbFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEyMHB4JywgaGVpZ2h0OiAnMTIwcHgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBgcm90YXRlKCR7aG9sZFByb2dyZXNzICogMTV9ZGVnKWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBob2xkUHJvZ3Jlc3MgLyAxMDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBJbm5lciBDb3JlIFB1bHNhciAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHJvdW5kZWQtZnVsbCBiZy1bI0M1QTA1OV0gdHJhbnNpdGlvbi1hbGwgbWl4LWJsZW5kLXNjcmVlblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogYCR7TWF0aC5tYXgoMTAsIGhvbGRQcm9ncmVzcyl9cHhgLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBgJHtNYXRoLm1heCgxMCwgaG9sZFByb2dyZXNzKX1weGAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IGAwIDAgJHtob2xkUHJvZ3Jlc3MgKiAyfXB4ICNGREZDRjBgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2hvbGRQcm9ncmVzcyA+PSAxMDAgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVMb2NrIGNsYXNzTmFtZT1cInRleHQtYmxhY2sgcmVsYXRpdmUgei0xMCBzY2FsZS1bMi41XVwiIHNpemU9ezQwfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVPcmJpdCBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIHJlbGF0aXZlIHotMTAgc2NhbGUtWzIuMF0gYW5pbWF0ZS1zcGluLXNsb3cgb3BhY2l0eS04MFwiIHNpemU9ezQwfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L21vdGlvbi5kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIERhdGEgUmVhZG91dCAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMTYgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsjRkRGQ0YwXSB0ZXh0LTN4bCBtZDp0ZXh0LTV4bCBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy1bMC40ZW1dIHRleHQtY2VudGVyIG1iLTIgbGVhZGluZy10aWdodCBtaXgtYmxlbmQtc2NyZWVuXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgdGV4dFNoYWRvdzogYDAgMCAke2hvbGRQcm9ncmVzcyAvIDV9cHggI0M1QTA1OSwgMCAwICR7aG9sZFByb2dyZXNzIC8gMn1weCAjZTVjOTk2YCB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2hvbGRQcm9ncmVzcyA+PSAxMDAgPyBcIkZBVEUgU0VBTEVEXCIgOiBcIlJFU09OQVRJTkdcIn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bI0M1QTA1OV0gdGV4dC14bCBmb250LW1vbm8gdHJhY2tpbmctd2lkZXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFsge2hvbGRQcm9ncmVzcy50b0ZpeGVkKDEpfSUgXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBQYXJ0aWNsZSBBY2NlbGVyYXRvcnMgKExpbmVzKSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBweC04IG10LTEyIG9wYWNpdHktNTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImgtWzFweF0gYmctZ3JhZGllbnQtdG8tciBmcm9tLXRyYW5zcGFyZW50IHZpYS1bI0M1QTA1OV0gdG8tdHJhbnNwYXJlbnQgZmxleC0xXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8THVjaWRlQWN0aXZpdHkgY2xhc3NOYW1lPVwidGV4dC1bI0M1QTA1OV0gbXgtNCBhbmltYXRlLXB1bHNlXCIgc2l6ZT17MjR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJoLVsxcHhdIGJnLWdyYWRpZW50LXRvLXIgZnJvbS10cmFuc3BhcmVudCB2aWEtWyNDNUEwNTldIHRvLXRyYW5zcGFyZW50IGZsZXgtMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9XCJpbnN0cnVjdGlvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogZm9jdXNlZExhbmcgPyBbJ3JnYmEoMTk3LDE2MCw4OSwwLjIpJywgJ3JnYmEoMTk3LDE2MCw4OSwwLjgpJywgJ3JnYmEoMTk3LDE2MCw4OSwwLjIpJ10gOiAncmdiYSgyNTUsMjU1LDI1NSwwLjEpJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiBmb2N1c2VkTGFuZyA/IFsnMCAwIDEwcHggcmdiYSgxOTcsMTYwLDg5LDApJywgJzAgMCAzMHB4IHJnYmEoMTk3LDE2MCw4OSwwLjQpJywgJzAgMCAxMHB4IHJnYmEoMTk3LDE2MCw4OSwwKSddIDogJ25vbmUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uPXt7IGR1cmF0aW9uOiAxLjUsIHJlcGVhdDogSW5maW5pdHkgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciB0ZXh0LWNlbnRlciBwLTIgbWQ6cC00IGJnLXdoaXRlLzUgYm9yZGVyLTIgcm91bmRlZC14bCBib3JkZXItZGFzaGVkIHctZnVsbCBoLWZ1bGxcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVDb21wYXNzIGNsYXNzTmFtZT17YCR7Zm9jdXNlZExhbmcgPyAndGV4dC1bI0M1QTA1OV0gYW5pbWF0ZS1zcGluLXNsb3cgc2NhbGUtMTUwJyA6ICd0ZXh0LXdoaXRlLzQwIHNjYWxlLTEyNSd9IG1iLTQgdHJhbnNpdGlvbi1hbGxgfSBzaXplPXs0MH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPXtgdGV4dC14cyBtZDp0ZXh0LWJhc2UgZm9udC1ibGFjayAke2ZvY3VzZWRMYW5nID8gJ3RleHQtWyNDNUEwNTldJyA6ICd0ZXh0LXdoaXRlLzQwJ30gdXBwZXJjYXNlIHRyYWNraW5nLVswLjRlbV0gbGVhZGluZy10aWdodCB0ZXh0LWNlbnRlciB0cmFuc2l0aW9uLWNvbG9yc2B9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9jdXNlZExhbmcgPyBmb2N1c2VkTGFuZy51aS5kcmFnIDogJ0FOQ0hPUid9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFuZyA9IExBTkdVQUdFU1twb3NdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzRm9jdXNlZCA9IGZvY3VzZWRMYW5nPy5pZCA9PT0gbGFuZy5pZDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1N0YWdlZCA9IHN0YWdlZExhbmc/LmlkID09PSBsYW5nLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzRGltbWFibGUgPSBmb2N1c2VkTGFuZyAmJiBmb2N1c2VkTGFuZy5pZCAhPT0gbGFuZy5pZDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc09yaWdpbmFsT2ZTdGFnZWQgPSBzdGFnZWRMYW5nICYmIHN0YWdlZExhbmcuaWQgPT09IGxhbmcuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleT17YHNsb3QtJHtpfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBhc3BlY3QtWzQvNV0gdy1mdWxsIHRyYW5zaXRpb24tb3BhY2l0eSBkdXJhdGlvbi0zMDAgb3ZlcmZsb3ctaGlkZGVuXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IG9wYWNpdHk6IGlzT3JpZ2luYWxPZlN0YWdlZCA/IDAgOiBNYXRoLm1heCgwLCAxIC0gKGhvbGRQcm9ncmVzcyAvIDEwMCkgKiAxLjUpIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiBIaWRlIHRoZSBvcmlnaW5hbCBzbG90IGNhcmQgaWYgaXQncyBjdXJyZW50bHkgc3RhZ2VkIGluIHRoZSBjZW50ZXIgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzT3JpZ2luYWxPZlN0YWdlZCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExhbmd1YWdlQ2FyZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nPXtsYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHg9e3Bvc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNGb2N1c2VkPXtpc0ZvY3VzZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3RhZ2VkPXtmYWxzZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNEaW1tYWJsZT17aXNEaW1tYWJsZSB8fCBzdGFnZWRMYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkZvY3VzPXtvbkNhcmRGb2N1c31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25SZWFkeT17b25DYXJkUmVhZHl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2VsZWN0PXtvbkNhcmRTZWxlY3R9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8bW90aW9uLnBcclxuICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogc3RhZ2VkTGFuZyA/IDAuOCA6IDAuMiB9fVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC14cyBtZDp0ZXh0LWJhc2UgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzAuOGVtXSB0ZXh0LXdoaXRlIG10LTEyIHRleHQtY2VudGVyXCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAge3N0YWdlZExhbmcgPyBzdGFnZWRMYW5nLnVpLmludml0aW5nIDogKGZvY3VzZWRMYW5nID8gZm9jdXNlZExhbmcudWkuYXdhaXRpbmcgOiBcIlRIRSBNQU5PUiBBV0FJVFMgWU9VUiBTT1VMJ1MgVk9ZQUdFLlwiKX1cclxuICAgICAgICAgICAgPC9tb3Rpb24ucD5cclxuXHJcbiAgICAgICAgICAgIHsvKiBNaW5hIFVJIFNjb3JlYm9hcmQgLSBOb3cgc3RyaWN0bHkgbWF0Y2hpbmcgdGhlIExhbmd1YWdlIEdyaWQvQ2FyZCB3aWR0aCAqL31cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BmaXhlZCB0b3AtNCBtZDp0b3AtOCBpbnNldC14LTAgcG9pbnRlci1ldmVudHMtbm9uZSB6LVs1MDAwXSBmbGV4IGp1c3RpZnktY2VudGVyYH0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCB3LVs5NXZ3XSBtZDp3LWF1dG8gbWQ6bWluLXctWzQ4MHB4XSBtYXgtdy00eGwgcHgtMiBtZDpweC00XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE1pbmFEaXJlY3RpdmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNWaXNpYmxlPXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVTdGVwPVwibGFuZ3VhZ2VcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0PXttaW5hVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb249XCJ0b3BcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcmFjdGlvbk1vZGU9e2lzSW50cm9BY3RpdmUgPyAncmVhZGluZycgOiAnYWN0aW9uJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3lzTmFtZT17Zm9jdXNlZExhbmc/LnVpPy5taW5hU3lzdGVtIHx8IFwiU1lTVEVNIENPTlNUUlVDVDogTUlOQVwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25SZXE9e2ZvY3VzZWRMYW5nPy51aT8ubWluYUFjdGlvbiB8fCBcIj4+IEFDVElPTiBSRVFVSVJFRDogU0VMRUNUIEEgTVVMVElWRVJTRSA8PFwifVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1NwZWFraW5nPXtpc01pbmFTcGVha2luZ31cclxuICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbi8vIEFsbCBwcmV2aW91cyBpbmxpbmUgdmlld3MgaGF2ZSBiZWVuIG1vdmVkIHRvIHRoZSB0b3AgbGV2ZWxcclxuXHJcbmNvbnN0IENvbmZpcm1WaWV3ID0gKHsgc2VsZWN0ZWRMYW5nLCBjb25maXJtTGFuZ3VhZ2UsIHRoZW1lIH0pID0+IHtcclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgLy8gRmxhc2ggYW5kIGF1dG8gdHJhbnNpdGlvblxyXG4gICAgICAgIGNvbnN0IHRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbmZpcm1MYW5ndWFnZSgpO1xyXG4gICAgICAgIH0sIDM1MDApO1xyXG4gICAgICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgfSwgW2NvbmZpcm1MYW5ndWFnZV0pO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotWzEwMDAwXSBiZy10cmFuc3BhcmVudCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBvdmVyZmxvdy1oaWRkZW5cIj5cclxuICAgICAgICAgICAgey8qIE1hc3NpdmUgRXhwbG9zaXZlIEZsYXJlICovfVxyXG4gICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbD17eyBzY2FsZTogMC4xLCBvcGFjaXR5OiAwIH19XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlPXt7IHNjYWxlOiBbMC4xLCA0LCAxNSwgMzBdLCBvcGFjaXR5OiBbMCwgMSwgMSwgMF0gfX1cclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDMuMCwgZWFzZTogXCJlYXNlSW5PdXRcIiB9fVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdy02NCBoLTY0IHJvdW5kZWQtZnVsbCBiZy1ncmFkaWVudC10by1yIGZyb20teWVsbG93LTMwMCB2aWEtWyNDNUEwNTldIHRvLXJlZC01MDAgbWl4LWJsZW5kLXNjcmVlbiBibHVyLTN4bCBwb2ludGVyLWV2ZW50cy1ub25lXCJcclxuICAgICAgICAgICAgLz5cclxuXHJcbiAgICAgICAgICAgIHsvKiBFeHBhbmRpbmcgU2hvY2t3YXZlICovfVxyXG4gICAgICAgICAgICA8bW90aW9uLmRpdlxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbD17eyBzY2FsZTogMSwgb3BhY2l0eTogMSwgYm9yZGVyV2lkdGg6IFwiMjBweFwiIH19XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlPXt7IHNjYWxlOiAxMCwgb3BhY2l0eTogMCwgYm9yZGVyV2lkdGg6IFwiMXB4XCIgfX1cclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDEuNSwgZWFzZTogXCJlYXNlT3V0XCIgfX1cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHctNDAgaC00MCByb3VuZGVkLWZ1bGwgYm9yZGVyLXdoaXRlIHBvaW50ZXItZXZlbnRzLW5vbmVcIlxyXG4gICAgICAgICAgICAvPlxyXG5cclxuICAgICAgICAgICAgPG1vdGlvbi5oMVxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCBmaWx0ZXI6IFwiYmx1cigyMHB4KVwiLCB5OiA1MCB9fVxyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiBbMCwgMSwgMSwgMF0sIGZpbHRlcjogW1wiYmx1cigyMHB4KVwiLCBcImJsdXIoMHB4KVwiLCBcImJsdXIoMHB4KVwiLCBcImJsdXIoMjBweClcIl0sIHNjYWxlOiBbMC44LCAxLCAxLjEsIDEuM10sIHk6IFs1MCwgMCwgMCwgLTUwXSB9fVxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMy41LCBlYXNlOiBcImNpcmNJblwiIH19XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWJsYWNrIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjJlbV0gbWQ6dHJhY2tpbmctWzAuNGVtXSB0ZXh0LWNlbnRlciB3LWZ1bGwgcHgtNCBicmVhay13b3JkcyB6LTEwIGxlYWRpbmctdGlnaHRcIlxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IFwiY2xhbXAoMzZweCwgOHZ3LCAxMjBweClcIiwgdGV4dFNoYWRvdzogXCIwIDAgNDBweCByZ2JhKDE5NywxNjAsODksMSlcIiB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7c2VsZWN0ZWRMYW5nLnVpLmNvbmZpcm1UaXRsZSB8fCBcIkFMSUdORURcIn1cclxuICAgICAgICAgICAgPC9tb3Rpb24uaDE+XHJcblxyXG4gICAgICAgICAgICB7LyogVGhlIEZsYWcgbWVyZ2luZyBpbnRvIHRoZSBsaWdodCAqL31cclxuICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgc2NhbGU6IDAuNSwgZmlsdGVyOiBcImJsdXIoMjBweClcIiB9fVxyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZT17eyBvcGFjaXR5OiBbMCwgMSwgMSwgMF0sIHNjYWxlOiBbMC41LCAyLCA0LCA4XSwgZmlsdGVyOiBbXCJibHVyKDIwcHgpXCIsIFwiYmx1cigwcHgpXCIsIFwiYmx1cigxMHB4KVwiLCBcImJsdXIoNDBweClcIl0gfX1cclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb249e3sgZHVyYXRpb246IDMuNSwgZWFzZTogXCJlYXNlSW5PdXRcIiB9fVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWJzb2x1dGUgei0wIHRleHQtWzEwcmVtXSBtZDp0ZXh0LVsyMHJlbV0gb3BhY2l0eS0zMCBwb2ludGVyLWV2ZW50cy1ub25lIG1peC1ibGVuZC1tdWx0aXBseVwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIHtzZWxlY3RlZExhbmcuZmxhZ31cclxuICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmNvbnN0IEFwcCA9ICgpID0+IHtcclxuICAgIGNvbnN0IFtpc09wZW5pbmdGaW5pc2hlZCwgc2V0SXNPcGVuaW5nRmluaXNoZWRdID0gdXNlU3RhdGUoZmFsc2UpO1xyXG4gICAgY29uc3QgW3N0ZXAsIHNldFN0ZXBdID0gdXNlU3RhdGUoJ2xhbmd1YWdlJyk7XHJcbiAgICBjb25zdCBbc2VsZWN0ZWRMYW5nLCBzZXRTZWxlY3RlZExhbmddID0gdXNlU3RhdGUoTEFOR1VBR0VTWzFdKTsgLy8gVjIwOiBFbmdsaXNoIChHQilcclxuXHJcbiAgICBjb25zdCBbaXNNaW5hU3BlYWtpbmcsIHNldElzTWluYVNwZWFraW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5zZXRNaW5hU3BlYWtpbmcgPSBzZXRJc01pbmFTcGVha2luZztcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0TWluYVNwZWFraW5nID0gbnVsbDtcclxuICAgICAgICB9O1xyXG4gICAgfSwgW10pO1xyXG5cclxuICAgIC8vIFVzZXIgQWNoaWV2ZW1lbnQgVHJhY2tpbmcgU3RhdGVcclxuICAgIGNvbnN0IFthcHBTdGFydFRpbWVdID0gdXNlU3RhdGUoRGF0ZS5ub3coKSk7XHJcbiAgICBjb25zdCBbdG90YWxDbGlja3MsIHNldFRvdGFsQ2xpY2tzXSA9IHVzZVN0YXRlKDApO1xyXG4gICAgY29uc3QgW2NhcmRzRXhwbG9yZWQsIHNldENhcmRzRXhwbG9yZWRdID0gdXNlU3RhdGUobmV3IFNldCgpKTtcclxuXHJcbiAgICAvLyBWMjA6IEltbWVkaWF0ZSB2b2ljZSBndWlkYW5jZSBvbiBsb2FkIChFTlNVUkUgRU4tR0IpXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGlmIChzdGVwID09PSAnbGFuZ3VhZ2UnICYmICFpc09wZW5pbmdGaW5pc2hlZCkge1xyXG4gICAgICAgICAgICAvLyBXYWl0IGZvciBvcGVuaW5nIHRvIHN0YXJ0XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW3N0ZXBdKTtcclxuICAgIGNvbnN0IFt2b3RlZElkLCBzZXRWb3RlZElkXSA9IHVzZVN0YXRlKG51bGwpO1xyXG4gICAgY29uc3QgW3ZpZXdNb2RlLCBzZXRWaWV3TW9kZV0gPSB1c2VTdGF0ZSgnZ2FsbGVyeScpO1xyXG4gICAgY29uc3QgW3ByZXZpZXdJZCwgc2V0UHJldmlld0lkXSA9IHVzZVN0YXRlKG51bGwpO1xyXG5cclxuICAgIGNvbnN0IFt0b2Rvcywgc2V0VG9kb3NdID0gdXNlU3RhdGUoeyBhdmF0YXI6IGZhbHNlLCBob21lOiBmYWxzZSwgdm90ZWQ6IGZhbHNlIH0pO1xyXG4gICAgY29uc3QgW3Nob3dUb2RvLCBzZXRTaG93VG9kb10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcblxyXG4gICAgY29uc3QgW3VzZXJBdmF0YXIsIHNldFVzZXJBdmF0YXJdID0gdXNlU3RhdGUobnVsbCk7XHJcbiAgICBjb25zdCBbYXZhdGFyTG9yZSwgc2V0QXZhdGFyTG9yZV0gPSB1c2VTdGF0ZShcIlwiKTtcclxuICAgIGNvbnN0IFtpc0F2YXRhckdlbmVyYXRpbmcsIHNldElzQXZhdGFyR2VuZXJhdGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgICBjb25zdCBbdXBsb2FkZWRJbWFnZSwgc2V0VXBsb2FkZWRJbWFnZV0gPSB1c2VTdGF0ZShudWxsKTtcclxuICAgIGNvbnN0IFt1c2VyTmFtZSwgc2V0VXNlck5hbWVdID0gdXNlU3RhdGUoJycpO1xyXG5cclxuICAgIGNvbnN0IFtjYW5kbGVMaXQsIHNldENhbmRsZUxpdF0gPSB1c2VTdGF0ZSh0cnVlKTtcclxuICAgIGNvbnN0IFtnZWFyc1NwaW5uaW5nLCBzZXRHZWFyc1NwaW5uaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IFtzcGlyaXRIaW50LCBzZXRTcGlyaXRIaW50XSA9IHVzZVN0YXRlKFwiXCIpO1xyXG4gICAgY29uc3QgW2lzU3Bpcml0U2Vuc2luZywgc2V0SXNTcGlyaXRTZW5zaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcclxuICAgIGNvbnN0IFt3aGlzcGVyLCBzZXRXaGlzcGVyXSA9IHVzZVN0YXRlKFwiXCIpO1xyXG5cclxuICAgIC8vIFtWOSBVUERBVEU6IExheWVyZWQgQXVkaW8gJiBCR01dXHJcbiAgICBjb25zdCBiZ21SZWYgPSB1c2VSZWYobnVsbCk7XHJcbiAgICBjb25zdCBbYmdtVm9sLCBzZXRCZ21Wb2xdID0gdXNlU3RhdGUoMC4yKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIC8vIFtWOCBVUERBVEU6IEFtYmllbnQgd2hpc3BlcnMgY3ljbGVdXHJcbiAgICAgICAgY29uc3Qgd2hpc3BlckludGVydmFsID0gc2V0SW50ZXJ2YWwoYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoYXBpS2V5ICYmIHN0ZXAgIT09ICdsYW5ndWFnZScpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgY2FsbEdlbWluaSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRzOiBbeyBwYXJ0czogW3sgdGV4dDogXCJHZW5lcmF0ZSAxIGNyeXB0aWMgc3RlYW1wdW5rIHdvcmQgb3IgdmVyeSBzaG9ydCBwaHJhc2UgKG1heCAyIHdvcmRzKSBhYm91dCBzb3VscywgZ2VhcnMsIG9yIHRpbWUuIFVwcGVyY2FzZSBvbmx5LlwiIH1dIH1dXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0V2hpc3BlcihyZXM/LmNhbmRpZGF0ZXM/LlswXT8uY29udGVudD8ucGFydHM/LlswXT8udGV4dD8udHJpbSgpIHx8IFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiBzaWxlbnQgKi8gfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgMTUwMDApO1xyXG4gICAgICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKHdoaXNwZXJJbnRlcnZhbCk7XHJcbiAgICB9LCBbc3RlcF0pO1xyXG5cclxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICAgICAgLy8gSW5pdGlhbGl6ZSBCR01cclxuICAgICAgICBiZ21SZWYuY3VycmVudCA9IG5ldyBBdWRpbygnL2Fzc2V0cy9zb3VuZHMvbWFub3ItYW1iaWVuY2UubXAzJyk7IC8vIFVzZSBsb2NhbCBhbWJpZW5jZVxyXG4gICAgICAgIGJnbVJlZi5jdXJyZW50Lmxvb3AgPSB0cnVlO1xyXG4gICAgICAgIGJnbVJlZi5jdXJyZW50LnZvbHVtZSA9IGJnbVZvbDtcclxuXHJcbiAgICAgICAgLy8gQmFja2dyb3VuZCBUVFMgcHJlbG9hZGluZyB0byBtaW5pbWl6ZSBuZXR3b3JrIGxhdGVuY3kgd2hlbiB1c2VyIGdldHMgdG8gQ29taW5nIFNvb25cclxuICAgICAgICBBdWRpb01hbmFnZXIucHJlbG9hZFRUUygpO1xyXG5cclxuICAgICAgICByZXR1cm4gKCkgPT4gYmdtUmVmLmN1cnJlbnQucGF1c2UoKTtcclxuICAgIH0sIFtdKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGlmIChiZ21SZWYuY3VycmVudCkgYmdtUmVmLmN1cnJlbnQudm9sdW1lID0gYmdtVm9sO1xyXG4gICAgfSwgW2JnbVZvbF0pO1xyXG5cclxuICAgIC8vIEFjY3VtdWxhdGUgc291bmQgbGF5ZXJzIGFzIHVzZXIgcHJvZ3Jlc3Nlc1xyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAoc3RlcCA9PT0gJ2Rhc2hib2FyZCcpIHNldEJnbVZvbCgwLjQpO1xyXG4gICAgICAgIGlmICh0b2Rvcy52b3RlZCkgc2V0QmdtVm9sKDAuNik7XHJcbiAgICB9LCBbc3RlcCwgdG9kb3NdKTtcclxuXHJcbiAgICBjb25zdCBwbGF5U2Z4ID0gKHR5cGUpID0+IHtcclxuICAgICAgICBjb25zdCBjdXJyZW50VGhlbWUgPSBUSEVNRV9DT05GSUdbc2VsZWN0ZWRMYW5nPy5pZF0gfHwgVEhFTUVfQ09ORklHLmVuO1xyXG5cclxuICAgICAgICBjb25zdCBzb3VuZHMgPSB7XHJcbiAgICAgICAgICAgIGNsaWNrOiBgL2Fzc2V0cy9zb3VuZHMvJHtzZWxlY3RlZExhbmc/LmlkIHx8ICdlbid9LWNsaWNrLm1wM2AsXHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGAvYXNzZXRzL3NvdW5kcy8ke3NlbGVjdGVkTGFuZz8uaWQgfHwgJ2VuJ30tdHJhbnNpdGlvbi5tcDNgLFxyXG4gICAgICAgICAgICB3ZWxjb21lOiAnL2Fzc2V0cy9zb3VuZHMvd2VsY29tZS12b2ljZS5tcDMnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgYXVkaW9TcmMgPSBzb3VuZHNbdHlwZV0gfHwgc291bmRzLmNsaWNrO1xyXG4gICAgICAgIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKGF1ZGlvU3JjKTtcclxuXHJcbiAgICAgICAgYXVkaW8ucGxheSgpLmNhdGNoKGUgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYFNvdW5kICR7dHlwZX0gZm9yICR7c2VsZWN0ZWRMYW5nPy5pZH0gbm90IGZvdW5kLCB1c2luZyBkZWZhdWx0LmApO1xyXG4gICAgICAgICAgICAvLyBTaWxlbnQgZmFsbGJhY2sgdG8gYXZvaWQgYnJlYWtpbmcgVUlcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgW2xvcmVUZXh0LCBzZXRMb3JlVGV4dF0gPSB1c2VTdGF0ZShcIlwiKTtcclxuXHJcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgICAgIGlmICh2aWV3TW9kZSA9PT0gJ2hvbWVfaW50ZXJpb3InICYmIHVzZXJBdmF0YXI/LmxvcmUpIHtcclxuICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICBzZXRMb3JlVGV4dChcIlwiKTtcclxuICAgICAgICAgICAgY29uc3QgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRMb3JlVGV4dChwcmV2ID0+IHByZXYgKyB1c2VyQXZhdGFyLmxvcmUuY2hhckF0KGkpKTtcclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgICAgIGlmIChpID49IHVzZXJBdmF0YXIubG9yZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBbVjk6IFByZS1mZXRjaCBuZXh0IGxvZ2ljIGFmdGVyIGxvcmUgZmluaXNoZWRdXHJcbiAgICAgICAgICAgICAgICAgICAgcHJlRmV0Y2hWb2ljZShzZWxlY3RlZExhbmcudWkudG9kb0RvbmUsIHNlbGVjdGVkTGFuZy52b2ljZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDMwKTtcclxuICAgICAgICAgICAgcmV0dXJuICgpID0+IGNsZWFySW50ZXJ2YWwodGltZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH0sIFt2aWV3TW9kZSwgdXNlckF2YXRhcl0pO1xyXG5cclxuICAgIGNvbnN0IGNhbGxHZW1pbmkgPSBhc3luYyAocGF5bG9hZCwgZW5kcG9pbnQgPSBcImdlbmVyYXRlQ29udGVudFwiLCBtb2RlbCA9IFwiZ2VtaW5pLTIuNS1mbGFzaC1wcmV2aWV3LTA5LTIwMjVcIikgPT4ge1xyXG4gICAgICAgIGNvbnN0IHVybCA9IGBodHRwczovL2dlbmVyYXRpdmVsYW5ndWFnZS5nb29nbGVhcGlzLmNvbS92MWJldGEvbW9kZWxzLyR7bW9kZWx9OiR7ZW5kcG9pbnR9P2tleT0ke2FwaUtleX1gO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLm9rKSB0aHJvdyBuZXcgRXJyb3IoJ0FQSSByZXF1ZXN0IGZhaWxlZCcpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PT0gNCkgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgbmV3IFByb21pc2UociA9PiBzZXRUaW1lb3V0KHIsIE1hdGgucG93KDIsIGkpICogMTAwMCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBzcGVha1RleHQgPSBhc3luYyAodGV4dCkgPT4ge1xyXG4gICAgICAgIGlmICghYXBpS2V5IHx8ICF0ZXh0KSByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIFtWOCBVUERBVEU6IENoZWNrIENhY2hlIFBhdGggZmlyc3RdXHJcbiAgICAgICAgaWYgKGF1ZGlvQ2FjaGVbdGV4dF0pIHtcclxuICAgICAgICAgICAgbmV3IEF1ZGlvKGF1ZGlvQ2FjaGVbdGV4dF0pLnBsYXkoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvbXB0ID0gYFNwZWFrIHdpdGggYSBicmlnaHQsIGNoZWVyZnVsLCBleHByZXNzaXZlLCBhbmQgaGlnaGx5IGh1bWFuLWxpa2Ugdm9pY2UgaW4gJHtzZWxlY3RlZExhbmcubmFtZX0gbGFuZ3VhZ2U6ICR7dGV4dH1gO1xyXG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNhbGxHZW1pbmkoe1xyXG4gICAgICAgICAgICAgICAgY29udGVudHM6IFt7IHBhcnRzOiBbeyB0ZXh0OiBwcm9tcHQgfV0gfV0sXHJcbiAgICAgICAgICAgICAgICBnZW5lcmF0aW9uQ29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VNb2RhbGl0aWVzOiBbXCJBVURJT1wiXSxcclxuICAgICAgICAgICAgICAgICAgICBzcGVlY2hDb25maWc6IHsgdm9pY2VDb25maWc6IHsgcHJlYnVpbHRWb2ljZUNvbmZpZzogeyB2b2ljZU5hbWU6IHNlbGVjdGVkTGFuZy52b2ljZSB8fCBcIlplcGh5clwiIH0gfSB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIFwiZ2VuZXJhdGVDb250ZW50XCIsIFwiZ2VtaW5pLTEuNS1mbGFzaFwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZT8uY2FuZGlkYXRlcz8uWzBdPy5jb250ZW50Py5wYXJ0cz8uWzBdPy5pbmxpbmVEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhdWRpb0RhdGEgPSByZXNwb25zZS5jYW5kaWRhdGVzWzBdLmNvbnRlbnQucGFydHNbMF0uaW5saW5lRGF0YS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2FtcGxlUmF0ZSA9IDI0MDAwO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2F2VXJsID0gcGNtVG9XYXYoYXVkaW9EYXRhLCBzYW1wbGVSYXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDYWNoZSBmb3IgbGF0ZXJcclxuICAgICAgICAgICAgICAgIHNldEF1ZGlvQ2FjaGUocHJldiA9PiAoeyAuLi5wcmV2LCBbdGV4dF06IHdhdlVybCB9KSk7XHJcbiAgICAgICAgICAgICAgICBuZXcgQXVkaW8od2F2VXJsKS5wbGF5KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHsgY29uc29sZS5lcnJvcihcIlRUUyBFcnJvcjpcIiwgZXJyKTsgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBbVjggVVBEQVRFOiBQcmUtZmV0Y2ggTG9naWMgdG8gZWxpbWluYXRlIHN5bmMgaXNzdWVzXVxyXG4gICAgY29uc3QgcHJlRmV0Y2hWb2ljZSA9IGFzeW5jICh0ZXh0LCBsYW5nVm9pY2UsIGxhbmdOYW1lKSA9PiB7XHJcbiAgICAgICAgaWYgKCFhcGlLZXkgfHwgIXRleHQgfHwgYXVkaW9DYWNoZVt0ZXh0XSkgcmV0dXJuO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgY2FsbEdlbWluaSh7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50czogW3sgcGFydHM6IFt7IHRleHQ6IGBTcGVhayB3aXRoIGEgYnJpZ2h0LCBjaGVlcmZ1bCwgZXhwcmVzc2l2ZSwgYW5kIGhpZ2hseSBodW1hbi1saWtlIHZvaWNlIGluICR7bGFuZ05hbWV9IGxhbmd1YWdlOiAke3RleHR9YCB9XSB9XSxcclxuICAgICAgICAgICAgICAgIGdlbmVyYXRpb25Db25maWc6IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZU1vZGFsaXRpZXM6IFtcIkFVRElPXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHNwZWVjaENvbmZpZzogeyB2b2ljZUNvbmZpZzogeyBwcmVidWlsdFZvaWNlQ29uZmlnOiB7IHZvaWNlTmFtZTogbGFuZ1ZvaWNlIHx8IFwiWmVwaHlyXCIgfSB9IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgXCJnZW5lcmF0ZUNvbnRlbnRcIiwgXCJnZW1pbmktMS41LWZsYXNoXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlPy5jYW5kaWRhdGVzPy5bMF0/LmNvbnRlbnQ/LnBhcnRzPy5bMF0/LmlubGluZURhdGEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGF1ZGlvRGF0YSA9IHJlc3BvbnNlLmNhbmRpZGF0ZXNbMF0uY29udGVudC5wYXJ0c1swXS5pbmxpbmVEYXRhLmRhdGE7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3YXZVcmwgPSBwY21Ub1dhdihhdWRpb0RhdGEsIDI0MDAwKTtcclxuICAgICAgICAgICAgICAgIHNldEF1ZGlvQ2FjaGUocHJldiA9PiAoeyAuLi5wcmV2LCBbdGV4dF06IHdhdlVybCB9KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHsgLyogU2lsZW50IGZhaWwgZm9yIHByZS1mZXRjaCAqLyB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFtWNyBVUERBVEU6IFJlc3RvcmVkIHJvYnVzdCBhdWRpbyBidWZmZXIgcHJvY2Vzc2luZywgaG9pc3RlZCBzdGFuZGFyZCBmdW5jdGlvbl1cclxuICAgIGZ1bmN0aW9uIHBjbVRvV2F2KGJhc2U2NCwgc2FtcGxlUmF0ZSkge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IFVpbnQ4QXJyYXkuZnJvbShhdG9iKGJhc2U2NCksIGMgPT4gYy5jaGFyQ29kZUF0KDApKS5idWZmZXI7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoNDQgKyBidWZmZXIuYnl0ZUxlbmd0aCkpO1xyXG4gICAgICAgIGNvbnN0IHdyaXRlU3RyaW5nID0gKG9mZnNldCwgc3RyaW5nKSA9PiB7IGZvciAobGV0IGkgPSAwOyBpIDwgc3RyaW5nLmxlbmd0aDsgaSsrKSB2aWV3LnNldFVpbnQ4KG9mZnNldCArIGksIHN0cmluZy5jaGFyQ29kZUF0KGkpKTsgfTtcclxuICAgICAgICB3cml0ZVN0cmluZygwLCAnUklGRicpOyB2aWV3LnNldFVpbnQzMig0LCAzNiArIGJ1ZmZlci5ieXRlTGVuZ3RoLCB0cnVlKTsgd3JpdGVTdHJpbmcoOCwgJ1dBVkUnKTsgd3JpdGVTdHJpbmcoMTIsICdmbXQgJyk7XHJcbiAgICAgICAgdmlldy5zZXRVaW50MzIoMTYsIDE2LCB0cnVlKTsgdmlldy5zZXRVaW50MTYoMjAsIDEsIHRydWUpOyB2aWV3LnNldFVpbnQxNigyMiwgMSwgdHJ1ZSk7IHZpZXcuc2V0VWludDMyKDI0LCBzYW1wbGVSYXRlLCB0cnVlKTtcclxuICAgICAgICB2aWV3LnNldFVpbnQzMigyOCwgc2FtcGxlUmF0ZSAqIDIsIHRydWUpOyB2aWV3LnNldFVpbnQxNigzMiwgMiwgdHJ1ZSk7IHZpZXcuc2V0VWludDE2KDM0LCAxNiwgdHJ1ZSk7IHdyaXRlU3RyaW5nKDM2LCAnZGF0YScpO1xyXG4gICAgICAgIHZpZXcuc2V0VWludDMyKDQwLCBidWZmZXIuYnl0ZUxlbmd0aCwgdHJ1ZSk7IG5ldyBVaW50OEFycmF5KHZpZXcuYnVmZmVyLCA0NCkuc2V0KG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpO1xyXG4gICAgICAgIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKG5ldyBCbG9iKFt2aWV3XSwgeyB0eXBlOiAnYXVkaW8vd2F2JyB9KSk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFtWMTldIENvbnNvbGlkYXRlZCBMYW5ndWFnZSBTZWxlY3Rpb24gTG9naWNcclxuICAgIGNvbnN0IGhhbmRsZUxhbmd1YWdlU2VsZWN0ID0gKGxhbmcpID0+IHtcclxuICAgICAgICBzZXRTZWxlY3RlZExhbmcobGFuZyk7XHJcbiAgICAgICAgc2V0U3RlcCgnY29uZmlybScpO1xyXG4gICAgICAgIHNldFZpZXdNb2RlKG51bGwpO1xyXG4gICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5U2Z4KCdjbGljaycpO1xyXG4gICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5TWluYShsYW5nLmlkLCAnY29uZmlybScpO1xyXG5cclxuICAgICAgICAvLyBNYWluIEJHTSBzdG9wcyBjb21wbGV0ZWx5XHJcbiAgICAgICAgaWYgKEF1ZGlvTWFuYWdlci5tYWluVGhlbWUpIHtcclxuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLm1haW5UaGVtZS5wYXVzZSgpO1xyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIubWFpblRoZW1lLmN1cnJlbnRUaW1lID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEVuaGFuY2Ugc3BlY2lmaWMgY291bnRyeSB0aGVtZSB2b2x1bWUgdG8gNzAlIHdpdGggY3Jvc3NmYWRlXHJcbiAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlUaGVtZShsYW5nLmlkLCAwLjcsIDMwMDApO1xyXG5cclxuICAgICAgICAvLyBbVjEwOiBTZXF1ZW5jZSBwcmUtZmV0Y2hpbmddXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHByZUZldGNoVm9pY2UobGFuZy51aS5jb25maXJtVGl0bGUsIGxhbmcudm9pY2UsIGxhbmcubmFtZSk7XHJcbiAgICAgICAgICAgIHByZUZldGNoVm9pY2UobGFuZy53ZWxjb21lLCBsYW5nLnZvaWNlLCBsYW5nLm5hbWUpO1xyXG4gICAgICAgIH0sIDMwMCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGNvbmZpcm1MYW5ndWFnZSA9IHVzZUNhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICBzZXRTdGVwKCdjb21pbmdfc29vbicpO1xyXG4gICAgICAgIHNldFZpZXdNb2RlKCdjb21pbmdfc29vbicpO1xyXG4gICAgfSwgW10pO1xyXG5cclxuICAgIGNvbnN0IGhhbmRsZUltYWdlVXBsb2FkID0gKGUpID0+IHtcclxuICAgICAgICBjb25zdCBmaWxlID0gZS50YXJnZXQuZmlsZXNbMF07XHJcbiAgICAgICAgaWYgKGZpbGUpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgcmVhZGVyLm9ubG9hZGVuZCA9ICgpID0+IHNldFVwbG9hZGVkSW1hZ2UocmVhZGVyLnJlc3VsdC5zcGxpdCgnLCcpWzFdKTtcclxuICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBnZW5lcmF0ZVRleHRDaGFyYWN0ZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgaWYgKCF1c2VyTmFtZS50cmltKCkpIHJldHVybjtcclxuICAgICAgICBzZXRJc0F2YXRhckdlbmVyYXRpbmcodHJ1ZSk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gW1Y3IFVQREFURTogU3luY2hyb25pemVkIHRleHQgYXZhdGFyIHByb21wdCBmcm9tIHVzZXIgc291cmNlXVxyXG4gICAgICAgICAgICBjb25zdCBwcm9tcHQgPSBgQ3JlYXRlIGEgc2hvcnQsIG15c3RlcmlvdXMgMTl0aC1jZW50dXJ5IHN0ZWFtcHVuayBwZXJzb25hIGZvciBzb21lb25lIG5hbWVkIFwiJHt1c2VyTmFtZX1cIi4gT3V0cHV0IGluICR7c2VsZWN0ZWRMYW5nLm5hbWV9LiBNYXggNDAgd29yZHMuYDtcclxuICAgICAgICAgICAgY29uc3QgbG9yZVJlc3VsdCA9IGF3YWl0IGNhbGxHZW1pbmkoeyBjb250ZW50czogW3sgcGFydHM6IFt7IHRleHQ6IHByb21wdCB9XSB9XSB9KTtcclxuICAgICAgICAgICAgY29uc3QgbG9yZSA9IGxvcmVSZXN1bHQ/LmNhbmRpZGF0ZXM/LlswXT8uY29udGVudD8ucGFydHM/LlswXT8udGV4dCB8fCBgVGhlIGVuaWdtYXRpYyAke3VzZXJOYW1lfS5gO1xyXG4gICAgICAgICAgICBzZXRVc2VyQXZhdGFyKHsgaW1hZ2U6IG51bGwsIHRleHROYW1lOiB1c2VyTmFtZSwgbG9yZSwgaXNUZXh0QXZhdGFyOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICBzZXRUb2RvcyhwID0+ICh7IC4uLnAsIGF2YXRhcjogdHJ1ZSB9KSk7XHJcbiAgICAgICAgICAgIEF1ZGlvTWFuYWdlci5wbGF5TWluYShzZWxlY3RlZExhbmcuaWQsICdhdmF0YXInKTtcclxuICAgICAgICAgICAgc2V0U3RlcCgnZGFzaGJvYXJkJyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgc2V0VXNlckF2YXRhcih7IGltYWdlOiBudWxsLCB0ZXh0TmFtZTogdXNlck5hbWUsIGxvcmU6IGBUaGUgZW5pZ21hdGljICR7dXNlck5hbWV9LmAsIGlzVGV4dEF2YXRhcjogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgc2V0VG9kb3MocCA9PiAoeyAuLi5wLCBhdmF0YXI6IHRydWUgfSkpO1xyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIucGxheU1pbmEoc2VsZWN0ZWRMYW5nLmlkLCAnYXZhdGFyJyk7XHJcbiAgICAgICAgICAgIHNldFN0ZXAoJ2Rhc2hib2FyZCcpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHNldElzQXZhdGFyR2VuZXJhdGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBnZW5lcmF0ZUNoYXJhY3RlciA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICBpZiAoIXVwbG9hZGVkSW1hZ2UpIHJldHVybjtcclxuICAgICAgICBzZXRJc0F2YXRhckdlbmVyYXRpbmcodHJ1ZSk7XHJcblxyXG4gICAgICAgIC8vIFtWNyBVUERBVEU6IFJlc3RvcmVkIGF0bW9zcGhlcmljIGZhbGxiYWNrIGxvcmUgYW5kIEltYWdlbiByYWNlIGxvZ2ljIGZyb20gdXNlciBzb3VyY2VdXHJcbiAgICAgICAgbGV0IGdlbmVyYXRlZExvcmUgPSBcIkEgbXlzdGVyaW91cyBzb3VsIHdob3NlIHZpc2FnZSB0aGUgbWFjaGluZSBjb3VsZCBub3QgZnVsbHkgY29tcHJlaGVuZC5cIjtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgbG9yZVJlc3VsdCA9IGF3YWl0IGNhbGxHZW1pbmkoe1xyXG4gICAgICAgICAgICAgICAgY29udGVudHM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgcm9sZTogXCJ1c2VyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFydHM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBgQW5hbHl6ZSB0aGlzIGltYWdlIGFuZCBjcmVhdGUgYSAxOXRoLWNlbnR1cnkgc3RlYW1wdW5rIHBlcnNvbmEuIE91dHB1dCBpbiAke3NlbGVjdGVkTGFuZy5uYW1lfSBsYW5ndWFnZS4gTWF4IDUwIHdvcmRzLmAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgeyBpbmxpbmVEYXRhOiB7IG1pbWVUeXBlOiBcImltYWdlL3BuZ1wiLCBkYXRhOiB1cGxvYWRlZEltYWdlIH0gfVxyXG4gICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAobG9yZVJlc3VsdD8uY2FuZGlkYXRlcz8uWzBdPy5jb250ZW50Py5wYXJ0cz8uWzBdPy50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICBnZW5lcmF0ZWRMb3JlID0gbG9yZVJlc3VsdC5jYW5kaWRhdGVzWzBdLmNvbnRlbnQucGFydHNbMF0udGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZXRBdmF0YXJMb3JlKGdlbmVyYXRlZExvcmUpO1xyXG5cclxuICAgICAgICAgICAgLy8gMjAgU2Vjb25kcyBUaW1lb3V0IFByb21pc2VcclxuICAgICAgICAgICAgY29uc3QgdGltZW91dFByb21pc2UgPSBuZXcgUHJvbWlzZSgoXywgcmVqZWN0KSA9PiBzZXRUaW1lb3V0KCgpID0+IHJlamVjdChuZXcgRXJyb3IoXCJUSU1FT1VUXCIpKSwgMjAwMDApKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGltYWdlRmV0Y2hQcm9taXNlID0gZmV0Y2goYGh0dHBzOi8vZ2VuZXJhdGl2ZWxhbmd1YWdlLmdvb2dsZWFwaXMuY29tL3YxYmV0YS9tb2RlbHMvaW1hZ2VuLTMuMC1nZW5lcmF0ZS0wMDE6cHJlZGljdD9rZXk9JHthcGlLZXl9YCwge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZXM6IHsgcHJvbXB0OiBgVmludGFnZSBvaWwgcGFpbnRpbmcgc3R5bGUsIHN0ZWFtcHVuayBjaGFyYWN0ZXIgcG9ydHJhaXQgYmFzZWQgb24gZGVzY3JpcHRpb246ICR7Z2VuZXJhdGVkTG9yZX0uIFNlcGlhIHRvbmVzLCB2aWN0b3JpYW4gY2xvdGhpbmcsIGJyYXNzIGdvZ2dsZXMsIGV0Y2hpbmcgdGV4dHVyZS5gIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczogeyBzYW1wbGVDb3VudDogMSB9XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgfSkudGhlbihyZXMgPT4gcmVzLmpzb24oKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBSYWNlIGJldHdlZW4gSW1hZ2UgQVBJIGFuZCAyMHMgVGltZW91dFxyXG4gICAgICAgICAgICBjb25zdCBpbWFnZURhdGEgPSBhd2FpdCBQcm9taXNlLnJhY2UoW2ltYWdlRmV0Y2hQcm9taXNlLCB0aW1lb3V0UHJvbWlzZV0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpbWFnZURhdGEgfHwgIWltYWdlRGF0YS5wcmVkaWN0aW9ucyB8fCAhaW1hZ2VEYXRhLnByZWRpY3Rpb25zWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGltYWdlIGRhdGEgc3RydWN0dXJlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBnZW5lcmF0ZWRVcmwgPSBgZGF0YTppbWFnZS9wbmc7YmFzZTY0LCR7aW1hZ2VEYXRhLnByZWRpY3Rpb25zWzBdLmJ5dGVzQmFzZTY0RW5jb2RlZH1gO1xyXG5cclxuICAgICAgICAgICAgc2V0VXNlckF2YXRhcih7IGltYWdlOiBnZW5lcmF0ZWRVcmwsIGxvcmU6IGdlbmVyYXRlZExvcmUsIGlzVGV4dEF2YXRhcjogZmFsc2UgfSk7XHJcbiAgICAgICAgICAgIHNldFRvZG9zKHAgPT4gKHsgLi4ucCwgYXZhdGFyOiB0cnVlIH0pKTtcclxuICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLnBsYXlNaW5hKHNlbGVjdGVkTGFuZy5pZCwgJ2F2YXRhcicpO1xyXG4gICAgICAgICAgICBzZXRTdGVwKCdkYXNoYm9hcmQnKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkdlbmVyYXRpb24gRXJyb3Igb3IgVGltZW91dDpcIiwgZXJyKTtcclxuICAgICAgICAgICAgLy8gRmFsbGJhY2s6IFVzZSBUZXh0IEF2YXRhciBpZiBpbWFnZSBnZW5lcmF0aW9uIGhhbmdzL2ZhaWxzXHJcbiAgICAgICAgICAgIHNldFVzZXJBdmF0YXIoeyBpbWFnZTogbnVsbCwgdGV4dE5hbWU6IFwiQXJjaGl0ZWN0XCIsIGxvcmU6IGdlbmVyYXRlZExvcmUsIGlzVGV4dEF2YXRhcjogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgc2V0VG9kb3MocCA9PiAoeyAuLi5wLCBhdmF0YXI6IHRydWUgfSkpO1xyXG4gICAgICAgICAgICBBdWRpb01hbmFnZXIucGxheU1pbmEoc2VsZWN0ZWRMYW5nLmlkLCAnYXZhdGFyJyk7XHJcbiAgICAgICAgICAgIHNldFN0ZXAoJ2Rhc2hib2FyZCcpO1xyXG4gICAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgICAgIHNldElzQXZhdGFyR2VuZXJhdGluZyhmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVQcmV2aWV3Vm90ZSA9IGFzeW5jIChpZCkgPT4ge1xyXG4gICAgICAgIGlmICghaXNBdXRoZW50aWNhdGVkKSByZXR1cm47XHJcbiAgICAgICAgc2V0UHJldmlld0lkKGlkKTtcclxuICAgICAgICBjb25zdCBwcm9qID0gUFJPSkVDVFMuZmluZChwID0+IHAuaWQgPT09IGlkKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBbVjcgVVBEQVRFOiBSZXN0b3JlZCBkZXRhaWxlZCBwcm9waGVjeSBwcm9tcHQgZnJvbSB1c2VyIHNvdXJjZV1cclxuICAgICAgICAgICAgY29uc3QgcHJvbXB0ID0gYFRoZSB1c2VyIGlzIGNvbnNpZGVyaW5nIHRoZSBwYXRoOiBcIiR7cHJvai50aXRsZX1cIi4gV3JpdGUgYSBteXN0ZXJpb3VzLCB2aWN0b3JpYW4tc3R5bGUgcHJvcGhlY3kgYWJvdXQgdGhpcyBjaG9pY2UuIE91dHB1dCBpbiAke3NlbGVjdGVkTGFuZy5uYW1lfS4gTWF4IDMwIHdvcmRzLmA7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhbGxHZW1pbmkoeyBjb250ZW50czogW3sgcGFydHM6IFt7IHRleHQ6IHByb21wdCB9XSB9XSB9KTtcclxuICAgICAgICAgICAgc2V0T3JhY2xlTWVzc2FnZShyZXN1bHQuY2FuZGlkYXRlcz8uWzBdPy5jb250ZW50Py5wYXJ0cz8uWzBdPy50ZXh0IHx8IFwiLi4uXCIpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikgeyBjb25zb2xlLmVycm9yKGVycik7IH1cclxuICAgIH07XHJcblxyXG4gICAgLy8gLS0tIFZpZXcgVGVtcGxhdGVzIC0tLVxyXG5cclxuICAgIC8vIEdhbGxlcnlWaWV3LCBNYW5vclZpZXcsIE1pc3Npb25WaWV3LCBUcmFpbGVyVmlldywgTGFuZ3VhZ2VWaWV3LCBDb25maXJtVmlldyBcclxuICAgIC8vIHdlcmUgbWFudWFsbHkgZGVmaW5lZCBpbnNpZGUgQXBwIHByZXZpb3VzbHksIGNhdXNpbmcgdGhlIHJlLXJlbmRlciBmb2N1cyBidWcuXHJcbiAgICAvLyBUaGV5IGFyZSBub3cgcHJvcGVybHkgaG9pc3RlZCBhbmQgd2UgcmVtb3ZlZCB0aGUgZHVwbGljYXRlIGxlZ2FjeSBvbmVzLlxyXG5cclxuICAgIGNvbnN0IE1hbm9yVmlldyA9ICh7IHNlbGVjdGVkTGFuZywgc2V0Vmlld01vZGUsIHVzZXJBdmF0YXIsIGNhbmRsZUxpdCwgc2V0Q2FuZGxlTGl0LCBnZWFyc1NwaW5uaW5nLCBzZXRHZWFyc1NwaW5uaW5nLCBsb3JlVGV4dCB9KSA9PiAoXHJcbiAgICAgICAgPG1vdGlvbi5kaXYgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCBzY2FsZTogMC45NSB9fSBhbmltYXRlPXt7IG9wYWNpdHk6IDEsIHNjYWxlOiAxIH19IGNsYXNzTmFtZT1cInctZnVsbCBtYXgtdy1sZyBoLWZ1bGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgc3BhY2UteS0yIHB5LTRcIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRWaWV3TW9kZSgnZ2FsbGVyeScpfSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzQwIGhvdmVyOnRleHQtd2hpdGUgdXBwZXJjYXNlIHRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdHJhY2tpbmctd2lkZXN0IG1iLTIgc2VsZi1zdGFydCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMVwiPlxyXG4gICAgICAgICAgICAgICAgPEx1Y2lkZUNoZXZyb25MZWZ0IHNpemU9ezE2fSAvPiB7c2VsZWN0ZWRMYW5nLnVpLnJldHVybkdhbGxlcnl9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG5cclxuICAgICAgICAgICAgPEdsYXNzQ2FyZCBjbGFzc05hbWU9XCJ3LWZ1bGwgZmxleC0xIG1heC1oLVs3MHZoXSBwLTAgYm9yZGVyLXdoaXRlLzEwIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlblwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJnLWdyYWRpZW50LXRvLXQgZnJvbS1ibGFjayB2aWEtdHJhbnNwYXJlbnQgdG8tdHJhbnNwYXJlbnQgb3BhY2l0eS04MFwiIC8+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LTEwIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIHAtNiBoLWZ1bGwgb3ZlcmZsb3cteS1hdXRvIG5vLXNjcm9sbGJhclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGZsZXgganVzdGlmeS1iZXR3ZWVuIG1iLTQgcHgtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyIGhvdmVyOnNjYWxlLTExMCB0cmFuc2l0aW9uLXRyYW5zZm9ybSBvcGFjaXR5LTMwIGhvdmVyOm9wYWNpdHktMTAwXCIgb25DbGljaz17KCkgPT4gc2V0Q2FuZGxlTGl0KCFjYW5kbGVMaXQpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVGbGFtZSBzaXplPXsyNH0gY2xhc3NOYW1lPXtjYW5kbGVMaXQgPyAndGV4dC13aGl0ZScgOiAndGV4dC13aGl0ZS8yMCd9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImN1cnNvci1wb2ludGVyIGhvdmVyOnJvdGF0ZS05MCB0cmFuc2l0aW9uLXRyYW5zZm9ybSBvcGFjaXR5LTMwIGhvdmVyOm9wYWNpdHktMTAwXCIgb25DbGljaz17KCkgPT4gc2V0R2VhcnNTcGlubmluZyghZ2VhcnNTcGlubmluZyl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXYgYW5pbWF0ZT17eyByb3RhdGU6IGdlYXJzU3Bpbm5pbmcgPyAzNjAgOiAwIH19IHRyYW5zaXRpb249e3sgZHVyYXRpb246IDQsIHJlcGVhdDogZ2VhcnNTcGlubmluZyA/IEluZmluaXR5IDogMCwgZWFzZTogXCJsaW5lYXJcIiB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8THVjaWRlU2V0dGluZ3Mgc2l6ZT17MjR9IGNsYXNzTmFtZT1cInRleHQtd2hpdGVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2ByZWxhdGl2ZSB3LTI4IGgtMjggbWItNCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi03MDAgJHtjYW5kbGVMaXQgPyAnJyA6ICdicmlnaHRuZXNzLTUwJ31gfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGJvcmRlciBib3JkZXItd2hpdGUvMjAgcm91bmRlZC1mdWxsIHNoYWRvdy1bMF8wXzMwcHhfcmdiYSgyNTUsMjU1LDI1NSwwLjEpXVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCByb3VuZGVkLWZ1bGwgb3ZlcmZsb3ctaGlkZGVuIGJnLWJsYWNrIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3VzZXJBdmF0YXI/LmltYWdlID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXt1c2VyQXZhdGFyLmltYWdlfSBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1mdWxsIG9iamVjdC1jb3ZlciByb3VuZGVkLWZ1bGxcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzUwIGZvbnQtYmxhY2sgdGV4dC14bCB0ZXh0LWNlbnRlciB1cHBlcmNhc2VcIj57dXNlckF2YXRhcj8udGV4dE5hbWU/LmNoYXJBdCgwKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQteGwgZm9udC1ibGFjayB0ZXh0LXdoaXRlIG1iLTQgdXBwZXJjYXNlIHRyYWNraW5nLVswLjNlbV0gdGV4dC1jZW50ZXIgbGVhZGluZy1ub25lIHRyYWNraW5nLXdpZGVzdFwiPntzZWxlY3RlZExhbmcudWkubWFub3JUaXRsZSB8fCBcIlRIRSBDTE9DS1dPUksgSEVBUlRcIn08L2gzPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwibG9yZS1ib3hcIiBjbGFzc05hbWU9XCJ3LWZ1bGwgZmxleC0xIGJnLWJsYWNrLzQwIHAtNSBib3JkZXIgYm9yZGVyLXdoaXRlLzUgcm91bmRlZC14bCBmb250LW1vbm8gdGV4dC1bMTFweF0gdGV4dC13aGl0ZS83MCBsZWFkaW5nLXJlbGF4ZWQgb3ZlcmZsb3cteS1hdXRvIG5vLXNjcm9sbGJhciBiYWNrZHJvcC1ibHVyLW1kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtsb3JlVGV4dH08c3BhbiBjbGFzc05hbWU9XCJpbmxpbmUtYmxvY2sgdy0xLjUgaC0zIGJnLXdoaXRlLzUwIG1sLTEgYW5pbWF0ZS1waW5nXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00IHctZnVsbCBtdC00IHB0LTQgYm9yZGVyLXQgYm9yZGVyLXdoaXRlLzEwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxtb3Rpb24uZGl2IHdoaWxlSG92ZXI9e3sgeTogLTIgfX0gY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgZ2FwLTIgY3Vyc29yLXBvaW50ZXIgZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVUcm9waHkgc2l6ZT17MTh9IGNsYXNzTmFtZT1cInRleHQtd2hpdGUvNDAgZ3JvdXAtaG92ZXI6dGV4dC13aGl0ZSB0cmFuc2l0aW9uLWNvbG9yc1wiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0ZXh0LXdoaXRlLzQwIGdyb3VwLWhvdmVyOnRleHQtd2hpdGUgdHJhY2tpbmctd2lkZXN0IHRyYW5zaXRpb24tY29sb3JzXCI+e3NlbGVjdGVkTGFuZy51aS5tYW5vckhlaXJsb29tcyB8fCBcIkhFSVJMT09NU1wifTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGdhcC0yIG9wYWNpdHktMzAgY3Vyc29yLW5vdC1hbGxvd2VkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8THVjaWRlTWFwUGluIHNpemU9ezE4fSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzQwXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRleHQtd2hpdGUvNDAgdHJhY2tpbmctd2lkZXN0XCI+e3NlbGVjdGVkTGFuZy51aS5tYW5vckVzdGF0ZSB8fCBcIkVTVEFURVwifTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9HbGFzc0NhcmQ+XHJcbiAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBNaXNzaW9uVmlldyA9ICh7IHNlbGVjdGVkTGFuZywgc2V0Vmlld01vZGUsIFBST0pFQ1RTLCBwcmV2aWV3SWQsIGhhbmRsZVByZXZpZXdWb3RlLCBpc0F1dGhlbnRpY2F0ZWQsIHNldElzQXV0aGVudGljYXRlZCwgb3JhY2xlTWVzc2FnZSwgc2V0U3RlcCwgc2V0VG9kb3MgfSkgPT4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIG1heC13LWxnIGgtZnVsbCBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWNlbnRlciBzcGFjZS15LTQgcHktNCBvdmVyZmxvdy1oaWRkZW5cIj5cclxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRWaWV3TW9kZSgnZ2FsbGVyeScpfSBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzQwIGhvdmVyOnRleHQtd2hpdGUgdXBwZXJjYXNlIHRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdHJhY2tpbmctd2lkZXN0IG1iLTIgc2VsZi1zdGFydCBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtMSBweC0yXCI+XHJcbiAgICAgICAgICAgICAgICA8THVjaWRlQ2hldnJvbkxlZnQgc2l6ZT17MTZ9IC8+IHtzZWxlY3RlZExhbmcudWkucmV0dXJuR2FsbGVyeX1cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBzcGFjZS15LTQgb3ZlcmZsb3cteS1hdXRvIG5vLXNjcm9sbGJhciBmbGV4LTEgcGItMTAgcHgtMiBsZzpweC00XCI+XHJcbiAgICAgICAgICAgICAgICA8R2xhc3NDYXJkIGNsYXNzTmFtZT1cInB5LTQgcHgtNiBib3JkZXItd2hpdGUvMTAgc2hhZG93LTJ4bFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LVsxMHB4XSBmb250LWJsYWNrIHRleHQtd2hpdGUvNTAgdXBwZXJjYXNlIHRyYWNraW5nLVswLjJlbV0gZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgYm9yZGVyLWIgYm9yZGVyLXdoaXRlLzUgcGItM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8THVjaWRlSW5mbyBzaXplPXsxNH0gLz4ge3NlbGVjdGVkTGFuZy51aS5hdXRoVGl0bGV9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICB7IWlzQXV0aGVudGljYXRlZCA/IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRJc0F1dGhlbnRpY2F0ZWQodHJ1ZSl9IGNsYXNzTmFtZT1cInctZnVsbCBtdC0zIHB5LTMgYmctd2hpdGUvNSB0ZXh0LXdoaXRlLzgwIHRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIGJvcmRlciBib3JkZXItd2hpdGUvMTAgaG92ZXI6Ymctd2hpdGUvMTAgaG92ZXI6dGV4dC13aGl0ZSB0cmFuc2l0aW9uLWFsbCBiYWNrZHJvcC1ibHVyLW1kIGFjdGl2ZTpzY2FsZS05NVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NlbGVjdGVkTGFuZy51aS5hdXRoQnRufVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0yIHRleHQtd2hpdGUvODAgZm9udC1ibGFjayBiZy13aGl0ZS81IHAtMyBtdC0zIGJvcmRlciBib3JkZXItd2hpdGUvMTAgdXBwZXJjYXNlIHRleHQtWzEwcHhdIGJhY2tkcm9wLWJsdXItbWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMdWNpZGVDaGVja0NpcmNsZSBzaXplPXsxNn0gY2xhc3NOYW1lPVwidGV4dC1ncmVlbi01MDAvODBcIiAvPiB7c2VsZWN0ZWRMYW5nLnVpLmF1dGhEb25lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9HbGFzc0NhcmQ+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cclxuICAgICAgICAgICAgICAgICAgICB7UFJPSkVDVFMubWFwKChwcm9qKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPSBwcmV2aWV3SWQgPT09IHByb2ouaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5hY3RpdmUgPSBwcmV2aWV3SWQgJiYgIWlzU2VsZWN0ZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bW90aW9uLmRpdiBrZXk9e3Byb2ouaWR9IGxheW91dCBjbGFzc05hbWU9e2Ake2lzSW5hY3RpdmUgPyAnb3BhY2l0eS0yMCBncmF5c2NhbGUgcG9pbnRlci1ldmVudHMtbm9uZScgOiAnJ31gfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8R2xhc3NDYXJkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+ICFpc0luYWN0aXZlICYmIGlzQXV0aGVudGljYXRlZCAmJiBoYW5kbGVQcmV2aWV3Vm90ZShwcm9qLmlkKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgY3Vyc29yLXBvaW50ZXIgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNTAwIG92ZXJmbG93LWhpZGRlbiBib3JkZXIgcC0wICR7aXNTZWxlY3RlZCA/ICdib3JkZXItd2hpdGUvMzAgYmctd2hpdGUvNSBzaGFkb3ctWzBfMF8zMHB4X3JnYmEoMjU1LDI1NSwyNTUsMC4wNSldJyA6ICdib3JkZXItd2hpdGUvNSBvcGFjaXR5LTgwIGhvdmVyOmJvcmRlci13aGl0ZS8yMCBob3ZlcjpiZy13aGl0ZS81J31gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2B0ZXh0LVs5cHhdIGZvbnQtbW9ubyBtYi0xIGJsb2NrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgJHtpc1NlbGVjdGVkID8gJ3RleHQtd2hpdGUvNzAnIDogJ3RleHQtd2hpdGUvMzAnfWB9PkNhc2UgIzB7cHJvai5pZH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT17YHRleHQtYmFzZSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgJHtpc1NlbGVjdGVkID8gJ3RleHQtd2hpdGUnIDogJ3RleHQtd2hpdGUvNjAnfWB9Pntwcm9qLnRpdGxlfTwvaDQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc1NlbGVjdGVkICYmIDxMdWNpZGVTcGFya2xlcyBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzgwIGFuaW1hdGUtcHVsc2VcIiBzaXplPXsxOH0gLz59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzU2VsZWN0ZWQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxtb3Rpb24uZGl2IGluaXRpYWw9e3sgaGVpZ2h0OiAwLCBvcGFjaXR5OiAwIH19IGFuaW1hdGU9e3sgaGVpZ2h0OiAnYXV0bycsIG9wYWNpdHk6IDEgfX0gZXhpdD17eyBoZWlnaHQ6IDAsIG9wYWNpdHk6IDAgfX0gY2xhc3NOYW1lPVwicC01IHB0LTAgYm9yZGVyLXQgYm9yZGVyLXdoaXRlLzUgYmctYmxhY2svNDAgYmFja2Ryb3AtYmx1ci1tZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTUgcC00IGJnLXdoaXRlLzUgYm9yZGVyIGJvcmRlci13aGl0ZS8xMCByb3VuZGVkLXNtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzgwIHRleHQtWzExcHhdIGl0YWxpYyBsZWFkaW5nLXJlbGF4ZWQgdGV4dC1jZW50ZXIgZm9udC1zZXJpZlwiPlwie29yYWNsZU1lc3NhZ2UgfHwgc2VsZWN0ZWRMYW5nLnVpLmNvbnN1bHRpbmd9XCI8L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgc2V0U3RlcCgndHJhaWxlcicpOyBzZXRUb2RvcyhwID0+ICh7IC4uLnAsIHZvdGVkOiB0cnVlIH0pKTsgfX0gY2xhc3NOYW1lPVwidy1mdWxsIHB5LTQgYmctd2hpdGUvMTAgdGV4dC13aGl0ZSBmb250LWJsYWNrIHVwcGVyY2FzZSB0ZXh0LVsxMXB4XSB0cmFja2luZy1bMC4zZW1dIGhvdmVyOmJnLXdoaXRlLzIwIGFjdGl2ZTpzY2FsZS05NSB0cmFuc2l0aW9uLWFsbCBib3JkZXIgYm9yZGVyLXdoaXRlLzIwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRMYW5nLnVpLnNlYWxCdG59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvR2xhc3NDYXJkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCBUcmFpbGVyVmlldyA9ICh7IHNlbGVjdGVkTGFuZywgcmVzZXRTdGF0ZXMsIHNldFN0ZXAgfSkgPT4gKFxyXG4gICAgICAgIDxHbGFzc0NhcmQgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgdy1mdWxsIG1heC13LXNtIG14LWF1dG8gcC0xMCBzaGFkb3ctMnhsIHJlbGF0aXZlIG92ZXJmbG93LWhpZGRlbiBmbGV4IGZsZXgtY29sIGl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0wIGxlZnQtMCB3LWZ1bGwgaC1bMXB4XSBiZy1ncmFkaWVudC10by1yIGZyb20tdHJhbnNwYXJlbnQgdmlhLXdoaXRlLzUwIHRvLXRyYW5zcGFyZW50XCIgLz5cclxuICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgc2NhbGU6IFsxLCAxLjA1LCAxXSB9fVxyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogNCwgcmVwZWF0OiBJbmZpbml0eSwgZWFzZTogXCJlYXNlSW5PdXRcIiB9fVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWItOFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0yMCBoLTIwIG14LWF1dG8gcm91bmRlZC1mdWxsIGJnLXdoaXRlLzUgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYm9yZGVyIGJvcmRlci13aGl0ZS8yMCBzaGFkb3ctWzBfMF80MHB4X3JnYmEoMjU1LDI1NSwyNTUsMC4xKV0gYmFja2Ryb3AtYmx1ci1tZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxMdWNpZGVMb2NrIGNsYXNzTmFtZT1cInctOCBoLTggdGV4dC13aGl0ZS84MFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9tb3Rpb24uZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTQgbWItMTAgdy1mdWxsXCI+XHJcbiAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzAuNGVtXSB0ZXh0LXdoaXRlIGxlYWRpbmctdGlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRMYW5nLnVpLmZhdGVTZWFsZWR9XHJcbiAgICAgICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEyIGgtWzFweF0gYmctd2hpdGUvMjAgbXgtYXV0b1wiIC8+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzUwIGl0YWxpYyB0ZXh0LVsxMXB4XSBsZWFkaW5nLXJlbGF4ZWQgZm9udC1zZXJpZiB0cmFja2luZy13aWRlc3QgdXBwZXJjYXNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgVGhlIG5ldHdvcmsgc2xlZXBzLlxyXG4gICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0U3RlcCgnbGFuZ3VhZ2UnKTsgcmVzZXRTdGF0ZXMoKTsgfX1cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBweS00IGJnLXdoaXRlLzUgdGV4dC13aGl0ZS84MCBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy1bMC4zZW1dIHRleHQtWzEwcHhdIGJvcmRlciBib3JkZXItd2hpdGUvMTAgaG92ZXI6Ymctd2hpdGUvMTAgaG92ZXI6dGV4dC13aGl0ZSBhY3RpdmU6c2NhbGUtOTUgdHJhbnNpdGlvbi1hbGxcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7c2VsZWN0ZWRMYW5nLnVpLnJldHVybkdhbGxlcnl9XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvR2xhc3NDYXJkPlxyXG4gICAgKTtcclxuXHJcbiAgICBjb25zdCB1c2VTcGlyaXRTZW5zZSA9IGFzeW5jICgpID0+IHtcclxuICAgICAgICBpZiAoIWFwaUtleSB8fCBpc1NwaXJpdFNlbnNpbmcpIHJldHVybjtcclxuICAgICAgICBzZXRJc1NwaXJpdFNlbnNpbmcodHJ1ZSk7XHJcbiAgICAgICAgcGxheVNmeCgnY2xpY2snKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9tcHQgPSBgWW91IGFyZSB0aGUgSG91c2UgU3Bpcml0IG9mIHRoZSBMb3JkIE1hbm9yLiBHaXZlIGEgdmVyeSBzaG9ydCwgY3J5cHRpYywgc3RlYW1wdW5rLXN0eWxlIGhpbnQgYWJvdXQgd2hhdCB0aGUgZ3Vlc3Qgc2hvdWxkIGRvIG5leHQuIEN1cnJlbnQgc3RlcDogJHtzdGVwfSwgVmlldzogJHt2aWV3TW9kZX0uIE91dHB1dCBpbiAke3NlbGVjdGVkTGFuZy5uYW1lfS4gTWF4IDE1IHdvcmRzLmA7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNhbGxHZW1pbmkoeyBjb250ZW50czogW3sgcGFydHM6IFt7IHRleHQ6IHByb21wdCB9XSB9XSB9KTtcclxuICAgICAgICAgICAgc2V0U3Bpcml0SGludChyZXN1bHQuY2FuZGlkYXRlcz8uWzBdPy5jb250ZW50Py5wYXJ0cz8uWzBdPy50ZXh0IHx8IFwiLi4uXCIpO1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHNldFNwaXJpdEhpbnQoXCJcIiksIDUwMDApO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikgeyBjb25zb2xlLmVycm9yKGVycik7IH1cclxuICAgICAgICBmaW5hbGx5IHsgc2V0SXNTcGlyaXRTZW5zaW5nKGZhbHNlKTsgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBbVjE5XSBEdXBsaWNhdGUgaW1wbGVtZW50YXRpb25zIHJlbW92ZWQgYW5kIGNvbnNvbGlkYXRlZCBhYm92ZS5cclxuICAgIC8vIFRoZSBwcmV2aW91cyBibG9jayB3YXMgZXJyb25lb3VzbHkgZHVwbGljYXRlZCBkdXJpbmcgdGhlIFYxOSByZWZhY3Rvci5cclxuICAgIC8vIEZ1bmN0aW9ucyBoYW5kbGVMYW5ndWFnZVNlbGVjdCBhbmQgY29uZmlybUxhbmd1YWdlIGFyZSBub3cgdW5pcXVlbHkgZGVmaW5lZCBhdCBMMTAzOC5cclxuXHJcbiAgICBjb25zdCByZXNldFN0YXRlcyA9ICgpID0+IHtcclxuICAgICAgICBzZXRQcmV2aWV3SWQobnVsbCk7XHJcbiAgICAgICAgc2V0T3JhY2xlTWVzc2FnZShcIlwiKTtcclxuICAgICAgICBzZXRUb2Rvcyh7IGF2YXRhcjogZmFsc2UsIGhvbWU6IGZhbHNlLCB2b3RlZDogZmFsc2UgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRUaGVtZSA9IFRIRU1FX0NPTkZJR1tzZWxlY3RlZExhbmc/LmlkXSB8fCBUSEVNRV9DT05GSUcua287XHJcblxyXG4gICAgLy8gW1YxOV0gRWZmZWN0IHRvIGhhbmRsZSBUVFMgZm9yIGxhdGVyIHN0ZXBzXHJcbiAgICAvLyBWMjA6IEZpeCBkZWZhdWx0IGxhbmd1YWdlIGxvZ2ljICYgZmlyc3Qgdm9pY2UgdHJpZ2dlclxyXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgICAgICBpZiAoaXNPcGVuaW5nRmluaXNoZWQgJiYgc3RlcCA9PT0gJ2xhbmd1YWdlJykge1xyXG4gICAgICAgICAgICAvLyBbVjIyXSAtIFJlbW92ZWQgZHVwbGljYXRlIEVuZ2xpc2ggcGxheU1pbmEgdHJpZ2dlclxyXG4gICAgICAgICAgICAvLyBBdWRpb01hbmFnZXIucGxheU1pbmEoJ2VuJywgJ2xhbmd1YWdlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSwgW2lzT3BlbmluZ0ZpbmlzaGVkXSk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFRvdGFsQ2xpY2tzKHByZXYgPT4gcHJldiArIDEpfVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9e2ByZWxhdGl2ZSB3LWZ1bGwgaC1zY3JlZW4gJHtjdXJyZW50VGhlbWUuYmd9ICR7Y3VycmVudFRoZW1lLnRleHR9ICR7Y3VycmVudFRoZW1lLmZvbnR9IG92ZXJmbG93LWhpZGRlbiB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0xMDAwYH1cclxuICAgICAgICA+XHJcblxyXG4gICAgICAgICAgICB7LyogW1YxMl0gQ2luZW1hdGljIFZpZGVvIEJhY2tncm91bmQgKi99XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgaW5zZXQtMCB3LWZ1bGwgaC1mdWxsIHotMCBvdmVyZmxvdy1oaWRkZW5cIj5cclxuICAgICAgICAgICAgICAgIDx2aWRlb1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dG9QbGF5XHJcbiAgICAgICAgICAgICAgICAgICAgbG9vcFxyXG4gICAgICAgICAgICAgICAgICAgIG11dGVkXHJcbiAgICAgICAgICAgICAgICAgICAgcGxheXNJbmxpbmVcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBtaW4tdy1mdWxsIG1pbi1oLWZ1bGwgb2JqZWN0LWNvdmVyIG9wYWNpdHktNTAgbWl4LWJsZW5kLXNjcmVlbiBzY2FsZS0xMDVcIlxyXG4gICAgICAgICAgICAgICAgICAgIHNyYz1cImh0dHBzOi8vYXNzZXRzLmNvZGVwZW4uaW8vMzM2NDE0My83YnRycmQubXA0XCJcclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICB7LyogRGFyayBDaW5lbWF0aWMgR3JhZGllbnQgJiBCbHVyIE92ZXJsYXkgKi99XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgYmctZ3JhZGllbnQtdG8tdCBmcm9tLWJsYWNrIHZpYS1ibGFjay84MCB0by1ibGFjay80MCBiYWNrZHJvcC1ibHVyLVsycHhdXCIgLz5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8QW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgeyFpc09wZW5pbmdGaW5pc2hlZCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB6LVsxMDAwMF1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENpbmVtYXRpY09wZW5pbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU3RhcnQ9eygpID0+IEF1ZGlvTWFuYWdlci5wbGF5TWFpblRoZW1lKDEuMCwgNDAwMCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlPXsoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXVkaW9NYW5hZ2VyLmZhZGVNYWluVGhlbWUoMC42LCAzMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRJc09wZW5pbmdGaW5pc2hlZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cclxuXHJcbiAgICAgICAgICAgIHtpc09wZW5pbmdGaW5pc2hlZCAmJiAoXHJcbiAgICAgICAgICAgICAgICA8PlxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBBUEkgU3RhdHVzIEJhbm5lciAqL31cclxuICAgICAgICAgICAgICAgICAgICB7IWFwaUtleSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgdG9wLTAgbGVmdC0wIHctZnVsbCB6LVsxMDAwXSBiZy1bIzVDMUExQV0gdGV4dC1bI2Y0ZTRiY10gcHktMiBweC00IHNoYWRvdy14bCBib3JkZXItYiBib3JkZXItWyNDNUEwNTldIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGdhcC0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8THVjaWRlWmFwIHNpemU9ezE2fSBjbGFzc05hbWU9XCJ0ZXh0LVsjQzVBMDU5XSBhbmltYXRlLXB1bHNlXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjJlbV1cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMaW5raW5nIHRvIEFldGhlci4uLiBTZXQgVklURV9HRU1JTklfQVBJX0tFWVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8QWV0aGVyV2hpc3BlcnMgdGV4dD17d2hpc3Blcn0gdGhlbWU9e2N1cnJlbnRUaGVtZX0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgey8qIE1haW4gQ29udGVudCBBcmVhOiBWOSBGb2N1cy1GaXhlZCBMYXlvdXQgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwicmVsYXRpdmUgei0xMCB3LWZ1bGwgaC1zY3JlZW4gZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgb3ZlcmZsb3ctaGlkZGVuIHB4LTRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEFuaW1hdGVQcmVzZW5jZSBtb2RlPVwid2FpdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG1vdGlvbi5kaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3N0ZXAgKyAoc2VsZWN0ZWRMYW5nPy5pZCB8fCAnJyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbD17eyBvcGFjaXR5OiAwLCBzY2FsZTogMC45OCB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgc2NhbGU6IDEgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGl0PXt7IG9wYWNpdHk6IDAsIHNjYWxlOiAxLjAyIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbj17eyBkdXJhdGlvbjogMC44LCBlYXNlOiBcImVhc2VJbk91dFwiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgdy1mdWxsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7KHN0ZXAgPT09ICdsYW5ndWFnZScgfHwgc3RlcCA9PT0gJ2NvbmZpcm0nKSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMYW5ndWFnZVZpZXdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIExBTkdVQUdFUz17TEFOR1VBR0VTfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTGFuZ3VhZ2VTZWxlY3Q9e2hhbmRsZUxhbmd1YWdlU2VsZWN0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U3Bpcml0SGludD17c2V0U3Bpcml0SGludH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhcmRzRXhwbG9yZWQ9e2NhcmRzRXhwbG9yZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRDYXJkc0V4cGxvcmVkPXtzZXRDYXJkc0V4cGxvcmVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNNaW5hU3BlYWtpbmc9e2lzTWluYVNwZWFraW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3N0ZXAgPT09ICdjb25maXJtJyAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb25maXJtVmlldyBzZWxlY3RlZExhbmc9e3NlbGVjdGVkTGFuZ30gY29uZmlybUxhbmd1YWdlPXtjb25maXJtTGFuZ3VhZ2V9IHRoZW1lPXtjdXJyZW50VGhlbWV9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dmlld01vZGUgPT09ICdjb21pbmdfc29vbicgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29taW5nU29vblZpZXdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkTGFuZz17c2VsZWN0ZWRMYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFRoZW1lPXtjdXJyZW50VGhlbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRWaWV3TW9kZT17c2V0Vmlld01vZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTdGVwPXtzZXRTdGVwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0cmljcz17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsQ2xpY2tzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXF1ZUNhcmRzOiBjYXJkc0V4cGxvcmVkLnNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZVNwZW50TXM6IERhdGUubm93KCkgLSBhcHBTdGFydFRpbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogTW9yZSBzdGVwcyB3b3VsZCBmb2xsb3csIHJlZmFjdG9yZWQgdG8gdXNlIGN1cnJlbnRUaGVtZSBjbGFzc2VzICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtzdGVwID09PSAnaW50cm8nICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEludHJvVmlld1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRMYW5nPXtzZWxlY3RlZExhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyTmFtZT17dXNlck5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRVc2VyTmFtZT17c2V0VXNlck5hbWV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZW5lcmF0ZVRleHRDaGFyYWN0ZXI9e2dlbmVyYXRlVGV4dENoYXJhY3Rlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzQXZhdGFyR2VuZXJhdGluZz17aXNBdmF0YXJHZW5lcmF0aW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlSW1hZ2VVcGxvYWQ9e2hhbmRsZUltYWdlVXBsb2FkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBsb2FkZWRJbWFnZT17dXBsb2FkZWRJbWFnZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlbmVyYXRlQ2hhcmFjdGVyPXtnZW5lcmF0ZUNoYXJhY3Rlcn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXlTZng9e3BsYXlTZnh9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3RlcCA9PT0gJ2Rhc2hib2FyZCcgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctZnVsbCBoLWZ1bGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2aWV3TW9kZSA9PT0gJ2dhbGxlcnknICYmIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8R2FsbGVyeVZpZXdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRMYW5nPXtzZWxlY3RlZExhbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJBdmF0YXI9e3VzZXJBdmF0YXJ9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFZpZXdNb2RlPXtzZXRWaWV3TW9kZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG9kb3M9e3NldFRvZG9zfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b2Rvcz17dG9kb3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXlTZng9e3BsYXlTZnh9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dmlld01vZGUgPT09ICdob21lX2ludGVyaW9yJyAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1hbm9yVmlld1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZExhbmc9e3NlbGVjdGVkTGFuZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Vmlld01vZGU9e3NldFZpZXdNb2RlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyQXZhdGFyPXt1c2VyQXZhdGFyfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5kbGVMaXQ9e2NhbmRsZUxpdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q2FuZGxlTGl0PXtzZXRDYW5kbGVMaXR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdlYXJzU3Bpbm5pbmc9e2dlYXJzU3Bpbm5pbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEdlYXJzU3Bpbm5pbmc9e3NldEdlYXJzU3Bpbm5pbmd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvcmVUZXh0PXtsb3JlVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGxheVNmeD17cGxheVNmeH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt2aWV3TW9kZSA9PT0gJ21pc3Npb25fYWN0aXZlJyAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1pc3Npb25WaWV3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkTGFuZz17c2VsZWN0ZWRMYW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRWaWV3TW9kZT17c2V0Vmlld01vZGV9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBST0pFQ1RTPXtQUk9KRUNUU31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlld0lkPXtwcmV2aWV3SWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZVByZXZpZXdWb3RlPXtoYW5kbGVQcmV2aWV3Vm90ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNBdXRoZW50aWNhdGVkPXtpc0F1dGhlbnRpY2F0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldElzQXV0aGVudGljYXRlZD17c2V0SXNBdXRoZW50aWNhdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmFjbGVNZXNzYWdlPXtvcmFjbGVNZXNzYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTdGVwPXtzZXRTdGVwfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUb2Rvcz17c2V0VG9kb3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYXlTZng9e3BsYXlTZnh9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3N0ZXAgPT09ICd0cmFpbGVyJyAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUcmFpbGVyVmlldyBzZWxlY3RlZExhbmc9e3NlbGVjdGVkTGFuZ30gcmVzZXRTdGF0ZXM9e3Jlc2V0U3RhdGVzfSBzZXRTdGVwPXtzZXRTdGVwfSBwbGF5U2Z4PXtwbGF5U2Z4fSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L21vdGlvbi5kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbWFpbj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgey8qIFtWMjVdIE1pbmEncyBEaXJlY3RpdmUgZ2xvYmFsIGd1aWRhbmNlIChQb3N0LUxhbmd1YWdlIHNlbGVjdGlvbikgKi99XHJcbiAgICAgICAgICAgICAgICAgICAge3N0ZXAgIT09ICdsYW5ndWFnZScgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TWluYURpcmVjdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNWaXNpYmxlPXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlU3RlcD17c3RlcH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ9e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAgPT09ICdjb25maXJtJyA/IHNlbGVjdGVkTGFuZy51aS5kaXJlY3RpdmVDb25maXJtIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIXRvZG9zLmF2YXRhciA/IHNlbGVjdGVkTGFuZy51aS5kaXJlY3RpdmVBdXRoIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICF0b2Rvcy5ob21lID8gc2VsZWN0ZWRMYW5nLnVpLmRpcmVjdGl2ZUF2YXRhciA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRMYW5nLnVpLmRpcmVjdGl2ZURhc2hib2FyZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb249XCJ0b3BcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJhY3Rpb25Nb2RlPVwiYWN0aW9uXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzU3BlYWtpbmc9e2lzTWluYVNwZWFraW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiBTdGF0dXMgV2lkZ2V0czogSW50ZWdyYXRlZCBBc3Npc3RhbnQgT25seSAqL31cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIGJvdHRvbS04IGxlZnQtOCB6LVsxMDBdIGZsZXggZmxleC1jb2wgZ2FwLTQgaXRlbXMtc3RhcnQgcG9pbnRlci1ldmVudHMtbm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3NwaXJpdEhpbnQgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxtb3Rpb24uZGl2XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWw9e3sgb3BhY2l0eTogMCwgeDogLTIwLCBzY2FsZTogMC44IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGU9e3sgb3BhY2l0eTogMSwgeDogMCwgc2NhbGU6IDEgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpdD17eyBvcGFjaXR5OiAwLCBzY2FsZTogMC44IH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJnLXdoaXRlLzUgYmFja2Ryb3AtYmx1ci0yeGwgdGV4dC13aGl0ZS85MCBwLTUgYm9yZGVyIGJvcmRlci13aGl0ZS8xMCBzaGFkb3ctMnhsIG1heC13LVsyODBweF0gdGV4dC1bMTFweF0gZm9udC1tZWRpdW0gdHJhY2tpbmctd2lkZSBsZWFkaW5nLXJlbGF4ZWQgcmVsYXRpdmUgZmxleCBmbGV4LWNvbCBnYXAtMyByb3VuZGVkLXhsXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xLjUgaC0xLjUgcm91bmRlZC1mdWxsIGJnLXdoaXRlLzQwIGFuaW1hdGUtcHVsc2VcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LVs4cHhdIHRleHQtd2hpdGUvMzAgdHJhY2tpbmctWzAuNGVtXSBmb250LWJsYWNrIHVwcGVyY2FzZVwiPk1hbm9yIEludGVsbGlnZW5jZTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpdGFsaWMgb3BhY2l0eS04MCBmb250LXNlcmlmIHRleHQtWzEzcHhdXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIntzcGlyaXRIaW50fVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQW5pbWF0ZVByZXNlbmNlPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDwvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFwcDtcclxuIl0sImZpbGUiOiJDOi9Vc2Vycy9TZWFuIFBhcmsvRGVza3RvcC9zZWFuX2Zsb3dzL2p1c3Quc2Vhbi5mbG93cy5naXQvanVzdC5zZWFuLmZsb3dzL3ByZWx1ZGUuanN4In0=
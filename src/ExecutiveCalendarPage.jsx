import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Check, ChevronRight, ChevronLeft, 
    Sparkles, AlertCircle, ArrowRight, ShieldCheck,
    Calendar as CalendarIcon, DollarSign, Euro, Plus, X, RotateCcw,
    CreditCard, Clock, BookOpen, Volume2, VolumeX, Trophy,
    Maximize2, Compass, ArrowDown, Eye, Layers, ZoomIn, ZoomOut,
    Flame, Target, Play, FastForward, CheckCircle2, Zap, Moon,
    SlidersHorizontal, ChevronDown, ChevronUp
} from 'lucide-react';

// Web Audio API FX Engine
const playHapticSound = (type = 'quest') => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'quest') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'layer') {
            // Deep spatial layer whoosh
            osc.type = 'sine';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(360, now + 0.14);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.start(now);
            osc.stop(now + 0.18);
        } else if (type === 'clear') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(432, now);
            osc.frequency.exponentialRampToValueAtTime(864, now + 0.1);
            gain.gain.setValueAtTime(0.22, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === 'flip') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(560, now + 0.06);
            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.start(now);
            osc.stop(now + 0.06);
        }
    } catch (e) {}
};

// 100% Real Fact Dataset categorized into 3-Tier Priority
const INITIAL_SCHEDULE = [
    // 1. [PRIORITY: CRITICAL 🔥]
    { 
        id: '6', 
        priority: 'critical', 
        priorityLabel: '🔥 중요 제출/마일스톤',
        vol: 'VOL. 01',
        title: '법인 자본금 납입 (Stammkapital)', 
        cat: 'Biz', 
        cost: 1000, 
        curr: '€', 
        day: 12, 
        method: 'Commerzbank i.G.',
        badge: '자본금 €1,000.00 납입 기한', 
        guide: 'JSF Collective UG (i.G.) 법인 계좌로 자본금 납입 및 Notar 송금확인서 제출 필수.',
        accent: '#FF3366',
        icon: '💼',
        status: 'urgent' 
    },
    { 
        id: '17', 
        priority: 'critical', 
        priorityLabel: '🔥 중요 제출/마일스톤',
        vol: 'VOL. 02',
        title: 'DECHEMA 스튜디오 입주 계약', 
        cat: 'Biz', 
        cost: 483.14, 
        curr: '€', 
        day: 31, 
        month: '10월 1일',
        method: 'DECHEMA e.V.',
        badge: 'IU22 (19.10㎡) 입주 체결', 
        guide: '관리비/VAT 포함 월 €483.14 (Kaution 보증금 3개월분 약 €825 정산). 서명 진행 중.',
        accent: '#FF5500',
        icon: '🎻',
        status: 'urgent' 
    },
    { 
        id: '10', 
        priority: 'critical', 
        priorityLabel: '🔥 중요 제출/마일스톤',
        vol: 'VOL. 03',
        title: '상업등기소 등록 (Amtsgericht)', 
        cat: 'Biz', 
        cost: 200, 
        curr: '€', 
        day: 16, 
        method: 'Amtsgericht 프랑크푸르트',
        badge: '9월 중순 HRB 번호 영수 기한', 
        guide: '자본금 증명서 제출 후 Amtsgericht 전자 등기 완료 및 HRB 번호 교부.',
        accent: '#00E5FF',
        icon: '📜',
        status: 'urgent' 
    },
    { 
        id: '16', 
        priority: 'critical', 
        priorityLabel: '🔥 중요 제출/마일스톤',
        vol: 'VOL. 04',
        title: '영업 신고 (Gewerbeanmeldung)', 
        cat: 'Biz', 
        cost: 45, 
        curr: '€', 
        day: 29, 
        method: 'Gewerbeamt 현장',
        badge: '9월 말 HRB 지참 방문', 
        guide: 'HRB 등기번호를 지참하여 프랑크푸르트 영업소에 IT/음악 사업 신고.',
        accent: '#C084FC',
        icon: '🏢',
        status: 'pending' 
    },
    { 
        id: '5', 
        priority: 'critical', 
        priorityLabel: '🔥 중요 제출/마일스톤',
        vol: 'VOL. 05',
        title: 'JSF Collective UG 공증 서명', 
        cat: 'Biz', 
        cost: 450, 
        curr: '€', 
        day: 11, 
        method: 'Notar Dr. Lachner',
        badge: 'Urkunde Nr. 495 / 2026', 
        guide: '2026-08-11 Notar 공증인 서명 체결 완료! Musterprotokoll 공증서 발행.',
        accent: '#D4AF37',
        icon: '🏛️',
        status: 'done' 
    },

    // 2. [PRIORITY: RECURRING ⚡]
    { 
        id: '3', 
        priority: 'recurring', 
        priorityLabel: '⚡ AI 구독 & 테크',
        vol: 'VOL. 06',
        title: 'Suno AI v4.5 Pro', 
        cat: 'AI', 
        cost: 30, 
        curr: '$', 
        day: 5, 
        method: 'Visa Corporate',
        badge: '2,500 음원 크레딧 갱신', 
        guide: 'v4.5 Music Pro Plan 크레딧 충전 및 사운드트랙 작곡 파이프라인 가동.',
        accent: '#A855F7',
        icon: '🎵',
        status: 'done' 
    },
    { 
        id: '4', 
        priority: 'recurring', 
        priorityLabel: '⚡ AI 구독 & 테크',
        vol: 'VOL. 07',
        title: 'Cursor Pro (Anysphere)', 
        cat: 'AI', 
        cost: 20, 
        curr: '$', 
        day: 8, 
        method: 'MasterCard',
        badge: 'Claude 3.7 Coding Agent', 
        guide: '안티그래비티 코딩 에이전트 인프라가 매월 8일 갱신됩니다.',
        accent: '#EAB308',
        icon: '⚡',
        status: 'done' 
    },
    { 
        id: '7', 
        priority: 'recurring', 
        priorityLabel: '⚡ AI 구독 & 테크',
        vol: 'VOL. 08',
        title: 'Google AI Pro (Gemini)', 
        cat: 'AI', 
        cost: 20, 
        curr: '$', 
        day: 12, 
        method: 'Google One Pay',
        badge: 'Gemini Notebook 2M', 
        guide: 'Google Workspace 및 AI Studio Ultra 한도가 갱신됩니다.',
        accent: '#00E5FF',
        icon: '🧠',
        status: 'active' 
    },
    { 
        id: '14', 
        priority: 'recurring', 
        priorityLabel: '⚡ AI 구독 & 테크',
        vol: 'VOL. 09',
        title: 'ElevenLabs Starter Voice', 
        cat: 'AI', 
        cost: 5.95, 
        curr: '$', 
        day: 26, 
        method: 'Mastercard (0489)',
        badge: '인보이스 JF0ETJ7W-0009', 
        guide: '영수증 2257-1755-9314 정상 결제 확인 (매월 26일 결제).',
        accent: '#EC4899',
        icon: '🎙️',
        status: 'done' 
    },
    { 
        id: '13', 
        priority: 'recurring', 
        priorityLabel: '⚡ AI 구독 & 테크',
        vol: 'VOL. 10',
        title: 'Amazon Prime & AWS', 
        cat: 'AI', 
        cost: 15, 
        curr: '$', 
        day: 24, 
        method: 'Amazon 1-Click',
        badge: 'Cloud & Prime', 
        guide: '아마존 프라임 비디오 및 클라우드 스토리지가 갱신됩니다.',
        accent: '#F59E0B',
        icon: '📦',
        status: 'active' 
    },
    { 
        id: '15', 
        priority: 'recurring', 
        priorityLabel: '⚡ AI 구독 & 테크',
        vol: 'VOL. 11',
        title: 'Vercel Edge & Domain', 
        cat: 'AI', 
        cost: 20, 
        curr: '$', 
        day: 28, 
        method: 'GitHub Pro Stripe',
        badge: 'justseanflows.com', 
        guide: '글로벌 엣지 서버 호스팅 및 도메인 유지비 결제입니다.',
        accent: '#F3F4F6',
        icon: '▲',
        status: 'active' 
    },

    // 3. [PRIORITY: AUTO SEPA 💤]
    { 
        id: '1', 
        priority: 'auto', 
        priorityLabel: '💤 자동이체 (저우선)',
        vol: 'VOL. 12',
        title: '집 월세 (Warmmiete)', 
        cat: 'Living', 
        cost: 1250, 
        curr: '€', 
        day: 1, 
        method: 'SEPA 자동이체',
        badge: '자동 출금 기록', 
        guide: '집주인 계좌로 SEPA 자동이체 출금 처리됩니다.',
        accent: '#64748B',
        icon: '🏠',
        status: 'done' 
    },
    { 
        id: '2', 
        priority: 'auto', 
        priorityLabel: '💤 자동이체 (저우선)',
        vol: 'VOL. 13',
        title: 'Mainova 전기/수도세', 
        cat: 'Living', 
        cost: 85, 
        curr: '€', 
        day: 1, 
        method: 'Mainova SEPA',
        badge: '자동 출금 기록', 
        guide: '전력청 고정 전기세 월정액 SEPA 자동 출금입니다.',
        accent: '#64748B',
        icon: '⚡',
        status: 'done' 
    },
    { 
        id: '8', 
        priority: 'auto', 
        priorityLabel: '💤 자동이체 (저우선)',
        vol: 'VOL. 14',
        title: 'GEZ 독일 방송수신료', 
        cat: 'Living', 
        cost: 55.08, 
        curr: '€', 
        day: 15, 
        method: 'SEPA 분기납',
        badge: '자동 출금 기록', 
        guide: '독일 거주자 필수 방송 수신료 분기별 자동납부입니다.',
        accent: '#64748B',
        icon: '📡',
        status: 'active' 
    },
    { 
        id: '9', 
        priority: 'auto', 
        priorityLabel: '💤 자동이체 (저우선)',
        vol: 'VOL. 15',
        title: '독일 건강보험 (TK)', 
        cat: 'Living', 
        cost: 220, 
        curr: '€', 
        day: 15, 
        method: 'TK Lastschrift',
        badge: '자동 출금 기록', 
        guide: '공보험 자동이체 계좌에서 자동 출금 처리됩니다.',
        accent: '#64748B',
        icon: '🩺',
        status: 'active' 
    },
    { 
        id: '11', 
        priority: 'auto', 
        priorityLabel: '💤 자동이체 (저우선)',
        vol: 'VOL. 16',
        title: 'Telekom 기가 인터넷', 
        cat: 'Living', 
        cost: 45, 
        curr: '€', 
        day: 18, 
        method: 'Telekom SEPA',
        badge: '자동 출금 기록', 
        guide: '초고속 광랜 정기 요금 SEPA 자동 출금입니다.',
        accent: '#64748B',
        icon: '🌐',
        status: 'active' 
    },
    { 
        id: '12', 
        priority: 'auto', 
        priorityLabel: '💤 자동이체 (저우선)',
        vol: 'VOL. 17',
        title: 'Deutschland-Ticket (DB)', 
        cat: 'Living', 
        cost: 63, 
        curr: '€', 
        day: 23, 
        method: 'DB Navigator',
        badge: '자동 출금 기록', 
        guide: '독일 전역 무제한 대중교통 정기권 자동 갱신입니다.',
        accent: '#64748B',
        icon: '🚆',
        status: 'done' 
    }
];

export default function ExecutiveCalendarPage() {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('SEAN_LAYER_SHIFT_CALENDAR_V10');
        return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    });

    // 3D Spatial Layer Mode: 'calendar' (Layer 1: Pure Calendar) | 'control' (Layer 2: Menu Deck)
    const [activeLayer, setActiveLayer] = useState('calendar');

    const [filterPriority, setFilterPriority] = useState('all');
    const [focusedCard, setFocusedCard] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [cameraRotation, setCameraRotation] = useState({ x: 8, y: 0 });
    const isDraggingRef = useRef(false);
    const dragStartRef = useRef({ x: 0, y: 0, rotX: 8, rotY: 0 });

    // Touch gesture for mobile layer switching
    const touchStartRef = useRef(0);

    const today = new Date().getDate();

    useEffect(() => {
        localStorage.setItem('SEAN_LAYER_SHIFT_CALENDAR_V10', JSON.stringify(items));
    }, [items]);

    // Financial totals
    const { totalEur, totalUsd } = useMemo(() => {
        let eur = 0, usd = 0;
        items.forEach(i => {
            if (i.curr === '€') eur += i.cost;
            if (i.curr === '$') usd += i.cost;
        });
        return { 
            totalEur: Math.round(eur).toLocaleString(), 
            totalUsd: Math.round(usd).toLocaleString() 
        };
    }, [items]);

    // Priority Counts
    const criticalPending = useMemo(() => items.filter(it => it.priority === 'critical' && it.status !== 'done'), [items]);
    const recurringPending = useMemo(() => items.filter(it => it.priority === 'recurring' && it.status !== 'done'), [items]);
    const autoPending = useMemo(() => items.filter(it => it.priority === 'auto' && it.status !== 'done'), [items]);

    // Smart Next Quest Target
    const nextQuestCard = useMemo(() => {
        return criticalPending[0] || recurringPending[0] || autoPending[0] || null;
    }, [criticalPending, recurringPending, autoPending]);

    // Layer Switch Function
    const handleSwitchLayer = (layerName) => {
        if (soundEnabled) playHapticSound('layer');
        setActiveLayer(layerName);
    };

    // Scroll Wheel Listener to change 3D Spatial Layer
    const handleWheel = (e) => {
        if (focusedCard) return;
        if (e.deltaY > 35 && activeLayer === 'calendar') {
            handleSwitchLayer('control');
        } else if (e.deltaY < -35 && activeLayer === 'control') {
            handleSwitchLayer('calendar');
        }
    };

    // Touch Swipe Handlers for Mobile
    const handleTouchStart = (e) => {
        touchStartRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (focusedCard) return;
        const deltaY = e.changedTouches[0].clientY - touchStartRef.current;
        if (deltaY < -45 && activeLayer === 'calendar') {
            handleSwitchLayer('control');
        } else if (deltaY > 45 && activeLayer === 'control') {
            handleSwitchLayer('calendar');
        }
    };

    // Toggle Card Done
    const handleToggleDone = (itemToToggle) => {
        const target = itemToToggle || focusedCard;
        if (!target) return;

        if (soundEnabled) playHapticSound('clear');
        const nextStatus = target.status === 'done' ? 'active' : 'done';

        setItems(prev => prev.map(it => it.id === target.id ? { ...it, status: nextStatus } : it));
        
        if (focusedCard && focusedCard.id === target.id) {
            setTimeout(() => {
                setFocusedCard(null);
                setIsFlipped(false);
            }, 380);
        }
    };

    // Mouse drag 3D orbit
    const handleMouseDown = (e) => {
        if (focusedCard) return;
        isDraggingRef.current = true;
        dragStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            rotX: cameraRotation.x,
            rotY: cameraRotation.y
        };
    };

    const handleMouseMove = (e) => {
        if (!isDraggingRef.current || focusedCard) return;
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        const nextRotY = dragStartRef.current.rotY + deltaX * 0.08;
        const nextRotX = Math.max(0, Math.min(25, dragStartRef.current.rotX - deltaY * 0.08));

        setCameraRotation({ x: nextRotX, y: nextRotY });
    };

    const handleMouseUp = () => {
        isDraggingRef.current = false;
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

            if (e.key === 'Escape') {
                setFocusedCard(null);
                setIsFlipped(false);
            } else if (e.code === 'Space' || e.key === 'Enter') {
                e.preventDefault();
                if (focusedCard) {
                    handleToggleDone(focusedCard);
                } else if (nextQuestCard) {
                    if (soundEnabled) playHapticSound('quest');
                    setFocusedCard(nextQuestCard);
                    setIsFlipped(false);
                }
            } else if (e.key === 'f') {
                if (focusedCard) {
                    e.preventDefault();
                    if (soundEnabled) playHapticSound('flip');
                    setIsFlipped(prev => !prev);
                }
            } else if (e.key === 'Tab') {
                e.preventDefault();
                handleSwitchLayer(activeLayer === 'calendar' ? 'control' : 'calendar');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedCard, nextQuestCard, soundEnabled, activeLayer]);

    return (
        <div 
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="w-screen h-screen max-h-screen bg-[#030305] text-[#EDEDED] flex flex-col justify-between select-none font-sans antialiased overflow-hidden relative cursor-grab active:cursor-grabbing"
            style={{ perspective: '2000px' }}
        >
            {/* Cinematic Background Ambient Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    animate={{
                        background: `radial-gradient(circle at 50% 30%, ${
                            activeLayer === 'control' ? '#FF336622' : '#D4AF3714'
                        } 0%, transparent 65%)`
                    }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 opacity-90 blur-[140px]" 
                />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] opacity-35" />
            </div>

            {/* FLOATING TOP STATUS & LAYER QUICK TOGGLE (1레이어에서는 100% 숨김 -> 2레이어에서만 등장) */}
            <motion.header 
                animate={{
                    opacity: activeLayer === 'control' ? 1 : 0,
                    y: activeLayer === 'control' ? 0 : -30,
                    pointerEvents: activeLayer === 'control' ? 'auto' : 'none'
                }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 inset-x-0 z-40 w-full px-5 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-white/[0.04] bg-black/60 backdrop-blur-md"
            >
                <div className="flex items-center gap-3">
                    <span className="font-serif text-sm sm:text-base font-black tracking-[0.2em] text-[#D4AF37] uppercase">
                        SEAN SPATIAL MATRIX
                    </span>
                    <span className="hidden sm:inline font-mono text-[10px] text-neutral-500">
                        2026. 08 FRANKFURT · CONTROL DECK
                    </span>
                </div>

                {/* LAYER TOGGLE PILL */}
                <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/80 backdrop-blur-2xl border border-white/[0.1] shadow-2xl">
                    <button
                        onClick={() => handleSwitchLayer('calendar')}
                        className="px-3 py-1 rounded-full font-mono text-[10px] sm:text-[11px] font-bold text-neutral-400 hover:text-white cursor-pointer"
                    >
                        <CalendarIcon className="w-3 h-3 inline mr-1" />
                        <span>1레이어: 캘린더 메인</span>
                    </button>

                    <button
                        onClick={() => handleSwitchLayer('control')}
                        className="px-3 py-1 rounded-full font-mono text-[10px] sm:text-[11px] font-bold bg-[#FF3366] text-white shadow-[0_0_12px_rgba(255,51,102,0.5)] cursor-pointer"
                    >
                        <SlidersHorizontal className="w-3 h-3 inline mr-1" />
                        <span>2레이어: 컨트롤 덱</span>
                    </button>
                </div>

                {/* Right Sound & Close */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleSwitchLayer('calendar')}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold cursor-pointer flex items-center gap-1"
                    >
                        <span>닫기 [Esc / 휠 위로]</span>
                    </button>
                </div>
            </motion.header>

            {/* 3D MULTI-LAYER STACK (100% 뷰포트 내 완벽 핏 · 스크롤 0%) */}
            <main 
                className="relative z-10 w-full flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden max-h-[calc(100vh-85px)]"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* ========================================================================= */}
                {/* 1. LAYER 1: PURE CALENDAR MATRIX (첫 번째 3D 캘린더 레이어) */}
                {/* ========================================================================= */}
                <motion.div
                    animate={{
                        translateZ: activeLayer === 'calendar' ? 0 : -220,
                        rotateX: activeLayer === 'calendar' ? cameraRotation.x : 20,
                        rotateY: activeLayer === 'calendar' ? cameraRotation.y : 0,
                        scale: activeLayer === 'calendar' ? 1 : 0.88,
                        opacity: activeLayer === 'calendar' ? 1 : 0.25,
                        filter: activeLayer === 'calendar' ? 'blur(0px)' : 'blur(4px)'
                    }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    className="relative w-full max-w-6xl h-full max-h-[580px] sm:max-h-[620px] p-3 sm:p-5 rounded-[36px] bg-black/60 backdrop-blur-3xl border border-white/[0.08] shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex flex-col justify-between"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Layer 1 Minimal Subtle Indicator */}
                    <div className="flex items-center justify-between px-2 font-mono text-[10px] text-neutral-500 pb-1">
                        <div className="flex items-center gap-2 text-[#D4AF37] font-bold tracking-wider">
                            <CalendarIcon className="w-3 h-3" />
                            <span>AUGUST 2026 · FRANKFURT EXECUTIVE MATRIX</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-500 text-[10px]">
                            <span>휠 아래로 / Tab ➔ <b className="text-neutral-400">컨트롤 덱</b></span>
                        </div>
                    </div>

                    {/* 31-DAY SPATIAL TILE GRID (100% 한 화면 핏 완료) */}
                    <div className="w-full flex-1 grid grid-cols-7 gap-1.5 sm:gap-2.5 pt-2" style={{ transformStyle: 'preserve-3d' }}>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day, idx) => {
                            let dayItems = items.filter(it => it.day === day);
                            if (filterPriority !== 'all') {
                                dayItems = dayItems.filter(it => it.priority === filterPriority);
                            }

                            const hasCard = dayItems.length > 0;
                            const isToday = day === today;
                            const hasCritical = dayItems.some(it => it.priority === 'critical' && it.status !== 'done');
                            const isNextTarget = dayItems.some(it => it.id === nextQuestCard?.id);

                            return (
                                <motion.div
                                    key={day}
                                    className={`relative rounded-xl sm:rounded-2xl border transition-all flex flex-col justify-between p-1.5 sm:p-2 ${
                                        isNextTarget
                                            ? 'bg-gradient-to-b from-[#2a121d] to-[#120f18] border-[#FF3366] shadow-[0_0_20px_rgba(255,51,102,0.4)] ring-1 ring-[#FF3366]/70 z-20'
                                            : hasCritical
                                            ? 'bg-[#220d16] border-[#FF3366]/50 shadow-[0_0_15px_rgba(255,51,102,0.25)]'
                                            : isToday 
                                            ? 'bg-blue-500/10 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' 
                                            : hasCard
                                            ? 'bg-[#13121a] border-white/[0.12] hover:border-white/30'
                                            : 'bg-white/[0.015] border-white/[0.04]'
                                    }`}
                                    style={{ transformStyle: 'preserve-3d' }}
                                >
                                    {/* Day Header */}
                                    <div className="flex items-center justify-between font-mono text-[10px] sm:text-xs">
                                        <span className={`font-bold ${
                                            isNextTarget ? 'text-[#FF3366] font-black' : isToday ? 'text-blue-400' : hasCard ? 'text-white' : 'text-neutral-600'
                                        }`}>
                                            {day}
                                        </span>
                                        {isNextTarget ? (
                                            <span className="text-[7px] font-mono px-1 rounded bg-[#FF3366] text-white font-black">
                                                FOCUS
                                            </span>
                                        ) : isToday ? (
                                            <span className="text-[7px] font-mono px-1 rounded bg-blue-500 text-white font-black">
                                                TODAY
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* 3D Standing Card Object */}
                                    {hasCard && (
                                        <div className="flex flex-col gap-0.5 mt-auto" style={{ transformStyle: 'preserve-3d' }}>
                                            {dayItems.map(item => {
                                                const isDone = item.status === 'done';
                                                const isCritical = item.priority === 'critical';
                                                const isRecurring = item.priority === 'recurring';
                                                const isAuto = item.priority === 'auto';

                                                let cardStyle = '';
                                                let zElevation = 8;

                                                if (isDone) {
                                                    cardStyle = 'bg-[#00FF88]/10 border-[#00FF88]/30 opacity-50 hover:opacity-100';
                                                    zElevation = 2;
                                                } else if (isCritical) {
                                                    cardStyle = 'bg-gradient-to-r from-[#300e1a] to-[#1e1017] border-[#FF3366] shadow-[0_0_15px_rgba(255,51,102,0.4)]';
                                                    zElevation = 18;
                                                } else if (isRecurring) {
                                                    cardStyle = 'bg-[#151b28] border-[#00E5FF]/60 shadow-[0_0_10px_rgba(0,229,255,0.2)]';
                                                    zElevation = 10;
                                                } else {
                                                    cardStyle = 'bg-white/[0.03] border-white/[0.08] opacity-60 hover:opacity-100';
                                                    zElevation = 2;
                                                }

                                                return (
                                                    <motion.button
                                                        key={item.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFocusedCard(item);
                                                            setIsFlipped(false);
                                                            if (soundEnabled) playHapticSound('quest');
                                                        }}
                                                        whileHover={{ scale: 1.04, translateZ: zElevation + 6 }}
                                                        whileTap={{ scale: 0.96 }}
                                                        className={`w-full p-1 sm:p-1.5 rounded-lg text-left border transition-all cursor-pointer relative flex flex-col justify-between overflow-hidden ${cardStyle}`}
                                                        style={{
                                                            transform: `translateZ(${zElevation}px)`,
                                                            transformStyle: 'preserve-3d'
                                                        }}
                                                    >
                                                        <div className="flex items-center justify-between font-mono text-[7px] sm:text-[8px] mb-0.5">
                                                            <span className={isCritical ? 'text-[#FF3366] font-black' : isRecurring ? 'text-[#00E5FF] font-bold' : 'text-neutral-500'}>
                                                                {isCritical ? '🔥 CRITICAL' : isRecurring ? '⚡ RECURRING' : '💤 AUTO'}
                                                            </span>
                                                            <span className={isDone ? 'text-[#00FF88] font-bold' : isCritical ? 'text-[#FF3366] font-bold' : 'text-white'}>
                                                                {item.curr}{item.cost}
                                                            </span>
                                                        </div>

                                                        <p className={`font-serif text-[9px] sm:text-[10px] font-bold leading-tight truncate ${
                                                            isDone ? 'line-through text-neutral-500' : isAuto ? 'text-neutral-400 font-normal' : 'text-white'
                                                        }`}>
                                                            {item.title}
                                                        </p>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* ========================================================================= */}
                {/* 2. LAYER 2: EXECUTIVE CONTROL & ANALYSIS DECK (스크롤 시 떠오르는 2번째 레이어) */}
                {/* ========================================================================= */}
                <motion.div
                    animate={{
                        translateZ: activeLayer === 'control' ? 0 : 260,
                        rotateX: activeLayer === 'control' ? 0 : -20,
                        scale: activeLayer === 'control' ? 1 : 0.85,
                        opacity: activeLayer === 'control' ? 1 : 0,
                        pointerEvents: activeLayer === 'control' ? 'auto' : 'none',
                        filter: activeLayer === 'control' ? 'blur(0px)' : 'blur(8px)'
                    }}
                    transition={{ type: "spring", stiffness: 220, damping: 26 }}
                    className="absolute inset-x-4 sm:inset-x-12 max-w-4xl mx-auto p-6 sm:p-8 rounded-[40px] bg-[#100f17]/95 backdrop-blur-3xl border border-[#FF3366]/50 shadow-[0_30px_100px_rgba(0,0,0,0.98),0_0_50px_rgba(255,51,102,0.25)] flex flex-col justify-between gap-6"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Layer 2 Header */}
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                        <div className="flex flex-col">
                            <span className="font-mono text-[10px] text-[#FF3366] uppercase tracking-widest font-black flex items-center gap-1.5">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                <span>2ND LAYER · EXECUTIVE PRIORITY & ANALYTICS DECK</span>
                            </span>
                            <h2 className="font-serif text-xl sm:text-2xl font-black text-white mt-1">
                                우선순위 필터링 및 월간 재무 요약
                            </h2>
                        </div>

                        <button
                            onClick={() => handleSwitchLayer('calendar')}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white flex items-center gap-1.5 cursor-pointer"
                        >
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>캘린더 룸으로 복귀</span>
                        </button>
                    </div>

                    {/* 3-Tier Priority Filter Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                            onClick={() => { setFilterPriority('critical'); handleSwitchLayer('calendar'); }}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                filterPriority === 'critical' 
                                    ? 'bg-[#FF3366]/20 border-[#FF3366] shadow-[0_0_20px_rgba(255,51,102,0.4)]' 
                                    : 'bg-white/[0.03] border-white/10 hover:border-[#FF3366]/40'
                            }`}
                        >
                            <div className="flex items-center justify-between text-[#FF3366] font-mono text-xs font-bold mb-2">
                                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 fill-current" /> 1순위: 중요 마일스톤</span>
                                <span className="px-1.5 py-0.5 rounded bg-black/40 text-white text-[10px]">{criticalPending.length}건 미결</span>
                            </div>
                            <p className="text-xs text-neutral-300 font-sans">
                                법인 자본금 납입, DECHEMA 입주, 상업등기소 HRB 등 직접 처리 필수 액션.
                            </p>
                        </button>

                        <button
                            onClick={() => { setFilterPriority('recurring'); handleSwitchLayer('calendar'); }}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                filterPriority === 'recurring' 
                                    ? 'bg-[#00E5FF]/20 border-[#00E5FF] shadow-[0_0_20px_rgba(0,229,255,0.4)]' 
                                    : 'bg-white/[0.03] border-white/10 hover:border-[#00E5FF]/40'
                            }`}
                        >
                            <div className="flex items-center justify-between text-[#00E5FF] font-mono text-xs font-bold mb-2">
                                <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 fill-current" /> 2순위: AI 구독</span>
                                <span className="px-1.5 py-0.5 rounded bg-black/40 text-white text-[10px]">{recurringPending.length}건 미결</span>
                            </div>
                            <p className="text-xs text-neutral-300 font-sans">
                                Suno, Cursor, Gemini, ElevenLabs 등 결제일/금액 인지용 AI 테크 스택.
                            </p>
                        </button>

                        <button
                            onClick={() => { setFilterPriority('auto'); handleSwitchLayer('calendar'); }}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                filterPriority === 'auto' 
                                    ? 'bg-white/20 border-white shadow-md' 
                                    : 'bg-white/[0.03] border-white/10 hover:border-white/30'
                            }`}
                        >
                            <div className="flex items-center justify-between text-neutral-400 font-mono text-xs font-bold mb-2">
                                <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5" /> 3순위: 자동이체 (저우선)</span>
                                <span className="px-1.5 py-0.5 rounded bg-black/40 text-white text-[10px]">{autoPending.length}건</span>
                            </div>
                            <p className="text-xs text-neutral-300 font-sans">
                                집 월세, Mainova 전기세, GEZ, TK 건강보험 등 자동 출금 기록용.
                            </p>
                        </button>
                    </div>

                    {/* Financial Burn Rate Summary */}
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/[0.08] flex items-center justify-between font-mono text-xs">
                        <div className="flex items-center gap-4">
                            <span className="text-neutral-400">월 고정 번레이트:</span>
                            <span className="text-[#00E5FF] font-black text-base">€{totalEur}</span>
                            <span className="text-neutral-600">/</span>
                            <span className="text-[#D4AF37] font-black text-base">${totalUsd}</span>
                        </div>

                        <button
                            onClick={() => { setFilterPriority('all'); handleSwitchLayer('calendar'); }}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
                        >
                            필터 초기화 (전체 보기)
                        </button>
                    </div>
                </motion.div>
            </main>

            {/* 3. 3D FLY-TO ZOOM QUEST INSPECTOR */}
            <AnimatePresence>
                {focusedCard && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-[3px] transition-all"
                        onClick={() => { setFocusedCard(null); setIsFlipped(false); }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 30 }}
                            transition={{ type: "spring", stiffness: 360, damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ perspective: '1600px' }}
                            className="relative w-[340px] sm:w-[400px] h-[450px] sm:h-[480px]"
                        >
                            <motion.div
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ type: "spring", stiffness: 360, damping: 28 }}
                                className={`relative w-full h-full rounded-[36px] overflow-hidden border shadow-[0_30px_100px_rgba(0,0,0,0.95)] ${
                                    focusedCard.priority === 'critical'
                                        ? 'border-[#FF3366] shadow-[0_0_60px_rgba(255,51,102,0.35)]'
                                        : 'border-[#D4AF37]/60 shadow-[0_0_60px_rgba(212,175,55,0.3)]'
                                }`}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Front Face */}
                                <div 
                                    className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-b from-[#1c1b26] via-[#100f17] to-[#08070c]"
                                    style={{ 
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(0deg)',
                                        zIndex: 2
                                    }}
                                >
                                    <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-white/[0.08] to-transparent pointer-events-none rounded-t-[36px]" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                                            focusedCard.priority === 'critical'
                                                ? 'bg-[#FF3366]/20 border-[#FF3366]/50 text-[#FF3366]'
                                                : focusedCard.priority === 'recurring'
                                                ? 'bg-[#00E5FF]/20 border-[#00E5FF]/50 text-[#00E5FF]'
                                                : 'bg-white/10 border-white/15 text-neutral-400'
                                        }`}>
                                            <span className="text-sm">{focusedCard.icon}</span>
                                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                                                {focusedCard.priorityLabel}
                                            </span>
                                        </div>

                                        <button 
                                            onClick={() => { if (soundEnabled) playHapticSound('flip'); setIsFlipped(true); }}
                                            className="font-mono text-[10px] text-[#D4AF37] px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center gap-1.5 cursor-pointer hover:bg-[#D4AF37]/25 transition-all"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            <span>상세 뒷면 [F]</span>
                                        </button>
                                    </div>

                                    <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
                                        <span className="font-serif text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-2xl">
                                            <span className="font-mono text-2xl font-light text-neutral-400 mr-1">{focusedCard.curr}</span>
                                            {focusedCard.cost.toLocaleString()}
                                        </span>

                                        <span className="mt-2 font-serif text-lg sm:text-xl font-bold text-[#F7EBE1]">
                                            {focusedCard.title}
                                        </span>
                                    </div>

                                    <div className="relative z-10 flex flex-col gap-2 pt-3 border-t border-white/[0.08]">
                                        <div className="flex items-center justify-between font-mono text-xs text-neutral-400 px-1">
                                            <span>{focusedCard.badge}</span>
                                            <span className="text-[#00FF88] font-bold">{focusedCard.method}</span>
                                        </div>

                                        <button
                                            onClick={() => handleToggleDone(focusedCard)}
                                            className={`w-full py-3 rounded-2xl font-mono text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                                focusedCard.status === 'done'
                                                    ? 'bg-[#00FF88]/20 text-[#00FF88] border border-[#00FF88]/40'
                                                    : focusedCard.priority === 'critical'
                                                    ? 'bg-gradient-to-r from-[#FF3366] to-[#FF5500] text-white shadow-[0_0_25px_rgba(255,51,102,0.5)]'
                                                    : 'bg-white text-black shadow-lg hover:bg-neutral-200'
                                            }`}
                                        >
                                            <Check className="w-4 h-4 stroke-[3]" />
                                            <span>{focusedCard.status === 'done' ? '완료됨 (다시 활성화)' : '확인 완료 [Space]'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Back Face */}
                                <div 
                                    className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between bg-[#121118] border border-[#D4AF37]/60 rounded-[36px]"
                                    style={{ 
                                        backfaceVisibility: 'hidden',
                                        WebkitBackfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                        zIndex: 3
                                    }}
                                >
                                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                                        <div>
                                            <span className="font-mono text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold block">
                                                {focusedCard.vol} · DETAIL INSPECTOR
                                            </span>
                                            <h3 className="font-serif text-base sm:text-lg font-bold text-white mt-0.5">
                                                {focusedCard.title}
                                            </h3>
                                        </div>
                                        <button 
                                            onClick={() => { if (soundEnabled) playHapticSound('flip'); setIsFlipped(false); }}
                                            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2 font-mono text-xs my-auto">
                                        <div className="flex justify-between py-1 border-b border-white/5">
                                            <span className="text-neutral-500">결제/마감일</span>
                                            <span className="font-bold text-white">{focusedCard.month ? `${focusedCard.month} ` : ''}매월 {focusedCard.day}일</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-white/5">
                                            <span className="text-neutral-500">결제 수단</span>
                                            <span className="font-bold text-[#00FF88]">{focusedCard.method}</span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-white/5">
                                            <span className="text-neutral-500">우선순위 분류</span>
                                            <span className={`font-bold ${focusedCard.priority === 'critical' ? 'text-[#FF3366]' : 'text-neutral-300'}`}>
                                                {focusedCard.priorityLabel}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-black/60 p-3 rounded-2xl border border-white/[0.06] mt-1 shadow-inner">
                                            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                                                {focusedCard.guide}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleToggleDone(focusedCard)}
                                        className="w-full py-3 rounded-2xl bg-white text-black font-mono text-xs font-black shadow-lg hover:bg-neutral-200 cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-4 h-4 stroke-[3] text-emerald-600" />
                                        <span>확인 완료 [Space]</span>
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* 4. FOOTER */}
            <footer className="relative z-30 w-full px-5 py-2 sm:py-2.5 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-500 pointer-events-none border-t border-white/[0.04] bg-black/40 backdrop-blur-md">
                <div className="pointer-events-auto flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                    <span>SPATIAL LAYER SHIFT V10</span>
                </div>

                <div className="pointer-events-auto flex items-center gap-4">
                    <span className="hidden sm:inline">[휠 스크롤 / 탭] 1레이어 ↔ 2레이어 3D 전환 · [Space] 중요 기한 열기</span>
                    <button 
                        onClick={() => {
                            if (confirm('모든 데이터를 초기 상태로 리셋하시겠습니까?')) {
                                setItems(INITIAL_SCHEDULE);
                                setFilterPriority('all');
                                setActiveLayer('calendar');
                                setFocusedCard(null);
                            }
                        }}
                        className="hover:text-neutral-300 transition-colors cursor-pointer"
                    >
                        Reset
                    </button>
                </div>
            </footer>
        </div>
    );
}

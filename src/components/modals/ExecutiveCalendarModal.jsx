import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Calendar, Clock, DollarSign, Euro, CheckCircle2, 
    Circle, Sparkles, Building, Music, Zap, Globe, Plus, 
    Trash2, ChevronLeft, ChevronRight, AlertCircle, ArrowUpRight 
} from 'lucide-react';

// INITIAL DATASET: Curated specifically for Sean Park (Frankfurt / Corporate / Creative AI)
const INITIAL_SCHEDULE = [
    // 1. AI & Creative Subscriptions
    { id: 'sub-1', title: 'Suno AI', category: 'sub', cost: 30, currency: '$', day: 5, icon: '🎵', memo: 'v4.5 Music Pro Plan', status: 'active' },
    { id: 'sub-2', title: 'Google AI Pro', category: 'sub', cost: 20, currency: '$', day: 12, icon: '🧠', memo: 'Gemini 2.5 Advanced 2M Context', status: 'active' },
    { id: 'sub-3', title: 'ElevenLabs', category: 'sub', cost: 22, currency: '$', day: 15, icon: '🎙️', memo: 'Custom Voice & Sound FX Pro', status: 'active' },
    { id: 'sub-4', title: 'Amazon Prime', category: 'sub', cost: 15, currency: '$', day: 24, icon: '📦', memo: 'Prime Video & AWS Cloud Storage', status: 'active' },
    { id: 'sub-5', title: 'Cursor Pro', category: 'sub', cost: 20, currency: '$', day: 8, icon: '⚡', memo: 'Claude 3.7 Sonnet Coding Agent', status: 'active' },
    { id: 'sub-6', title: 'Vercel / Domain', category: 'sub', cost: 20, currency: '$', day: 28, icon: '▲', memo: 'justseanflows.com Global Edge', status: 'active' },

    // 2. Germany Fixed Living & Utilities (Frankfurt)
    { id: 'ger-1', title: '집 월세 (Warmmiete)', category: 'germany', cost: 1250, currency: '€', day: 1, icon: '🏠', memo: 'SEPA 이체 (매월 1일~3일 필수)', status: 'pending' },
    { id: 'ger-2', title: 'Mainova 전기세', category: 'germany', cost: 85, currency: '€', day: 1, icon: '⚡', memo: 'Stromabschlag 프랑크푸르트 전력', status: 'pending' },
    { id: 'ger-3', title: 'Telekom 초고속 인터넷', category: 'germany', cost: 45, currency: '€', day: 18, icon: '🌐', memo: 'GigaZuhause 250 Fiber', status: 'active' },
    { id: 'ger-4', title: 'GEZ 독일 방송수신료', category: 'germany', cost: 55.08, currency: '€', day: 15, icon: '📡', memo: 'Rundfunkbeitrag (분기별 납부 필수)', status: 'active' },
    { id: 'ger-5', title: '독일 건강보험 (TK/사보험)', category: 'germany', cost: 220, currency: '€', day: 15, icon: '🩺', memo: 'Krankenversicherung 자동이체', status: 'active' },
    { id: 'ger-6', title: 'Deutschlandticket', category: 'germany', cost: 49, currency: '€', day: 25, icon: '🚆', memo: '독일 전역 대중교통 49유로 패스', status: 'active' },

    // 3. Corporate & Studio Milestones
    { id: 'biz-1', title: '독일 법인 (UG/GmbH) 공증', category: 'milestone', cost: 650, currency: '€', day: 10, icon: '🏛️', memo: 'Notar 방문 & 회사 정관 공증 서명', status: 'urgent' },
    { id: 'biz-2', title: '상업등기소 등록 & 자본금', category: 'milestone', cost: 150, currency: '€', day: 17, icon: '📜', memo: 'Handelsregister 등기 & Stammkapital', status: 'pending' },
    { id: 'biz-3', title: 'Finanzamt 세금번호 발급', category: 'milestone', cost: 0, currency: '€', day: 22, icon: '💼', memo: 'Steuernummer & USt-IdNr 사업자 번호', status: 'pending' },
    { id: 'biz-4', title: '음악 연습실/아틀리에 입주', category: 'milestone', cost: 800, currency: '€', day: 14, icon: '🎻', memo: 'Proberaum 입주 & Kaution(보증금) 정산', status: 'urgent' },
    { id: 'biz-5', title: '세무사 부가세 선신고', category: 'milestone', cost: 120, currency: '€', day: 10, icon: '📊', memo: 'USt-Voranmeldung (매월 10일 마감)', status: 'pending' }
];

const CATEGORIES = [
    { id: 'all', label: '전체 보기', icon: Sparkles, color: '#C8A96E' },
    { id: 'sub', label: 'AI 구독', icon: Zap, color: '#00E5FF' },
    { id: 'germany', label: '독일 공과금', icon: Globe, color: '#FF2A55' },
    { id: 'milestone', label: '법인 / 스튜디오', icon: Building, color: '#00FF88' }
];

// Staggered Container Animation
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.96 },
    show: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] }
    }
};

export function ExecutiveCalendarModal({ isOpen, onClose }) {
    const [scheduleList, setScheduleList] = useState(INITIAL_SCHEDULE);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().getDate());
    const [currentMonth, setCurrentMonth] = useState('2026. 08');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCost, setNewCost] = useState('');
    const [newCurrency, setNewCurrency] = useState('€');
    const [newCategory, setNewCategory] = useState('sub');
    const [newDay, setNewDay] = useState(new Date().getDate());

    const todayDay = new Date().getDate();

    // Financial Totals
    const { totalEuro, totalDollar } = useMemo(() => {
        let eur = 0;
        let usd = 0;
        scheduleList.forEach(item => {
            if (item.currency === '€') eur += item.cost;
            if (item.currency === '$') usd += item.cost;
        });
        return { totalEuro: eur.toFixed(2), totalDollar: usd.toFixed(2) };
    }, [scheduleList]);

    // Filtered Items
    const filteredItems = useMemo(() => {
        return scheduleList
            .filter(item => activeTab === 'all' || item.category === activeTab)
            .sort((a, b) => a.day - b.day);
    }, [scheduleList, activeTab]);

    // Urgent D-Day Items (Upcoming in next 7 days)
    const upcomingUrgent = useMemo(() => {
        return scheduleList.filter(item => {
            const diff = item.day - todayDay;
            return diff >= 0 && diff <= 5;
        }).sort((a, b) => a.day - b.day);
    }, [scheduleList, todayDay]);

    const toggleStatus = (id) => {
        setScheduleList(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, status: item.status === 'done' ? 'active' : 'done' };
            }
            return item;
        }));
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const newItem = {
            id: `custom-${Date.now()}`,
            title: newTitle.trim(),
            category: newCategory,
            cost: parseFloat(newCost) || 0,
            currency: newCurrency,
            day: parseInt(newDay, 10) || todayDay,
            icon: newCategory === 'sub' ? '⚡' : newCategory === 'germany' ? '🇩🇪' : '🏢',
            memo: 'Custom Entry',
            status: 'active'
        };

        setScheduleList(prev => [...prev, newItem]);
        setNewTitle('');
        setNewCost('');
        setIsAddModalOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-6 bg-black/80 backdrop-blur-xl select-none overflow-hidden"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1.0, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-5xl h-[92vh] sm:h-[86vh] rounded-[32px] bg-[#0A090D]/95 backdrop-blur-2xl border border-[#C8A96E]/50 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(200,169,110,0.2)] flex flex-col overflow-hidden text-neutral-200"
                >
                    {/* Top Ribbon */}
                    <div className="px-6 py-4 bg-black/90 border-b border-[#C8A96E]/30 shrink-0 flex items-center justify-between z-30">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#C8A96E]/15 border border-[#C8A96E]/60 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(200,169,110,0.3)]">
                                📅
                            </div>
                            <div>
                                <span className="font-mono text-[9px] text-[#C8A96E] uppercase tracking-widest flex items-center gap-2">
                                    <span>SEAN PARK EXECUTIVE</span>
                                    <span>•</span>
                                    <span className="text-[#00FF88] font-bold">CHRONO-CALENDAR</span>
                                </span>
                                <h2 className="font-serif text-base sm:text-lg font-bold text-[#F7EBE1] tracking-wide">
                                    프랑크푸르트 고정비 & AI 구독 & 법인 마일스톤
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Burn Rate Summary Pills */}
                            <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
                                <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-[#00E5FF]">
                                    <span>월 지출:</span>
                                    <span className="font-black">€{totalEuro}</span>
                                </div>
                                <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 flex items-center gap-1.5 text-[#FFD700]">
                                    <span className="font-black">${totalDollar}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="p-2 rounded-xl bg-[#C8A96E]/20 hover:bg-[#C8A96E]/30 border border-[#C8A96E]/50 text-[#C8A96E] transition-all cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
                                title="일정/구독 추가"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">추가</span>
                            </button>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="px-6 py-2.5 bg-[#121118] border-b border-white/10 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
                        <div className="flex items-center gap-2">
                            {CATEGORIES.map(cat => {
                                const Icon = cat.icon;
                                const isActive = activeTab === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveTab(cat.id)}
                                        className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                                            isActive 
                                                ? 'bg-[#C8A96E] text-black shadow-[0_0_15px_rgba(200,169,110,0.4)]' 
                                                : 'bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/5'
                                        }`}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <span className="font-mono text-[11px] text-neutral-500 hidden md:block">
                            총 {filteredItems.length}개 관리 중
                        </span>
                    </div>

                    {/* Main Content Layout */}
                    <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                        {/* LEFT COLUMN: Staggered Chrono-List (7 Cols) */}
                        <div className="lg:col-span-7 overflow-y-auto p-4 sm:p-6 custom-scrollbar flex flex-col gap-4">
                            {/* Urgent Upcoming Banner */}
                            {upcomingUrgent.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black border border-amber-500/30 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-amber-200">
                                                이번 주 마감 임박 ({upcomingUrgent.length}건)
                                            </p>
                                            <p className="text-[10px] text-amber-400/70 font-mono">
                                                {upcomingUrgent.map(u => `${u.title} (매월 ${u.day}일)`).join(' • ')}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/30">
                                        D-DAY CHECK
                                    </span>
                                </motion.div>
                            )}

                            {/* Staggered Item Cards */}
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="flex flex-col gap-2.5"
                            >
                                {filteredItems.map(item => {
                                    const isDone = item.status === 'done';
                                    const isUrgent = item.status === 'urgent';
                                    const isCurrentDay = item.day === selectedDate;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            variants={itemVariants}
                                            onClick={() => setSelectedDate(item.day)}
                                            className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                                                isCurrentDay 
                                                    ? 'bg-[#C8A96E]/10 border-[#C8A96E] shadow-[0_0_20px_rgba(200,169,110,0.15)]' 
                                                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-white/15'
                                            } ${isDone ? 'opacity-40 grayscale' : ''}`}
                                        >
                                            <div className="flex items-center gap-3.5 overflow-hidden">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleStatus(item.id);
                                                    }}
                                                    className="shrink-0 cursor-pointer text-neutral-400 hover:text-[#00FF88] transition-colors"
                                                >
                                                    {isDone ? (
                                                        <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
                                                    ) : (
                                                        <Circle className="w-5 h-5" />
                                                    )}
                                                </button>

                                                <div className="w-9 h-9 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-base shrink-0 shadow-inner">
                                                    {item.icon}
                                                </div>

                                                <div className="overflow-hidden">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className={`font-serif text-sm font-bold tracking-wide truncate ${isDone ? 'line-through text-neutral-500' : 'text-white'}`}>
                                                            {item.title}
                                                        </h4>
                                                        {isUrgent && (
                                                            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-black bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                                                                URGENT
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] text-neutral-400 truncate">
                                                        {item.memo}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <div className="text-right">
                                                    <span className="font-mono text-xs font-black text-[#C8A96E]">
                                                        {item.currency}{item.cost}
                                                    </span>
                                                    <p className="font-mono text-[10px] text-neutral-500">
                                                        매월 {item.day}일
                                                    </p>
                                                </div>

                                                <div className={`w-8 h-8 rounded-xl flex flex-col items-center justify-center font-mono text-[10px] font-black border ${
                                                    item.day === todayDay 
                                                        ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/40' 
                                                        : 'bg-white/5 text-neutral-400 border-white/10'
                                                }`}>
                                                    <span>{item.day}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        </div>

                        {/* RIGHT COLUMN: Minimal Calendar Vector Matrix (5 Cols) */}
                        <div className="lg:col-span-5 p-4 sm:p-6 bg-black/40 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                            <div>
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="font-mono text-[10px] text-[#C8A96E] uppercase tracking-widest">
                                            MONTH MATRIX
                                        </span>
                                        <h3 className="font-serif text-lg font-bold text-white">
                                            {currentMonth}
                                        </h3>
                                    </div>
                                    <div className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 font-mono text-xs font-bold text-[#00FF88]">
                                        TODAY: {todayDay}일
                                    </div>
                                </div>

                                {/* Calendar Day-of-Week */}
                                <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-neutral-500 mb-2 font-bold">
                                    <span>일</span>
                                    <span>월</span>
                                    <span>화</span>
                                    <span>수</span>
                                    <span>목</span>
                                    <span>금</span>
                                    <span>토</span>
                                </div>

                                {/* Minimal 31 Days Grid */}
                                <div className="grid grid-cols-7 gap-1.5">
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                                        const dayItems = scheduleList.filter(item => item.day === day);
                                        const isSelected = selectedDate === day;
                                        const isToday = day === todayDay;
                                        const hasItem = dayItems.length > 0;

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => setSelectedDate(day)}
                                                className={`h-11 sm:h-12 rounded-xl border flex flex-col items-center justify-between p-1 transition-all cursor-pointer relative ${
                                                    isSelected
                                                        ? 'bg-[#C8A96E] text-black border-[#C8A96E] shadow-[0_0_15px_rgba(200,169,110,0.5)] font-black scale-105 z-10'
                                                        : isToday
                                                        ? 'bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/50 font-bold'
                                                        : 'bg-white/[0.02] hover:bg-white/[0.08] text-neutral-400 border-white/5'
                                                }`}
                                            >
                                                <span className="font-mono text-[11px] leading-none">
                                                    {day}
                                                </span>

                                                {hasItem && (
                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                        {dayItems.slice(0, 3).map((item, idx) => (
                                                            <div 
                                                                key={idx}
                                                                className="w-1.5 h-1.5 rounded-full"
                                                                style={{ 
                                                                    backgroundColor: isSelected 
                                                                        ? '#000000' 
                                                                        : item.category === 'sub' 
                                                                        ? '#00E5FF' 
                                                                        : item.category === 'germany' 
                                                                        ? '#FF2A55' 
                                                                        : '#00FF88' 
                                                                }}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Selected Day Quick Inspector Card */}
                            <div className="mt-6 p-4 rounded-2xl bg-black/60 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-mono text-[10px] text-[#C8A96E] uppercase tracking-widest">
                                        {selectedDate}일 상세 브리핑
                                    </span>
                                    <span className="font-mono text-xs text-neutral-400">
                                        {scheduleList.filter(s => s.day === selectedDate).length}건 예약됨
                                    </span>
                                </div>

                                {scheduleList.filter(s => s.day === selectedDate).length === 0 ? (
                                    <p className="text-xs text-neutral-500 font-serif italic py-2">
                                        이 날짜에 예정된 고정 지출이나 마일스톤이 없습니다.
                                    </p>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {scheduleList.filter(s => s.day === selectedDate).map(item => (
                                            <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0">
                                                <div className="flex items-center gap-2">
                                                    <span>{item.icon}</span>
                                                    <span className="font-bold text-white">{item.title}</span>
                                                </div>
                                                <span className="font-mono text-[#C8A96E] font-bold">
                                                    {item.currency}{item.cost}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Add Modal */}
                {isAddModalOpen && (
                    <div 
                        className="fixed inset-0 z-[10010] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                        onClick={() => setIsAddModalOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md p-6 rounded-3xl bg-[#14131A] border border-[#C8A96E]/50 shadow-2xl flex flex-col gap-4 text-white"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif text-base font-bold text-[#F7EBE1]">
                                    새 구독 / 일정 등록
                                </h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-neutral-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleAddItem} className="flex flex-col gap-3">
                                <div>
                                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">제목 (예: Cursor AI, 집 월세)</label>
                                    <input 
                                        type="text" 
                                        value={newTitle} 
                                        onChange={e => setNewTitle(e.target.value)}
                                        placeholder="항목 이름을 입력하세요"
                                        className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-[#C8A96E] outline-none text-xs font-sans"
                                        autoFocus
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-mono text-neutral-400 block mb-1">금액</label>
                                        <input 
                                            type="number" 
                                            value={newCost} 
                                            onChange={e => setNewCost(e.target.value)}
                                            placeholder="예: 30"
                                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-[#C8A96E] outline-none text-xs font-mono"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-neutral-400 block mb-1">통화</label>
                                        <select 
                                            value={newCurrency} 
                                            onChange={e => setNewCurrency(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-[#C8A96E] outline-none text-xs font-mono"
                                        >
                                            <option value="€">EUR (€)</option>
                                            <option value="$">USD ($)</option>
                                            <option value="₩">KRW (₩)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-mono text-neutral-400 block mb-1">카테고리</label>
                                        <select 
                                            value={newCategory} 
                                            onChange={e => setNewCategory(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-[#C8A96E] outline-none text-xs font-sans"
                                        >
                                            <option value="sub">AI / 크리에이티브 구독</option>
                                            <option value="germany">독일 공과금 / 생활비</option>
                                            <option value="milestone">법인 / 스튜디오 마일스톤</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono text-neutral-400 block mb-1">결제일 / 마감일 (1~31)</label>
                                        <input 
                                            type="number" 
                                            min={1} 
                                            max={31} 
                                            value={newDay} 
                                            onChange={e => setNewDay(e.target.value)}
                                            className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 focus:border-[#C8A96E] outline-none text-xs font-mono"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="mt-2 w-full py-2.5 rounded-xl bg-[#C8A96E] text-black font-mono text-xs font-black shadow-[0_0_15px_rgba(200,169,110,0.4)] hover:bg-[#d8b97e] cursor-pointer transition-all"
                                >
                                    등록 완료 ✨
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
export default ExecutiveCalendarModal;

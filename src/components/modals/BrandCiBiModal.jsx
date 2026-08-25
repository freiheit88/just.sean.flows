import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, Copy, Check, Palette, Type, ShieldCheck, Music, Layers, Eye, Compass, Grid, Award, BookOpen } from 'lucide-react';

const BRAND_PALETTE = [
    {
        category: "PRIMARY HERITAGE CORE",
        colors: [
            { 
                name: "Deep Velvet Bordeaux", 
                hex: "#480B1B", 
                rgb: "72, 11, 27", 
                cmyk: "45, 95, 70, 60", 
                pantone: "PANTONE 19-1528 TCX",
                role: "Brand Primary Background & Haute Couture Velvet Texture" 
            },
            { 
                name: "18K Brushed Champagne Gold", 
                hex: "#C8A96E", 
                rgb: "200, 169, 110", 
                cmyk: "25, 35, 75, 10", 
                pantone: "PANTONE 16-0928 TPG",
                role: "Master Emblem Lineage & Luxury Architectural Metallic" 
            },
            { 
                name: "Imperial Pure Gold", 
                hex: "#FFD700", 
                rgb: "255, 215, 0", 
                cmyk: "0, 15, 100, 0", 
                pantone: "PANTONE 14-0848 TCX",
                role: "VIP Crown Seals & 3D Specular Keyframe Glints" 
            }
        ]
    },
    {
        category: "DYNAMIC KINETIC & HUD ACCENTS",
        colors: [
            { 
                name: "Atelier Electric Volt", 
                hex: "#E7FF00", 
                rgb: "231, 255, 0", 
                cmyk: "15, 0, 100, 0", 
                pantone: "PANTONE 389 C",
                role: "432Hz Sound Frequency Resonance & Interactive Active State" 
            },
            { 
                name: "Emerald Neon Pulse", 
                hex: "#00FF88", 
                rgb: "0, 255, 136", 
                cmyk: "60, 0, 80, 0", 
                pantone: "PANTONE 802 C",
                role: "Spatial Radar Navigation Waypoints & Progress Status" 
            }
        ]
    },
    {
        category: "ARCHITECTURAL NEUTRALS",
        colors: [
            { 
                name: "Frankfurt Void Black", 
                hex: "#060405", 
                rgb: "6, 4, 5", 
                cmyk: "80, 75, 70, 95", 
                pantone: "PANTONE Black 6 C",
                role: "02:00 AM Midnight Spatial Depth & Deep Vignette Horizon" 
            },
            { 
                name: "Alabaster Silk Twill", 
                hex: "#F7EBE1", 
                rgb: "247, 235, 225", 
                cmyk: "2, 6, 8, 0", 
                pantone: "PANTONE 11-0604 TCX",
                role: "Editorial Typography & Haute Couture Scarf Foundations" 
            }
        ]
    }
];

export function BrandCiBiModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('symbol'); // 'symbol' | 'colors' | 'typography' | 'applications'
    const [copiedHex, setCopiedHex] = useState(null);

    if (!isOpen) return null;

    const copyColor = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 1800);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-2 sm:p-5 select-none overflow-hidden"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.94, y: 20 }}
                    animate={{ scale: 1.0, y: 0 }}
                    exit={{ scale: 0.94, y: 20 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] rounded-[32px] bg-gradient-to-b from-[#181014] via-[#0E090C] to-[#060405] border-2 border-[#C8A96E]/75 flex flex-col overflow-hidden shadow-[0_0_120px_rgba(200,169,110,0.4)]"
                >
                    {/* 1. Haute Couture Top Navigation Header */}
                    <div className="px-6 py-4 border-b border-[#C8A96E]/30 flex items-center justify-between shrink-0 bg-black/70 backdrop-blur-xl z-30">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FFD700] via-[#C8A96E] to-[#8C6B2D] p-0.5 shadow-[0_0_15px_rgba(200,169,110,0.6)]">
                                <div className="w-full h-full bg-[#1A0B10] rounded-[10px] flex items-center justify-center text-[#E7FF00] font-black text-sm">
                                    ⚜️
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase">
                                        OFFICIAL BRAND IDENTITY MANUAL // 2026 EDITION
                                    </span>
                                    <span className="px-2 py-0.2 rounded-full bg-[#E7FF00]/10 border border-[#E7FF00]/40 font-mono text-[8px] font-bold text-[#E7FF00] uppercase">
                                        MASTER SPEC
                                    </span>
                                </div>
                                <h2 className="font-serif text-base sm:text-lg font-bold text-[#F7EBE1] tracking-wide">
                                    JUST SEAN FLOWS — CORPORATE & BRAND IDENTITY SYSTEM
                                </h2>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="hidden md:flex items-center gap-1.5 bg-black/60 p-1 rounded-full border border-white/10">
                            {[
                                { id: 'symbol', label: '01. 심볼 철학 & 작도' },
                                { id: 'colors', label: '02. 공식 컬러 스펙트럼' },
                                { id: 'typography', label: '03. 타이포그래피' },
                                { id: 'applications', label: '04. 브랜드 어플리케이션' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'bg-[#C8A96E] text-black shadow-[0_0_12px_rgba(200,169,110,0.5)]'
                                            : 'text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/20 border border-white/20 text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Tab Pill Bar */}
                    <div className="md:hidden flex items-center justify-between gap-1 px-4 py-2 bg-black/50 border-b border-white/10 overflow-x-auto no-scrollbar shrink-0">
                        {[
                            { id: 'symbol', label: '01. 심볼' },
                            { id: 'colors', label: '02. 컬러' },
                            { id: 'typography', label: '03. 서체' },
                            { id: 'applications', label: '04. 응용' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold whitespace-nowrap transition-all ${
                                    activeTab === tab.id ? 'bg-[#C8A96E] text-black font-black' : 'text-neutral-400'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 2. Scrollable Dynamic Body */}
                    <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 custom-scrollbar">
                        {/* TAB 1: SYMBOL PHILOSOPHY & GEOMETRIC CONSTRUCTION */}
                        {activeTab === 'symbol' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-3xl bg-black/40 border border-[#C8A96E]/40 shadow-2xl">
                                    <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-[#2D0711] border-2 border-[#C8A96E]/70 shadow-[0_0_50px_rgba(200,169,110,0.3)]">
                                        <div className="w-full max-w-[220px] aspect-square rounded-2xl overflow-hidden border border-[#C8A96E]/50 shadow-2xl">
                                            <img 
                                                src="/assets/logo/jsf_card_master.jpg" 
                                                alt="Master Brand Emblem" 
                                                className="w-full h-full object-cover select-none"
                                            />
                                        </div>
                                        <span className="font-mono text-[9px] font-black text-[#E7FF00] tracking-widest uppercase mt-3">
                                            MASTER EMBLEM // JUST SEAN FLOWS
                                        </span>
                                    </div>

                                    <div className="md:col-span-7 flex flex-col gap-3.5">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2.5 py-0.5 rounded-full bg-[#E7FF00]/10 border border-[#E7FF00]/40 font-mono text-[9px] font-bold text-[#E7FF00] tracking-widest uppercase">
                                                ORIGIN SPECIFICATION
                                            </span>
                                            <span className="font-mono text-[9px] text-[#C8A96E] font-bold">
                                                GOLDEN RATIO 1 : 1.618
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7EBE1] leading-tight">
                                            Bordeaux Wine Glass & G-Clef Synthesis
                                        </h3>
                                        <p className="font-sans text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                            프랑크푸르트 심야 02:00 AM의 깊은 사색을 담은 <strong>보르도 크리스탈 와인잔</strong>의 포물선과 432Hz 하모닉 작곡을 상징하는 <strong>높은음자리표(Treble Clef)</strong>가 18K 브러시드 골드로 하나의 유기적인 단일 선(Continuous Monoline)으로 융합된 하이엔드 아틀리에 시그니처 엠블럼입니다.
                                        </p>

                                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                                            <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                                                <span className="font-mono text-[8px] text-[#C8A96E] font-bold block uppercase">상징 요소 01</span>
                                                <span className="font-sans text-xs font-bold text-white">크리스탈 보르도 잔</span>
                                                <p className="font-sans text-[10px] text-neutral-400 mt-0.5">사색, 숙성, 프라이빗 살롱의 여유</p>
                                            </div>
                                            <div className="p-3 rounded-xl bg-black/60 border border-white/10">
                                                <span className="font-mono text-[8px] text-[#E7FF00] font-bold block uppercase">상징 요소 02</span>
                                                <span className="font-sans text-xs font-bold text-white">432Hz 높은음자리표</span>
                                                <p className="font-sans text-[10px] text-neutral-400 mt-0.5">자연 치유 주파수, 오리지널 선율</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Emblem Protection & Safe Space */}
                                <div className="p-6 rounded-3xl bg-black/30 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="font-mono text-[9px] text-[#C8A96E] font-bold uppercase">규정 01 // 최소 여백 규정</span>
                                        <p className="font-sans text-xs text-neutral-300">엠블럼 외곽에는 최소 엠블럼 높이의 0.25H 이상의 완전한 안전 여백을 확보해야 합니다.</p>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="font-mono text-[9px] text-[#E7FF00] font-bold uppercase">규정 02 // 비율 불변의 원칙</span>
                                        <p className="font-sans text-xs text-neutral-300">엠블럼의 가로세로 비율은 절대 왜곡할 수 없으며, 단독 사용 시 정원형 또는 4:5 직사각 캔버스를 유지합니다.</p>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="font-mono text-[9px] text-[#00FF88] font-bold uppercase">규정 03 // 배경 대비 규정</span>
                                        <p className="font-sans text-xs text-neutral-300">Deep Velvet Bordeaux(#480B1B) 또는 Frankfurt Void Black(#060405) 배경 위에서만 100% 본연의 광채를 발휘합니다.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: COLOR SYSTEM & PANTONE CODES */}
                        {activeTab === 'colors' && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#E7FF00]">
                                        <Palette className="w-5 h-5" />
                                        <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                                            MASTER COLOR ARCHITECTURE (CLICK TO COPY HEX)
                                        </h3>
                                    </div>
                                    <span className="font-mono text-[9px] text-neutral-400">
                                        RGB • CMYK • PANTONE CERTIFIED
                                    </span>
                                </div>

                                {BRAND_PALETTE.map((group, gIdx) => (
                                    <div key={gIdx} className="space-y-3">
                                        <span className="font-mono text-[10px] font-black text-[#C8A96E] tracking-[0.2em] uppercase block">
                                            {group.category}
                                        </span>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {group.colors.map((col) => {
                                                const isCopied = copiedHex === col.hex;

                                                return (
                                                    <div
                                                        key={col.hex}
                                                        onClick={() => copyColor(col.hex)}
                                                        className="p-4 rounded-2xl bg-black/60 border border-white/10 hover:border-[#E7FF00] transition-all duration-300 cursor-pointer flex flex-col group hover:shadow-[0_0_25px_rgba(231,255,0,0.3)]"
                                                    >
                                                        <div 
                                                            className="w-full h-20 rounded-xl mb-3 shadow-inner border border-white/20 relative flex items-center justify-center overflow-hidden"
                                                            style={{ backgroundColor: col.hex }}
                                                        >
                                                            {isCopied ? (
                                                                <span className="px-2.5 py-1 rounded-full bg-black/90 text-[#E7FF00] text-[10px] font-mono font-bold animate-bounce flex items-center gap-1 shadow-lg">
                                                                    <Check className="w-3.5 h-3.5 text-[#E7FF00]" /> COPIED!
                                                                </span>
                                                            ) : (
                                                                <span className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[9px] flex items-center gap-1">
                                                                    <Copy className="w-3 h-3 text-[#E7FF00]" /> CLICK TO COPY
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <span className="font-sans text-xs sm:text-sm font-bold text-white group-hover:text-[#E7FF00] transition-colors">
                                                                {col.name}
                                                            </span>
                                                            <span className="font-mono text-[11px] font-black text-[#E7FF00]">
                                                                {col.hex}
                                                            </span>
                                                        </div>

                                                        <div className="mt-2 pt-2 border-t border-white/10 space-y-1 font-mono text-[9px] text-neutral-400">
                                                            <div className="flex justify-between">
                                                                <span>RGB</span>
                                                                <span className="text-white">{col.rgb}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>CMYK</span>
                                                                <span className="text-white">{col.cmyk}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>PANTONE</span>
                                                                <span className="text-[#C8A96E] font-bold">{col.pantone}</span>
                                                            </div>
                                                        </div>

                                                        <p className="font-sans text-[10px] text-neutral-400 mt-2.5 line-clamp-2 leading-relaxed">
                                                            {col.role}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* TAB 3: TYPOGRAPHY HIERARCHY */}
                        {activeTab === 'typography' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-[#C8A96E]">
                                    <Type className="w-5 h-5" />
                                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                                        TYPOGRAPHIC SYSTEM & HIERARCHY
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="p-5 rounded-2xl bg-black/60 border border-[#C8A96E]/50 flex flex-col gap-3">
                                        <span className="font-mono text-[9px] text-[#C8A96E] font-bold tracking-widest uppercase">
                                            PRIMARY BRAND LOGOTYPE (MONOSPACE)
                                        </span>
                                        <div className="p-4 rounded-xl bg-black border border-white/15">
                                            <span className="font-mono text-xl sm:text-2xl font-black text-[#F7EBE1] tracking-[0.25em] block">
                                                JUST • SEAN • FLOWS
                                            </span>
                                            <span className="font-mono text-[9px] text-neutral-400 mt-2 block">
                                                Font: Space Mono / JetBrains Mono • Tracking: 0.25em • All Caps
                                            </span>
                                        </div>
                                        <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                                            현대 음향 프로덕션의 정밀함과 하이엔드 테크놀로지를 대변하는 모노스페이스 서체로, 모든 글자 사이에 시그니처 블릿(•)을 적용하여 일정한 432Hz 박자감을 형성합니다.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-black/60 border border-[#E7FF00]/40 flex flex-col gap-3">
                                        <span className="font-mono text-[9px] text-[#E7FF00] font-bold tracking-widest uppercase">
                                            EDITORIAL MASTER TITLE (LATE ROMANTIC SERIF)
                                        </span>
                                        <div className="p-4 rounded-xl bg-black border border-white/15">
                                            <span className="font-serif text-xl sm:text-2xl font-bold text-[#E7FF00] italic block">
                                                A Twelve-minute Alibi
                                            </span>
                                            <span className="font-mono text-[9px] text-neutral-400 mt-2 block">
                                                Font: Playfair Display / Cinzel • Style: Italicized Haute Couture
                                            </span>
                                        </div>
                                        <p className="font-sans text-xs text-neutral-300 leading-relaxed">
                                            1924년 빈티지 스타인웨이 피아노 살롱의 고전적 품격을 계승하는 클래식 세리프 서체로, 작품 타이틀 및 전시 큐레이션 헤드라인에 적용됩니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: BRAND APPLICATIONS */}
                        {activeTab === 'applications' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-[#00FF88]">
                                    <Award className="w-5 h-5" />
                                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                                        HAUTE COUTURE BRAND APPLICATIONS
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-3 group hover:border-[#C8A96E] transition-all">
                                        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-[#2A151A] to-[#120B0F] border border-[#C8A96E]/40 flex items-center justify-center p-3">
                                            <div className="w-16 h-16 rounded-full border-2 border-[#C8A96E] flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(200,169,110,0.5)]">
                                                ⚜️
                                            </div>
                                        </div>
                                        <span className="font-sans text-sm font-bold text-white group-hover:text-[#C8A96E]">
                                            18K Gold Favicon Hardware
                                        </span>
                                        <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                                            스마트폰 홈 화면 및 실크 트윌 스카프 전용 메탈 하드웨어로 정밀 캐스팅된 18K 골드 인장 엠블럼.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-3 group hover:border-[#E7FF00] transition-all">
                                        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-[#1F070E] to-[#0A0507] border border-[#E7FF00]/40 flex items-center justify-center p-3">
                                            <div className="px-4 py-2 rounded-lg bg-[#3A0915] border border-[#E7FF00] text-center shadow-[0_0_25px_rgba(231,255,0,0.4)]">
                                                <span className="font-mono text-[9px] text-[#E7FF00] font-black tracking-widest block">GRAND CRU 2026</span>
                                                <span className="font-serif text-xs font-bold text-white">BORDEAUX PINOT NOIR</span>
                                            </div>
                                        </div>
                                        <span className="font-sans text-sm font-bold text-white group-hover:text-[#E7FF00]">
                                            Private Salon Wine Label
                                        </span>
                                        <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                                            프랑크푸르트 심야 살롱 VIP 리셉션을 위한 한정판 보르도 피노 누아 맞춤형 와인 레이블 아키텍처.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-black/60 border border-white/10 flex flex-col gap-3 group hover:border-[#00FF88] transition-all">
                                        <div className="w-full h-36 rounded-xl bg-gradient-to-br from-[#101412] to-[#060807] border border-[#00FF88]/40 flex items-center justify-center p-3">
                                            <div className="w-20 h-20 rounded-2xl bg-black/80 border border-[#00FF88] flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(0,255,136,0.4)]">
                                                <span className="text-lg">🎼</span>
                                                <span className="font-mono text-[8px] text-[#00FF88] font-bold">432Hz MASTER</span>
                                            </div>
                                        </div>
                                        <span className="font-sans text-sm font-bold text-white group-hover:text-[#00FF88]">
                                            Spatial Digital HUD & UI
                                        </span>
                                        <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                                            자이로스코프 공간 물리 및 실시간 사운드웨이브 키네틱 피직스가 적용된 차세대 디지털 인터페이스.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

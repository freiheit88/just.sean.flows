// Master Ambient Floating Particles: 3X Giant Music Emojis & Multi-Speed Couture Typography
export const MUSIC_EMOJIS_SUPER_LARGE = [
    "🎻", "🎹", "🎼", "🍷", "🎷", "🎺", "🎧", "🎵", "🎶", "🎙️", "📻", "🥂", "⚜️", "👑", "🕯️", "🏛️"
];

export const COUTURE_PHRASES = [
    "JUST SEAN FLOWS", "A TWELVE-MINUTE ALIBI", "432Hz HARMONIC", "FRANKFURT AM MAIN",
    "STEINWAY & SONS", "LATE ROMANTICISM", "BORDEAUX PINOT NOIR", "02:00 AM MIDNIGHT",
    "CAPRICCIO", "NOCTURNE", "VIRTUOSO", "CRESCENDO", "PIANISSIMO", "RUBATO",
    "UNTERNEHMERGESELLSCHAFT", "VELVET COUTURE", "KINETIC ODYSSEY", "GOLDEN SANCTUARY",
    "VACUUM TUBE 44.1kHz", "CHOPIN BALLADE", "VIOLIN CADENZA", "POLYPHONY", "RESONANCE"
];

export const DEBRIS_COLORS = [
    "#E7FF00", "#FFD700", "#00FF88", "#00F0FF", "#FF0055", "#F7EBE1",
    "#C8A96E", "#E6A23C", "#FF6B8B", "#81ECEC", "#FFFFFF"
];

function generateMasterDebris() {
    const list = [];
    const totalCount = 110;

    for (let i = 0; i < totalCount; i++) {
        const isSuperLargeEmoji = i % 3 === 0; // Every 3rd item is a 3X GIANT MUSIC EMOJI!
        const isGlassBadge = i % 5 === 1;
        const isPhrase = !isSuperLargeEmoji && !isGlassBadge;

        // Speed categories: 0: Ultra-Slow (16-24s), 1: Moderate (9-14s), 2: Brisk (5-8s)
        const speedCategory = i % 3;
        const duration = speedCategory === 0 ? (16 + (i % 9) * 1.0) : speedCategory === 1 ? (9 + (i % 6) * 0.9) : (5.5 + (i % 5) * 0.7);

        // Visual properties
        let text = "";
        let styleClass = "";
        let scaleRange = [0.8, 1.0, 0.6];
        let opacityMax = 0.55;
        let isLarge = false;

        if (isSuperLargeEmoji) {
            text = MUSIC_EMOJIS_SUPER_LARGE[i % MUSIC_EMOJIS_SUPER_LARGE.length];
            // 3X ~ 4X SUPER LARGE SCALE!
            styleClass = "text-4xl sm:text-6xl md:text-7xl select-none filter drop-shadow-[0_0_25px_rgba(255,215,0,0.7)]";
            scaleRange = [0.9, 1.45, 0.75];
            opacityMax = 0.75;
            isLarge = true;
        } else if (isGlassBadge) {
            const badgePhrases = [
                "🎻 432Hz MASTER", "🍷 BORDEAUX ATELIER", "👑 VIP SANCTUARY",
                "🎹 STEINWAY 1924", "🏛️ FRANKFURT NOIR", "🎼 ALIBI SCORE", "⚡ 60 FPS KINETIC"
            ];
            text = badgePhrases[i % badgePhrases.length];
            styleClass = "font-mono text-[9px] sm:text-[11px] font-bold px-3 py-1 rounded-full border border-[#C8A96E]/50 bg-black/50 backdrop-blur-md text-[#E7FF00] shadow-[0_0_15px_rgba(200,169,110,0.3)] tracking-widest";
            opacityMax = 0.85;
            scaleRange = [0.85, 1.1, 0.7];
        } else {
            text = COUTURE_PHRASES[i % COUTURE_PHRASES.length];
            const fontChoice = (i % 3 === 0) 
                ? "font-serif italic tracking-wider font-light text-xs sm:text-base text-[#F7EBE1]"
                : (i % 3 === 1)
                ? "font-mono font-black tracking-[0.25em] text-[10px] sm:text-xs uppercase text-[#E7FF00]"
                : "font-sans font-bold tracking-wider text-xs sm:text-sm text-neutral-300";
            styleClass = fontChoice;
            opacityMax = 0.45;
            scaleRange = [0.75, 1.15, 0.6];
        }

        const zDepth = (i % 10) * 30 - 120;
        const tiltMult = isLarge ? 0.6 : speedCategory === 2 ? 3.2 : 1.8;

        list.push({
            id: i,
            text,
            color: DEBRIS_COLORS[i % DEBRIS_COLORS.length],
            styleClass,
            left: `${((i * 17.3) % 94) + 3}%`,
            duration,
            delay: (i % 15) * 0.35,
            pullXPx: ((i % 13) - 6) * 45,
            rotation: ((i % 11) - 5) * 35,
            opacityMax,
            scaleRange,
            zDepth,
            tiltMult,
            isSuperLargeEmoji,
            speedCategory
        });
    }
    return list;
}

export const ATELIER_DEBRIS_100 = generateMasterDebris();

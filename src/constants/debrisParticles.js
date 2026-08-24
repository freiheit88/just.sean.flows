// Highly Optimized 60FPS Ambient Floating Particles (Spacious & Lightweight)
export const MUSIC_EMOJIS_CURATED = [
    "🎻", "🎹", "🎼", "🍷", "🎷", "🎧", "🎵", "🎶", "🥂", "⚜️", "👑", "🏛️"
];

export const COUTURE_PHRASES_CURATED = [
    "JUST SEAN FLOWS", "432Hz HARMONIC", "FRANKFURT AM MAIN",
    "STEINWAY & SONS", "BORDEAUX PINOT NOIR", "02:00 AM MIDNIGHT",
    "A TWELVE-MINUTE ALIBI", "VELVET COUTURE", "KINETIC ODYSSEY", "GOLDEN SANCTUARY"
];

export const DEBRIS_COLORS = [
    "#E7FF00", "#FFD700", "#00FF88", "#00F0FF", "#F7EBE1",
    "#C8A96E", "#FF6B8B", "#FFFFFF"
];

function generateOptimizedDebris() {
    const list = [];
    const totalCount = 22; // Reduced from 110 to 22 for silky-smooth 60 FPS!

    for (let i = 0; i < totalCount; i++) {
        const isSuperLargeEmoji = i % 2 === 0; // Alternating emojis & phrases
        const isBadge = i % 5 === 1;

        // Varied float speeds: Slow, Medium, Brisk
        const duration = (i % 3 === 0) ? (14 + (i % 5) * 1.5) : (i % 3 === 1) ? (9 + (i % 4) * 1.2) : (6.5 + (i % 3) * 0.8);

        let text = "";
        let styleClass = "";
        let scaleRange = [0.8, 1.0, 0.6];
        let opacityMax = 0.40;

        if (isSuperLargeEmoji) {
            text = MUSIC_EMOJIS_CURATED[(i / 2) % MUSIC_EMOJIS_CURATED.length];
            styleClass = "text-4xl sm:text-5xl md:text-6xl select-none";
            scaleRange = [0.85, 1.25, 0.7];
            opacityMax = 0.55;
        } else if (isBadge) {
            const badges = ["🎻 432Hz MASTER", "🍷 BORDEAUX ATELIER", "👑 VIP SANCTUARY", "🎹 STEINWAY 1924"];
            text = badges[i % badges.length];
            styleClass = "font-mono text-[9px] sm:text-[10px] font-bold px-3 py-1 rounded-full border border-[#C8A96E]/40 bg-black/40 text-[#E7FF00] tracking-widest";
            opacityMax = 0.60;
            scaleRange = [0.9, 1.05, 0.8];
        } else {
            text = COUTURE_PHRASES_CURATED[i % COUTURE_PHRASES_CURATED.length];
            styleClass = (i % 2 === 0)
                ? "font-serif italic tracking-wider text-xs sm:text-sm text-[#F7EBE1]/80"
                : "font-mono font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase text-[#E7FF00]/80";
            opacityMax = 0.35;
            scaleRange = [0.8, 1.1, 0.7];
        }

        const zDepth = (i % 6) * 20 - 60;
        const tiltMult = isSuperLargeEmoji ? 0.7 : 1.5;

        list.push({
            id: i,
            text,
            color: DEBRIS_COLORS[i % DEBRIS_COLORS.length],
            styleClass,
            left: `${((i * 24.3) % 86) + 7}%`,
            duration,
            delay: (i % 8) * 0.45,
            pullXPx: ((i % 7) - 3) * 35,
            rotation: ((i % 7) - 3) * 25,
            opacityMax,
            scaleRange,
            zDepth,
            tiltMult,
            isSuperLargeEmoji
        });
    }
    return list;
}

export const ATELIER_DEBRIS_100 = generateOptimizedDebris();

// 첫 화면 LET'S GO 3D 부유 파티클 (다양한 럭셔리 꾸뛰르 & 세리프 & 모노스페이스 스타일)
const DEBRIS_WORDS = [
    "JUST SEAN FLOWS", "FRANKFURT", "2026", "ATELIER", "CAPRICCIO", "CHOPIN",
    "VIOLIN", "SOLO", "NOCTURNE", "MR ALIBI", "FLOW", "KINETIC",
    "GOTHIC ARCH", "AMBER LOUNGE", "WINE DECANTER", "432Hz CADENZA", "MIDNIGHT 02:00 AM", "ECHO",
    "BASS GROOVE", "ORCHESTRA TUTTI", "STEINWAY & SONS", "SOUND LAB", "QUEST", "ENTER",
    "J.S.F COUTURE", "STAINED GLASS", "CYBER ACOUSTIC", "GOLDEN SALON", "DOPAMINE", "VELVET ALIBI",
    "120 BPM", "ALLEGRO", "VIBRATO", "HARMONY", "POLYPHONY", "RESONANCE", "FREQUENCY"
];

const DEBRIS_COLORS = [
    "#E7FF00", "#FF0055", "#00F0FF", "#FFE066", "#FFFFFF",
    "#C8A96E", "#E65100", "#D35400", "#FFD54F", "#64FFDA"
];

function generateDebris100() {
    const list = [];
    for (let i = 0; i < 90; i++) {
        const styleType = i % 4; // 0: Serif Italic, 1: Mono Tech, 2: Glass Pill Badge, 3: Sans Bold
        const isLarge = i % 15 === 0;
        const isMedium = i % 6 === 0;
        const tiltMult = isLarge ? 0.8 : isMedium ? 1.6 : 3.0;
        const zDepth = (i % 8) * 25 - 80;

        let styleClass = "";
        if (styleType === 0) {
            styleClass = "font-serif italic tracking-wide font-light";
        } else if (styleType === 1) {
            styleClass = "font-mono font-black tracking-[0.25em] uppercase";
        } else if (styleType === 2) {
            styleClass = "font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm tracking-widest";
        } else {
            styleClass = "font-sans font-bold tracking-wider";
        }

        const sizeClass = isLarge ? "text-xl sm:text-2xl" : isMedium ? "text-xs sm:text-sm" : "text-[10px] sm:text-xs";
        
        list.push({
            id: i,
            text: DEBRIS_WORDS[i % DEBRIS_WORDS.length],
            color: DEBRIS_COLORS[i % DEBRIS_COLORS.length],
            styleClass: `${styleClass} ${sizeClass}`,
            left: `${((i * 19.7) % 92) + 4}%`,
            duration: 6.5 + (i % 6) * 1.2,
            delay: (i % 12) * 0.35,
            pullXPx: ((i % 11) - 5) * 35,
            rotation: ((i % 9) - 4) * 28,
            opacityMax: isLarge ? 0.65 : styleType === 2 ? 0.75 : 0.45,
            zDepth,
            tiltMult,
            isLarge
        });
    }
    return list;
}

export const ATELIER_DEBRIS_100 = generateDebris100();

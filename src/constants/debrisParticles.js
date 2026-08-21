// 첫 화면 LET'S GO 3D 파티클 100개 데이터
const DEBRIS_WORDS = [
    "JUST SEAN FLOWS", "FRANKFURT", "2026", "ATELIER", "CAPRICCIO", "CHOPIN",
    "VIOLIN", "SOLO", "NOCTURNE", "MR ALIBI", "FLOW", "KINETIC",
    "GOTHIC", "ARCH", "AMBER", "WINE", "TREBLE", "MIDNIGHT", "ALLEY", "ECHO",
    "BASS", "ORCHESTRA", "LIVE", "SOUND", "QUEST", "ENTER", "STAGE", "READY",
    "J.S.F", "STAINED", "GLASS", "CYBER", "SALON", "KINETIC", "DOPAMINE", "FLOWS",
    "120 BPM", "ALLEGRO", "VIBRATO", "HARMONY", "POLYPHONY", "RESONANCE", "FREQUENCY"
];

const DEBRIS_COLORS = [
    "#E7FF00", "#FF0055", "#00F0FF", "#FFE066", "#FFFFFF",
    "#F39C12", "#E65100", "#D35400", "#FFD54F", "#64FFDA"
];

const DEBRIS_FONTS = ["font-mono", "font-sans", "font-serif"];
const SIZE_CLASSES = ["text-[10px]", "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];

function generateDebris100() {
    const list = [];
    for (let i = 0; i < 100; i++) {
        const isLarge = i % 14 === 0;
        const isMedium = i % 5 === 0;
        const tiltMult = isLarge ? 0.6 : isMedium ? 1.4 : 2.8;
        const zDepth = (i % 7) * 22 - 70;
        const sizeClass = isLarge ? "text-2xl font-black" : isMedium ? "text-sm font-bold" : SIZE_CLASSES[i % SIZE_CLASSES.length];
        
        list.push({
            id: i,
            text: DEBRIS_WORDS[i % DEBRIS_WORDS.length],
            color: DEBRIS_COLORS[i % DEBRIS_COLORS.length],
            fontFamily: DEBRIS_FONTS[i % DEBRIS_FONTS.length],
            sizeClass,
            left: `${((i * 19.3) % 94) + 3}%`,
            duration: 5.5 + (i % 7) * 0.9,
            delay: (i % 15) * 0.28,
            pullXPx: ((i % 11) - 5) * 38,
            rotation: ((i % 9) - 4) * 35,
            shapeCategory: i % 7,
            opacityMax: isLarge ? 0.9 : 0.65,
            zDepth,
            tiltMult,
            isLarge
        });
    }
    return list;
}

export const ATELIER_DEBRIS_100 = generateDebris100();

export const calculateArchetype = (metrics) => {
    const {
        totalClicks,
        uniqueCards,
        sessionTimeSeconds: seconds,
        selectedLangId
    } = metrics;

    const badges = [];
    const sec = Math.floor(seconds);

    // We now just return the logic flags, passing the raw numbers up 
    // down to the React layer to figure out the actual localized string.

    // [ Major Archetypes ] - The first one added will be the main 'Title'
    if (seconds < 10 && uniqueCards === 0 && totalClicks < 5) {
        badges.push({ id: 'lightspeed', isMajor: true, vars: { sec, uniqueCards, totalClicks }, color: 'from-purple-300 via-pink-400 to-red-400' });
    } else if (seconds > 300) {
        badges.push({ id: 'wanderer', isMajor: true, vars: { sec, uniqueCards }, color: 'from-indigo-400 to-cyan-400' });
    } else if (totalClicks > 50 && seconds < 60) {
        badges.push({ id: 'destroyer', isMajor: true, vars: { totalClicks, sec }, color: 'from-orange-500 to-red-600' });
    } else if (uniqueCards >= 6 && seconds > 120) {
        badges.push({ id: 'indecision', isMajor: true, vars: { uniqueCards, sec }, color: 'from-yellow-200 to-yellow-500' });
    } else if (uniqueCards === 1 && seconds < 30) {
        badges.push({ id: 'razor', isMajor: true, vars: { uniqueCards, sec }, color: 'from-slate-300 to-slate-500' });
    } else if (totalClicks <= 3 && seconds > 100) {
        badges.push({ id: 'silent', isMajor: true, vars: { totalClicks, sec }, color: 'from-gray-400 to-gray-600' });
    } else if (uniqueCards >= 8) {
        badges.push({ id: 'octopus', isMajor: true, vars: { uniqueCards }, color: 'from-fuchsia-400 to-purple-600' });
    } else if (totalClicks > 100) {
        badges.push({ id: 'tester', isMajor: true, vars: { totalClicks }, color: 'from-red-600 to-black' });
    } else if (seconds > 180 && totalClicks < 10) {
        badges.push({ id: 'hermit', isMajor: true, vars: { sec, totalClicks }, color: 'from-green-300 to-emerald-500' });
    } else if (totalClicks > 30 && uniqueCards <= 2) {
        badges.push({ id: 'defier', isMajor: true, vars: { totalClicks, uniqueCards }, color: 'from-amber-600 to-amber-800' });
    } else if (seconds > 60 && seconds < 120 && uniqueCards >= 3 && uniqueCards <= 5 && totalClicks < 20) {
        badges.push({ id: 'loyal', isMajor: true, vars: { sec, uniqueCards }, color: 'from-[#00E5FF] to-blue-500' });
    } else if (selectedLangId === 'ko' && seconds < 20) {
        badges.push({ id: 'prophesied', isMajor: true, vars: { sec, lang: 'Korean' }, color: 'from-blue-600 via-white to-red-600' });
    } else if ((selectedLangId === 'ar' || selectedLangId === 'hi') && seconds < 40) {
        badges.push({ id: 'pioneer', isMajor: true, vars: { sec, lang: selectedLangId === 'ar' ? 'Arabic' : 'Hindi' }, color: 'from-yellow-700 to-yellow-900' });
    } else if (selectedLangId === 'es' && uniqueCards > 4) {
        badges.push({ id: 'romantic', isMajor: true, vars: { uniqueCards, lang: 'Spanish' }, color: 'from-rose-400 to-rose-600' });
    } else if (selectedLangId === 'de' && totalClicks < 15 && seconds > 40) {
        badges.push({ id: 'order', isMajor: true, vars: { totalClicks, lang: 'German' }, color: 'from-gray-700 to-gray-900' });
    } else if (selectedLangId === 'ja' && seconds > 90) {
        badges.push({ id: 'samurai', isMajor: true, vars: { sec, lang: 'Japanese' }, color: 'from-pink-300 to-rose-300' });
    } else if (selectedLangId === 'pl' && uniqueCards >= 5) {
        badges.push({ id: 'polar', isMajor: true, vars: { uniqueCards, lang: 'Polish' }, color: 'from-blue-200 to-blue-400' });
    } else if (selectedLangId === 'en' && seconds < 15) {
        badges.push({ id: 'shakespeare', isMajor: true, vars: { sec, lang: 'English' }, color: 'from-blue-700 to-red-500' });
    } else if (totalClicks === uniqueCards && uniqueCards > 2) {
        badges.push({ id: 'chance', isMajor: true, vars: { totalClicks, uniqueCards }, color: 'from-green-500 to-emerald-700' });
    }

    // Fallback if no major badge matched
    if (badges.length === 0) {
        badges.push({ id: 'fortune', isMajor: true, vars: { sec, totalClicks, uniqueCards }, color: 'from-[#C5A059] to-[#e5c996]' });
    }

    // [ Fun Minor Badges: Accumulate these ]
    if (totalClicks >= 1) {
        badges.push({ id: 'm_firstStep', isMinor: true, vars: { totalClicks } });
    }
    if (totalClicks > 80) {
        badges.push({ id: 'm_spammer', isMinor: true, vars: { totalClicks } });
    }
    if (totalClicks === 2) {
        badges.push({ id: 'm_doubleTap', isMinor: true, vars: { totalClicks } });
    }
    if (uniqueCards === 2) {
        badges.push({ id: 'm_safety', isMinor: true, vars: { uniqueCards } });
    }
    if (totalClicks > uniqueCards * 3 && uniqueCards > 0) {
        badges.push({ id: 'm_paranoid', isMinor: true, vars: { uniqueCards, totalClicks } });
    }
    if (seconds < 15) {
        badges.push({ id: 'm_speedrunner', isMinor: true, vars: { sec } });
    }
    if (seconds > 200) {
        badges.push({ id: 'm_marathon', isMinor: true, vars: { sec } });
    }
    if (seconds > 60 && uniqueCards >= 3) {
        badges.push({ id: 'm_cautious', isMinor: true, vars: { sec, uniqueCards } });
    }

    // New: Dual Persona badge (unlocked just by seeing the grid where personas switch)
    if (totalClicks >= 1) {
        badges.push({ id: 'm_dualPersona', isMinor: true, vars: {} });
    }

    return badges;
};

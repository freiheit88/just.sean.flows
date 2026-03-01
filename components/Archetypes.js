export const calculateArchetype = (metrics) => {
    const {
        totalClicks,
        uniqueCards,
        sessionTimeSeconds: seconds,
        selectedLangId
    } = metrics;

    // 1. [ 빛의 속도를 넘은 자 | The Light-Speed Breaker ]
    if (seconds < 10 && uniqueCards === 0 && totalClicks < 5) {
        return { id: 'lightspeed', title: '빛의 속도를 넘은 자', sub: 'The Light-Speed Breaker', desc: '아무것도 보지 않고 오직 직감만으로 세계의 문을 돌파한 기인.', color: 'from-purple-300 via-pink-400 to-red-400' };
    }

    // 2. [ 우주의 방랑객 | The Cosmic Wanderer ]
    if (seconds > 300) {
        return { id: 'wanderer', title: '우주의 방랑객', sub: 'The Cosmic Wanderer', desc: '5분 넘게 이 공허를 맴돌며 시공간의 끝을 관측한 위대한 탐구자.', color: 'from-indigo-400 to-cyan-400' };
    }

    // 3. [ 메뉴얼 파괴자 | The Manual Destroyer ]
    if (totalClicks > 50 && seconds < 60) {
        return { id: 'destroyer', title: '메뉴얼 파괴자', sub: 'The Manual Destroyer', desc: '머리보단 손가락이 먼저 반응하는, 압도적인 클릭의 폭풍.', color: 'from-orange-500 to-red-600' };
    }

    // 4. [ 선택 장애의 화신 | Master of Indecision ]
    if (uniqueCards >= 6 && seconds > 120) {
        return { id: 'indecision', title: '선택 장애의 화신', sub: 'Master of Indecision', desc: '모든 선택지를 다 눌러보고도 한참을 고민한 완벽주의자.', color: 'from-yellow-200 to-yellow-500' };
    }

    // 5. [ 단호한 결단력 | The Absolute Razor ]
    if (uniqueCards === 1 && seconds < 30) {
        return { id: 'razor', title: '단호한 결단력', sub: 'The Absolute Razor', desc: '단 한 곳만 바라보고 주저 없이 선택을 내린 흔들림 없는 칼날.', color: 'from-slate-300 to-slate-500' };
    }

    // 6. [ 침묵의 관찰자 | The Silent Observer ]
    if (totalClicks <= 3 && seconds > 100) {
        return { id: 'silent', title: '침묵의 관찰자', sub: 'The Silent Observer', desc: '아무것도 만지지 않고 그저 흐르는 시간과 음악을 감상한 고고한 영혼.', color: 'from-gray-400 to-gray-600' };
    }

    // 7. [ 문어발식 탐색가 | The Octopus Tactician ]
    if (uniqueCards >= 8) {
        return { id: 'octopus', title: '문어발식 탐색가', sub: 'The Octopus Tactician', desc: '준비된 모든 8개의 다중우주를 꼼꼼히 확인한 정보 수집의 달인.', color: 'from-fuchsia-400 to-purple-600' };
    }

    // 8. [ 신을 시험하는 자 | Tester of Gods ]
    if (totalClicks > 100) {
        return { id: 'tester', title: '시스템을 시험하는 자', sub: 'Tester of Systems', desc: '무엇이든 박살날 때까지 클릭해보는 진정한 QA 마스터.', color: 'from-red-600 to-black' };
    }

    // 9. [ 음악 속의 은둔자 | The Musical Hermit ]
    if (seconds > 180 && totalClicks < 10) {
        return { id: 'hermit', title: '음악 속의 은둔자', sub: 'The Musical Hermit', desc: '선택을 미루고 그저 이 공간의 울림표에 몸을 맡긴 낭만주의자.', color: 'from-green-300 to-emerald-500' };
    }

    // 10. [ 운명을 거스르는 자 | Defier of Fate ]
    if (totalClicks > 30 && uniqueCards <= 2) {
        return { id: 'defier', title: '운명을 거스르는 자', sub: 'Defier of Fate', desc: '수많은 클릭에도 불구하고 고집스럽게 적은 세계만을 파고든 장인.', color: 'from-amber-600 to-amber-800' };
    }

    // 11. [ 미나의 충실한 조력자 | Mina\'s Loyal Agent ]
    if (seconds > 60 && seconds < 120 && uniqueCards >= 3 && uniqueCards <= 5 && totalClicks < 20) {
        return { id: 'loyal', title: '미나의 모범 요원', sub: 'Mina\'s Loyal Agent', desc: '적당한 시간, 적당한 탐색, 아주 모범적으로 시스템의 의도대로 행동한 요원.', color: 'from-[#00E5FF] to-blue-500' };
    }

    // 12. [ 예언된 자 | The Prophesied One ]
    if (selectedLangId === 'ko' && seconds < 20) {
        return { id: 'prophesied', title: '향수병에 걸린 자', sub: 'The Nostalgic One', desc: '다른 곳은 보지도 않고 바로 한국어로 뛰어든 익숙함을 찾는 영혼.', color: 'from-blue-600 via-white to-red-600' };
    }

    // 13. [ 미지의 개척자 | The Unknown Pioneer ]
    if ((selectedLangId === 'ar' || selectedLangId === 'hi') && seconds < 40) {
        return { id: 'pioneer', title: '미지의 개척자', sub: 'The Unknown Pioneer', desc: '낯선 언어와 문화에 대한 두려움 없이 기꺼이 첫 발을 내디딘 용사.', color: 'from-yellow-700 to-yellow-900' };
    }

    // 14. [ 감성 충만 로맨티스트 | The Hopeless Romantic ]
    if (selectedLangId === 'es' && uniqueCards > 4) {
        return { id: 'romantic', title: '감성 충만 로맨티스트', sub: 'The Hopeless Romantic', desc: '여러 곳을 떠돌다 결국 가장 열정적인 곳에 정착한 낭만파.', color: 'from-rose-400 to-rose-600' };
    }

    // 15. [ 질서를 수호하는 자 | Guardian of Order ]
    if (selectedLangId === 'de' && totalClicks < 15 && seconds > 40) {
        return { id: 'order', title: '질서를 수호하는 자', sub: 'Guardian of Order', desc: '정확하고 필요한 클릭만으로 목적지에 도달한 기계 같은 정확성.', color: 'from-gray-700 to-gray-900' };
    }

    // 16. [ 벚꽃의 무사 | The Sakura Samurai ]
    if (selectedLangId === 'ja' && seconds > 90) {
        return { id: 'samurai', title: '벚꽃의 무사', sub: 'The Sakura Samurai', desc: '충분한 정신 수양(대기) 후 마침내 검을 뽑듯 단호하게 결정을 내린 자.', color: 'from-pink-300 to-rose-300' };
    }

    // 17. [ 극야의 여행자 | The Polar Traveler ]
    if (selectedLangId === 'pl' && uniqueCards >= 5) {
        return { id: 'polar', title: '백야의 음유시인', sub: 'The Polar Bard', desc: '수많은 세계를 엿보고 가장 독특한 선율을 지닌 북방으로 향한 귀인.', color: 'from-blue-200 to-blue-400' };
    }

    // 18. [ 셰익스피어의 환생 | Reincarnation of Shakespeare ]
    if (selectedLangId === 'en' && seconds < 15) {
        return { id: 'shakespeare', title: '글로벌 스탠다드', sub: 'The Global Standard', desc: '고민할 것도 없이 가장 익숙하고 세계적인 공용어를 선택한 실용주의자.', color: 'from-blue-700 to-red-500' };
    }

    // 19. [ 우연을 믿는 자 | Believer in Chance ]
    if (totalClicks === uniqueCards && uniqueCards > 2) {
        return { id: 'chance', title: '우연을 믿는 자', sub: 'Believer in Chance', desc: '단 한 번의 불필요한 행위 없이 오직 새로운 카드만을 뽑아든 타짜.', color: 'from-green-500 to-emerald-700' };
    }

    // 20. [ 운명의 수레바퀴 | The Wheel of Fortune ]
    return { id: 'fortune', title: '운명의 수레바퀴', sub: 'The Wheel of Fortune', desc: '정의할 수 없는 독특한 흐름으로 자신만의 이야기를 써내려간 개척자.', color: 'from-[#C5A059] to-[#e5c996]' };
};

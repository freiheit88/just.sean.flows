export const calculateArchetype = (metrics) => {
    const {
        totalClicks,
        uniqueCards,
        sessionTimeSeconds: seconds,
        selectedLangId
    } = metrics;

    const badges = [];
    const sec = Math.floor(seconds);

    // [ Major Archetypes ] - The first one added will be the main 'Title'
    if (seconds < 10 && uniqueCards === 0 && totalClicks < 5) {
        badges.push({ id: 'lightspeed', title: '빛의 속도를 넘은 자', sub: 'The Light-Speed Breaker', desc: `아무것도 보지 않고 직감만으로 돌파했다. (소요시간: ${sec}초, 탐색: ${uniqueCards}개, 클릭: ${totalClicks}회)`, color: 'from-purple-300 via-pink-400 to-red-400', isMajor: true });
    } else if (seconds > 300) {
        badges.push({ id: 'wanderer', title: '우주의 방랑객', sub: 'The Cosmic Wanderer', desc: `5분 넘게 공허를 맴돌며 시공간을 관측했다. (소요시간: ${sec}초, 탐색: ${uniqueCards}개)`, color: 'from-indigo-400 to-cyan-400', isMajor: true });
    } else if (totalClicks > 50 && seconds < 60) {
        badges.push({ id: 'destroyer', title: '메뉴얼 파괴자', sub: 'The Manual Destroyer', desc: `광기로 마우스/화면을 찢어발겼다. (클릭: ${totalClicks}회, 소요시간: ${sec}초)`, color: 'from-orange-500 to-red-600', isMajor: true });
    } else if (uniqueCards >= 6 && seconds > 120) {
        badges.push({ id: 'indecision', title: '선택 장애의 화신', sub: 'Master of Indecision', desc: `모든 선택지를 다 눌러보고도 한참을 고민했다. (탐색: ${uniqueCards}개, 소요시간: ${sec}초)`, color: 'from-yellow-200 to-yellow-500', isMajor: true });
    } else if (uniqueCards === 1 && seconds < 30) {
        badges.push({ id: 'razor', title: '단호한 결단력', sub: 'The Absolute Razor', desc: `단 한 곳만 바라보고 주저 없이 선택했다. (탐색: 딱 ${uniqueCards}개, 소요시간: ${sec}초)`, color: 'from-slate-300 to-slate-500', isMajor: true });
    } else if (totalClicks <= 3 && seconds > 100) {
        badges.push({ id: 'silent', title: '침묵의 관찰자', sub: 'The Silent Observer', desc: `거의 아무것도 만지지 않고 흐르는 음악만을 감상했다. (클릭: ${totalClicks}회, 소요시간: ${sec}초)`, color: 'from-gray-400 to-gray-600', isMajor: true });
    } else if (uniqueCards >= 8) {
        badges.push({ id: 'octopus', title: '문어발식 탐색가', sub: 'The Octopus Tactician', desc: `준비된 모든 다중우주를 꼼꼼히 확인했다. (탐색한 갯수: ${uniqueCards}개 완료)`, color: 'from-fuchsia-400 to-purple-600', isMajor: true });
    } else if (totalClicks > 100) {
        badges.push({ id: 'tester', title: '시스템을 시험하는 자', sub: 'Tester of Systems', desc: `시스템을 파괴할 기세로 실험을 강행했다. QA팀이 두려워한다. (총 클릭: ${totalClicks}회)`, color: 'from-red-600 to-black', isMajor: true });
    } else if (seconds > 180 && totalClicks < 10) {
        badges.push({ id: 'hermit', title: '음악 속의 은둔자', sub: 'The Musical Hermit', desc: `선택을 미루고 오직 울림표에 몸을 맡겼다. (소요시간: ${sec}초, 클릭: 불과 ${totalClicks}회)`, color: 'from-green-300 to-emerald-500', isMajor: true });
    } else if (totalClicks > 30 && uniqueCards <= 2) {
        badges.push({ id: 'defier', title: '운명을 거스르는 자', sub: 'Defier of Fate', desc: `수많은 터치에도 고집스럽게 좁은 세계만을 파고듦. (클릭: ${totalClicks}회, 탐색: 단 ${uniqueCards}개)`, color: 'from-amber-600 to-amber-800', isMajor: true });
    } else if (seconds > 60 && seconds < 120 && uniqueCards >= 3 && uniqueCards <= 5 && totalClicks < 20) {
        badges.push({ id: 'loyal', title: 'SEAN의 모범 요원', sub: 'SEAN\'s Loyal Agent', desc: `가장 시스템 설계 의도대로 완벽하게 행동했다. (소요: ${sec}초, 탐색: ${uniqueCards}개)`, color: 'from-[#00E5FF] to-blue-500', isMajor: true });
    } else if (selectedLangId === 'ko' && seconds < 20) {
        badges.push({ id: 'prophesied', title: '향수병에 걸린 자', sub: 'The Nostalgic One', desc: `향수병에 이끌리듯 즉시 한국을 택했다. (선택: 한국어, 소요: ${sec}초)`, color: 'from-blue-600 via-white to-red-600', isMajor: true });
    } else if ((selectedLangId === 'ar' || selectedLangId === 'hi') && seconds < 40) {
        badges.push({ id: 'pioneer', title: '미지의 개척자', sub: 'The Unknown Pioneer', desc: `낯선 이국으로 두려움 없이 기꺼이 발을 내디뎠다. (선택: ${selectedLangId === 'ar' ? '아랍어' : '힌디어'}, 탐험 소요: ${sec}초)`, color: 'from-yellow-700 to-yellow-900', isMajor: true });
    } else if (selectedLangId === 'es' && uniqueCards > 4) {
        badges.push({ id: 'romantic', title: '감성 충만 로맨티스트', sub: 'The Hopeless Romantic', desc: `음악에 젖어 열정적인 세계에 결국 정착했다. (선택: 스페인어, 돌아본 세계: ${uniqueCards}개)`, color: 'from-rose-400 to-rose-600', isMajor: true });
    } else if (selectedLangId === 'de' && totalClicks < 15 && seconds > 40) {
        badges.push({ id: 'order', title: '질서를 수호하는 자', sub: 'Guardian of Order', desc: `기계처럼 정확하고 필요한 조작만을 수행. (선택: 독일어, 오직 ${totalClicks}회 클릭)`, color: 'from-gray-700 to-gray-900', isMajor: true });
    } else if (selectedLangId === 'ja' && seconds > 90) {
        badges.push({ id: 'samurai', title: '벚꽃의 무사', sub: 'The Sakura Samurai', desc: `충분히 관망하며 대기한 후 단호하게 검을 뽑았다. (선택: 일본어, 정신 수양: ${sec}초)`, color: 'from-pink-300 to-rose-300', isMajor: true });
    } else if (selectedLangId === 'pl' && uniqueCards >= 5) {
        badges.push({ id: 'polar', title: '백야의 음유시인', sub: 'The Polar Bard', desc: `수많은 세계를 엿보고 독창적인 선율인 북방으로 향했다. (선택: 폴란드어, 스쳐간 세계: ${uniqueCards}개)`, color: 'from-blue-200 to-blue-400', isMajor: true });
    } else if (selectedLangId === 'en' && seconds < 15) {
        badges.push({ id: 'shakespeare', title: '글로벌 스탠다드', sub: 'The Global Standard', desc: `고민 없이 가장 세계적인 공용어를 선택했다. 무난함의 달인. (선택: 영어, 고민 시간: 단 ${sec}초)`, color: 'from-blue-700 to-red-500', isMajor: true });
    } else if (totalClicks === uniqueCards && uniqueCards > 2) {
        badges.push({ id: 'chance', title: '우연을 믿는 자', sub: 'Believer in Chance', desc: `불필요한 조작 없이 오직 새로운 카드만을 뽑아든 타짜. (클릭 ${totalClicks}회 = 탐색 ${uniqueCards}개)`, color: 'from-green-500 to-emerald-700', isMajor: true });
    }

    // Fallback if no major badge matched
    if (badges.length === 0) {
        badges.push({ id: 'fortune', title: '운명의 수레바퀴', sub: 'The Wheel of Fortune', desc: `자신만의 독특한 패턴으로 움직이는 변수 그 자체. (소요: ${sec}초, 조작: ${totalClicks}회, 탐험: ${uniqueCards}개)`, color: 'from-[#C5A059] to-[#e5c996]', isMajor: true });
    }

    // [ Fun Minor Badges: Accumulate these ]
    if (totalClicks >= 1) {
        badges.push({ id: 'm_firstStep', title: '첫 걸음 👣', sub: 'First Step', desc: `미나의 시스템에 흔적을 남겼다. (현재 총 클릭: ${totalClicks}회)` });
    }
    if (totalClicks > 80) {
        badges.push({ id: 'm_spammer', title: '광클러 ⚡', sub: 'Click Spammer', desc: `시스템 부하를 유도할 정도로 심하게 터치했다. (${totalClicks}회 클릭 달성)` });
    }
    if (totalClicks === 2) {
        badges.push({ id: 'm_doubleTap', title: '더블 탭 🎯', sub: 'Double Tap', desc: `정확하게 단 ${totalClicks}번의 조작으로 승부했다.` });
    }
    if (uniqueCards === 2) {
        badges.push({ id: 'm_safety', title: '안전 제일 🛡️', sub: 'Safety First', desc: `딱 하나만 더 비교해보고 끝냈다. (본 카드: ${uniqueCards}개)` });
    }
    if (totalClicks > uniqueCards * 3 && uniqueCards > 0) {
        badges.push({ id: 'm_paranoid', title: '의심병 환자 🕵️', sub: 'Paranoid', desc: `보고 또 보는 치밀함 검증. (${uniqueCards}개 카드를 무려 ${totalClicks}번이나 조작함)` });
    }
    if (seconds < 15) {
        badges.push({ id: 'm_speedrunner', title: '스피드 러너 🏃', sub: 'Speedrunner', desc: `빛과 같이 초스피드로 통과함. (${sec}초 소모)` });
    }
    if (seconds > 200) {
        badges.push({ id: 'm_marathon', title: '마라토너 ⏱️', sub: 'Marathoner', desc: `오랜 시간 방황하고 감상했다. (총 체류 시간: ${sec}초)` });
    }
    if (seconds > 60 && uniqueCards >= 3) {
        badges.push({ id: 'm_cautious', title: '신중한 탐험가 🗺️', sub: 'Cautious Explorer', desc: `여러 우주를 시간을 들여 꼼꼼히 탐색함. (체류: ${sec}초, 탐색: ${uniqueCards}개)` });
    }

    return badges;
};

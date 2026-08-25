// Master Brand Title & Achievement System (칭호 시스템)
export const ATELIER_TITLES = [
    {
        id: 'altstadt_cartographer',
        emoji: '🗺️',
        name: '알트슈타트 고지도 수집가',
        enName: 'Cartographer of Altstadt',
        desc: '1인칭 심야 골목 2단계 시네마틱 퀘스트에서 코너를 돌아 프랑크푸르트 고지도(Mini-Map)를 발견 및 획득함',
        rarity: 'EXPLORER HERITAGE',
        color: '#00FF88'
    },
    {
        id: 'resonance_virtuoso',
        emoji: '⚜️',
        name: '공명 마스터',
        enName: 'Resonance Virtuoso',
        desc: '첫 화면에서 스마트폰 자이로 또는 마우스를 5초간 연속으로 움직여 공명 게이지를 5단계(+50%)까지 최대로 충전함',
        rarity: 'KINETIC MASTER',
        color: '#FFD700'
    },
    {
        id: 'shortcut_master',
        emoji: '🗝️',
        name: '지름길',
        enName: 'The Shortcut',
        desc: '첫 화면에서 디바이스를 빠르게 흔들어(Shake) 숨겨진 아틀리에 뮤지엄 직행 게이트를 즉시 개방함',
        rarity: 'SECRET LEGENDARY',
        color: '#E7FF00'
    },
    {
        id: 'founding_member_2026',
        emoji: '🏢',
        name: '창립년도 2026 멤버',
        enName: 'Founding Member 2026',
        desc: '4단계 및 뮤지엄 허브에서 2026 프랑크푸르트 Unternehmergesellschaft (독일 법인) 아카이브를 열람함',
        rarity: 'ORIGIN VIP',
        color: '#00E5FF'
    },
    {
        id: 'bordeaux_sommelier',
        emoji: '🍷',
        name: '보르도 소믈리에',
        enName: 'Bordeaux Sommelier',
        desc: '프랑크푸르트 심야 02:00 AM 골목길 1단계부터 6단계 살롱 문턱까지 전체 워크스루를 100% 완주함',
        rarity: 'ATELIER MASTER',
        color: '#FF6B8B'
    },
    {
        id: 'steinway_virtuoso',
        emoji: '👑',
        name: '스타인웨이 마에스트로',
        enName: 'Steinway Virtuoso',
        desc: '7단계 최종 보스방 살롱에 입장하여 1924년산 골든 스타인웨이 그랜드 피아노 공간을 정복함',
        rarity: 'SPATIAL ARTIST',
        color: '#FFD700'
    },
    {
        id: 'sanctuary_vip',
        emoji: '👑',
        name: 'VIP 성소 방문자',
        enName: 'Sanctuary VIP',
        desc: '인스타그램 VIP 멤버 인증을 완료하고 프라이빗 볼트(Private Vault) 전용 성소에 입장함',
        rarity: 'ROYAL COUTURE',
        color: '#FFD700'
    },
    {
        id: 'october_gala_vip',
        emoji: '🍸',
        name: '10월 갈라 VIP',
        enName: 'October Gala Invitee',
        desc: '2026년 10월 프랑크푸르트 프라이빗 살롱 그랜드 오픈 갈라 파티 기획 명세서를 확인하고 초대장을 수령함',
        rarity: 'EXCLUSIVE GUEST',
        color: '#A29BFE'
    },
    {
        id: 'sound_connoisseur',
        emoji: '🎧',
        name: '432Hz 사운드 마스터',
        enName: '432Hz Connoisseur',
        desc: '상단 헤더의 당구 물리 충돌과 432Hz 하모닉 사운드 음소거/해제 컨트롤을 직접 작동함',
        rarity: 'ACOUSTIC LAB',
        color: '#00FF88'
    }
];

const STORAGE_KEY = 'jsf_acquired_titles_v1';

export function getAcquiredTitles() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function unlockTitle(titleId) {
    try {
        const acquired = getAcquiredTitles();
        if (!acquired.some(t => t.id === titleId)) {
            const def = ATELIER_TITLES.find(t => t.id === titleId);
            if (def) {
                const updated = [...acquired, { ...def, unlockedAt: new Date().toLocaleDateString('ko-KR') }];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                window.dispatchEvent(new CustomEvent('title_unlocked', { detail: def }));
                return def;
            }
        }
    } catch (e) {
        console.warn("Title unlock error:", e);
    }
    return null;
}

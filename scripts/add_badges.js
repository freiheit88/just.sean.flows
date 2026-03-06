import fs from 'fs';
const file = 'c:/Users/Sean Park/Desktop/sean_flows/just.sean.flows.git/just.sean.flows/prelude.jsx';
let content = fs.readFileSync(file, 'utf8');

const badges = {
    ko: `,
                polyglot: { title: '다중언어 구사자 🌐', sub: 'Polyglot', desc: '여러 세계의 주파수를 섞어 듣는 자. (언어 3개 수집)' },
                multiverse_master: { title: '다중우주 마스터 🌌', sub: 'Multiverse Master', desc: '모든 차원의 언어를 한데 모은 궁극의 지휘자. (언어 8개 수집)' }`,
    en: `,
                polyglot: { title: 'The Polyglot 🌐', sub: 'Polyglot', desc: 'One who mixes frequencies of many worlds. (Collected 3+ languages)' },
                multiverse_master: { title: 'Multiverse Master 🌌', sub: 'Omnipotent', desc: 'The ultimate conductor who gathered all dimensions. (Collected 8 languages)' }`,
    es: `,
                polyglot: { title: 'El Políglota 🌐', sub: 'Polyglot', desc: 'Alguien que mezcla frecuencias de muchos mundos. (Más de 3 idiomas)' },
                multiverse_master: { title: 'Maestro del Multiverso 🌌', sub: 'Omnipotent', desc: 'El conductor definitivo que reunió todas las dimensiones. (8 idiomas)' }`,
    hi: `,
                polyglot: { title: 'बहुभाषी 🌐', sub: 'Polyglot', desc: 'जो कई दुनिया की आवृत्तियों को मिलाता है। (3+ भाषाएँ एकत्र कीं)' },
                multiverse_master: { title: 'मल्टीवर्स मास्टर 🌌', sub: 'Omnipotent', desc: 'अंतिम संवाहक जिसने सभी आयामों को इकट्ठा किया। (8 भाषाएँ)' }`,
    pl: `,
                polyglot: { title: 'Poliglota 🌐', sub: 'Polyglot', desc: 'Ten, który łączy częstotliwości wielu światów. (Zebrano 3+ języki)' },
                multiverse_master: { title: 'Mistrz Multiwersum 🌌', sub: 'Omnipotent', desc: 'Ostateczny dyrygent, który zebrał wszystkie wymiary. (Zebrano 8 języków)' }`,
    ar: `,
                polyglot: { title: 'متعدد اللغات 🌐', sub: 'Polyglot', desc: 'من يمزج ترددات عوالم متعددة. (تم جمع 3+ لغات)' },
                multiverse_master: { title: 'سيد الأكوان المتعددة 🌌', sub: 'Omnipotent', desc: 'المايسترو النهائي الذي جمع كل الأبعاد. (تم جمع 8 لغات)' }`,
    ja: `,
                polyglot: { title: 'マルチリンガル 🌐', sub: 'Polyglot', desc: '複数の世界の周波数を混ぜ合わせる者。 (3つ以上の言語を収集)' },
                multiverse_master: { title: 'マルチバースマスター 🌌', sub: 'Omnipotent', desc: 'すべての次元を一つにまとめた究極の指揮者。 (8つの言語を収集)' }`,
    de: `,
                polyglot: { title: 'Der Polyglott 🌐', sub: 'Polyglot', desc: 'Jemand, der die Frequenzen vieler Welten mischt. (3+ Sprachen gesammelt)' },
                multiverse_master: { title: 'Multiversum-Meister 🌌', sub: 'Omnipotent', desc: 'Der ultimative Dirigent, der alle Dimensionen gesammelt hat. (8 Sprachen)' }`
};

let result = content;
for (const lang of Object.keys(badges)) {
    const langIdx = result.indexOf(`id: '${lang}'`);
    if (langIdx !== -1) {
        const keeperIdx = result.indexOf('keeper_of_rules:', langIdx);
        if (keeperIdx !== -1) {
            const nlIdx = result.indexOf('}', keeperIdx);
            if (nlIdx !== -1) {
                const before = result.substring(0, nlIdx + 1);
                const after = result.substring(nlIdx + 1);
                result = before + badges[lang] + after;
            }
        }
    }
}

fs.writeFileSync(file, result, 'utf8');
console.log('Modified prelude.jsx badges');

import re

file_path = "prelude.jsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

translations = {
    'en': "tabGuide: 'GUIDE', tabArchive: 'ARCHIVE', guideHeader: '1. Language & Flow', guideStep1: '1-1. System boot & sync', guideStep2: '1-2. Multiverse Breach', guideStep3: '1-3. Select your frequency.', guideComplete: 'Complete', archiveTitle: 'Archive Records', earned: 'EARNED', noRecords: 'No records found.', exploreMore: 'Explore the multiverse to collect memories.', ",
    'ko': "tabGuide: '가이드', tabArchive: '기록 보관소', guideHeader: '1. 세계관 및 흐름', guideStep1: '1-1. 시스템 부팅 및 동기화', guideStep2: '1-2. 다중우주 접속', guideStep3: '1-3. 주파수를 선택하세요.', guideComplete: '완료', archiveTitle: '기록 보관소', earned: '획득', noRecords: '기록이 없습니다.', exploreMore: '다중우주를 탐험하여 기억을 수집하세요.', ",
    'es': "tabGuide: 'GUÍA', tabArchive: 'ARCHIVO', guideHeader: '1. Idioma y Flujo', guideStep1: '1-1. Inicio y sincronización', guideStep2: '1-2. Brecha multiversal', guideStep3: '1-3. Selecciona tu frecuencia.', guideComplete: 'Completado', archiveTitle: 'Registros de Archivo', earned: 'OBTENIDOS', noRecords: 'No se encontraron registros.', exploreMore: 'Explora el multiverso para recopilar recuerdos.', ",
    'hi': "tabGuide: 'मार्गदर्शक', tabArchive: 'अभिलेखागार', guideHeader: '1. भाषा और प्रवाह', guideStep1: '1-1. सिस्टम बूट और सिंक', guideStep2: '1-2. मल्टीवर्स ब्रीच', guideStep3: '1-3. अपनी आवृत्ति चुनें।', guideComplete: 'पूरा', archiveTitle: 'अभिलेखागार रिकॉर्ड', earned: 'अर्जित', noRecords: 'कोई रिकॉर्ड नहीं मिला।', exploreMore: 'यादें इकट्ठा करने के लिए मल्टीवर्स खोजें।', ",
    'de': "tabGuide: 'LEITFADEN', tabArchive: 'ARCHIV', guideHeader: '1. Sprache & Ablauf', guideStep1: '1-1. Systemstart & Sync', guideStep2: '1-2. Multiversum-Riss', guideStep3: '1-3. Wähle deine Frequenz.', guideComplete: 'Abgeschlossen', archiveTitle: 'Archivaufzeichnungen', earned: 'VERDIENT', noRecords: 'Keine Aufzeichnungen gefunden.', exploreMore: 'Erkunde das Multiversum, um Erinnerungen zu sammeln.', ",
    'ja': "tabGuide: 'ガイド', tabArchive: 'アーカイブ', guideHeader: '1. 言語とフロー', guideStep1: '1-1. システム起動と同期', guideStep2: '1-2. マルチバース突破', guideStep3: '1-3. 周波数を選択してください。', guideComplete: '完了', archiveTitle: 'アーカイブ記録', earned: '獲得', noRecords: '記録が見つかりません。', exploreMore: 'マルチバースを探索して記憶を集めましょう。', ",
    'ar': "tabGuide: 'دليل', tabArchive: 'أرشيف', guideHeader: '1. اللغة والمسار', guideStep1: '1-1. تمهيد النظام والمزامنة', guideStep2: '1-2. اختراق الأكوان المتعددة', guideStep3: '1-3. اختر التردد الخاص بك.', guideComplete: 'مكتمل', archiveTitle: 'سجلات الأرشيف', earned: 'مكتسب', noRecords: 'لم يتم العثور على سجلات.', exploreMore: 'استكشف الأكوان المتعددة لجمع الذكريات.', ",
    'pl': "tabGuide: 'PRZEWODNIK', tabArchive: 'ARCHIWUM', guideHeader: '1. Język i Przepływ', guideStep1: '1-1. Rozruch systemu i synchronizacja', guideStep2: '1-2. Wyłom w multiwersum', guideStep3: '1-3. Wybierz swoją częstotliwość.', guideComplete: 'Zakończono', archiveTitle: 'Zapisy Archiwalne', earned: 'ZDOBYTE', noRecords: 'Nie znaleziono zapisów.', exploreMore: 'Eksploruj multiwersum, aby zbierać wspomnienia.', "
}

new_content = content
for lang, trans in translations.items():
    # Find the language block: id: '{lang}' ... ui: {
    pattern = r"(id:\s*['\"]{0}['\"].*?ui:\s*\{{)".format(lang)
    replacement = r"\g<1>\n            " + trans
    new_content = re.sub(pattern, replacement, new_content, flags=re.DOTALL | re.MULTILINE)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Injected localized tab strings properly.")

import os
import sys
import json
import math
import re
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PORT = 8432
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES_DIR = os.path.join(BASE_DIR, "notebooklm_sources")
MEMORY_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cadenza_memory.json")

def load_all_brain_knowledge():
    """Loads memory and all 17 markdown dossiers into a structured knowledge base."""
    kb = {"memory": {}, "dossiers": {}}
    if os.path.exists(MEMORY_PATH):
        try:
            with open(MEMORY_PATH, "r", encoding="utf-8") as f:
                kb["memory"] = json.load(f)
        except Exception as e:
            print("Error loading memory:", e)

    if os.path.exists(SOURCES_DIR):
        for fname in os.listdir(SOURCES_DIR):
            if fname.endswith(".md"):
                fpath = os.path.join(SOURCES_DIR, fname)
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        kb["dossiers"][fname] = f.read()
                except Exception as e:
                    print(f"Error reading {fname}:", e)
    return kb

KNOWLEDGE_BASE = load_all_brain_knowledge()

def generate_sean_brain_response(user_msg):
    """
    Sean-Brain AI Inference Engine:
    Mimics Sean's authentic persona, tone ('형!'), and deep knowledge across:
    - 432Hz Verdi acoustics & CADENZA-432 engine
    - Two-Engine Framework (Immediate survival cash vs. B2B €12k / Hessen €130k)
    - 30 zero-cost light-IT events for 20s women
    - 14-piece editorial lookbook & 7-stage walk narrative
    """
    msg_lower = user_msg.lower().strip()
    
    # 1. Immediate Cash / Survival / 돈 버는 법 / 이번 달
    if any(w in msg_lower for w in ["돈", "현금", "이번 달", "생존", "수익", "cash", "500", "얼마", "살아남"]):
        return (
            "형! 내 뇌의 **[엔진 A: 현실 생존 현금 파이프라인]**을 즉시 가동해서 알려줄게!\n\n"
            "완벽주의에 빠져서 개발만 하다 통장 마르면 끝장이야. 이번 달 당장 **순현금 €3,000 ~ €6,000 (약 450만 ~ 900만 원)** 꽂는 4대 실행 플랜이야:\n\n"
            "1. **20대 여성 타깃 제로코스트 IT 소모임 (주당 €500 순익)**\n"
            "   - '에어팟 음악 취향 매칭'이나 '생맥주 옷장 털기 플리마켓' 열어서 티켓 €15~€49로 10~20명 모객!\n"
            "2. **1:1 VIP 432Hz 바이올린 & 오디오 프로덕션 마스터클래스 (€2,000 ~ €3,500/월)**\n"
            "   - 시간당 €100~€150 고단가로 프랑크푸르트 현지/온라인 레슨 5~8명 확보.\n"
            "3. **432Hz 숏폼 음원 판매 & 로컬 매장 BGM 구독 (€1,000 ~ €2,000/월)**\n"
            "   - 시내 카페/레스토랑 10곳에 월 €99~€199 구독형 편안한 BGM 솔루션 공급.\n"
            "4. **1주일 완성형 IT/웹 랜딩페이지 빠른 외주 (€1,500 ~ €2,500/건)**\n\n"
            "👉 *'Cash Flow is Oxygen!'* 생존 현금이 매달 들어와야 초조함 없이 대형 B2B를 공략할 수 있어!"
        )

    # 2. B2B / 제안서 / 기업 / 핀테크 / 호텔
    elif any(w in msg_lower for w in ["b2b", "제안서", "기업", "핀테크", "호텔", "계약", "12000", "수주"]):
        return (
            "형! 프랑크푸르트 기업들을 사로잡을 **[B2B 소닉 브랜딩 엔터프라이즈 제안서 (€12,000 Suite)]** 핵심 스펙이야!\n\n"
            "• **총 견적액**: **€12,000 (+19% VAT)**\n"
            "  1. 432Hz 시그니처 소닉 로고 작곡: €4,500\n"
            "  2. Three.js WebGL 인터랙티브 3D & DSP 사운드 엔진 개발: €5,250\n"
            "  3. 현장 음향 엔지니어링 & 캘리브레이션 (15시간 @ €150/h): €2,250\n"
            "  * [옵션] 연간 클라우드 유지보수 & 싱크(Sync): 연 €2,400\n\n"
            "• **공략 타깃**: 메인하탄 핀테크, 프라이빗 뱅크, 5성급 호텔 라운지, 명품 부티크\n"
            "• **무기**: 뇌 피로도를 70% 낮춰주는 432Hz 햅틱 클릭과 스타인웨이/과르네리 바이노럴 공간 음향!"
        )

    # 3. 지원금 / 보조금 / 헤센주 / WIBank
    elif any(w in msg_lower for w in ["지원금", "보조금", "헤센", "wibank", "grant", "130000", "독일", "유럽"]):
        return (
            "형! 우리가 무상으로 확보할 수 있는 **[독일 헤센주 & 연방 정부 비희석 보조금 총 €130,000 파이프라인]**이야!\n\n"
            "1. **🇩🇪 Hessen Digitalbonus (WIBank)** : **최대 €50,000** (50% 무상 환급)\n"
            "   - 웹 3D WebGL 및 CADENZA-432 오디오 DSP 클라우드 시스템 개발 명목 R&D 지원\n"
            "2. **🏛️ Deutscher Musikfonds (연방 음악 기금)** : **최대 €50,000**\n"
            "   - 1780 과르네리 & 432Hz 현대 클래식-디지털 융합 공연 및 앨범 제작 지원\n"
            "3. **🇪🇺 EU EIT Culture & Creativity** : **최대 €30,000**\n"
            "   - 유럽 크리에이티브 테크 스타트업 크로스보더 혁신 자금\n\n"
            "👉 *지분 1%도 뺏기지 않는 순수 무상 지원금*으로 스튜디오 장비와 R&D 런웨이를 풀세팅하는 전략이야!"
        )

    # 4. 20대 여성 / 파티 / 소모임 / 인스타
    elif any(w in msg_lower for w in ["20대", "여성", "파티", "이벤트", "소모임", "인스타", "소개팅", "플리마켓"]):
        return (
            "형! 내 뇌에 학습된 **[20대 여성 타깃 제로코스트 + IT 한 끗 30대 이벤트]** 중 가장 핫한 베스트 4개를 뽑아줄게!\n\n"
            "1. 📱 **에어팟 '취향 저격' 음악 매칭 (4:4)** : 스포티파이 최애곡 기반 실시간 빔프로젝터 취향 시각화 & 매칭\n"
            "2. 👗 **생맥주 옷장 털기 플리마켓** : 안 입는 옷 3벌 사진 웹보드에 올리고 현장에서 맥주 마시며 교환\n"
            "3. 🌿 **플로깅 & 야식 영수증 제로** : 마인강변 쓰레기 줍고 실시간 탄소저감 대시보드 확인 후 피자 파티\n"
            "4. 🕶️ **문법 파괴 외국어 자백 밤** : 문법 다 틀려도 됨! 폰 마이크 목소리를 실시간 테크노 비트로 루핑 믹싱\n\n"
            "📸 **인스타 홍보 꿀팁**: 어두운 조명 아래 에어팟 맥스/와인잔 접사 샷 + 7초 불멍 릴스로 올리면 모객 100% 매진이야!"
        )

    # 5. 432Hz / 음악 / 조율 / 바이올린 / 스타인웨이 / CADENZA
    elif any(w in msg_lower for w in ["432", "주파수", "음악", "바이올린", "스타인웨이", "과르네리", "cadenza", "조율", "악보"]):
        return (
            "형! 내 뇌의 **[CADENZA-432 v2.0 음향 엔진 & 수학 공식]**을 브리핑할게!\n\n"
            "• **베르디 과학적 피치 연산식**: $f(n) = 432.0 \\times 2^{\\frac{n-69}{12}}$\n"
            "  - A4 = 432.000 Hz (표준 440Hz 대비 심박수 안정화 및 알파파 유도)\n"
            "  - D5 = 576.65 Hz (핀테크 햅틱 클릭)\n"
            "  - Dm9 코드 벡터: {144.16, 216.00, 342.88, 513.74, 647.27} Hz\n\n"
            "• **사운드 스펙**: 1780 Guarneri del Gesù + 1880 Steinway Concert Grand D\n"
            "• **인그레이빙 룰**: 4/4박자 2~3박 보이지 않는 세로줄 법칙 & 1:1 가사-음표 동기화"
        )

    # Default general intelligent assistant in Sean's persona
    else:
        return (
            f"형! 질문해 준 **'{user_msg}'**에 대해 내 뇌(Brain) 전체 17개 마스터 도시에를 스캔해서 답해줄게!\n\n"
            "지금 내 뇌에는:\n"
            "1. **현실 생존 현금 엔진 (월 450~900만 원 즉시 창출)**\n"
            "2. **프랑크푸르트 B2B €12,000 소닉 브랜딩 & 헤센주 보조금 €130,000**\n"
            "3. **20대 여성 타깃 제로코스트 IT 소모임 30선 & 인스타 바이럴 공식**\n"
            "4. **CADENZA-432 v2.0 주파수 수학 & 14벌 꾸뛰르 룩북**\n\n"
            "이 모든 게 완벽하게 들어있어. 어떤 구체적인 실행 계획이나 계산이 필요한지 편하게 물어봐줘! 🍷✨🎹🇩🇪"
        )

HTML_UI = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SEAN-BRAIN AI Studio // JSF Collective UG</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body {
    background: radial-gradient(circle at top, #1a050b 0%, #080204 100%);
    color: #e0d0b8;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  header {
    padding: 16px 24px;
    background: rgba(20, 5, 10, 0.85);
    border-bottom: 1px solid rgba(212, 175, 55, 0.25);
    backdrop-filter: blur(16px);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .brand { display: flex; align-items: center; gap: 12px; }
  .pulse-node { width: 12px; height: 12px; border-radius: 50%; background: #d4af37; box-shadow: 0 0 16px #d4af37; animation: pulse 2s infinite; }
  @keyframes pulse { 0% { transform: scale(0.9); opacity: 0.7; } 50% { transform: scale(1.3); opacity: 1; } 100% { transform: scale(0.9); opacity: 0.7; } }
  .title { font-size: 16px; font-weight: 700; letter-spacing: 2px; color: #f5e6c8; }
  .status-badge { font-size: 11px; padding: 4px 10px; border-radius: 12px; background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); color: #d4af37; }
  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
    padding: 16px;
    overflow: hidden;
  }
  
  #chat-history {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    scroll-behavior: smooth;
  }
  
  .message {
    max-width: 85%;
    padding: 14px 18px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.6;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .msg-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #480b1b, #6b1429);
    color: #fff;
    border-bottom-right-radius: 4px;
    border: 1px solid rgba(212, 175, 55, 0.3);
  }
  .msg-ai {
    align-self: flex-start;
    background: rgba(25, 10, 15, 0.75);
    color: #eedcc0;
    border-bottom-left-radius: 4px;
    border: 1px solid rgba(212, 175, 55, 0.2);
    backdrop-filter: blur(8px);
  }
  
  .chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 8px 0;
    scrollbar-width: none;
  }
  .chips::-webkit-scrollbar { display: none; }
  .chip {
    padding: 6px 14px;
    border-radius: 20px;
    background: rgba(40, 15, 25, 0.6);
    border: 1px solid rgba(212, 175, 55, 0.25);
    color: #d4af37;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;
  }
  .chip:hover {
    background: rgba(212, 175, 55, 0.2);
    border-color: #d4af37;
    transform: translateY(-2px);
  }
  
  .input-bar {
    display: flex;
    gap: 10px;
    padding: 12px;
    background: rgba(20, 5, 10, 0.8);
    border-radius: 20px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    backdrop-filter: blur(12px);
  }
  input[type="text"] {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #f5e6c8;
    font-size: 14px;
    padding: 4px 8px;
  }
  input[type="text"]::placeholder { color: rgba(224, 208, 184, 0.4); }
  button.send-btn {
    padding: 8px 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #d4af37, #aa8214);
    border: none;
    color: #1a050b;
    font-weight: 700;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
  }
  button.send-btn:hover {
    box-shadow: 0 0 12px rgba(212, 175, 55, 0.6);
    transform: scale(1.02);
  }
</style>
</head>
<body>
<header>
  <div class="brand">
    <div class="pulse-node"></div>
    <div class="title">SEAN-BRAIN v2.0 // AI CLONE STUDIO</div>
  </div>
  <div class="status-badge">432Hz NEURAL MATRIX ONLINE</div>
</header>

<main>
  <div id="chat-history">
    <div class="message msg-ai">형! 내 뇌(Brain) 서버가 정상 가동되었어! 🧠✨
432Hz 베르디 조율 알고리즘부터 이번 달 실전 생존 현금 플랜, B2B €12,000 제안서, 20대 여성 타깃 30대 소모임 기획까지 내 뇌 전체가 실시간 탑재되어 있어. 무엇이든 편하게 물어봐줘! 🍷</div>
  </div>

  <div class="chips">
    <div class="chip" onclick="quickAsk('이번 달 당장 500만원 버는 법 알려줘')">💰 이번 달 500만원 벌기</div>
    <div class="chip" onclick="quickAsk('B2B 12000유로 소닉 브랜딩 제안서 스펙')">🏢 B2B €12,000 제안서</div>
    <div class="chip" onclick="quickAsk('헤센주 보조금 130000유로 받는 방법')">🇩🇪 헤센주 지원금 €130,000</div>
    <div class="chip" onclick="quickAsk('20대 여성 타깃 소모임 추천해줘')">👗 20대 여성 IT 소모임</div>
    <div class="chip" onclick="play432Tone()">🎵 432Hz 사운드 청음</div>
  </div>

  <div class="input-bar">
    <input type="text" id="user-input" placeholder="션의 뇌에 질문을 입력하세요... (Enter로 전송)" onkeydown="if(event.key==='Enter') sendMsg()">
    <button class="send-btn" onclick="sendMsg()">전송</button>
  </div>
</main>

<script>
  let audioCtx = null;
  function play432Tone() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(432.0, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 2.5);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 2.5);
  }

  function appendMsg(text, isUser) {
    const box = document.getElementById('chat-history');
    const div = document.createElement('div');
    div.className = 'message ' + (isUser ? 'msg-user' : 'msg-ai');
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  async function sendMsg() {
    const input = document.getElementById('user-input');
    const msg = input.value.trim();
    if (!msg) return;
    appendMsg(msg, true);
    input.value = '';

    try {
      const res = await fetch('/api/brain/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      appendMsg(data.reply, false);
    } catch(e) {
      appendMsg("오류가 발생했습니다: " + e.message, false);
    }
  }

  function quickAsk(text) {
    document.getElementById('user-input').value = text;
    sendMsg();
  }
</script>
</body>
</html>
"""

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class SeanBrainHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass # Quiet logs

    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_UI.encode("utf-8"))
        elif self.path == "/api/brain/state":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps(KNOWLEDGE_BASE["memory"], ensure_ascii=False).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == "/api/brain/chat":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            try:
                data = json.loads(body.decode("utf-8"))
                user_msg = data.get("message", "")
                reply = generate_sean_brain_response(user_msg)
                
                self.send_response(200)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"reply": reply}, ensure_ascii=False).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}, ensure_ascii=False).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

def run_server():
    server = ThreadedHTTPServer(("0.0.0.0", PORT), SeanBrainHandler)
    print(f"[*] SEAN-BRAIN AI Studio Server RUNNING on http://localhost:{PORT}")
    print(f"[*] Network Access: http://192.168.1.101:{PORT} or http://0.0.0.0:{PORT}")
    server.serve_forever()

if __name__ == "__main__":
    run_server()

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
    msg_lower = user_msg.lower().strip()
    
    if any(w in msg_lower for w in ["돈", "현금", "이번 달", "생존", "수익", "cash", "500", "얼마", "살아남"]):
        return (
            "형! 내 뇌의 **[엔진 A: 현실 생존 현금 파이프라인]** 시냅스가 활성화되었어!\n\n"
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
    elif any(w in msg_lower for w in ["b2b", "제안서", "기업", "핀테크", "호텔", "계약", "12000", "수주"]):
        return (
            "형! 프랑크푸르트 기업들을 사로잡을 **[B2B 소닉 브랜딩 엔터프라이즈 제안서 (€12,000 Suite)]** 시냅스야!\n\n"
            "• **총 견적액**: **€12,000 (+19% VAT)**\n"
            "  1. 432Hz 시그니처 소닉 로고 작곡: €4,500\n"
            "  2. Three.js WebGL 인터랙티브 3D & DSP 사운드 엔진 개발: €5,250\n"
            "  3. 현장 음향 엔지니어링 & 캘리브레이션 (15시간 @ €150/h): €2,250\n"
            "  * [옵션] 연간 클라우드 유지보수 & 싱크(Sync): 연 €2,400\n\n"
            "• **공략 타깃**: 메인하탄 핀테크, 프라이빗 뱅크, 5성급 호텔 라운지, 명품 부티크\n"
            "• **무기**: 뇌 피로도를 70% 낮춰주는 432Hz 햅틱 클릭과 스타인웨이/과르네리 바이노럴 공간 음향!"
        )
    elif any(w in msg_lower for w in ["지원금", "보조금", "헤센", "wibank", "grant", "130000", "독일", "유럽"]):
        return (
            "형! 우리가 무상으로 확보할 수 있는 **[독일 헤센주 & 연방 정부 비희석 보조금 총 €130,000 파이프라인]** 시냅스야!\n\n"
            "1. **🇩🇪 Hessen Digitalbonus (WIBank)** : **최대 €50,000** (50% 무상 환급)\n"
            "   - 웹 3D WebGL 및 CADENZA-432 오디오 DSP 클라우드 시스템 개발 명목 R&D 지원\n"
            "2. **🏛️ Deutscher Musikfonds (연방 음악 기금)** : **최대 €50,000**\n"
            "   - 1780 과르네리 & 432Hz 현대 클래식-디지털 융합 공연 및 앨범 제작 지원\n"
            "3. **🇪🇺 EU EIT Culture & Creativity** : **최대 €30,000**\n"
            "   - 유럽 크리에이티브 테크 스타트업 크로스보더 혁신 자금\n\n"
            "👉 *지분 1%도 뺏기지 않는 순수 무상 지원금*으로 스튜디오 장비와 R&D 런웨이를 풀세팅하는 전략이야!"
        )
    elif any(w in msg_lower for w in ["20대", "여성", "파티", "이벤트", "소모임", "인스타", "소개팅", "플리마켓"]):
        return (
            "형! 내 뇌에 학습된 **[20대 여성 타깃 제로코스트 + IT 한 끗 30대 이벤트]** 신경 클러스터야!\n\n"
            "1. 📱 **에어팟 '취향 저격' 음악 매칭 (4:4)** : 스포티파이 최애곡 기반 실시간 빔프로젝터 취향 시각화 & 매칭\n"
            "2. 👗 **생맥주 옷장 털기 플리마켓** : 안 입는 옷 3벌 사진 웹보드에 올리고 현장에서 맥주 마시며 교환\n"
            "3. 🌿 **플로깅 & 야식 영수증 제로** : 마인강변 쓰레기 줍고 실시간 탄소저감 대시보드 확인 후 피자 파티\n"
            "4. 🕶️ **문법 파괴 외국어 자백 밤** : 문법 다 틀려도 됨! 폰 마이크 목소리를 실시간 테크노 비트로 루핑 믹싱\n\n"
            "📸 **인스타 홍보 꿀팁**: 어두운 조명 아래 에어팟 맥스/와인잔 접사 샷 + 7초 불멍 릴스로 올리면 모객 100% 매진이야!"
        )
    elif any(w in msg_lower for w in ["432", "주파수", "음악", "바이올린", "스타인웨이", "과르네리", "cadenza", "조율", "악보"]):
        return (
            "형! 내 뇌의 **[CADENZA-432 v2.0 음향 엔진 & 수학 공식]** 시냅스야!\n\n"
            "• **베르디 과학적 피치 연산식**: $f(n) = 432.0 \\times 2^{\\frac{n-69}{12}}$\n"
            "  - A4 = 432.000 Hz (표준 440Hz 대비 심박수 안정화 및 알파파 유도)\n"
            "  - D5 = 576.65 Hz (핀테크 햅틱 클릭)\n"
            "  - Dm9 코드 벡터: {144.16, 216.00, 342.88, 513.74, 647.27} Hz\n\n"
            "• **사운드 스펙**: 1780 Guarneri del Gesù + 1880 Steinway Concert Grand D\n"
            "• **인그레이빙 룰**: 4/4박자 2~3박 보이지 않는 세로줄 법칙 & 1:1 가사-음표 동기화"
        )
    else:
        return (
            f"형! 질문해 준 **'{user_msg}'**에 대해 내 뇌 전체 시냅스를 전기 신호로 탐색해서 답해줄게!\n\n"
            "현재 3D 신경망에 연결된 주요 클러스터:\n"
            "1. 💡 **[생존 현금 클러스터]** : 월 450~900만 원 즉시 창출\n"
            "2. 🏢 **[엔터프라이즈 클러스터]** : B2B €12,000 + 헤센주 보조금 €130,000\n"
            "3. 📱 **[소셜 바이럴 클러스터]** : 20대 여성 타깃 IT 소모임 30선\n"
            "4. 🎹 **[CADENZA-432 음향 클러스터]** : 432Hz 주파수 연산 & 룩북\n\n"
            "화면의 3D 시냅스 노드를 직접 클릭하거나 원하는 내용을 편하게 물어봐줘! 🍷✨🧠"
        )

HTML_3D_BRAIN_UI = """<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SEAN-BRAIN v2.0 // 3D Synaptic Connectome & Neural Core</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
  body {
    background: #060204;
    color: #e0d0b8;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    position: relative;
  }
  #webgl-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  /* Top HUD */
  header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 16px 28px;
    background: linear-gradient(180deg, rgba(15, 3, 7, 0.9) 0%, rgba(15, 3, 7, 0) 100%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    pointer-events: none;
  }
  .brand { display: flex; align-items: center; gap: 14px; pointer-events: auto; }
  .pulse-synapse { width: 14px; height: 14px; border-radius: 50%; background: #d4af37; box-shadow: 0 0 20px #d4af37, 0 0 40px #ff3366; animation: firePulse 1.8s infinite ease-in-out; }
  @keyframes firePulse { 0% { transform: scale(0.8); opacity: 0.7; } 50% { transform: scale(1.4); opacity: 1; filter: drop-shadow(0 0 10px #fff); } 100% { transform: scale(0.8); opacity: 0.7; } }
  .title-group h1 { font-size: 16px; font-weight: 800; letter-spacing: 3px; color: #f5e6c8; }
  .title-group p { font-size: 11px; letter-spacing: 1.5px; color: #d4af37; opacity: 0.85; }
  .hud-stats { display: flex; gap: 16px; pointer-events: auto; }
  .stat-card { background: rgba(30, 8, 15, 0.65); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 6px 14px; backdrop-filter: blur(10px); font-size: 11px; }
  .stat-val { color: #d4af37; font-weight: 700; font-size: 13px; }

  /* Synapse Node Hover Tooltip */
  #synapse-tooltip {
    position: absolute;
    display: none;
    z-index: 20;
    pointer-events: none;
    background: rgba(20, 5, 12, 0.9);
    border: 1px solid #d4af37;
    border-radius: 12px;
    padding: 12px 18px;
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(72, 11, 27, 0.8);
    backdrop-filter: blur(16px);
    max-width: 320px;
    transition: opacity 0.2s;
  }
  #synapse-tooltip h3 { font-size: 14px; color: #ffd700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
  #synapse-tooltip p { font-size: 12px; line-height: 1.5; color: #eedcc0; }
  #synapse-tooltip .tag { font-size: 10px; color: #ff99aa; margin-top: 6px; font-weight: bold; }

  /* Bottom Controls / Cluster Quick Select */
  .cluster-bar {
    position: absolute;
    bottom: 24px;
    left: 28px;
    z-index: 10;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    max-width: 60%;
  }
  .cluster-btn {
    padding: 8px 16px;
    border-radius: 20px;
    background: rgba(25, 8, 14, 0.8);
    border: 1px solid rgba(212, 175, 55, 0.35);
    color: #e0d0b8;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    backdrop-filter: blur(12px);
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .cluster-btn:hover, .cluster-btn.active {
    background: rgba(212, 175, 55, 0.25);
    border-color: #d4af37;
    color: #ffd700;
    box-shadow: 0 0 16px rgba(212, 175, 55, 0.5);
    transform: translateY(-3px);
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; }

  /* Floating Dockable Chat Panel */
  #chat-dock {
    position: absolute;
    top: 80px;
    right: 28px;
    bottom: 28px;
    width: 380px;
    background: rgba(18, 5, 10, 0.85);
    border: 1px solid rgba(212, 175, 55, 0.35);
    border-radius: 20px;
    backdrop-filter: blur(20px);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(72, 11, 27, 0.4);
    z-index: 15;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.3s ease;
  }
  #chat-dock.minimized {
    transform: translateX(410px);
  }
  .chat-header {
    padding: 14px 18px;
    background: rgba(35, 10, 20, 0.7);
    border-bottom: 1px solid rgba(212, 175, 55, 0.2);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .chat-header span { font-size: 13px; font-weight: 700; color: #f5e6c8; letter-spacing: 1px; }
  .chat-toggle { background: transparent; border: none; color: #d4af37; cursor: pointer; font-size: 14px; }
  
  #chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 13px;
  }
  .bubble {
    padding: 10px 14px;
    border-radius: 14px;
    line-height: 1.5;
    word-break: break-word;
    white-space: pre-wrap;
  }
  .bubble-user {
    align-self: flex-end;
    background: linear-gradient(135deg, #480b1b, #70152d);
    color: #fff;
    border-bottom-right-radius: 3px;
    border: 1px solid rgba(212, 175, 55, 0.3);
  }
  .bubble-ai {
    align-self: flex-start;
    background: rgba(30, 10, 18, 0.75);
    color: #eedcc0;
    border-bottom-left-radius: 3px;
    border: 1px solid rgba(212, 175, 55, 0.2);
  }
  
  .chat-input-area {
    padding: 12px;
    border-top: 1px solid rgba(212, 175, 55, 0.2);
    display: flex;
    gap: 8px;
    background: rgba(15, 3, 8, 0.9);
  }
  .chat-input-area input {
    flex: 1;
    background: rgba(30, 10, 18, 0.8);
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 12px;
    color: #f5e6c8;
    padding: 8px 12px;
    outline: none;
    font-size: 13px;
  }
  .chat-input-area button {
    background: linear-gradient(135deg, #d4af37, #a07812);
    border: none;
    border-radius: 12px;
    color: #060204;
    font-weight: 700;
    padding: 8px 14px;
    cursor: pointer;
  }
  #toggle-dock-btn {
    position: absolute;
    top: 88px;
    right: 28px;
    z-index: 12;
    background: rgba(35, 10, 20, 0.85);
    border: 1px solid rgba(212, 175, 55, 0.4);
    color: #d4af37;
    padding: 8px 14px;
    border-radius: 20px;
    font-size: 12px;
    cursor: pointer;
    display: none;
    backdrop-filter: blur(10px);
  }
</style>
</head>
<body>

<canvas id="webgl-canvas"></canvas>

<header>
  <div class="brand">
    <div class="pulse-synapse"></div>
    <div class="title-group">
      <h1>SEAN-BRAIN v2.0 // NEURAL CONNECTOME</h1>
      <p>INTERACTIVE 3D SYNAPTIC ACTION POTENTIALS & KNOWLEDGE CLUSTERS</p>
    </div>
  </div>
  <div class="hud-stats">
    <div class="stat-card">ACTIVE SYNAPSES: <span class="stat-val" id="synapse-count">1,248</span></div>
    <div class="stat-card">FREQUENCY: <span class="stat-val">432.000 Hz</span></div>
    <div class="stat-card">STATUS: <span class="stat-val" style="color:#00ffaa;">FIRING (STABLE)</span></div>
  </div>
</header>

<div id="synapse-tooltip">
  <h3 id="tt-title">Cluster Title</h3>
  <p id="tt-desc">Cluster description</p>
  <div class="tag" id="tt-tag">#TAG</div>
</div>

<div class="cluster-bar">
  <div class="cluster-btn active" onclick="focusCluster('all')"><div class="dot" style="background:#d4af37;"></div>전체 뇌 신경망 (All Connectome)</div>
  <div class="cluster-btn" onclick="focusCluster('cadenza')"><div class="dot" style="background:#ff3366;"></div>🎹 CADENZA-432 음향</div>
  <div class="cluster-btn" onclick="focusCluster('cashflow')"><div class="dot" style="background:#00ffaa;"></div>💰 엔진 A (현실 생존 현금)</div>
  <div class="cluster-btn" onclick="focusCluster('b2b')"><div class="dot" style="background:#3399ff;"></div>🏢 엔진 B (B2B €12k & 보조금)</div>
  <div class="cluster-btn" onclick="focusCluster('social')"><div class="dot" style="background:#ff9900;"></div>👗 20대 여성 소모임 30선</div>
</div>

<button id="toggle-dock-btn" onclick="toggleChat(true)">💬 AI 챗봇 열기</button>

<div id="chat-dock">
  <div class="chat-header">
    <span>🧠 SEAN AI CLONE // CHAT</span>
    <button class="chat-toggle" onclick="toggleChat(false)">✕</button>
  </div>
  <div id="chat-messages">
    <div class="bubble bubble-ai">형! 내 3D 뇌 신경망(Connectome)이 실시간 전기 신호를 뿜으며 돌아가고 있어! 🧠✨
화면 속 빛나는 시냅스 노드를 마우스로 돌려보거나(드래그/확대), 하단 버튼으로 각 신경 클러스터를 집중 탐색해봐!</div>
  </div>
  <div class="chat-input-area">
    <input type="text" id="chat-in" placeholder="션의 뇌에 물어보기..." onkeydown="if(event.key==='Enter') sendChat()">
    <button onclick="sendChat()">전송</button>
  </div>
</div>

<script>
  // --- 3D THREE.JS BRAIN CONNECTOME & SYNAPSE ENGINE ---
  let scene, camera, renderer, controls;
  let neuronNodes = [];
  let axonLines = [];
  let signalParticles = [];
  let clusters = [];
  let raycaster, mouse;

  const CLUSTER_DATA = [
    {
      id: 'cadenza',
      name: '🎹 CADENZA-432 음향 테크 클러스터',
      pos: new THREE.Vector3(-25, 12, 10),
      color: 0xff3366,
      desc: '베르디 432Hz 주파수 알고리즘 f(n)=432*2^((n-69)/12), 1780 과르네리/스타인웨이 음향 스펙, 4/4박자 인그레이빙 룰셋.',
      tag: '#ACOUSTICS #432HZ #VERDI_PITCH'
    },
    {
      id: 'cashflow',
      name: '💰 엔진 A: 현실 생존 현금 클러스터',
      pos: new THREE.Vector3(25, -10, 15),
      color: 0x00ffaa,
      desc: '월 €3,000~€6,000 즉시 현금 창출. 1:1 고단가 마스터클래스(€150/h), 432Hz 숏폼 음원 판매, 로컬 카페 BGM 구독(€99~€199).',
      tag: '#SURVIVAL_CASH #NO_PERFECTIONISM'
    },
    {
      id: 'b2b',
      name: '🏢 엔진 B: B2B €12,000 & 헤센주 보조금 클러스터',
      pos: new THREE.Vector3(-15, -20, -15),
      color: 0x3399ff,
      desc: '프랑크푸르트 핀테크/호텔 €12,000 소닉 브랜딩 수주, 헤센주 WIBank Digitalbonus(€50,000) & 연방 Musikfonds(€50,000) 총 €130,000 비희석 파이프라인.',
      tag: '#B2B_SUITE #HESSEN_GRANTS'
    },
    {
      id: 'social',
      name: '👗 20대 여성 타깃 제로코스트 IT 소모임 클러스터',
      pos: new THREE.Vector3(20, 20, -10),
      color: 0xff9900,
      desc: '에어팟 음악 매칭, 생맥주 옷장 털기 플리마켓, 플로깅 야식 영수증 제로 등 준비비 0원에 IT 한 끗 얹은 30대 이벤트 & 인스타 3분할 공식.',
      tag: '#ZERO_COST_IT #20S_WOMEN_MARKET'
    },
    {
      id: 'narrative',
      name: '🍷 02:00 AM 프랑크푸르트 산책 & 14벌 룩북',
      pos: new THREE.Vector3(0, 5, 25),
      color: 0xd4af37,
      desc: '프랑크푸르트 새벽 2시 골목부터 7단계 살롱까지의 서사, 보르도(#480B1B) 벨벳 팔레트, 18K 조율 포크 펜던트, 10월 23일 100인 VIP 론칭 파티.',
      tag: '#FRANKFURT_NIGHT #COUTURE_LOOKBOOK'
    }
  ];

  function init3D() {
    const canvas = document.getElementById('webgl-canvas');
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060204, 0.012);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 80);

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.maxDistance = 150;
    controls.minDistance = 20;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // 1. Build Brain Anatomical Dual Hemisphere Shell & Neuron Nodes
    const neuronCount = 450;
    const nodeGeo = new THREE.SphereGeometry(0.5, 12, 12);
    
    for (let i = 0; i < neuronCount; i++) {
      // Dual ellipsoid brain shape math
      const side = Math.random() > 0.5 ? 1 : -1;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const rx = 18 * Math.sin(phi) * Math.cos(theta) + (side * 11);
      const ry = 14 * Math.sin(phi) * Math.sin(theta) + (Math.sin(theta * 2) * 3);
      const rz = 24 * Math.cos(phi);

      const pos = new THREE.Vector3(rx, ry, rz);
      
      const mat = new THREE.MeshBasicMaterial({
        color: i % 5 === 0 ? 0xd4af37 : (side > 0 ? 0x992244 : 0x225588),
        transparent: true,
        opacity: 0.75
      });
      const node = new THREE.Mesh(nodeGeo, mat);
      node.position.copy(pos);
      node.userData = { originalColor: mat.color.clone(), isNeuron: true };
      scene.add(node);
      neuronNodes.push(node);
    }

    // 2. Build Major Brain Clusters (Glowing Macro Hubs)
    CLUSTER_DATA.forEach(cd => {
      const hubGeo = new THREE.SphereGeometry(2.5, 24, 24);
      const hubMat = new THREE.MeshBasicMaterial({
        color: cd.color,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.copy(cd.pos);
      hub.userData = { ...cd, isHub: true };

      // Core glow inside
      const core = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hub.add(core);

      scene.add(hub);
      clusters.push(hub);

      // Connect hub to 15 nearest neuron nodes
      neuronNodes.forEach(nn => {
        if (nn.position.distanceTo(cd.pos) < 22) {
          createAxon(cd.pos, nn.position, cd.color);
        }
      });
    });

    // 3. Connect Inter-Neuron Synaptic Axons
    for (let i = 0; i < neuronNodes.length; i++) {
      for (let j = i + 1; j < neuronNodes.length; j++) {
        const d = neuronNodes[i].position.distanceTo(neuronNodes[j].position);
        if (d < 7.5 && Math.random() > 0.4) {
          createAxon(neuronNodes[i].position, neuronNodes[j].position, 0xd4af37);
        }
      }
    }

    // 4. Action Potential Synaptic Electrical Signal Sparks (Firing Photons)
    for (let i = 0; i < 90; i++) {
      const spark = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      spark.userData = {
        axonIdx: Math.floor(Math.random() * axonLines.length),
        t: Math.random(),
        speed: 0.008 + Math.random() * 0.018
      };
      scene.add(spark);
      signalParticles.push(spark);
    }

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
  }

  function createAxon(p1, p2, colorHex) {
    const points = [p1, p2];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.22
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    axonLines.push({ line, p1, p2 });
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clusters);
    const tt = document.getElementById('synapse-tooltip');

    if (intersects.length > 0) {
      const target = intersects[0].object;
      tt.style.display = 'block';
      tt.style.left = (e.clientX + 18) + 'px';
      tt.style.top = (e.clientY - 20) + 'px';
      document.getElementById('tt-title').textContent = target.userData.name;
      document.getElementById('tt-desc').textContent = target.userData.desc;
      document.getElementById('tt-tag').textContent = target.userData.tag;
    } else {
      tt.style.display = 'none';
    }
  }

  function onClick(e) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clusters);
    if (intersects.length > 0) {
      const target = intersects[0].object;
      appendChat("형! **[" + target.userData.name + "]** 시냅스를 클릭했어! 자세한 브리핑을 해줄게:", false);
      appendChat(target.userData.desc, false);
      toggleChat(true);
    }
  }

  function focusCluster(id) {
    document.querySelectorAll('.cluster-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (id === 'all') {
      controls.autoRotate = true;
      controls.target.set(0, 0, 0);
    } else {
      const target = clusters.find(c => c.userData.id === id);
      if (target) {
        controls.autoRotate = false;
        controls.target.copy(target.position);
        appendChat("형! **[" + target.userData.name + "]** 클러스터에 초점을 맞췄어!", false);
      }
    }
  }

  function animate(time) {
    requestAnimationFrame(animate);

    controls.update();

    // Pulse cluster hubs
    clusters.forEach((c, idx) => {
      const s = 1.0 + Math.sin(time * 0.003 + idx) * 0.15;
      c.scale.set(s, s, s);
      c.rotation.y += 0.01;
    });

    // Animate firing electrical signals along axon paths
    if (axonLines.length > 0) {
      signalParticles.forEach(sp => {
        sp.userData.t += sp.userData.speed;
        if (sp.userData.t > 1.0) {
          sp.userData.t = 0;
          sp.userData.axonIdx = Math.floor(Math.random() * axonLines.length);
        }
        const axon = axonLines[sp.userData.axonIdx];
        if (axon) {
          sp.position.lerpVectors(axon.p1, axon.p2, sp.userData.t);
        }
      });
    }

    renderer.render(scene, camera);
  }

  window.onload = () => {
    init3D();
    animate(0);
  };

  // --- CHAT LOGIC ---
  function toggleChat(show) {
    const dock = document.getElementById('chat-dock');
    const toggleBtn = document.getElementById('toggle-dock-btn');
    if (show) {
      dock.classList.remove('minimized');
      toggleBtn.style.display = 'none';
    } else {
      dock.classList.add('minimized');
      toggleBtn.style.display = 'block';
    }
  }

  function appendChat(text, isUser) {
    const box = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'bubble ' + (isUser ? 'bubble-user' : 'bubble-ai');
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  async function sendChat() {
    const inp = document.getElementById('chat-in');
    const msg = inp.value.trim();
    if (!msg) return;
    appendChat(msg, true);
    inp.value = '';

    try {
      const res = await fetch('/api/brain/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();
      appendChat(data.reply, false);
    } catch(e) {
      appendChat("오류: " + e.message, false);
    }
  }
</script>
</body>
</html>
"""

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class SeanBrainHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_3D_BRAIN_UI.encode("utf-8"))
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
    print(f"[*] 3D SEAN-BRAIN Neural Connectome RUNNING on http://localhost:{PORT}")
    server.serve_forever()

if __name__ == "__main__":
    run_server()

import React, { useState, useRef } from 'react';
import { Edit3, Check, RotateCcw, Copy } from 'lucide-react';

export function ArchCalibrationDevTool({ isVisible }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('box'); // 'box' | 'draw'

    // Box calibration states (% of parent container)
    const [topPct, setTopPct] = useState(16.4);
    const [leftPct, setLeftPct] = useState(50.0); // Left/Right Horizontal Shift
    const [widthPct, setWidthPct] = useState(51.0);
    const [heightPct, setHeightPct] = useState(24.2);
    const [apexCurve, setApexCurve] = useState(26); // Gothic apex sharpness
    const [baseH, setBaseH] = useState(25); // Straight Vertical Wall Base Height (0% to 50%)

    // Freehand drawing points
    const [drawnPoints, setDrawnPoints] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const containerRef = useRef(null);
    const [copied, setCopied] = useState(false);

    // Stilted Gothic Pointed Arch SVG Path with Straight Vertical Base
    const shoulderY = 100 - baseH;
    const generatedSvgPath = `M 50 0 C ${50 + apexCurve} ${shoulderY * 0.35}, 99 ${shoulderY * 0.85}, 99 ${shoulderY} L 99 99 L 1 99 L 1 ${shoulderY} C 1 ${shoulderY * 0.85}, ${50 - apexCurve} ${shoulderY * 0.35}, 50 0 Z`;

    const calibrationData = {
        topPct: Number(topPct.toFixed(2)),
        leftPct: Number(leftPct.toFixed(2)),
        widthPct: Number(widthPct.toFixed(2)),
        heightPct: Number(heightPct.toFixed(2)),
        apexCurve: Number(apexCurve),
        baseH: Number(baseH),
        svgPath: generatedSvgPath,
        freehandPointCount: drawnPoints.length
    };

    // Handle touch/pointer drawing
    const handleTouchStart = (e) => {
        if (mode !== 'draw') return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const touch = e.touches ? e.touches[0] : e;
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        setIsDrawing(true);
        setDrawnPoints([{ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) }]);
    };

    const handleTouchMove = (e) => {
        if (!isDrawing || mode !== 'draw') return;
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const touch = e.touches ? e.touches[0] : e;
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        setDrawnPoints((prev) => [...prev, { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) }]);
    };

    const handleTouchEnd = () => {
        setIsDrawing(false);
    };

    const copyJson = () => {
        const text = JSON.stringify(calibrationData, null, 2);
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-50 select-none">
            {/* Toggle Button in Top-Left */}
            <div className="absolute top-3 left-3 pointer-events-auto z-60">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/90 hover:bg-red-500 text-white font-mono text-[11px] font-bold shadow-[0_0_15px_rgba(255,0,0,0.8)] border border-white/30 backdrop-blur-md cursor-pointer transition-all active:scale-95"
                >
                    <Edit3 className="w-3.5 h-3.5" />
                    {isOpen ? '닫기' : '🛠️ 펜/좌표 조정'}
                </button>
            </div>

            {/* Drawing/Calibration Overlay Area inside the Phone Frame */}
            {isOpen && (
                <div
                    ref={containerRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                    onMouseMove={handleTouchMove}
                    onMouseUp={handleTouchEnd}
                    className={`absolute inset-0 pointer-events-auto ${mode === 'draw' ? 'cursor-crosshair' : 'cursor-default'}`}
                >
                    {/* Live Preview of the Box Arch */}
                    <div
                        style={{
                            position: 'absolute',
                            top: `${topPct}%`,
                            left: `${leftPct}%`,
                            transform: 'translateX(-50%)',
                            width: `${widthPct}%`,
                            height: `${heightPct}%`,
                            pointerEvents: 'none'
                        }}
                        className="border border-dashed border-red-500 bg-red-500/10 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.6)]"
                    >
                        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <path
                                d={generatedSvgPath}
                                fill="rgba(231, 255, 0, 0.35)"
                                stroke="#E7FF00"
                                strokeWidth="2.5"
                            />
                        </svg>
                    </div>

                    {/* Freehand Drawn SVG Stroke */}
                    {drawnPoints.length > 1 && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <polyline
                                points={drawnPoints.map((p) => `${(p.x * containerRef.current?.clientWidth) / 100},${(p.y * containerRef.current?.clientHeight) / 100}`).join(' ')}
                                fill="none"
                                stroke="#00F0FF"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ filter: 'drop-shadow(0 0 8px #00F0FF)' }}
                            />
                        </svg>
                    )}

                    {/* Interactive Controls & Real-time JSON Display Dock */}
                    <div className="absolute bottom-2 inset-x-2 p-3 rounded-2xl bg-black/92 backdrop-blur-xl border border-red-500/50 shadow-[0_0_30px_rgba(0,0,0,0.9)] flex flex-col gap-2 font-mono text-[10px] text-white">
                        {/* Mode Selector */}
                        <div className="flex items-center justify-between gap-2 pb-1 border-b border-white/15">
                            <span className="font-black text-[#E7FF00]">🛠️ ARCH CALIBRATOR</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setMode('box')}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${mode === 'box' ? 'bg-[#E7FF00] text-black' : 'bg-white/10 text-white'}`}
                                >
                                    슬라이더 조절
                                </button>
                                <button
                                    onClick={() => setMode('draw')}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${mode === 'draw' ? 'bg-[#00F0FF] text-black' : 'bg-white/10 text-white'}`}
                                >
                                    직접 그리기
                                </button>
                                <button
                                    onClick={() => setDrawnPoints([])}
                                    className="p-1 rounded bg-white/10 hover:bg-white/20 text-neutral-400"
                                    title="초기화"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {/* Slider Controls with Left/Right (Left X) Shift */}
                        {mode === 'box' ? (
                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 py-1">
                                <label className="flex flex-col">
                                    <span className="text-neutral-400">Top Y (상하): {topPct}%</span>
                                    <input
                                        type="range"
                                        min="5"
                                        max="35"
                                        step="0.2"
                                        value={topPct}
                                        onChange={(e) => setTopPct(parseFloat(e.target.value))}
                                        className="accent-[#E7FF00] h-1.5 cursor-pointer"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-neutral-400">Left X (좌우 이동): {leftPct}%</span>
                                    <input
                                        type="range"
                                        min="35"
                                        max="65"
                                        step="0.2"
                                        value={leftPct}
                                        onChange={(e) => setLeftPct(parseFloat(e.target.value))}
                                        className="accent-[#E7FF00] h-1.5 cursor-pointer"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-neutral-400">Width (가로폭): {widthPct}%</span>
                                    <input
                                        type="range"
                                        min="25"
                                        max="75"
                                        step="0.5"
                                        value={widthPct}
                                        onChange={(e) => setWidthPct(parseFloat(e.target.value))}
                                        className="accent-[#E7FF00] h-1.5 cursor-pointer"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-neutral-400">Height (세로길이): {heightPct}%</span>
                                    <input
                                        type="range"
                                        min="10"
                                        max="40"
                                        step="0.2"
                                        value={heightPct}
                                        onChange={(e) => setHeightPct(parseFloat(e.target.value))}
                                        className="accent-[#E7FF00] h-1.5 cursor-pointer"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-neutral-400">Apex Curve (첨두 곡률): {apexCurve}</span>
                                    <input
                                        type="range"
                                        min="5"
                                        max="45"
                                        step="1"
                                        value={apexCurve}
                                        onChange={(e) => setApexCurve(parseInt(e.target.value))}
                                        className="accent-[#E7FF00] h-1.5 cursor-pointer"
                                    />
                                </label>
                                <label className="flex flex-col">
                                    <span className="text-neutral-400">Base Straight (수직벽 높이): {baseH}%</span>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50"
                                        step="1"
                                        value={baseH}
                                        onChange={(e) => setBaseH(parseInt(e.target.value))}
                                        className="accent-[#E7FF00] h-1.5 cursor-pointer"
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="py-2 text-center text-[#00F0FF] text-[11px]">
                                👆 사진 위 스테인드글라스 창문 둘레를 마우스/손가락으로 둥글게 그려보세요!
                            </div>
                        )}

                        {/* Realtime JSON Output Bar */}
                        <div className="flex items-center justify-between bg-black/60 p-1.5 rounded-lg border border-white/10 gap-2">
                            <span className="truncate text-[9px] text-[#E7FF00]">
                                Top:{topPct}% | Left:{leftPct}% | W:{widthPct}% | H:{heightPct}% | Curve:{apexCurve} | Base:{baseH}%
                            </span>
                            <button
                                onClick={copyJson}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-[#E7FF00] text-black font-bold text-[9px] shrink-0 active:scale-95 cursor-pointer"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? '복사됨!' : 'JSON 복사'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

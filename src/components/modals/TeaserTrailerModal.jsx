import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TeaserTrailerModal({ isOpen, onClose, onWalkAgain }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm rounded-3xl bg-[#0D0B08]/95 border-2 border-[#E7FF00]/80 p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(231,255,0,0.3)] overflow-hidden"
                    >
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#E7FF00]/15 rounded-full filter blur-2xl pointer-events-none" />

                        <span className="inline-block px-3 py-1 rounded-full bg-[#E7FF00]/10 border border-[#E7FF00]/40 font-mono text-[10px] font-black text-[#E7FF00] tracking-[0.25em] uppercase mb-4 shadow-[0_0_12px_rgba(231,255,0,0.3)]">
                            ✦ TEASER TRAILER • 2026 ✦
                        </span>

                        <h2 className="font-sans text-3xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight mb-2">
                            SEE YOU IN OCTOBER.
                        </h2>

                        <p className="font-sans text-sm text-[#E7FF00] font-bold tracking-wide mb-1">
                            10월에 정식으로 돌아옵니다!
                        </p>

                        <p className="font-sans text-xs text-neutral-400 leading-relaxed mb-6">
                            프랑크푸르트 아틀리에 계약과 인허가가 순조롭게 완료되면,<br />
                            10월 환상적인 음악과 공간으로 여러분을 초대합니다.
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <button
                                onClick={onWalkAgain}
                                className="w-full py-3 rounded-full bg-[#E7FF00] hover:bg-[#F3FF66] text-black font-mono text-xs font-black tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(231,255,0,0.5)] active:scale-95 cursor-pointer"
                            >
                                ↺ WALK AGAIN (처음부터 다시 걷기)
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-xs font-medium tracking-wider transition-colors cursor-pointer"
                            >
                                ✕ 아틀리에 둘러보기
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

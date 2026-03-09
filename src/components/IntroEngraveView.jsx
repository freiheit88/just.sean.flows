import React from 'react';
import { motion } from 'framer-motion';
import { LucideZap, LucideFeather, LucideLoader2, LucideUpload, LucideCamera } from 'lucide-react';

const GlassCard = ({ children, className = "", onClick, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: "easeOut" }}
        onClick={onClick}
        className={`bg-[#050505]/60 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden group ${className}`}
    >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <div className="relative z-10">{children}</div>
    </motion.div>
);

const IntroEngraveView = ({ selectedLang, userName, setUserName, generateTextCharacter, isAvatarGenerating, handleImageUpload, uploadedImage, generateCharacter, playSfx, THEME_CONFIG, handleAnalogSoul }) => (
    <div className="space-y-4 max-w-md mx-auto overflow-y-auto no-scrollbar max-h-[85vh] px-4 py-4">
        <GlassCard className="text-center italic text-sm border-l-4 border-l-white/50 py-4 mb-6">
            <span className="opacity-80">"{selectedLang.welcome}"</span>
        </GlassCard>

        <GlassCard className="py-6 px-4 flex flex-col items-center">
            <div className="absolute top-0 right-0 w-8 h-8 opacity-20"><LucideZap size={32} className="text-white" /></div>
            <h3 className="text-xs font-black uppercase mb-4 tracking-[0.2em] flex items-center gap-2 text-white/50">
                <LucideFeather size={16} /> {selectedLang.ui.textOptionTitle}
            </h3>
            <input
                type="text"
                value={userName}
                onChange={e => { setUserName(e.target.value); }}
                onFocus={() => playSfx?.('click')}
                placeholder={selectedLang.ui.textInputPlaceholder}
                className="w-full bg-transparent border-b border-white/20 p-3 mb-6 focus:outline-none font-sans text-lg transition-all focus:border-white text-center text-white placeholder-white/20"
            />
            <button
                onClick={generateTextCharacter}
                disabled={isAvatarGenerating || !userName.trim()}
                onMouseEnter={() => playSfx?.('hover')}
                className="w-full py-4 bg-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/20 disabled:opacity-30 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 backdrop-blur-md"
            >
                {isAvatarGenerating ? <LucideLoader2 className="animate-spin" size={16} /> : null}
                {isAvatarGenerating ? selectedLang.ui.generating : selectedLang.ui.textSubmitBtn}
            </button>
        </GlassCard>

        <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em] bg-transparent">
                <span className="px-4 text-white/40 bg-[#0A0A0B]">OR</span>
            </div>
        </div>

        <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            onClick={() => {
                playSfx?.('click');
                handleAnalogSoul?.();
            }}
            className="w-full py-4 bg-neutral-800 text-white font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-[10px] hover:bg-neutral-700 transition-all flex items-center justify-center shadow-2xl active:scale-95 border border-red-500/50 mb-4"
        >
            <span className="text-red-400">기계의 개입 거부하기 (순수 아날로그 모드)</span>
        </motion.button>

        <label className="block w-full cursor-pointer group">
            <div className="p-6 border border-dashed border-white/20 bg-white/5 hover:bg-white/10 rounded-sm flex flex-col items-center transition-all shadow-inner backdrop-blur-sm">
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                <LucideUpload className="text-white/50 mb-3 group-hover:text-white transition-colors" size={24} />
                <p className="font-black uppercase tracking-widest text-[10px] text-white/50 group-hover:text-white transition-colors">{selectedLang.ui.uploadTitle}</p>
            </div>
        </label>

        {uploadedImage && !isAvatarGenerating && (
            <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={generateCharacter}
                onMouseEnter={() => playSfx?.('hover')}
                className={`w-full py-4 bg-black/40 border border-white/10 backdrop-blur-md ${THEME_CONFIG[selectedLang.id]?.text || 'text-white'} font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-95`}
            >
                <LucideCamera size={16} />
                {selectedLang.ui.generateBtn}
            </motion.button>
        )}

        {isAvatarGenerating && (
            <div className="text-center p-4">
                <LucideLoader2 className="animate-spin mx-auto text-[#5C1A1A] mb-2" size={32} />
                <p className="text-[10px] italic text-[#8B7355] animate-pulse">{selectedLang.loading}</p>
            </div>
        )}
    </div>
);

export default IntroEngraveView;

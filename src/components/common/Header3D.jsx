import React from 'react';

export function Header3D() {
    return (
        <header className="fixed top-0 left-0 right-0 z-60 px-6 py-4 md:py-4 flex items-center justify-center pointer-events-none">
            <div className="pointer-events-auto flex items-center justify-center gap-3 py-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E7FF00] shadow-[0_0_15px_#E7FF00] animate-pulse" />
                <h1 
                    className="font-mono font-black text-base sm:text-lg tracking-[0.38em] uppercase text-[#E7FF00] relative select-none"
                    style={{
                        textShadow: '0 2px 0 #C5A059, 0 4px 0 #000000, 0 6px 18px rgba(231,255,0,0.65)'
                    }}
                >
                    JUST.SEAN.FLOWS
                </h1>
            </div>
        </header>
    );
}

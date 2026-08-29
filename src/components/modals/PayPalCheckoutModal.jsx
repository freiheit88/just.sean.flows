import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, ShieldCheck, Sparkles, CreditCard, ArrowRight, Download, Receipt } from 'lucide-react';
import { PAYPAL_TIERS, loadPayPalSdk, savePaymentReceipt } from '../../services/paypalService';
import { saveVipProfile, getStoredVipProfile } from './InstagramVipAuthModal';

export function PayPalCheckoutModal({ isOpen, onClose, defaultTier = 'VIP_PARTY', onPaymentSuccess }) {
    const [selectedTierKey, setSelectedTierKey] = useState(defaultTier);
    const [isLoadingSdk, setIsLoadingSdk] = useState(false);
    const [sdkError, setSdkError] = useState(null);
    const [completedReceipt, setCompletedReceipt] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const paypalButtonContainerRef = useRef(null);

    const activeTier = PAYPAL_TIERS[selectedTierKey] || PAYPAL_TIERS.VIP_PARTY;

    useEffect(() => {
        if (defaultTier && PAYPAL_TIERS[defaultTier]) {
            setSelectedTierKey(defaultTier);
        }
    }, [defaultTier]);

    useEffect(() => {
        if (!isOpen || completedReceipt) return;

        let isMounted = true;
        setIsLoadingSdk(true);
        setSdkError(null);

        loadPayPalSdk(activeTier.currency)
            .then((paypal) => {
                if (!isMounted || !paypalButtonContainerRef.current) return;
                setIsLoadingSdk(false);

                // Clear previous buttons
                paypalButtonContainerRef.current.innerHTML = '';

                try {
                    paypal.Buttons({
                        style: {
                            layout: 'vertical',
                            color: 'gold',
                            shape: 'rect',
                            label: 'pay',
                            height: 44
                        },
                        createOrder: (data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    description: activeTier.name,
                                    amount: {
                                        currency_code: activeTier.currency,
                                        value: activeTier.amount
                                    }
                                }]
                            });
                        },
                        onApprove: async (data, actions) => {
                            try {
                                const details = await actions.order.capture();
                                handleSuccessfulTransaction(details);
                            } catch (err) {
                                setSdkError('Payment capture failed. Please try again.');
                            }
                        },
                        onError: (err) => {
                            console.warn('PayPal Button Error:', err);
                            setSdkError('PayPal checkout encountered an issue. You can use the instant sandbox test below.');
                        }
                    }).render(paypalButtonContainerRef.current);
                } catch (renderErr) {
                    console.warn('Failed to render PayPal buttons', renderErr);
                }
            })
            .catch((err) => {
                if (!isMounted) return;
                setIsLoadingSdk(false);
                setSdkError('Could not load PayPal SDK. You can use the Sandbox Simulation button.');
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen, selectedTierKey, completedReceipt]);

    const handleSuccessfulTransaction = (details) => {
        const orderId = details?.id || `JSF-${Date.now().toString(36).toUpperCase()}`;
        const payerName = details?.payer?.name?.given_name || 'VIP Patron';
        
        const receipt = {
            orderId,
            tierId: activeTier.id,
            tierName: activeTier.name,
            amount: `${activeTier.amount} ${activeTier.currency}`,
            date: new Date().toLocaleString(),
            payerName,
            status: 'COMPLETED'
        };

        savePaymentReceipt(receipt);
        setCompletedReceipt(receipt);

        // Auto-upgrade or issue VIP profile in localStorage
        const existingVip = getStoredVipProfile() || {
            instagramId: 'vip_patron',
            avatarUrl: 'https://api.dicebear.com/7.x/micah/svg?seed=VIP_PATRON',
            memberNumber: Math.floor(Math.random() * 888) + 100
        };

        const updatedVip = {
            ...existingVip,
            tier: activeTier.id === 'VIP_PARTY' ? 'FOUNDING_PATRON_VIP' : 'COMMERCIAL_LICENSE_VIP',
            lastTransactionId: orderId,
            lastPaymentDate: new Date().toISOString()
        };

        saveVipProfile(updatedVip);

        if (onPaymentSuccess) {
            onPaymentSuccess(receipt, updatedVip);
        }
    };

    const handleSimulateSandboxPayment = () => {
        setIsSimulating(true);
        setTimeout(() => {
            setIsSimulating(false);
            handleSuccessfulTransaction({
                id: `SANDBOX-${Date.now().toString().slice(-6)}`,
                payer: { name: { given_name: 'Sean VIP Partner' } }
            });
        }, 1200);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/92 backdrop-blur-2xl p-4 select-none"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.92, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.92, y: 20 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-lg rounded-[32px] border-2 border-[#D4AF37]/60 bg-gradient-to-b from-[#1E060B] via-[#0E0305] to-black p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95),0_0_50px_rgba(212,175,55,0.25)] overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-neutral-300 hover:text-white transition cursor-pointer z-20"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    {!completedReceipt ? (
                        <>
                            {/* Modal Header */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                                    <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-xl">
                                        💳
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-mono text-base sm:text-lg font-black text-[#F7EBE1] tracking-wide uppercase flex items-center gap-2">
                                        ATELIER CHECKOUT
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFD700]">
                                            EUR €
                                        </span>
                                    </h3>
                                    <p className="font-mono text-[10px] text-[#C8A96E]/70 uppercase tracking-widest">
                                        SECURE PAYPAL SMART PAYMENT GATEWAY
                                    </p>
                                </div>
                            </div>

                            {/* Tier Selection Radio Cards */}
                            <div className="space-y-2.5 mb-6">
                                {Object.values(PAYPAL_TIERS).map((tier) => {
                                    const isSelected = tier.id === selectedTierKey;
                                    return (
                                        <div
                                            key={tier.id}
                                            onClick={() => setSelectedTierKey(tier.id)}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                                isSelected 
                                                    ? 'bg-[#D4AF37]/15 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)]' 
                                                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#FFD700] bg-[#FFD700]' : 'border-white/30'}`}>
                                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-white tracking-wide">
                                                            {tier.name}
                                                        </span>
                                                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50 border border-[#D4AF37]/40 text-[#D4AF37]">
                                                            {tier.badge}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-neutral-400 font-sans mt-0.5">
                                                        {tier.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="font-mono text-sm font-black text-[#FFD700] shrink-0 ml-3">
                                                €{tier.amount}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* PayPal SDK Button Mount Area */}
                            <div className="relative min-h-[90px] mb-4">
                                {isLoadingSdk && (
                                    <div className="flex items-center justify-center py-6 gap-2 text-xs font-mono text-[#D4AF37]">
                                        <div className="w-4 h-4 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
                                        <span>INITIALIZING PAYPAL SDK...</span>
                                    </div>
                                )}
                                <div ref={paypalButtonContainerRef} className="z-10 relative" />
                            </div>

                            {/* Zero-Friction Sandbox Simulation Trigger */}
                            <div className="pt-2 border-t border-white/10 flex flex-col items-center gap-2">
                                <button
                                    onClick={handleSimulateSandboxPayment}
                                    disabled={isSimulating}
                                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-xs font-black tracking-wider uppercase flex items-center justify-center gap-2 transition cursor-pointer hover:border-[#D4AF37]"
                                >
                                    {isSimulating ? (
                                        <>
                                            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
                                            <span>VERIFYING SANDBOX PAYMENT...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>INSTANT SANDBOX TEST (€{activeTier.amount})</span>
                                        </>
                                    )}
                                </button>
                                <span className="text-[9px] font-mono text-neutral-500">
                                    🔒 256-Bit SSL Encrypted European Payment Protocol
                                </span>
                            </div>
                        </>
                    ) : (
                        /* Digital Golden Receipt State */
                        <div className="space-y-5 text-center py-2">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFD700] p-0.5 mx-auto shadow-[0_0_35px_rgba(255,215,0,0.6)]">
                                <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-3xl">
                                    🏆
                                </div>
                            </div>

                            <div>
                                <h3 className="font-mono text-lg font-black text-[#FFD700] tracking-widest uppercase">
                                    PAYMENT COMPLETED
                                </h3>
                                <p className="font-mono text-xs text-neutral-300 mt-1">
                                    Official Digital Receipt Issued
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-black/60 border border-[#D4AF37]/40 text-left font-mono text-xs space-y-2 text-neutral-300">
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-neutral-500">ORDER ID</span>
                                    <span className="text-[#FFD700] font-bold">{completedReceipt.orderId}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-neutral-500">PRODUCT</span>
                                    <span className="text-white font-bold">{completedReceipt.tierName}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/10 pb-2">
                                    <span className="text-neutral-500">AMOUNT PAID</span>
                                    <span className="text-emerald-400 font-bold">{completedReceipt.amount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-500">DATE</span>
                                    <span className="text-neutral-300">{completedReceipt.date}</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#E5A93C] text-black font-mono text-xs font-black tracking-widest uppercase shadow-[0_0_30px_rgba(255,215,0,0.85)] hover:brightness-110 transition cursor-pointer"
                            >
                                ENTER VIP ATELIER 🏛️
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck } from 'lucide-react';
import { Button } from './Button';
import { logDonationClick } from '@/lib/actions/donation';


interface DonationModalProps {
  onClose: () => void;
}

export const DonationModal = ({ onClose }: DonationModalProps) => {
  const [customAmount, setCustomAmount] = React.useState("");
  const [isOpening, setIsOpening] = React.useState<string | null>(null);
  const tiers = [
    { label: "Coffee", value: 5, emoji: "☕", url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" },
    { label: "Supporter", value: 15, emoji: "🚀", url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" },
    { label: "Legend", value: 50, emoji: "💎", url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" }
  ];

  const handleDonate = async (tier: string, url: string) => {
    try {
      setIsOpening(tier);
      await logDonationClick(tier);
    } catch (error) {
      console.error("Failed to log donation click", error);
    } finally {
      window.open(url, '_blank', 'noopener,noreferrer');
      setIsOpening(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-fg/40 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white p-8 md:p-12 rounded-5xl w-full max-w-2xl text-center shadow-2xl relative border border-border"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-muted hover:text-fg font-bold"
        >
          ✕
        </button>
        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 animate-float">
          <Heart className="w-10 h-10 text-accent fill-accent" />
        </div>
        <h2 className="text-4xl font-black tracking-tight mb-4">Help Keep Lesspriz Free</h2>
        <p className="text-muted font-medium mb-8 leading-relaxed text-sm md:text-base">
          Lesspriz stays ad-free and subscription-free. If it already saved you money, a small donation helps keep scans and alerts running for everyone.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {tiers.map(tier => (
            <button 
              key={tier.label} 
              onClick={() => handleDonate(tier.label, tier.url)}
              disabled={isOpening !== null}
              className="p-6 rounded-3xl border border-border hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tier.emoji}</div>
              <div className="font-black text-xl">${tier.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted">{tier.label}</div>
            </button>
          ))}
        </div>
        <div className="rounded-3xl border border-border bg-bg p-5 mb-8 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-3">Custom amount</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              min="1"
              placeholder="Amount in USD"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="flex-1 rounded-2xl border border-border bg-white px-4 py-3 font-semibold outline-none focus:ring-4 ring-accent/10"
            />
            <Button
              variant="secondary"
              className="sm:px-6"
              disabled={isOpening !== null || !customAmount || Number(customAmount) <= 0}
              onClick={() => handleDonate(`Custom-${customAmount}`, "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ")}
            >
              Donate Custom
            </Button>
          </div>
        </div>
        <Button 
          variant="accent" 
          className="w-full py-5 text-lg"
          disabled={isOpening !== null}
          onClick={() => handleDonate("General", "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ")}
        >
          {isOpening ? "Opening PayPal..." : "Donate via PayPal"}
        </Button>
        <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold text-muted">
          <ShieldCheck className="w-3.5 h-3.5" />
          Secure checkout is handled by PayPal.
        </div>
        <button onClick={onClose} className="mt-6 text-sm font-bold text-muted hover:text-fg">Maybe later</button>
      </motion.div>
    </div>
  );
};

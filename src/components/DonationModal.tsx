"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from './Button';
import { logDonationClick } from '@/lib/actions/donation';


interface DonationModalProps {
  onClose: () => void;
}

export const DonationModal = ({ onClose }: DonationModalProps) => {
  const tiers = [
    { label: "Coffee", value: 5, emoji: "☕", url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" },
    { label: "Supporter", value: 15, emoji: "🚀", url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" },
    { label: "Legend", value: 50, emoji: "💎", url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" }
  ];

  const handleDonate = async (tier: string, url: string) => {
    await logDonationClick(tier);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-fg/40 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white p-12 rounded-5xl w-full max-w-lg text-center shadow-2xl relative"
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
        <h2 className="text-4xl font-black tracking-tight mb-4">Support Lesspriz</h2>
        <p className="text-muted font-medium mb-10 leading-relaxed text-sm">
          We don't sell your data or charge subscriptions. We rely on people like you who've saved money using our tool.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-10">
          {tiers.map(tier => (
            <button 
              key={tier.label} 
              onClick={() => handleDonate(tier.label, tier.url)}
              className="p-6 rounded-3xl border border-border hover:border-accent hover:bg-accent/5 transition-all group"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tier.emoji}</div>
              <div className="font-black text-xl">${tier.value}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted">{tier.label}</div>
            </button>
          ))}
        </div>
        <Button 
          variant="accent" 
          className="w-full py-5 text-lg"
          onClick={() => handleDonate("General", "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ")}
        >
          Donate via PayPal
        </Button>
        <button onClick={onClose} className="mt-6 text-sm font-bold text-muted hover:text-fg">Maybe later</button>
      </motion.div>
    </div>
  );
};

"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, TrendingDown, Coffee, Rocket, Diamond, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { logDonationClick } from '@/lib/actions/donation';
import Link from 'next/link';

export default function DonatePage() {
  const [customAmount, setCustomAmount] = useState("");
  const [isOpening, setIsOpening] = useState<string | null>(null);

  const tiers = [
    { label: "Coffee", value: 5, emoji: <Coffee className="w-6 h-6" />, url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" },
    { label: "Supporter", value: 15, emoji: <Rocket className="w-6 h-6" />, url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" },
    { label: "Legend", value: 50, emoji: <Diamond className="w-6 h-6" />, url: "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ" }
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
    <div className="hero-gradient min-h-screen flex flex-col">
      <nav className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-3 font-black text-2xl tracking-tighter">
          <div className="w-10 h-10 bg-fg rounded-xl flex items-center justify-center text-white shadow-xl shadow-fg/20">
            <TrendingDown className="w-5 h-5" />
          </div>
          Lesspriz
        </Link>
        <Link href="/dashboard">
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Button>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 md:p-16 rounded-[3rem] w-full max-w-3xl text-center shadow-2xl border border-border/50"
        >
          <div className="w-24 h-24 bg-accent/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-10 animate-float">
            <Heart className="w-12 h-12 text-accent fill-accent" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-none">
            Help Keep <br /> <span className="text-accent">Lesspriz Free</span>
          </h1>
          
          <p className="text-muted text-lg font-medium mb-12 max-w-xl mx-auto leading-relaxed">
            Lesspriz stays ad-free and subscription-free because of people like you. 
            If we&apos;ve saved you money, consider fueling our servers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {tiers.map(tier => (
              <button
                key={tier.label}
                onClick={() => handleDonate(tier.label, tier.url)}
                disabled={isOpening !== null}
                className="p-8 rounded-[2.5rem] border-2 border-border/50 hover:border-accent hover:bg-accent/[0.02] transition-all group relative overflow-hidden"
              >
                <div className="text-accent mb-4 group-hover:scale-110 transition-transform flex justify-center">{tier.emoji}</div>
                <div className="font-black text-3xl mb-1">${tier.value}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">{tier.label}</div>
              </button>
            ))}
          </div>

          <div className="rounded-[2.5rem] border-2 border-border/50 bg-bg/30 p-8 mb-10 text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-4">Or choose your own amount</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-xl text-muted">$</span>
                <input
                  type="number"
                  min="1"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full rounded-2xl border-2 border-border/50 bg-white pl-10 pr-5 py-4 font-black text-xl outline-none focus:border-accent transition-colors"
                />
              </div>
              <Button
                variant="secondary"
                className="sm:px-10 h-[60px] text-lg"
                disabled={isOpening !== null || !customAmount || Number(customAmount) <= 0}
                onClick={() => handleDonate(`Custom-${customAmount}`, "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ")}
              >
                Donate
              </Button>
            </div>
          </div>

          <Button
            variant="accent"
            className="w-full py-6 text-xl rounded-2xl shadow-xl shadow-accent/20"
            disabled={isOpening !== null}
            onClick={() => handleDonate("General", "https://www.paypal.com/donate/?hosted_button_id=GZK7ZR73MP8FQ")}
          >
            {isOpening ? "Opening PayPal..." : "Donate"}
          </Button>

          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-muted bg-bg px-4 py-2 rounded-full">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              Secure checkout via PayPal
            </div>
            <Link href="/dashboard" className="text-sm font-black text-muted hover:text-fg transition-colors">
              Return to dashboard
            </Link>
          </div>
        </motion.div>
      </main>

      <footer className="p-8 text-center">
        <p className="text-xs font-bold text-muted/50 uppercase tracking-[0.2em]">© 2026 Lesspriz. Built for smart shoppers.</p>
      </footer>
    </div>
  );
}

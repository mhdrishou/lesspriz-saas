"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TrendingDown, Zap, Brain, Shield, Link as LinkIcon, Heart, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

import Link from "next/link";

const SupportedStores = () => (
  <div className="py-20 border-y border-border bg-white/50 overflow-hidden">
    <div className="max-w-7xl mx-auto px-8">
      <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-muted mb-12">Tracking 100+ Global Retailers</p>
      <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
        <Image src="https://cdn.simpleicons.org/amazon/000000" alt="Amazon" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/shopify/96bf48" alt="Shopify" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/bestbuy/0046be" alt="Best Buy" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/walmart/0071ce" alt="Walmart" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/nike/000000" alt="Nike" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/target/cc0000" alt="Target" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/apple/000000" alt="Apple" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/sephora/000000" alt="Sephora" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/adidas/000000" alt="Adidas" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/ebay/e53238" alt="eBay" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
        <Image src="https://cdn.simpleicons.org/ikea/0051ba" alt="IKEA" width={120} height={40} unoptimized className="h-10 w-auto object-contain" />
      </div>
    </div>
  </div>
);

const PricingComparison = () => (
  <section className="py-32 max-w-7xl mx-auto px-8">
    <div className="text-center mb-20">
      <h2 className="text-5xl font-black tracking-tighter mb-4">Generosity by Design.</h2>
      <p className="text-muted text-lg font-medium">Why we don&apos;t have a subscription model.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div className="p-12 rounded-4xl bg-white border border-border">
        <h3 className="text-2xl font-black mb-8">The &quot;Other&quot; Guys</h3>
        <ul className="space-y-6">
          {["$15/month subscription", "Locked features", "Aggressive upsells", "Tracking limits", "Ads in your inbox"].map(item => (
            <li key={item} className="flex items-center gap-4 text-muted font-medium">
              <XCircle className="text-red-400 w-5 h-5" /> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="p-12 rounded-4xl bg-accent/[0.03] border-2 border-accent/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <Heart className="w-12 h-12 text-accent fill-accent/10" />
        </div>
        <h3 className="text-2xl font-black mb-8 text-accent">Lesspriz</h3>
        <ul className="space-y-6">
          {["100% Free Forever", "All features unlocked", "No annoying emails", "Unlimited tracking", "Powered by donations"].map(item => (
            <li key={item} className="flex items-center gap-4 text-fg font-bold">
              <CheckCircle className="text-accent w-5 h-5" /> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const { userId } = useAuth();

  return (
    <div className="hero-gradient min-h-screen">
      <nav className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 z-[100] backdrop-blur-xl">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
          <div className="w-10 h-10 bg-fg rounded-xl flex items-center justify-center text-white">
            <TrendingDown className="w-5 h-5" />
          </div>
          Lesspriz
        </div>
        <div className="flex gap-4 items-center glass p-2 rounded-2xl">
          {!userId ? (
            <>
              <SignInButton>
                <button className="px-6 py-2 text-sm font-bold text-muted hover:text-fg transition-colors">Log in</button>
              </SignInButton>
              <SignUpButton>
                <Button className="py-2.5 px-6 text-sm">Launch App</Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="mr-2">
                <Button className="py-2.5 px-6 text-sm">Go to Dashboard</Button>
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-32 md:pb-40 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border text-[10px] font-black uppercase tracking-widest mb-10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Over $2.4M saved this month
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.9] md:leading-[0.85] mb-10 md:mb-12 text-balance">
            Shop smart. <br /> <span className="text-muted/20">Pay less.</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted max-w-2xl mx-auto mb-12 md:mb-16 font-medium leading-relaxed">
            The premium price tracker for those who value their time and money. Paste a link, and <span className="text-fg font-bold">Lesspriz</span> does the rest.
          </p>

          <div className="max-w-3xl mx-auto p-4 bg-white border border-border rounded-[2.5rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] flex flex-col md:flex-row gap-4 mb-32 group focus-within:ring-8 ring-accent/5 transition-all">
            <div className="flex-1 flex items-center gap-5 px-6">
              <LinkIcon className="w-6 h-6 text-accent" />
              <input
                type="text"
                placeholder="Paste Amazon, Best Buy, or Nike URL..."
                className="bg-transparent outline-none text-xl font-semibold w-full placeholder:text-muted/30"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Link href={url ? `/dashboard?url=${encodeURIComponent(url)}` : "/dashboard"}>
                <Button variant="accent" className="py-5 px-12 text-xl w-full md:w-auto">Track Now</Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          {[
            { title: "Real-time Scans", desc: "Our engine checks prices across 100+ retailers every 15 minutes.", icon: Zap },
            { title: "Smart Logic", desc: "Predicts when the next sale might happen using historical data.", icon: Brain },
            { title: "Private & Safe", desc: "We don't sell your data. We don't even have your credit card.", icon: Shield }
          ].map((feat, i) => (
            <motion.div key={feat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="p-10 rounded-4xl bg-white border border-border hover:shadow-xl transition-all">
              <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center mb-6">
                <feat.icon className="text-accent w-6 h-6" />
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight">{feat.title}</h3>
              <p className="text-muted font-medium leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <SupportedStores />
      <PricingComparison />

      <footer className="py-20 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-fg rounded-xl flex items-center justify-center text-white">
              <TrendingDown className="w-5 h-5" />
            </div>
            Lesspriz
          </div>
          <div className="flex gap-8 md:gap-12 text-xs font-black uppercase tracking-widest text-muted">
            <Link href="/privacy" className="hover:text-fg transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-fg transition-colors">Terms</Link>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-fg transition-colors">Twitter</a>
            <Link href="/contact" className="hover:text-fg transition-colors">Contact</Link>
          </div>
          <p className="text-xs font-bold text-muted">© 2026 Lesspriz. Donation-powered price tracking.</p>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, TrendingDown } from 'lucide-react';
import { Button } from './Button';
import Link from 'next/link';

interface DonationModalProps {
  onClose: () => void;
}

export const DonationModal = ({ onClose }: DonationModalProps) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-fg/40 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white p-8 md:p-12 rounded-[2.5rem] w-full max-w-xl text-center shadow-2xl relative border border-border"
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
        <p className="text-muted font-medium mb-8 leading-relaxed">
          Help us keep the price scans running for everyone. Your support makes a difference!
        </p>
        
        <Link href="/donate">
          <Button 
            variant="accent" 
            className="w-full py-5 text-lg rounded-2xl"
            onClick={onClose}
          >
            Go to Donation Page
          </Button>
        </Link>

        <button onClick={onClose} className="mt-6 text-sm font-bold text-muted hover:text-fg">Maybe later</button>
      </motion.div>
    </div>
  );
};

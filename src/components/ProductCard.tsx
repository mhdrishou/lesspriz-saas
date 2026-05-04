"use client";

import React from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  currentPrice: number;
  previousPrice: number | null;
  image: string;
  currency: string;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const hasDrop = product.previousPrice && product.currentPrice < product.previousPrice;
  const dropPercentage = hasDrop ? Math.round(((product.previousPrice! - product.currentPrice) / product.previousPrice!) * 100) : 0;
  
  return (
    <div 
      className="p-8 rounded-4xl bg-white border border-border group hover:shadow-2xl transition-all cursor-pointer relative" 
      onClick={onClick}
    >
      {hasDrop && (
        <div className="absolute top-6 left-6 z-10 bg-green-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
          -{dropPercentage}%
        </div>
      )}
      <div className="aspect-square rounded-3xl bg-bg flex items-center justify-center overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-500">
        {product.image.startsWith('http') ? (
            <Image src={product.image} alt={product.title} width={300} height={300} unoptimized className="w-full h-full object-contain p-4" />
        ) : (
            <span className="text-6xl">{product.image || '📦'}</span>
        )}
      </div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl tracking-tight leading-tight line-clamp-2">{product.title}</h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          {product.previousPrice && (
            <p className="text-muted text-xs font-bold line-through tabular">${product.previousPrice.toFixed(2)}</p>
          )}
          <p className="text-3xl font-black tracking-tight tabular">${product.currentPrice.toFixed(2)}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center group-hover:bg-fg group-hover:text-white transition-all">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

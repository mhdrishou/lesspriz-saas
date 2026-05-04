"use client";

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Icon } from '@/components/Icon';

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
  
  return (
    <div 
      className="p-8 rounded-4xl bg-white border border-border group hover:shadow-2xl transition-all cursor-pointer" 
      onClick={onClick}
    >
      <div className="aspect-square rounded-3xl bg-bg flex items-center justify-center overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-500">
        {product.image.startsWith('http') ? (
            <img src={product.image} alt={product.title} className="w-full h-full object-contain p-4" />
        ) : (
            <span className="text-6xl">{product.image || '📦'}</span>
        )}
      </div>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl tracking-tight leading-tight line-clamp-2">{product.title}</h3>
        {hasDrop && (
          <span className="bg-green-100 text-green-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Drop</span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          {product.previousPrice && (
            <p className="text-muted text-xs font-bold line-through tabular">${product.previousPrice}</p>
          )}
          <p className="text-3xl font-black tracking-tight tabular">${product.currentPrice}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-bg flex items-center justify-center group-hover:bg-fg group-hover:text-white transition-all">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

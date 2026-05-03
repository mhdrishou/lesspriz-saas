"use client";

import React, { useState, useEffect } from "react";
import { TrendingDown, LayoutGrid, Package, Bell, ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { DonationModal } from "@/components/DonationModal";
import { UserButton, SignOutButton } from "@clerk/nextjs";
import { addProduct, deleteProduct } from "@/lib/actions/product";
import { useRouter, useSearchParams } from "next/navigation";

interface Product {
  id: string;
  title: string;
  currentPrice: number;
  previousPrice: number | null;
  image: string;
  currency: string;
  history: any[];
}

interface DashboardContentProps {
  initialProducts: any[];
  user: any;
}

export const DashboardContent = ({ initialProducts, user }: DashboardContentProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDonation, setShowDonation] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlFromQuery = searchParams.get("url");
    if (urlFromQuery) {
        handleTrack(urlFromQuery);
    }
  }, [searchParams]);

  const handleTrack = async (urlToTrack?: string) => {
    const targetUrl = urlToTrack || newUrl;
    if (!targetUrl) return;
    
    setIsAdding(true);
    try {
      await addProduct(targetUrl);
      setNewUrl("");
      router.refresh();
    } catch (error) {
      alert("Failed to track product. Make sure the URL is valid.");
    } finally {
      setIsAdding(false);
    }
  };

  const totalSaved = initialProducts.reduce((acc, p) => {
    if (p.previousPrice && p.currentPrice < p.previousPrice) {
        return acc + (p.previousPrice - p.currentPrice);
    }
    return acc;
  }, 0);

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="w-80 border-r border-border p-8 hidden lg:flex flex-col gap-10 bg-surface sticky top-0 h-screen">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 bg-fg rounded-xl flex items-center justify-center text-white">
            <TrendingDown className="w-5 h-5" />
          </div>
          Lesspriz
        </div>
        <nav className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 text-accent font-bold">
            <LayoutGrid className="w-5 h-5" /> Overview
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-bg transition-colors font-medium">
            <Package className="w-5 h-5" /> My Products
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:bg-bg transition-colors font-medium">
            <Bell className="w-5 h-5" /> Alerts
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-4">
            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10">
                <p className="text-xs font-black uppercase tracking-widest text-accent mb-4">You saved ${totalSaved.toFixed(2)} 🎉</p>
                <p className="text-sm font-bold leading-relaxed mb-6">"Lesspriz is a labor of love. Help us keep it alive."</p>
                <Button variant="accent" className="w-full py-3 text-xs" onClick={() => setShowDonation(true)}>Support ❤️</Button>
            </div>
            
            <div className="flex items-center gap-3 px-4">
                <UserButton afterSignOutUrl="/" />
                <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 p-10 lg:p-20 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <h2 className="text-5xl font-black tracking-tighter mb-2">Dashboard</h2>
            <p className="text-muted font-medium">Tracking {initialProducts.length} products.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <input 
                type="text" 
                placeholder="Paste URL..." 
                className="flex-1 md:w-80 px-6 py-4 rounded-2xl border border-border bg-white focus:ring-4 ring-accent/5 outline-none font-medium"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            />
            <Button onClick={() => handleTrack()} disabled={isAdding || !newUrl} className="whitespace-nowrap">
                {isAdding ? "Scanning..." : "Track New"}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {initialProducts.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
          ))}
          {initialProducts.length === 0 && !isAdding && (
            <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-4xl">
                <p className="text-muted font-bold">No products tracked yet. Add your first URL above!</p>
            </div>
          )}
        </div>
      </main>

      {showDonation && <DonationModal onClose={() => setShowDonation(false)} />}
      
      {selectedProduct && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-fg/20 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
              <div className="bg-white p-10 rounded-5xl w-full max-w-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-8 mb-8">
                      <div className="w-48 h-48 rounded-3xl bg-bg flex items-center justify-center p-4">
                          <img src={selectedProduct.image} alt="" className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="flex-1">
                          <h3 className="text-2xl font-black mb-2">{selectedProduct.title}</h3>
                          <div className="flex gap-6 mb-6">
                              <div>
                                  <p className="text-xs font-bold text-muted uppercase">Current</p>
                                  <p className="text-3xl font-black">${selectedProduct.currentPrice}</p>
                              </div>
                              {selectedProduct.previousPrice && (
                                  <div>
                                      <p className="text-xs font-bold text-muted uppercase">Was</p>
                                      <p className="text-3xl font-black text-muted line-through">${selectedProduct.previousPrice}</p>
                                  </div>
                              )}
                          </div>
                          <div className="flex gap-4">
                            <Button className="flex-1" onClick={() => window.open(selectedProduct.url, '_blank')}>View on Store</Button>
                            <Button variant="secondary" className="px-6" onClick={async () => {
                                if(confirm("Stop tracking this product?")) {
                                    await deleteProduct(selectedProduct.id);
                                    setSelectedProduct(null);
                                    router.refresh();
                                }
                            }}>
                                <Package className="w-5 h-5 text-red-500" />
                            </Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

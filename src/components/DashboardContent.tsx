"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingDown, LayoutGrid, Package, Bell, Info, Tag, ExternalLink, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { DonationModal } from "@/components/DonationModal";
import { UserButton } from "@clerk/nextjs";
import { addProduct, deleteProduct } from "@/lib/actions/product";
import { useRouter, useSearchParams } from "next/navigation";

interface Product { 
  url: string;
  id: string;
  title: string;
  currentPrice: number;
  previousPrice: number | null;
  image: string;
  currency: string;
  description?: string | null;
  category?: string | null;
  outOfStock?: boolean;
  history: { price: number; createdAt: Date }[];
}

interface DashboardContentProps {
  initialProducts: Product[];
  user: {
    name?: string | null;
    email?: string;
  } | null;
}

export const DashboardContent = ({ initialProducts, user }: DashboardContentProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDonation, setShowDonation] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTrack = React.useCallback(async (urlToTrack?: string) => {
    const targetUrl = urlToTrack || newUrl;
    if (!targetUrl) return;
    
    setIsAdding(true);
    try {
      await addProduct(targetUrl);
      setNewUrl("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to track product. Make sure the URL is valid.");
    } finally {
      setIsAdding(false);
    }
  }, [newUrl, router]);

  useEffect(() => {
    const urlFromQuery = searchParams.get("url");
    if (urlFromQuery) {
        const timer = setTimeout(() => handleTrack(urlFromQuery), 0);
        return () => clearTimeout(timer);
    }
  }, [searchParams, handleTrack]);

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
                <p className="text-sm font-bold leading-relaxed mb-6">&quot;Lesspriz is a labor of love. Help us keep it alive.&quot;</p>
                <Button variant="accent" className="w-full py-3 text-xs" onClick={() => setShowDonation(true)}>Support ❤️</Button>
            </div>
            
            <div className="flex items-center gap-3 px-4">
                <UserButton />
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
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-fg/30 backdrop-blur-md" onClick={() => setSelectedProduct(null)}>
              <div className="bg-white rounded-[3rem] w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]" onClick={e => e.stopPropagation()}>
                  {/* Left Column: Image and Info */}
                  <div className="md:w-80 bg-bg p-10 flex flex-col gap-8 border-r border-border overflow-y-auto">
                      <div className="aspect-square rounded-3xl bg-white flex items-center justify-center p-8 shadow-sm">
                          <Image src={selectedProduct.image} alt={selectedProduct.title} width={300} height={300} unoptimized className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 flex items-center gap-2"><Info className="w-3 h-3" /> Description</p>
                            <p className="text-sm font-medium leading-relaxed line-clamp-6">{selectedProduct.description || "No description available."}</p>
                        </div>
                        {selectedProduct.category && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 flex items-center gap-2"><Tag className="w-3 h-3" /> Category</p>
                                <p className="text-sm font-bold text-accent">{selectedProduct.category}</p>
                            </div>
                        )}
                        <div className={`p-4 rounded-2xl border ${selectedProduct.outOfStock ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'} flex items-center gap-3`}>
                            <div className={`w-2 h-2 rounded-full ${selectedProduct.outOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
                            <p className="text-xs font-black uppercase tracking-widest">{selectedProduct.outOfStock ? 'Out of Stock' : 'In Stock'}</p>
                        </div>
                      </div>
                  </div>

                  {/* Right Column: Chart and Actions */}
                  <div className="flex-1 p-10 flex flex-col gap-10 overflow-y-auto">
                      <header className="flex justify-between items-start">
                          <div>
                            <h3 className="text-3xl font-black tracking-tight mb-2 leading-tight">{selectedProduct.title}</h3>
                            <a href={selectedProduct.url} target="_blank" className="text-xs font-bold text-muted hover:text-accent transition-colors flex items-center gap-1">
                                {new URL(selectedProduct.url).hostname} <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <div className="text-right">
                              <p className="text-4xl font-black tabular tracking-tighter">${selectedProduct.currentPrice.toFixed(2)}</p>
                              {selectedProduct.previousPrice && (
                                <p className="text-sm font-bold text-muted line-through tabular">${selectedProduct.previousPrice.toFixed(2)}</p>
                              )}
                          </div>
                      </header>

                      {/* Price History Chart */}
                      <div className="flex-1 min-h-[300px] bg-bg rounded-3xl p-6 border border-border">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-6">Price History (30 Days)</p>
                          <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={selectedProduct.history.map(h => ({
                                  price: h.price,
                                  date: new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              }))}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                  <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                                    labelStyle={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8' }}
                                  />
                                  <Line 
                                    type="monotone" 
                                    dataKey="price" 
                                    stroke="#000" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#fff', stroke: '#000', strokeWidth: 2 }} 
                                    activeDot={{ r: 6, fill: '#000' }} 
                                  />
                              </LineChart>
                          </ResponsiveContainer>
                      </div>

                      <div className="flex gap-4">
                        <Button className="flex-1 py-5 text-lg" onClick={() => window.open(selectedProduct.url, '_blank')}>View Store Page</Button>
                        <Button variant="secondary" className="px-6 border-red-100 hover:bg-red-50" onClick={async () => {
                            if(confirm("Stop tracking this product?")) {
                                await deleteProduct(selectedProduct.id);
                                setSelectedProduct(null);
                                router.refresh();
                            }
                        }}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </Button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

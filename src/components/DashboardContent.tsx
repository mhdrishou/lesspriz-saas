"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TrendingDown, LayoutGrid, Package, Bell, Info, Tag, ExternalLink, Trash2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { DonationModal } from "@/components/DonationModal";
import { UserButton } from "@clerk/nextjs";
import { addProduct, deleteProduct, createAlert, deleteAlert } from "@/lib/actions/product";
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

interface Alert {
  id: string;
  productId: string;
  targetPrice: number | null;
  isActive: boolean;
  product: Product;
}

interface DashboardContentProps {
  initialProducts: Product[];
  initialAlerts: Alert[];
  user: {
    name?: string | null;
    email?: string;
  } | null;
}

export const DashboardContent = ({ initialProducts, initialAlerts, user }: DashboardContentProps) => {
  const getHostname = (rawUrl: string) => {
    try {
      return new URL(rawUrl).hostname;
    } catch {
      return "Store link";
    }
  };
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "alerts">("overview");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDonation, setShowDonation] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [isSavingAlert, setIsSavingAlert] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const DONATION_COOLDOWN_DAYS = 7;
  const DONATION_KEY = "lesspriz:lastDonationPromptAt";

  const setMessage = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
  };

  const handleCreateAlert = async (productId: string) => {
    if (!targetPrice) return;
    setIsSavingAlert(true);
    try {
      await createAlert(productId, parseFloat(targetPrice));
      setTargetPrice("");
      router.refresh();
      setMessage("success", "Alert created successfully.");
    } catch (error) {
      console.error(error);
      setMessage("error", "Failed to create alert. Please try again.");
    } finally {
      setIsSavingAlert(false);
    }
  };

  const handleTrack = React.useCallback(async (urlToTrack?: string) => {
    const targetUrl = urlToTrack || newUrl;
    if (!targetUrl) return;
    
    setIsAdding(true);
    try {
      await addProduct(targetUrl);
      setNewUrl("");
      router.refresh();
      setMessage("success", "Product added to tracking.");
    } catch (error) {
      console.error(error);
      setMessage("error", "Failed to track product. Make sure the URL is valid.");
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (showDonation || initialProducts.length === 0) return;

    const raw = window.localStorage.getItem(DONATION_KEY);
    const lastPrompt = raw ? Number(raw) : 0;
    const cooldownMs = DONATION_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
    const shouldPrompt = !lastPrompt || Date.now() - lastPrompt > cooldownMs;

    if (shouldPrompt && initialProducts.length >= 2) {
      const timer = window.setTimeout(() => {
        setShowDonation(true);
        window.localStorage.setItem(DONATION_KEY, String(Date.now()));
      }, 1500);
      return () => window.clearTimeout(timer);
    }
  }, [initialProducts.length, showDonation]);

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
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'overview' ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-bg'}`}
          >
            <LayoutGrid className="w-5 h-5" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'products' ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-bg'}`}
          >
            <Package className="w-5 h-5" /> My Products
          </button>
          <button 
            onClick={() => setActiveTab("alerts")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold ${activeTab === 'alerts' ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-bg'}`}
          >
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
        <div className="lg:hidden mb-8 rounded-2xl border border-border bg-white p-2 grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider ${activeTab === "overview" ? "bg-accent/10 text-accent" : "text-muted"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider ${activeTab === "products" ? "bg-accent/10 text-accent" : "text-muted"}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("alerts")}
            className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider ${activeTab === "alerts" ? "bg-accent/10 text-accent" : "text-muted"}`}
          >
            Alerts
          </button>
        </div>
        {feedback && (
          <div className={`mb-8 rounded-2xl border px-5 py-4 text-sm font-semibold ${feedback.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            <div className="flex items-center justify-between gap-4">
              <span>{feedback.message}</span>
              <button onClick={() => setFeedback(null)} className="text-xs uppercase tracking-wider opacity-70 hover:opacity-100">Dismiss</button>
            </div>
          </div>
        )}
        {activeTab === "overview" && (
            <>
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
            </>
        )}

        {activeTab === "products" && (
            <>
                <header className="mb-16">
                    <h2 className="text-5xl font-black tracking-tighter mb-2">My Products</h2>
                    <p className="text-muted font-medium">Manage your {initialProducts.length} tracked items.</p>
                </header>
                <div className="bg-white rounded-[2.5rem] border border-border overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-bg">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Product</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Price</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {initialProducts.map(p => (
                                <tr key={p.id} className="hover:bg-bg/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-bg flex items-center justify-center p-2 flex-shrink-0">
                                                <Image src={p.image} alt="" width={48} height={48} unoptimized className="object-contain max-w-full max-h-full" />
                                            </div>
                                            <p className="font-bold text-sm line-clamp-1">{p.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-black">${p.currentPrice.toFixed(2)}</p>
                                        {p.previousPrice && <p className="text-[10px] font-bold text-muted line-through">${p.previousPrice.toFixed(2)}</p>}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${p.outOfStock ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${p.outOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
                                            {p.outOfStock ? 'Out of Stock' : 'Tracking'}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-2">
                                            <Button variant="secondary" className="p-2 h-10 w-10" onClick={() => setSelectedProduct(p)}>
                                                <Info className="w-4 h-4" />
                                            </Button>
                                            <Button variant="secondary" className="p-2 h-10 w-10 hover:bg-red-50" onClick={async () => {
                                                try {
                                                  await deleteProduct(p.id);
                                                  setMessage("success", "Product removed from tracking.");
                                                  router.refresh();
                                                } catch (error) {
                                                  console.error(error);
                                                  setMessage("error", "Could not remove product.");
                                                }
                                            }}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {initialProducts.length === 0 && (
                              <tr>
                                <td colSpan={4} className="px-8 py-14 text-center text-sm font-semibold text-muted">
                                  No tracked products yet. Paste a product URL in Overview to get started.
                                </td>
                              </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {activeTab === "alerts" && (
            <>
                <header className="mb-16">
                    <h2 className="text-5xl font-black tracking-tighter mb-2">Price Drop Alerts</h2>
                    <p className="text-muted font-medium">Get notified the second a price drops below your target.</p>
                </header>
                {initialAlerts.length > 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-border overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-bg">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Product</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Target Price</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Current</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {initialAlerts.map(alertItem => (
                                    <tr key={alertItem.id} className="hover:bg-bg/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-bg flex items-center justify-center p-2 flex-shrink-0">
                                                    <Image src={alertItem.product.image} alt="" width={40} height={40} unoptimized className="object-contain max-w-full max-h-full" />
                                                </div>
                                                <p className="font-bold text-sm line-clamp-1">{alertItem.product.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-black text-accent">${alertItem.targetPrice?.toFixed(2)}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold">${alertItem.product.currentPrice.toFixed(2)}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <Button variant="secondary" className="p-2 h-10 w-10 hover:bg-red-50" onClick={async () => {
                                                try {
                                                  await deleteAlert(alertItem.id);
                                                  setMessage("success", "Alert removed.");
                                                  router.refresh();
                                                } catch (error) {
                                                  console.error(error);
                                                  setMessage("error", "Could not remove alert.");
                                                }
                                            }}>
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-32 text-center border-2 border-dashed border-border rounded-4xl">
                        <div className="w-16 h-16 bg-bg rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Bell className="w-8 h-8 text-muted" />
                        </div>
                        <p className="text-muted font-bold">No active alerts. Set a target price in product details!</p>
                    </div>
                )}
            </>
        )}
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
                            <a href={selectedProduct.url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-muted hover:text-accent transition-colors flex items-center gap-1">
                                {getHostname(selectedProduct.url)} <ExternalLink className="w-3 h-3" />
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
                        <Button className="flex-1 py-5 text-lg" onClick={() => window.open(selectedProduct.url, '_blank', 'noopener,noreferrer')}>View Store Page</Button>
                        <Button variant="secondary" className="px-6 border-red-100 hover:bg-red-50" onClick={async () => {
                            try {
                              await deleteProduct(selectedProduct.id);
                              setSelectedProduct(null);
                              setMessage("success", "Product removed from tracking.");
                              router.refresh();
                            } catch (error) {
                              console.error(error);
                              setMessage("error", "Could not remove product.");
                            }
                        }}>
                            <Trash2 className="w-5 h-5 text-red-500" />
                        </Button>
                      </div>

                      <div className="pt-8 border-t border-border">
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-4 flex items-center gap-2"><Bell className="w-3 h-3" /> Set Price Alert</p>
                          <div className="flex gap-4">
                              <div className="relative flex-1">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">$</span>
                                  <input 
                                    type="number" 
                                    placeholder="Target Price" 
                                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-border bg-bg focus:ring-2 ring-accent/20 outline-none font-bold"
                                    value={targetPrice}
                                    onChange={(e) => setTargetPrice(e.target.value)}
                                  />
                              </div>
                              <Button 
                                onClick={() => handleCreateAlert(selectedProduct.id)} 
                                disabled={isSavingAlert || !targetPrice}
                                className="px-8"
                              >
                                  {isSavingAlert ? "Saving..." : "Set Alert"}
                              </Button>
                          </div>
                          <p className="text-[10px] font-medium text-muted mt-3">We&apos;ll email you at {user?.email} when the price drops below this amount.</p>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

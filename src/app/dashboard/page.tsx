import { getProducts, syncUser, getAlerts } from "@/lib/actions/product";
import { DashboardContent } from "@/components/DashboardContent";
import { Suspense } from "react";

export default async function DashboardPage() {
  const user = await syncUser();
  const products = await getProducts();
  const alerts = await getAlerts();

  return (
    <Suspense fallback={<div className="p-20 text-center font-black text-4xl animate-pulse">Loading Lesspriz...</div>}>
      <DashboardContent initialProducts={products} initialAlerts={alerts} user={user} />
    </Suspense>
  );
}

import { getProducts, syncUser } from "@/lib/actions/product";
import { DashboardContent } from "@/components/DashboardContent";
import { Suspense } from "react";

export default async function DashboardPage() {
  const user = await syncUser();
  const products = await getProducts();

  return (
    <Suspense fallback={<div className="p-20 text-center font-black text-4xl animate-pulse">Loading Lesspriz...</div>}>
      <DashboardContent initialProducts={products} user={user} />
    </Suspense>
  );
}

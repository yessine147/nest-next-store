"use client";

import { useEffect, useState } from "react";
import { ProtectedShell } from "../../components/layout/ProtectedShell";
import { api } from "../../lib/api";
import type { Product } from "../../types/product";
import { ProductCard } from "../../components/products/ProductCard";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type ProductsResponse = {
  data: Product[];
};

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      const data = res.data as ProductsResponse | Product[] | unknown;
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as ProductsResponse).data)
      ) {
        setProducts((data as ProductsResponse).data);
      } else {
        setProducts([]);
      }
    } catch (error: unknown) {
      console.error(error);
      if (error && typeof error === "object" && "message" in error) {
        const message = (error as { message?: string }).message;
        if (message?.includes("Network Error") || message?.includes("ERR_NETWORK")) {
          toast.error("Cannot connect to backend. Is the server running on port 3000?");
        } else {
          toast.error(`Failed to load products: ${message}`);
        }
      } else {
        toast.error("Failed to load products");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      await loadProducts();
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <ProtectedShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Overview of your products and activity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/products/new")}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          New Product
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-slate-900/50 text-sm text-slate-400">
          <p>No products yet.</p>
          <button
            type="button"
            onClick={() => router.push("/products/new")}
            className="mt-3 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
          >
            Create your first product
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={() => router.push(`/products/${p.id}`)}
              onEdit={() => router.push(`/products/${p.id}/edit`)}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}
    </ProtectedShell>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedShell } from "../../../components/layout/ProtectedShell";
import { api } from "../../../lib/api";
import type { Product } from "../../../types/product";
import toast from "react-hot-toast";

export default function ViewProductPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error: unknown) {
        console.error(error);
        toast.error("Failed to load product");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (!Number.isNaN(id)) {
      void load();
    }
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  if (loading || !product) {
    return (
      <ProtectedShell>
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      </ProtectedShell>
    );
  }

  return (
    <ProtectedShell>
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-50">{product.name}</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push(`/products/${id}/edit`)}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Section */}
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-96 items-center justify-center bg-slate-800/50">
              <div className="text-center">
                <svg
                  className="mx-auto h-24 w-24 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-4 text-sm text-slate-400">No image available</p>
              </div>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-50">
              Product Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Price
                </label>
                <p className="mt-1 text-2xl font-bold text-emerald-400">
                  ${Number(product.price).toFixed(2)}
                </p>
              </div>

              {product.description && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Description
                  </label>
                  <p className="mt-1 text-sm leading-relaxed text-slate-300">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Created
                  </label>
                  <p className="mt-1 text-sm text-slate-300">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Last Updated
                  </label>
                  <p className="mt-1 text-sm text-slate-300">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedShell>
  );
}

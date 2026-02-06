"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedShell } from "../../../../components/layout/ProtectedShell";
import { ProductForm, type ProductFormValues } from "../../../../components/products/ProductForm";
import { api } from "../../../../lib/api";
import type { Product } from "../../../../types/product";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error: unknown) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    if (!Number.isNaN(id)) {
      void load();
    }
  }, [id]);

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.description) {
        formData.append("description", values.description);
      }
      formData.append("price", values.price);
      const fileList = values.image as FileList | undefined;
      const file = fileList?.[0];
      if (file) {
        formData.append("image", file);
      }
      await api.patch(`/products/${id}`, formData);
      toast.success("Product updated");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-50">Edit Product</h1>
        <p className="text-sm text-slate-400">
          Update the product details and pricing.
        </p>
      </div>

      {loading || !product ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        </div>
      ) : (
        <ProductForm
          defaultValues={{
            name: product.name,
            description: product.description ?? undefined,
            price: product.price,
          }}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          isSubmitting={submitting}
        />
      )}
    </ProtectedShell>
  );
}


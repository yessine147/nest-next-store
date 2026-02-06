"use client";

import { useState } from "react";
import { ProtectedShell } from "../../../components/layout/ProtectedShell";
import { ProductForm, type ProductFormValues } from "../../../components/products/ProductForm";
import { api } from "../../../lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewProductPage() {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

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
      await api.post("/products", formData);
      toast.success("Product created");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedShell>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-50">New Product</h1>
        <p className="text-sm text-slate-400">
          Create a new product in your catalog.
        </p>
      </div>
      <ProductForm
        submitLabel="Create product"
        onSubmit={handleSubmit}
        isSubmitting={submitting}
      />
    </ProtectedShell>
  );
}


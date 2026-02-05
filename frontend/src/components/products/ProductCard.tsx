import type { Product } from "../../types/product";

type Props = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <div className="flex flex-col rounded-lg border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-50">
          {product.name}
        </h3>
        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-300">
          ${Number(product.price).toFixed(2)}
        </span>
      </div>
      {product.description && (
        <p className="mb-4 text-sm text-slate-300 line-clamp-3">
          {product.description}
        </p>
      )}
      <div className="mt-auto flex gap-2 text-sm">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-md bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}


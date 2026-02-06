import type { Product } from "../../types/product";

type Props = {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onView?: () => void;
};

export function ProductCard({ product, onEdit, onDelete, onView }: Props) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70 shadow-sm transition-all hover:border-slate-700 hover:shadow-lg">
      {product.imageUrl && (
        <div
          className="h-40 w-full cursor-pointer overflow-hidden border-b border-slate-800/60 bg-slate-900"
          onClick={onView}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3
            className="cursor-pointer text-base font-semibold text-slate-50 hover:text-emerald-400 transition-colors"
            onClick={onView}
          >
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
          {onView && (
            <button
              type="button"
              onClick={onView}
              className="flex-1 rounded-md bg-slate-800 px-3 py-2 text-slate-100 hover:bg-slate-700"
            >
              View
            </button>
          )}
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
    </div>
  );
}


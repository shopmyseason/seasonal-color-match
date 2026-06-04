import type { Product } from "@/lib/types";
import { getMatchLabel, type MatchTier } from "@/src/lib/colorMatch";

type ProductCardProps = {
  product: Product;
  matchScore: number;
  hasAvoidWarning?: boolean;
};

function scoreBadgeStyles(tier: MatchTier): string {
  switch (tier) {
    case "excellent":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    case "good":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "possible":
      return "bg-amber-50 text-amber-800 ring-amber-200";
    case "poor":
      return "bg-gray-100 text-gray-600 ring-gray-200";
  }
}

function labelBadgeStyles(tier: MatchTier): string {
  switch (tier) {
    case "excellent":
      return "bg-rose-100/90 text-rose-800 ring-rose-200/80";
    case "good":
      return "bg-emerald-100/90 text-emerald-800 ring-emerald-200/80";
    case "possible":
      return "bg-amber-100/90 text-amber-900 ring-amber-200/80";
    case "poor":
      return "bg-gray-200/90 text-gray-700 ring-gray-300/80";
  }
}

export function ProductCard({
  product,
  matchScore,
  hasAvoidWarning = false,
}: ProductCardProps) {
  const { label, tier } = getMatchLabel(matchScore);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div
        className="relative flex aspect-[4/5] items-center justify-center"
        style={{
          background: `linear-gradient(145deg, ${product.hexColor}33 0%, ${product.hexColor}88 50%, ${product.hexColor}44 100%)`,
        }}
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm">
          <svg
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="absolute right-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center justify-end gap-1.5">
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${scoreBadgeStyles(tier)}`}
          >
            {matchScore}%
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium leading-tight ring-1 ring-inset ${labelBadgeStyles(tier)}`}
          >
            {label}
          </span>
        </div>
        {hasAvoidWarning && (
          <span className="absolute bottom-3 left-3 right-3 rounded-full bg-amber-50 px-2.5 py-1 text-center text-[10px] font-medium leading-tight text-amber-900 ring-1 ring-inset ring-amber-200">
            Not ideal for this palette
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-medium leading-snug text-gray-900 transition-colors group-hover:text-rose-800">
            {product.name}
          </h3>
          <p className="mt-1 text-lg font-semibold text-gray-900">
            {formattedPrice}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="h-5 w-5 shrink-0 rounded-full ring-1 ring-gray-200"
              style={{ backgroundColor: product.hexColor }}
              title={product.colorName}
            />
            <span className="truncate text-sm text-gray-600">
              {product.colorName}
            </span>
          </div>
        </div>

        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {product.palette}
        </p>
      </div>
    </article>
  );
}

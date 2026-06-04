"use client";

import { useMemo, useState } from "react";
import { filterProducts } from "@/lib/filter-products";
import { products } from "@/lib/products";
import { seasonalPalettes } from "@/src/data/seasonalPalettes";
import {
  GOOD_MATCH_MIN_SCORE,
  getMatchScore,
  isNearAvoidColor,
} from "@/src/lib/colorMatch";
import type { SeasonalPalette } from "@/lib/types";
import { ProductCard } from "./ProductCard";

const ALL_PALETTES_VALUE = "";

export function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [paletteValue, setPaletteValue] = useState(ALL_PALETTES_VALUE);
  const [onlyGoodMatches, setOnlyGoodMatches] = useState(false);

  const selectedPalette: SeasonalPalette | null =
    paletteValue === "" ? null : (paletteValue as SeasonalPalette);

  const filteredProducts = useMemo(
    () => filterProducts(products, searchQuery, selectedPalette),
    [searchQuery, selectedPalette],
  );

  const productsWithScores = useMemo(() => {
    const scored = filteredProducts
      .map((product) => {
        const scorePaletteName = selectedPalette ?? product.palette;
        const scorePalette = seasonalPalettes.find(
          (p) => p.name === scorePaletteName,
        );
        const matchScore = scorePalette
          ? getMatchScore(product.hexColor, scorePalette.colors)
          : 0;

        const selectedPaletteData = selectedPalette
          ? seasonalPalettes.find((p) => p.name === selectedPalette)
          : undefined;
        const hasAvoidWarning = selectedPaletteData
          ? isNearAvoidColor(
              product.hexColor,
              selectedPaletteData.avoidColors,
            )
          : false;

        return { product, matchScore, hasAvoidWarning };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    if (!onlyGoodMatches) {
      return scored;
    }

    return scored.filter(
      (item) => item.matchScore >= GOOD_MATCH_MIN_SCORE,
    );
  }, [filteredProducts, selectedPalette, onlyGoodMatches]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedPalette !== null ||
    onlyGoodMatches;

  function clearFilters() {
    setSearchQuery("");
    setPaletteValue(ALL_PALETTES_VALUE);
    setOnlyGoodMatches(false);
  }

  return (
    <>
      <section className="border-b border-gray-100 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
          >
            <div className="relative flex-1">
              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>
              <input
                id="product-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for dresses, blouses, sweaters..."
                autoComplete="off"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
              />
            </div>

            <div className="flex flex-col gap-2 sm:w-52">
              <div>
                <label htmlFor="palette-select" className="sr-only">
                  Seasonal palette
                </label>
                <select
                  id="palette-select"
                  value={paletteValue}
                  onChange={(e) => setPaletteValue(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 transition-colors focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
                >
                  <option value={ALL_PALETTES_VALUE}>All palettes</option>
                  {seasonalPalettes.map((palette) => (
                    <option key={palette.name} value={palette.name}>
                      {palette.name}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex cursor-pointer items-center gap-2 px-1 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={onlyGoodMatches}
                  onChange={(e) => setOnlyGoodMatches(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-300"
                />
                Only show good matches
              </label>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-8 py-3 font-medium text-white shadow-sm transition-colors hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 sm:shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {productsWithScores.length === 0
                ? "No products match your filters."
                : `Showing ${productsWithScores.length} of ${products.length} items`}
            </p>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {searchQuery.trim() && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    Name: &ldquo;{searchQuery.trim()}&rdquo;
                  </span>
                )}
                {selectedPalette && (
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                    {selectedPalette}
                  </span>
                )}
                {onlyGoodMatches && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    Good matches only (75+)
                  </span>
                )}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-medium text-rose-600 underline-offset-2 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {productsWithScores.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productsWithScores.map(
                ({ product, matchScore, hasAvoidWarning }) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    matchScore={matchScore}
                    hasAvoidWarning={hasAvoidWarning}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 text-center">
              <p className="text-gray-600">
                Try a different search term, palette, or turn off good matches
                only.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-medium text-rose-600 underline-offset-2 hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

import type { Product, SeasonalPalette } from "./types";

export function filterProducts(
  products: Product[],
  searchQuery: string,
  selectedPalette: SeasonalPalette | null,
): Product[] {
  const query = searchQuery.trim().toLowerCase();

  return products.filter((product) => {
    const matchesPalette =
      selectedPalette === null || product.palette === selectedPalette;

    const matchesName =
      query.length === 0 || product.name.toLowerCase().includes(query);

    return matchesPalette && matchesName;
  });
}

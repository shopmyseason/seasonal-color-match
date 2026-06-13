import type { Product } from "./types";

export function getBaseCategory(cat: string): string {
  return cat.replace(/^(Women's|Men's|Unisex)\s+/i, "");
}

export function filterProducts(
  products: Product[],
  category: string,
  gender: string,
): Product[] {
  return products.filter((product) => {
    const matchesGender =
      !gender ||
      product.category.toLowerCase().startsWith(gender.toLowerCase());
    const matchesCategory =
      !category || getBaseCategory(product.category) === category;
    return matchesGender && matchesCategory;
  });
}

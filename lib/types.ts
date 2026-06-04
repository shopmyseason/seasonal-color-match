import type { seasonalPaletteNames } from "@/src/data/seasonalPalettes";

export type SeasonalPalette = (typeof seasonalPaletteNames)[number];

export type Product = {
  id: string;
  name: string;
  price: number;
  colorName: string;
  hexColor: string;
  palette: SeasonalPalette;
};

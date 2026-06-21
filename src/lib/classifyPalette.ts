import type { SeasonalPalette } from "@/src/data/seasonalPalettes";
import type { ExtractedColor } from "./extractColors";

/**
 * Each palette is defined by its position on three axes:
 *   - temperature: warm (positive) vs cool (negative), range roughly -1 to 1
 *   - chroma: muted (low) vs clear/bright (high), 0 to 1
 *   - value: light (high) vs deep/dark (low), 0 to 1
 *
 * These profiles encode the fundamental qualities of seasonal color analysis.
 */
type PaletteProfile = {
  name: SeasonalPalette;
  temperature: number; // -1 (cool) to 1 (warm)
  chroma: number; // 0 (muted) to 1 (vivid)
  value: number; // 0 (dark) to 1 (light)
};

const PALETTE_PROFILES: PaletteProfile[] = [
  // SPRING: warm, clear/light
  { name: "Light Spring", temperature: 0.35, chroma: 0.45, value: 0.8 },
  { name: "Warm Spring", temperature: 0.7, chroma: 0.65, value: 0.6 },
  { name: "Clear Spring", temperature: 0.25, chroma: 0.85, value: 0.55 },

  // SUMMER: cool, muted/light
  { name: "Light Summer", temperature: -0.2, chroma: 0.35, value: 0.8 },
  { name: "Soft Summer", temperature: -0.1, chroma: 0.15, value: 0.5 },
  { name: "Cool Summer", temperature: -0.55, chroma: 0.5, value: 0.55 },

  // AUTUMN: warm, muted/deep
  { name: "Soft Autumn", temperature: 0.25, chroma: 0.2, value: 0.5 },
  { name: "Warm Autumn", temperature: 0.55, chroma: 0.45, value: 0.35 },
  { name: "Deep Autumn", temperature: 0.3, chroma: 0.4, value: 0.18 },

  // WINTER: cool, clear/deep
  { name: "Clear Winter", temperature: -0.2, chroma: 0.8, value: 0.45 },
  { name: "Cool Winter", temperature: -0.6, chroma: 0.55, value: 0.35 },
  { name: "Deep Winter", temperature: -0.3, chroma: 0.4, value: 0.15 },
];

/**
 * Determines if a hue is warm or cool on a -1 to 1 scale.
 *
 * In seasonal color analysis:
 *   Warm: red (0°), orange (30°), yellow (60°), yellow-green (80°)
 *   Neutral-warm: green with yellow lean (80-140°)
 *   Cool: blue-green (170°), blue (210-240°), blue-violet (260°)
 *   Cool-to-neutral: violet (270-310°), red-violet/magenta (310-340°)
 *   Warm again: warm red (340-360°)
 *
 * Key insight: greens (100-160°) in clothing are typically warm-toned
 * (olive, forest, moss). True cool starts at teal/cyan (170°+).
 * Pink/magenta (310-340°) is cool in seasonal analysis despite being
 * close to red on the wheel — it has blue undertones.
 */
function hueTemperature(h: number): number {
  h = ((h % 360) + 360) % 360;

  // Warm reds and oranges: 0-60°
  if (h <= 60) return 0.7 + (0.3 * (1 - h / 60));
  // Yellow to yellow-green: 60-90°
  if (h <= 90) return 0.7 - (0.3 * (h - 60) / 30);
  // Green (warm-leaning in clothing): 90-150°
  if (h <= 150) return 0.4 - (0.6 * (h - 90) / 60);
  // Teal/cyan transition to cool: 150-180°
  if (h <= 180) return -0.2 - (0.4 * (h - 150) / 30);
  // Cool blues: 180-260°
  if (h <= 260) {
    const depth = Math.sin(((h - 180) / 80) * Math.PI);
    return -0.6 - 0.4 * depth;
  }
  // Violet: 260-310° (cool)
  if (h <= 310) return -0.6 + (0.2 * (h - 260) / 50);
  // Magenta/pink: 310-340° (cool-leaning, blue undertone)
  if (h <= 340) return -0.4 + (0.6 * (h - 310) / 30);
  // Back to warm red: 340-360°
  return 0.2 + (0.8 * (h - 340) / 20);
}

/**
 * Converts extracted image colors into the three palette axes.
 */
function colorToAxes(color: ExtractedColor): {
  temperature: number;
  chroma: number;
  value: number;
} {
  const temp = hueTemperature(color.h);
  // Weight temperature by saturation — desaturated colors are more neutral
  // But keep a minimum influence so dark saturated colors aren't lost
  const satWeight = Math.max(0.15, color.s / 100);
  const temperature = temp * satWeight;
  const chroma = color.s / 100;
  const value = color.l / 100;

  return { temperature, chroma, value };
}

/**
 * Scores how well a color matches a palette profile.
 * Lower is better (distance in profile space).
 */
function profileDistance(
  axes: { temperature: number; chroma: number; value: number },
  profile: PaletteProfile,
): number {
  // Weight temperature more heavily since it's the most defining quality
  const tempDiff = (axes.temperature - profile.temperature) * 1.5;
  const chromaDiff = axes.chroma - profile.chroma;
  const valueDiff = axes.value - profile.value;
  return Math.sqrt(tempDiff ** 2 + chromaDiff ** 2 + valueDiff ** 2);
}

/**
 * Classifies a single color by its best-matching palette.
 */
export function classifyColor(color: ExtractedColor): {
  palette: SeasonalPalette;
  score: number;
} {
  const axes = colorToAxes(color);
  let bestPalette = PALETTE_PROFILES[0];
  let bestDist = Infinity;

  for (const profile of PALETTE_PROFILES) {
    const dist = profileDistance(axes, profile);
    if (dist < bestDist) {
      bestDist = dist;
      bestPalette = profile;
    }
  }

  // Convert distance to a 0-100 score (max reasonable distance is ~2.5)
  const score = Math.round(Math.max(0, 100 - (bestDist / 2.5) * 100));

  return { palette: bestPalette.name, score };
}

/**
 * Given multiple extracted colors (from an image), determines the best
 * palette by population-weighted voting.
 */
export function classifyByExtractedColors(
  colors: ExtractedColor[],
): SeasonalPalette {
  if (colors.length === 0) return "Soft Autumn";

  const totalPopulation = colors.reduce((sum, c) => sum + c.population, 0);
  const votes = new Map<SeasonalPalette, number>();

  for (const color of colors) {
    const { palette } = classifyColor(color);
    const weight = color.population / totalPopulation;
    votes.set(palette, (votes.get(palette) ?? 0) + weight);
  }

  let bestPalette: SeasonalPalette = "Soft Autumn";
  let bestWeight = 0;
  for (const [palette, weight] of votes) {
    if (weight > bestWeight) {
      bestWeight = weight;
      bestPalette = palette;
    }
  }

  return bestPalette;
}

/**
 * Returns all palette matches ranked by fit, for display purposes.
 */
export function rankPalettes(
  colors: ExtractedColor[],
): { palette: SeasonalPalette; score: number }[] {
  if (colors.length === 0) return [];

  const totalPopulation = colors.reduce((sum, c) => sum + c.population, 0);
  const paletteScores = new Map<SeasonalPalette, number>();

  for (const color of colors) {
    const axes = colorToAxes(color);
    const weight = color.population / totalPopulation;

    for (const profile of PALETTE_PROFILES) {
      const dist = profileDistance(axes, profile);
      const score = Math.max(0, 100 - (dist / 2.5) * 100);
      paletteScores.set(
        profile.name,
        (paletteScores.get(profile.name) ?? 0) + score * weight,
      );
    }
  }

  return [...paletteScores.entries()]
    .map(([palette, score]) => ({ palette, score: Math.round(score) }))
    .sort((a, b) => b.score - a.score);
}

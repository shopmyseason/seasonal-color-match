import sharp from "sharp";

export type ExtractedColor = {
  hex: string;
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  population: number; // pixel count
};

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")
  );
}

function colorDistanceSq(
  a: [number, number, number],
  b: [number, number, number],
): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

/**
 * Simple k-means clustering in RGB space.
 * Returns up to `k` dominant colors sorted by population.
 */
function kMeans(
  pixels: [number, number, number][],
  k: number,
  maxIter = 15,
): { center: [number, number, number]; count: number }[] {
  // Initialize centroids by picking evenly spaced pixels
  const step = Math.max(1, Math.floor(pixels.length / k));
  let centroids: [number, number, number][] = [];
  for (let i = 0; i < k; i++) {
    centroids.push([...pixels[Math.min(i * step, pixels.length - 1)]]);
  }

  let assignments = new Int32Array(pixels.length);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    // Assign each pixel to nearest centroid
    for (let i = 0; i < pixels.length; i++) {
      let bestDist = Infinity;
      let bestIdx = 0;
      for (let c = 0; c < centroids.length; c++) {
        const d = colorDistanceSq(pixels[i], centroids[c]);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = c;
        }
      }
      if (assignments[i] !== bestIdx) {
        assignments[i] = bestIdx;
        changed = true;
      }
    }
    if (!changed) break;

    // Recompute centroids
    const sums = centroids.map(() => [0, 0, 0] as [number, number, number]);
    const counts = new Int32Array(centroids.length);
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      counts[c]++;
    }
    for (let c = 0; c < centroids.length; c++) {
      if (counts[c] > 0) {
        centroids[c] = [
          sums[c][0] / counts[c],
          sums[c][1] / counts[c],
          sums[c][2] / counts[c],
        ];
      }
    }
  }

  // Build result
  const counts = new Int32Array(centroids.length);
  for (let i = 0; i < pixels.length; i++) counts[assignments[i]]++;

  return centroids
    .map((center, i) => ({ center, count: counts[i] }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

/**
 * Downloads an image and extracts the dominant colors using k-means clustering.
 * Filters out near-white and near-black background pixels.
 */
export async function extractColorsFromImage(
  imageUrl: string,
  numColors = 5,
): Promise<ExtractedColor[]> {
  const res = await fetch(imageUrl);
  if (!res.ok) return [];
  const buffer = Buffer.from(await res.arrayBuffer());

  // Resize to small dimensions for speed
  const { data, info } = await sharp(buffer)
    .resize(100, 100, { fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Filter out near-white backgrounds (L > 95) and near-black (L < 5)
    const [, , l] = rgbToHsl(r, g, b);
    if (l > 95 || l < 5) continue;
    // Filter out very low saturation grays that are likely background
    const [, s] = rgbToHsl(r, g, b);
    if (s < 3 && l > 80) continue;
    pixels.push([r, g, b]);
  }

  if (pixels.length < 10) return [];

  const clusters = kMeans(pixels, numColors);
  const totalPixels = pixels.length;

  return clusters.map((c) => {
    const [r, g, b] = c.center;
    const [h, s, l] = rgbToHsl(r, g, b);
    return {
      hex: rgbToHex(r, g, b),
      h,
      s,
      l,
      population: c.count,
    };
  });
}

/**
 * Returns the single most dominant non-background color from an image.
 */
export async function getDominantColor(
  imageUrl: string,
): Promise<ExtractedColor | null> {
  const colors = await extractColorsFromImage(imageUrl, 3);
  return colors[0] ?? null;
}

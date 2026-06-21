import { promises as fs } from "fs";
import path from "path";
import type { Product } from "@/src/data/manualProducts";

const PRODUCTS_PATH = path.join(process.cwd(), "src/data/products.json");
const BLOB_PATHNAME = "products.json";

// True when running on Vercel (BLOB_READ_WRITE_TOKEN is auto-added by Vercel Blob)
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function readProductsFile(): Promise<Product[]> {
  if (useBlob) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: BLOB_PATHNAME });
      const blob = blobs.find((b) => b.pathname === BLOB_PATHNAME);
      if (blob) {
        const res = await fetch(blob.url, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const text = await res.text();
        // Guard against CDN returning HTML error pages
        if (res.ok && text.trimStart().startsWith("[")) {
          return JSON.parse(text) as Product[];
        }
        console.error("Blob fetch returned unexpected content:", res.status, text.slice(0, 200));
      }
    } catch (err) {
      console.error("Blob read failed:", err);
    }
  }
  // Local dev, or first deploy before any write has seeded the blob
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  return JSON.parse(raw) as Product[];
}

export async function writeProductsFile(products: Product[]): Promise<void> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, JSON.stringify(products, null, 2), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    });
    return;
  }
  await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2) + "\n", "utf-8");
}

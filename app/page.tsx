import { ProductCatalog } from "@/components/ProductCatalog";

export default function Home() {
  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-gray-100 bg-gradient-to-b from-rose-50/40 to-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-rose-400">
            Your personal color stylist
          </p>
          <h1 className="font-serif text-4xl font-light tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Seasonal Color Match
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-gray-500">
            Find clothing that harmonizes with your seasonal color palette.
          </p>
        </div>
      </header>

      <ProductCatalog />
    </div>
  );
}

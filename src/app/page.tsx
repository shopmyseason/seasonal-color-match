import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCatalog } from "@/components/ProductCatalog";

export default function Home() {
  return (
    <div className="min-h-full bg-[#faf9f7]">
      <Hero />
      <ProductCatalog />

      {/* Analyze CTA */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-violet-100 bg-gradient-to-r from-rose-50 via-violet-50 to-amber-50 px-8 py-10 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <h2 className="font-serif text-xl font-medium text-gray-900">
                Found something you love?
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Paste any Amazon clothing link and we'll instantly show you which color variations work best for your season.
              </p>
            </div>
            <Link
              href="/analyze"
              className="shrink-0 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 hover:shadow-md"
            >
              Analyze a new product →
            </Link>
          </div>
        </div>
      </section>
      <footer className="border-t border-gray-200/60 px-4 py-8 text-center text-xs text-gray-400 sm:px-6 lg:px-8">
        Style My Season is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
      </footer>
    </div>
  );
}

import Link from "next/link";
import { seasonalPalettes } from "@/src/data/seasonalPalettes";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 12 Seasons — Style My Season",
  description:
    "Learn about the 12 seasonal color palettes and discover which one suits your natural coloring.",
};

const SEASON_GROUPS = [
  {
    season: "Spring",
    bg: "bg-amber-50",
    border: "border-amber-200",
    heading: "text-amber-900",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-400",
    description:
      "Spring palettes are defined by warm undertones and a fresh, clear quality. Colors in this family are golden and luminous rather than cool or ashy. Springs generally wear warm-based hues best — anything with yellow, peach, or golden undertones — and can look washed out in heavy, muted, or very cool shades.",
    palettes: ["Light Spring", "Warm Spring", "Clear Spring"],
    paletteDesc: {
      "Light Spring": "Low contrast, warm, and delicate. The overall effect is soft and light — best served by gentle pastels and warm neutrals rather than deep or saturated shades.",
      "Warm Spring": "The most intensely warm of the springs, with medium depth and saturation. Earthy golds, peachy corals, and warm greens feel most harmonious.",
      "Clear Spring": "High contrast with warm undertones and bright, vivid saturation. This palette can carry bold, clear colors that would overwhelm lower-contrast spring types.",
    },
  },
  {
    season: "Summer",
    bg: "bg-sky-50",
    border: "border-sky-200",
    heading: "text-sky-900",
    badge: "bg-sky-100 text-sky-800",
    dot: "bg-sky-400",
    description:
      "Summer palettes are cool-toned and soft. The defining quality is a gentle, blended contrast — features harmonize with each other rather than standing apart sharply. Muted, dusty versions of colors tend to work better than bright or saturated ones, and warm golden tones can feel jarring against summer's natural coolness.",
    palettes: ["Light Summer", "Soft Summer", "Cool Summer"],
    paletteDesc: {
      "Light Summer": "Cool, low-contrast, and delicate. Soft muted pastels — lavender, powder blue, and rose — suit this palette best. Heavy or saturated colors overpower it.",
      "Soft Summer": "The most muted of all 12 seasons, with low contrast and cool-neutral undertones. Colors should be dusty and blended — think cool grays, mauve, and sage.",
      "Cool Summer": "The strongest contrast within the summer family, with distinctly cool undertones. Deep rose, burgundy, and soft navy bring out its best.",
    },
  },
  {
    season: "Autumn",
    bg: "bg-orange-50",
    border: "border-orange-200",
    heading: "text-orange-900",
    badge: "bg-orange-100 text-orange-800",
    dot: "bg-orange-400",
    description:
      "Autumn palettes are warm and muted, with an earthy, rich quality. Unlike springs, which are warm and bright, autumns lean toward deeper, more complex tones — think spice, moss, and bronze rather than peach and coral. Cool or icy colors tend to clash with autumn's inherent warmth.",
    palettes: ["Soft Autumn", "Warm Autumn", "Deep Autumn"],
    paletteDesc: {
      "Soft Autumn": "Low contrast and muted warmth. Colors should be gentle and earthy — dusty terracotta, sage, and camel — rather than bold or highly saturated.",
      "Warm Autumn": "The most saturated and vividly warm of the autumns. Rich pumpkin, mustard, olive, and copper sit well here without looking overdone.",
      "Deep Autumn": "High depth with warm undertones. This palette supports the richest, darkest shades — chocolate, forest green, aubergine — and loses impact in light or cool colors.",
    },
  },
  {
    season: "Winter",
    bg: "bg-violet-50",
    border: "border-violet-200",
    heading: "text-violet-900",
    badge: "bg-violet-100 text-violet-800",
    dot: "bg-violet-400",
    description:
      "Winter palettes are cool and high-contrast, with a crisp, striking quality. Colors look best when they're clear and definite — either very deep or very light, with little muddiness in between. Warm, muted, or earthy tones tend to soften the contrast that makes winter palettes so powerful.",
    palettes: ["Clear Winter", "Cool Winter", "Deep Winter"],
    paletteDesc: {
      "Clear Winter": "High contrast and vivid saturation with cool-to-neutral undertones. Bold, bright, clear colors — true red, royal blue, emerald — are ideal. Muted or warm tones fall flat.",
      "Cool Winter": "Distinctly cool undertones with medium-to-high contrast. Icy pinks, burgundy, and royal blue are especially flattering; warm or golden shades tend to clash.",
      "Deep Winter": "The deepest and most dramatic of all seasons. Very dark or very light shades create the most impact — true black, deep navy, pure white — while soft or muted tones disappear.",
    },
  },
];

export default function SeasonsPage() {
  return (
    <div className="min-h-full bg-[#faf9f7]">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-gray-200/60 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to shopping
          </Link>
          <h1 className="font-serif text-3xl font-medium text-gray-900 sm:text-4xl">
            The 12 Seasonal Palettes
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600">
            Seasonal color analysis identifies which clothing colors harmonize with your natural undertone, contrast level, and saturation. There are 12 palette types across four seasons — and any season can apply to any person, regardless of background. What matters is the relationship between your features: whether your undertone reads warm or cool, whether your overall look has high or low contrast, and whether your coloring is muted or vivid.
          </p>
        </div>
      </header>

      {/* Season groups */}
      <main className="mx-auto max-w-4xl space-y-16 px-4 py-14 sm:px-6 lg:px-8">
        {SEASON_GROUPS.map((group) => {
          const groupPalettes = seasonalPalettes.filter((p) =>
            group.palettes.includes(p.name),
          );
          return (
            <section key={group.season}>
              {/* Season heading */}
              <div className="mb-8 flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${group.dot}`} />
                <h2 className={`font-serif text-2xl font-medium ${group.heading}`}>
                  {group.season}
                </h2>
              </div>
              <p className="mb-8 text-gray-600">{group.description}</p>

              {/* Palette cards */}
              <div className="space-y-6">
                {groupPalettes.map((palette) => (
                  <div
                    key={palette.name}
                    className={`rounded-2xl border ${group.border} ${group.bg} p-6`}
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className={`mb-1 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${group.badge}`}>
                          {group.season}
                        </span>
                        <h3 className="font-serif text-xl font-medium text-gray-900">
                          {palette.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          {group.paletteDesc[palette.name as keyof typeof group.paletteDesc]}
                        </p>
                      </div>
                    </div>

                    {/* Color swatches */}
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        Palette colors
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {palette.colors.map((color) => (
                          <div key={color.name} className="flex flex-col items-center gap-1">
                            <span
                              className="h-9 w-9 rounded-full border border-black/10 shadow-sm"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                            <span className="w-12 text-center text-[9px] leading-tight text-gray-500">
                              {color.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Avoid colors */}
                    {palette.avoidColors.length > 0 && (
                      <div className="mt-5 border-t border-black/5 pt-4">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                          Colors to avoid
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {palette.avoidColors.map((color) => (
                            <div key={color.name} className="flex flex-col items-center gap-1" title={color.reason}>
                              <span
                                className="relative h-9 w-9 rounded-full border border-black/10 shadow-sm"
                                style={{ backgroundColor: color.hex }}
                              >
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <svg className="h-4 w-4 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </span>
                              </span>
                              <span className="w-12 text-center text-[9px] leading-tight text-gray-400">
                                {color.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center">
          <h2 className="font-serif text-2xl font-medium text-gray-900">
            Ready to shop your palette?
          </h2>
          <p className="mt-2 text-gray-600">
            Browse pieces scored and sorted by how well they match your season.
          </p>
          <Link
            href="/"
            className="mt-5 inline-block rounded-xl bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md"
          >
            Shop by palette
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200/60 px-4 py-8 text-center text-xs text-gray-400 sm:px-6 lg:px-8">
        Style My Season is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
      </footer>
    </div>
  );
}

/**
 * Per-product video wall (community + brand TikToks). No embeds are wired
 * yet — this renders an honest "coming soon" state until real TikTok URLs
 * are provided for this product.
 */
export function ProductVideos() {
  return (
    <section className="border-t border-nero/10 pt-8">
      <h2 className="font-display text-lg uppercase tracking-[0.1em] text-nero">
        La community lo indossa
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({length: 4}).map((_, i) => (
          <div
            key={i}
            className="flex aspect-[9/16] items-center justify-center bg-nero/5 text-center text-[10px] uppercase tracking-widest text-nero/30"
          >
            Presto
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-nero/50">
        I video di questo prodotto arrivano presto — segui{' '}
        <a
          href="https://www.tiktok.com/@anyma.beauty"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-gold"
        >
          @anyma.beauty
        </a>{' '}
        su TikTok.
      </p>
    </section>
  );
}

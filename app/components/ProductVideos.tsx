import {getProductVideo} from '~/lib/productVideo';
import type {AnimaDefinition} from '~/lib/animas';

const CATEGORIES = ['Rossetto', 'Lip Gloss', 'Mascara/Eyeliner'] as const;

/**
 * Per-anima video wall: reuses the same clips shown across the product
 * gallery (one per category) so visitors can see how the rest of that
 * anima's trio looks, since there's no real per-community-post footage
 * (no TikTok embeds) yet.
 */
export function ProductVideos({anima}: {anima?: AnimaDefinition}) {
  const clips = anima
    ? CATEGORIES.flatMap((category) => {
        const video = getProductVideo(category, anima.handle);
        return video ? [{category, video}] : [];
      })
    : [];

  return (
    <section className="border-t border-nero/10 pt-8">
      <h2 className="font-display text-lg uppercase tracking-[0.1em] text-nero">
        La community lo indossa
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {clips.length > 0
          ? clips.map(({category, video}) => (
              <video
                key={category}
                src={video.src}
                poster={video.poster}
                autoPlay
                muted
                loop
                playsInline
                className="aspect-[9/16] w-full rounded object-cover"
              />
            ))
          : Array.from({length: 4}).map((_, i) => (
              <div
                key={i}
                className="flex aspect-[9/16] items-center justify-center bg-nero/5 text-center text-[10px] uppercase tracking-widest text-nero/30"
              >
                Presto
              </div>
            ))}
      </div>
      <p className="mt-3 text-xs text-nero/50">
        I video della community arrivano presto — segui{' '}
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

const COMMUNITY_CLIPS = [
  {name: 'reveal', src: '/videos/community/reveal.mp4', poster: '/videos/community/posters/reveal.jpg'},
  {name: 'gloss-closeup', src: '/videos/community/gloss-closeup.mp4', poster: '/videos/community/posters/gloss-closeup.jpg'},
  {name: 'street-holdup', src: '/videos/community/street-holdup.mp4', poster: '/videos/community/posters/street-holdup.jpg'},
  {name: 'street-macro', src: '/videos/community/street-macro.mp4', poster: '/videos/community/posters/street-macro.jpg'},
];

/**
 * Real UGC-style clips from the influencer shoot — no live TikTok embed
 * feed yet, so this is a fixed set shown on every product for now.
 */
export function ProductVideos() {
  return (
    <section className="border-t border-nero/10 pt-8">
      <h2 className="font-display text-lg uppercase tracking-[0.1em] text-nero">
        La community lo indossa
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {COMMUNITY_CLIPS.map((clip) => (
          <video
            key={clip.name}
            src={clip.src}
            poster={clip.poster}
            autoPlay
            muted
            loop
            playsInline
            className="aspect-[9/16] w-full rounded object-cover"
          />
        ))}
      </div>
      <p className="mt-3 text-xs text-nero/50">
        Altri video della community arrivano presto — segui{' '}
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

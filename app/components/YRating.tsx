import sealPositive from '~/assets/images/seal-y-positive.png';

/**
 * Anyma's review rating mark: 5 "Sello del Alma" Y-seals instead of stars.
 * With no review data source yet, `count` defaults to 0 and renders an
 * honest empty state rather than fabricated ratings.
 */
export function YRating({
  rating = 0,
  count = 0,
}: {
  rating?: number;
  count?: number;
}) {
  if (count === 0) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex gap-1" aria-hidden="true">
          {Array.from({length: 5}).map((_, i) => (
            <img
              key={i}
              src={sealPositive}
              alt=""
              className="h-4 w-auto opacity-20"
            />
          ))}
        </div>
        <span className="text-xs uppercase tracking-[0.15em] text-nero/50">
          Ancora nessuna recensione
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-3"
      role="img"
      aria-label={`${rating} su 5 Anime`}
    >
      <div className="flex gap-1">
        {Array.from({length: 5}).map((_, i) => (
          <img
            key={i}
            src={sealPositive}
            alt=""
            aria-hidden="true"
            className="h-4 w-auto"
            style={{opacity: i < Math.round(rating) ? 1 : 0.2}}
          />
        ))}
      </div>
      <span className="text-xs uppercase tracking-[0.15em] text-nero/60">
        {rating.toFixed(1)} · {count} {count === 1 ? 'recensione' : 'recensioni'}
      </span>
    </div>
  );
}

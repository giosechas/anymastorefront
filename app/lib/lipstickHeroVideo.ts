const VIDEO_COUNT: Record<string, number> = {
  ROSSO: 2,
  NUDE: 1,
  VIOLA: 7,
  CHERRY: 5,
};

/** "Verità senza filtri" hero clips for lipstick PDPs, keyed by color so
 * the same footage plays regardless of which anima the color belongs to. */
export function getLipstickHeroVideos(
  productType: string,
  colorTag: string | undefined,
): {src: string; poster: string}[] {
  if (productType !== 'Rossetto') return [];
  const count = colorTag && VIDEO_COUNT[colorTag];
  if (!count) return [];
  const slug = colorTag!.toLowerCase();

  return Array.from({length: count}, (_, i) => ({
    src: `/videos/hero-lipstick/${slug}/${i + 1}.mp4`,
    poster: `/videos/hero-lipstick/${slug}/posters/${i + 1}.jpg`,
  }));
}

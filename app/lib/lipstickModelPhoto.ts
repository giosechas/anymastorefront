const COLOR_SLUG: Record<string, string> = {
  NUDE: 'nude',
  ROSSO: 'rosso',
  VIOLA: 'viola',
  CHERRY: 'cherry',
};

/** Only lipstick products get "worn on lips" model photos — 4 per color,
 * shared across every anima since the color itself doesn't change. */
export function getLipstickModelPhotos(
  productType: string,
  colorTag: string | undefined,
): {url: string; altText: string}[] {
  if (productType !== 'Rossetto') return [];
  const slug = colorTag && COLOR_SLUG[colorTag];
  if (!slug) return [];

  return Array.from({length: 4}, (_, i) => ({
    url: `/images/lipstick-model/${slug}/${i + 1}.webp`,
    altText: 'Modella indossa il rossetto Anyma',
  }));
}

/** 4 short worn-on-lips clips per color, same models as the photos above. */
export function getLipstickModelVideos(
  productType: string,
  colorTag: string | undefined,
): {src: string; poster: string}[] {
  if (productType !== 'Rossetto') return [];
  const slug = colorTag && COLOR_SLUG[colorTag];
  if (!slug) return [];

  return Array.from({length: 4}, (_, i) => ({
    src: `/videos/lipstick-model/${slug}/${i + 1}.mp4`,
    poster: `/videos/lipstick-model/${slug}/posters/${i + 1}.jpg`,
  }));
}

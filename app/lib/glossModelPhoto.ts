const COLOR_SLUG: Record<string, string> = {
  PINK: 'pink',
  YELLOW: 'yellow',
};

/** Only lip gloss products get "worn on lips" model photos — 4 per color,
 * shared across every anima since the color itself doesn't change. */
export function getGlossModelPhotos(
  productType: string,
  colorTag: string | undefined,
): {url: string; altText: string}[] {
  if (productType !== 'Lip Gloss') return [];
  const slug = colorTag && COLOR_SLUG[colorTag];
  if (!slug) return [];

  return Array.from({length: 4}, (_, i) => ({
    url: `/images/gloss-model/${slug}/${i + 1}.webp`,
    altText: 'Modella indossa il gloss Anyma',
  }));
}

/** 4 short worn-on-lips clips per color, same models as the photos above. */
export function getGlossModelVideos(
  productType: string,
  colorTag: string | undefined,
): {src: string; poster: string}[] {
  if (productType !== 'Lip Gloss') return [];
  const slug = colorTag && COLOR_SLUG[colorTag];
  if (!slug) return [];

  return Array.from({length: 4}, (_, i) => ({
    src: `/videos/gloss-model/${slug}/${i + 1}.mp4`,
    poster: `/videos/gloss-model/${slug}/posters/${i + 1}.jpg`,
  }));
}

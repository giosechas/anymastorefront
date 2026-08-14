const CATEGORY_PREFIX: Record<string, string> = {
  Rossetto: 'lipstick',
  'Lip Gloss': 'gloss',
  'Mascara/Eyeliner': 'mask',
};

/** anima.handle is "anima-<slug>"; video files are named "<prefix>-<slug>.mp4". */
export function getProductVideo(
  productType: string,
  animaHandle: string | undefined,
): {src: string; poster: string} | undefined {
  const prefix = CATEGORY_PREFIX[productType];
  const slug = animaHandle?.replace(/^anima-/, '');
  if (!prefix || !slug) return undefined;

  return {
    src: `/videos/${prefix}-${slug}.mp4`,
    poster: `/videos/posters/${prefix}-${slug}.jpg`,
  };
}

const CATEGORY_PREFIX: Record<string, string> = {
  Rossetto: 'lipstick',
  'Mascara/Eyeliner': 'mask',
};

const GLOSS_VIDEO_COLORS: Record<string, Record<string, string>> = {
  CHERRY: {
    leopard: 'leopard',
    street: 'street',
    'candy-rosa': 'candy-rosa',
  },
};

/** anima.handle is "anima-<slug>"; video files are named "<prefix>-<slug>.mp4". */
export function getProductVideo(
  productType: string,
  animaHandle: string | undefined,
  colorTag?: string,
): {src: string; poster: string} | undefined {
  const slug = animaHandle?.replace(/^anima-/, '');
  if (!slug) return undefined;

  if (productType === 'Lip Gloss' && colorTag) {
    const byAnima = GLOSS_VIDEO_COLORS[colorTag];
    const file = byAnima?.[slug];
    if (file) {
      return {
        src: `/videos/gloss-cherry/${file}.mp4`,
        poster: `/videos/gloss-cherry/posters/${file}.jpg`,
      };
    }
  }

  const prefix = CATEGORY_PREFIX[productType];
  if (!prefix) return undefined;

  return {
    src: `/videos/${prefix}-${slug}.mp4`,
    poster: `/videos/posters/${prefix}-${slug}.jpg`,
  };
}

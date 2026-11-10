const CATEGORY_PREFIX: Record<string, string> = {
  Rossetto: 'lipstick',
  'Mascara/Eyeliner': 'mask',
};

type VideoEntry = {src: string; poster: string};

const GLOSS_VIDEO_COLORS: Record<string, Record<string, VideoEntry>> = {
  PINK: {
    leopard: {
      src: '/videos/gloss/leopard-pink.mp4',
      poster: '/videos/gloss/posters/leopard-pink.jpg',
    },
    'candy-rosa': {
      src: '/videos/gloss/candy-rosa-pink.mp4',
      poster: '/videos/gloss/posters/candy-rosa-pink.jpg',
    },
  },
  YELLOW: {
    street: {
      src: '/videos/gloss/street-light-gold.mp4',
      poster: '/videos/gloss/posters/street-light-gold.jpg',
    },
  },
  CHERRY: {
    leopard: {
      src: '/videos/gloss-cherry/leopard.mp4',
      poster: '/videos/gloss-cherry/posters/leopard.jpg',
    },
    street: {
      src: '/videos/gloss-cherry/street.mp4',
      poster: '/videos/gloss-cherry/posters/street.jpg',
    },
    'candy-rosa': {
      src: '/videos/gloss-cherry/candy-rosa.mp4',
      poster: '/videos/gloss-cherry/posters/candy-rosa.jpg',
    },
  },
  CHOCOLATE: {
    leopard: {
      src: '/videos/gloss/leopard-chocolate.mp4',
      poster: '/videos/gloss/posters/leopard-chocolate.jpg',
    },
    street: {
      src: '/videos/gloss/street-chocolate.mp4',
      poster: '/videos/gloss/posters/street-chocolate.jpg',
    },
    'candy-rosa': {
      src: '/videos/gloss/candy-rosa-chocolate.mp4',
      poster: '/videos/gloss/posters/candy-rosa-chocolate.jpg',
    },
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
    const entry = byAnima?.[slug];
    if (entry) return entry;
  }

  const prefix = CATEGORY_PREFIX[productType];
  if (!prefix) return undefined;

  return {
    src: `/videos/${prefix}-${slug}.mp4`,
    poster: `/videos/posters/${prefix}-${slug}.jpg`,
  };
}

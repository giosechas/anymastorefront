/** "La verità senza filtri" hero video shown on every PDP, keyed by anima
 * handle. Space is reserved on every PDP even where no clip exists yet. */
const ANIMA_HERO_VIDEO: Record<string, {src: string; poster: string}> = {
  'anima-leopard': {
    src: '/videos/anima-hero/leopard.mp4',
    poster: '/videos/anima-hero/posters/leopard.jpg',
  },
  'anima-street': {
    src: '/videos/anima-hero/street.mp4',
    poster: '/videos/anima-hero/posters/street.jpg',
  },
};

export function getAnimaHeroVideo(
  animaHandle: string | undefined,
): {src: string; poster: string} | undefined {
  return animaHandle ? ANIMA_HERO_VIDEO[animaHandle] : undefined;
}

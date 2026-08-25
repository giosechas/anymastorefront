import type {AnimaKey} from '~/lib/animas';

/**
 * Stop-motion "animal built from the packaging" clip per anima — only 4 of
 * 6 exist so far. Files live in /videos/animas/<key>.mp4 (public/, not
 * Vite-imported).
 */
const ANIMAS_WITH_VIDEO: Partial<Record<AnimaKey, true>> = {
  leopard: true,
  panther: true,
  candyRosa: true,
  street: true,
};

export function getAnimaAnimalVideo(
  key: AnimaKey,
): {src: string; poster: string} | undefined {
  if (!ANIMAS_WITH_VIDEO[key]) return undefined;
  const slug = key === 'candyRosa' ? 'candy-rosa' : key;
  return {
    src: `/videos/animas/${slug}.mp4`,
    poster: `/videos/animas/posters/${slug}.jpg`,
  };
}

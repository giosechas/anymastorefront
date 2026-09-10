/** "Verità senza filtri" hero clips for lipstick PDPs — one clip per exact
 * anima + color combination. Filmed footage doesn't cover every combo yet;
 * missing ones fall back to a "video soon" placeholder in the UI. */
const AVAILABLE: Record<string, string[]> = {
  leopard: ['ROSSO', 'NUDE', 'CHERRY', 'VIOLA'],
  panther: ['ROSSO', 'NUDE', 'CHERRY', 'VIOLA'],
  candyRosa: ['ROSSO', 'NUDE', 'VIOLA'],
  candyTiffany: ['NUDE', 'CHERRY', 'VIOLA'],
  street: ['NUDE', 'VIOLA'],
  urban: ['ROSSO', 'CHERRY', 'VIOLA'],
};

export function getLipstickHeroVideo(
  productType: string,
  animaKey: string | undefined,
  colorTag: string | undefined,
): {src: string; poster: string} | undefined {
  if (productType !== 'Rossetto' || !animaKey || !colorTag) return undefined;
  if (!AVAILABLE[animaKey]?.includes(colorTag)) return undefined;

  return {
    src: `/videos/hero-lipstick/${animaKey}/${colorTag}.mp4`,
    poster: `/videos/hero-lipstick/${animaKey}/posters/${colorTag}.jpg`,
  };
}

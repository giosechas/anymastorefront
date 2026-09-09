const VIDEO_COUNT: Record<string, number> = {
  'anima-leopard': 4,
  'anima-panther': 1,
  'anima-urban': 1,
};

/** Only the animas we've filmed so far get "applying it" video clips —
 * the rest keep showing the static mascaraModelPhoto instead. */
export function getMascaraModelVideos(
  productType: string,
  animaHandle: string | undefined,
): {src: string; poster: string}[] {
  if (productType !== 'Mascara/Eyeliner') return [];
  const count = animaHandle && VIDEO_COUNT[animaHandle];
  if (!count) return [];
  const slug = animaHandle!.replace(/^anima-/, '');

  return Array.from({length: count}, (_, i) => ({
    src: `/videos/mascara-model/${slug}/${i + 1}.mp4`,
    poster: `/videos/mascara-model/${slug}/posters/${i + 1}.jpg`,
  }));
}

const MODEL_PHOTO_SLUG: Record<string, string> = {
  'anima-leopard': 'leopard',
  'anima-panther': 'panther',
  'anima-candy-rosa': 'candy-rosa',
  'anima-candy-tiffany': 'candy-tiffany',
  'anima-street': 'street',
  'anima-urban': 'urban',
};

/** Only mascara/eyeliner products get a "model applying it" gallery photo. */
export function getMascaraModelPhoto(
  productType: string,
  animaHandle: string | undefined,
): {url: string; altText: string} | undefined {
  if (productType !== 'Mascara/Eyeliner') return undefined;
  const slug = animaHandle && MODEL_PHOTO_SLUG[animaHandle];
  if (!slug) return undefined;

  return {
    url: `/images/mascara-model/${slug}.jpg`,
    altText: 'Modella applica il mascara Anyma',
  };
}

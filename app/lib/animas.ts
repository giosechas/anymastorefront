export type AnimaKey =
  | 'leopard'
  | 'panther'
  | 'candyRosa'
  | 'candyTiffany'
  | 'street'
  | 'urban';

export interface AnimaDefinition {
  key: AnimaKey;
  handle: string;
  name: string;
  tagline: string;
  swatch: string;
  /** Exact Shopify product tag used to group this anima's products. */
  tag: string;
  /** Number of rotating gallery photos at /images/animas/<slug>/1..N.webp */
  galleryCount: number;
}

export const ANIME: AnimaDefinition[] = [
  {
    key: 'leopard',
    handle: 'anima-leopard',
    name: 'Leopard',
    tagline: 'Per i giorni di energia feroce.',
    swatch: 'anima-tile-leopard',
    tag: 'LEOPARD',
    galleryCount: 8,
  },
  {
    key: 'panther',
    handle: 'anima-panther',
    name: 'Panther',
    tagline: 'Per i momenti di profondità affilata.',
    swatch: 'anima-tile-panther',
    tag: 'PANTHER',
    galleryCount: 11,
  },
  {
    key: 'candyRosa',
    handle: 'anima-candy-rosa',
    name: 'Candy Rosa',
    tagline: 'Per le giornate di intensità dolce.',
    swatch: 'anima-tile-candy-rosa',
    tag: 'CANDY ROSA',
    galleryCount: 5,
  },
  {
    key: 'candyTiffany',
    handle: 'anima-candy-tiffany',
    name: 'Candy Tiffany',
    tagline: 'Per la leggerezza che sorprende.',
    swatch: 'anima-tile-candy-tiffany',
    tag: 'CANDY TIFFANY',
    galleryCount: 10,
  },
  {
    key: 'street',
    handle: 'anima-street',
    name: 'Street',
    tagline: 'Per la libertà autentica.',
    swatch: 'anima-tile-street',
    tag: 'STREET',
    galleryCount: 9,
  },
  {
    key: 'urban',
    handle: 'anima-urban',
    name: 'Urban',
    tagline: 'Per le notti intense.',
    swatch: 'anima-tile-urban',
    tag: 'URBAN',
    galleryCount: 10,
  },
];

export function getAnimaGalleryImages(anima: AnimaDefinition): string[] {
  const slug = anima.handle.replace(/^anima-/, '');
  return Array.from(
    {length: anima.galleryCount},
    (_, i) => `/images/animas/${slug}/${i + 1}.webp`,
  );
}

export function findAnimaByCollectionHandle(
  handle: string | undefined | null,
): AnimaDefinition | undefined {
  return ANIME.find((a) => a.handle === handle);
}

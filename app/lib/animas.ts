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
}

export const ANIME: AnimaDefinition[] = [
  {
    key: 'leopard',
    handle: 'anima-leopard',
    name: 'Leopard',
    tagline: 'Per i giorni di energia feroce.',
    swatch: 'anima-tile-leopard',
    tag: 'LEOPARD',
  },
  {
    key: 'panther',
    handle: 'anima-panther',
    name: 'Panther',
    tagline: 'Per i momenti di profondità affilata.',
    swatch: 'anima-tile-panther',
    tag: 'PANTHER',
  },
  {
    key: 'candyRosa',
    handle: 'anima-candy-rosa',
    name: 'Candy Rosa',
    tagline: 'Per le giornate di intensità dolce.',
    swatch: 'anima-tile-candy-rosa',
    tag: 'CANDY ROSA',
  },
  {
    key: 'candyTiffany',
    handle: 'anima-candy-tiffany',
    name: 'Candy Tiffany',
    tagline: 'Per la leggerezza che sorprende.',
    swatch: 'anima-tile-candy-tiffany',
    tag: 'CANDY TIFFANY',
  },
  {
    key: 'street',
    handle: 'anima-street',
    name: 'Street',
    tagline: 'Per la libertà autentica.',
    swatch: 'anima-tile-street',
    tag: 'STREET',
  },
  {
    key: 'urban',
    handle: 'anima-urban',
    name: 'Urban',
    tagline: 'Per le notti intense.',
    swatch: 'anima-tile-urban',
    tag: 'URBAN',
  },
];

export function findAnimaByCollectionHandle(
  handle: string | undefined | null,
): AnimaDefinition | undefined {
  return ANIME.find((a) => a.handle === handle);
}

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
}

export const ANIME: AnimaDefinition[] = [
  {
    key: 'leopard',
    handle: 'anima-leopard',
    name: 'Leopard',
    tagline: 'Per i giorni di energia feroce.',
    swatch: 'anima-tile-leopard',
  },
  {
    key: 'panther',
    handle: 'anima-panther',
    name: 'Panther',
    tagline: 'Per i momenti di profondità affilata.',
    swatch: 'anima-tile-panther',
  },
  {
    key: 'candyRosa',
    handle: 'anima-candy-rosa',
    name: 'Candy Rosa',
    tagline: 'Per le giornate di intensità dolce.',
    swatch: 'anima-tile-candy-rosa',
  },
  {
    key: 'candyTiffany',
    handle: 'anima-candy-tiffany',
    name: 'Candy Tiffany',
    tagline: 'Per la leggerezza che sorprende.',
    swatch: 'anima-tile-candy-tiffany',
  },
  {
    key: 'street',
    handle: 'anima-street',
    name: 'Street',
    tagline: 'Per la libertà autentica.',
    swatch: 'anima-tile-street',
  },
  {
    key: 'urban',
    handle: 'anima-urban',
    name: 'Urban',
    tagline: 'Per le notti intense.',
    swatch: 'anima-tile-urban',
  },
];

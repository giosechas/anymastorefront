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
  /** Short caps hook line above the story paragraph on the collection page. */
  storyHeading: string;
  /** Longer brand-voice paragraph for the collection page intro. */
  story: string;
  /** True while this anima's brand copy is still a preview draft. */
  comingSoon?: boolean;
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
    storyHeading: 'Presenza assoluta',
    story:
      'L’energia di chi non ha bisogno di chiedere permesso. Per i giorni in cui sai già chi sei e decidi di occupare il tuo spazio nel mondo senza scuse. Un manto regale che protegge e rivela la tua sensibilità più profonda. Oggi non ti nascondi: oggi guidi tu.',
    swatch: 'anima-tile-leopard',
    tag: 'LEOPARD',
    galleryCount: 8,
  },
  {
    key: 'panther',
    handle: 'anima-panther',
    name: 'Panther',
    tagline: 'Per i momenti di profondità affilata.',
    storyHeading: 'Magnetismo silenzioso',
    story:
      'Il potere che non ha bisogno di farsi vedere. Dove Leopard dichiara presenza, Panther possiede il silenzio. Una calma magnetica e sinuosa che custodisce la tua straordinaria forza sotto un’armatura di velluto nero. Entra nel tuo mondo solo chi decidi tu.',
    comingSoon: true,
    swatch: 'anima-tile-panther',
    tag: 'PANTHER',
    galleryCount: 11,
  },
  {
    key: 'candyRosa',
    handle: 'anima-candy-rosa',
    name: 'Candy Rosa',
    tagline: 'Per le giornate di intensità dolce.',
    storyHeading: 'Leggera ribellione',
    story:
      'La leggerezza come atto di coraggio. Chi ha detto che diventare grandi significa rinunciare alla meraviglia? Scegli la gioia come tua dichiarazione di indipendenza. Proteggi la tua bambina interiore e risplendi di una dolcezza che resiste a tutto.',
    swatch: 'anima-tile-candy-rosa',
    tag: 'CANDY ROSA',
    galleryCount: 5,
  },
  {
    key: 'candyTiffany',
    handle: 'anima-candy-tiffany',
    name: 'Candy Tiffany',
    tagline: 'Per la leggerezza che sorprende.',
    storyHeading: 'La leggerezza che si fa luce',
    story:
      'La tua sensibilità è una frequenza luminosa. La versione più limpida, fresca e aerea della dolcezza. Un’innocenza che si apre con fiducia al mondo, trasformando la fragilità in pura energia diurna. Per i giorni in cui decidi semplicemente di splendere.',
    comingSoon: true,
    swatch: 'anima-tile-candy-tiffany',
    tag: 'CANDY TIFFANY',
    galleryCount: 10,
  },
  {
    key: 'street',
    handle: 'anima-street',
    name: 'Street',
    tagline: 'Per la libertà autentica.',
    storyHeading: 'Verità senza filtri',
    story:
      'A proprio agio ovunque, fiera di chi sei. Come il tuo paio di jeans più amato, la tua bellezza si scrive nel cammino, non nell’intonso. Senza specchi, senza filtri, con l’autenticità di chi non deve dimostrare niente a nessuno. Questa è la tua libertà quotidiana.',
    swatch: 'anima-tile-street',
    tag: 'STREET',
    galleryCount: 9,
  },
  {
    key: 'urban',
    handle: 'anima-urban',
    name: 'Urban',
    tagline: 'Per le notti intense.',
    storyHeading: 'Autenticità profonda',
    story:
      'La tua storia è il tuo sapere più prezioso. La versione notturna, intima e matura di chi cammina a testa alta. Non hai bisogno di esibire la tua forza: la porti dentro di te come medaglia di libertà e consapevolezza.',
    comingSoon: true,
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

/** /pack/$handle expects the slug without the "anima-" prefix. */
export function getPackPath(anima: AnimaDefinition): string {
  return `/pack/${anima.handle.replace(/^anima-/, '')}`;
}

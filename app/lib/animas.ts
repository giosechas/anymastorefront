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
    storyHeading: 'L’energia di chi non ha bisogno di chiedere permesso',
    story:
      'Leopard è per i giorni in cui sai già chi sei e non hai bisogno che qualcuno te lo confermi. Rappresenta una natura regale e felina che osserva, sceglie l’obiettivo e occupa il proprio spazio nel mondo senza scuse. La tua grinta non nasconde la sensibilità, la abita: sono sfaccettature naturali della stessa identica pietra. Scegli Leopard se hai deciso di usare la tua forza per proteggere il tuo lato più intimo e vulnerabile, rivelando una presenza che non ha bisogno di alzare la voce per essere riconosciuta.',
    swatch: 'anima-tile-leopard',
    tag: 'LEOPARD',
    galleryCount: 8,
  },
  {
    key: 'panther',
    handle: 'anima-panther',
    name: 'Panther',
    tagline: 'Per i momenti di profondità affilata.',
    storyHeading: 'Il potere che non ha bisogno di essere visto per essere sentito',
    story:
      'Dove Leopard dichiara presenza, Panther possiede il silenzio. È la versione più sofisticata e affilata del nostro sistema di anime: il potere che non ha bisogno di essere visto per essere sentito. Panther custodisce la sensibilità dietro una calma magnetica che nasconde una forza d’urto enorme. Un’armatura di velluto nero per i giorni in cui decidi che l’unico modo per entrare nel tuo mondo è bussare con rispetto e chiedere il permesso.',
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
    storyHeading: 'La leggerezza come atto di coraggio',
    story:
      'Candy Rosa appartiene a chi ha il coraggio di non lasciarsi indurire dal mondo. È l’innocenza intesa come atto di resistenza: il lusso di custodire intatti i sogni e la spontaneità dell’infanzia in un mondo che glorifica solo la serietà costante. L’adulta consapevole e la bambina spontanea qui vivono insieme, nello stesso istante, in una tenerezza ribelle. Non c’è nulla da mascherare o alterare; c’è solo una verità meravigliosa e spontanea da accogliere e indossare con gioia.',
    swatch: 'anima-tile-candy-rosa',
    tag: 'CANDY ROSA',
    galleryCount: 5,
  },
  {
    key: 'candyTiffany',
    handle: 'anima-candy-tiffany',
    name: 'Candy Tiffany',
    tagline: 'Per la leggerezza che sorprende.',
    storyHeading: 'La leggerezza che si fa pura luce',
    story:
      'Candy Tiffany è la leggerezza che si fa pura luce. Se Candy Rosa è il calore avvolgente della tua bambina interiore, Tiffany rappresenta la versione più limpida, aerea e diurna della stessa dolcezza. È un’innocenza che si apre con fiducia verso il mondo, trasformando la fragilità in una frequenza luminosa e sofisticata. È il rituale perfetto per i giorni in cui decidi che la vita è troppo breve per essere vissuta senza gioia.',
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
    storyHeading: 'La verità senza filtri',
    story:
      'Street è l’energia di chi è a proprio agio ovunque perché è a proprio agio con sé stessa. Come il tuo paio di jeans preferito, ammorbidito dal tempo e dal cammino, Street non si traveste per il contesto: vi entra esattamente così com’è. I segni della tua storia e le pieghe della tua strada non sono dettagli da nascondere, ma la mappa preziosa della tua libertà quotidiana. È l’autenticità pura di chi si trucca in movimento, senza specchi e senza la necessità di dover controllare nulla.',
    swatch: 'anima-tile-street',
    tag: 'STREET',
    galleryCount: 9,
  },
  {
    key: 'urban',
    handle: 'anima-urban',
    name: 'Urban',
    tagline: 'Per le notti intense.',
    storyHeading: 'L’autenticità avvolta nel blu della notte',
    story:
      'Se Street è la verità vissuta della strada sotto il sole, Urban è la sua frequenza notturna, intima e profonda. Rappresenta la donna metropolitana che si conosce così bene da non avere alcun bisogno di dimostrare nulla al mondo. Non esibisce la propria storia come un trofeo: la porta dentro di sé come un sapere calmo e un’esperienza preziosa. È l’autenticità essenziale e magnetica, avvolta nel blu profondo della notte.',
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

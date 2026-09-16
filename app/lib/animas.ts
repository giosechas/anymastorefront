import type {LocaleCode} from '~/lib/locale';

export type AnimaKey =
  | 'leopard'
  | 'panther'
  | 'candyRosa'
  | 'candyTiffany'
  | 'street'
  | 'urban';

type LocalizedText = Record<LocaleCode, string>;

export interface AnimaDefinition {
  key: AnimaKey;
  handle: string;
  name: string;
  tagline: LocalizedText;
  /** Short caps hook line above the story paragraph on the collection page. */
  storyHeading: LocalizedText;
  /** Longer brand-voice paragraph for the collection page intro. */
  story: LocalizedText;
  /** True while this anima's brand copy is still a preview draft. */
  comingSoon?: boolean;
  swatch: string;
  /** Representative hex, used to color-code this anima in UI like the
   *  PDP's "change anima" pills — matches its tile texture's palette. */
  color: string;
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
    tagline: {
      IT: 'Per i giorni di energia feroce.',
      EN: 'For days of fierce energy.',
      ES: 'Para los días de energía feroz.',
    },
    storyHeading: {
      IT: 'Presenza assoluta',
      EN: 'Absolute presence',
      ES: 'Presencia absoluta',
    },
    story: {
      IT: 'L’energia di chi non ha bisogno di chiedere permesso. Per i giorni in cui sai già chi sei e decidi di occupare il tuo spazio nel mondo senza scuse. Un manto regale che protegge e rivela la tua sensibilità più profonda. Oggi non ti nascondi: oggi guidi tu.',
      EN: "The energy of someone who doesn't need permission. For the days when you already know who you are and decide to take up your space in the world, unapologetically. A regal coat that protects and reveals your deepest sensitivity. Today you don't hide: today you lead.",
      ES: 'La energía de quien no necesita pedir permiso. Para los días en que ya sabes quién eres y decides ocupar tu espacio en el mundo sin disculpas. Un manto regio que protege y revela tu sensibilidad más profunda. Hoy no te escondes: hoy lideras tú.',
    },
    swatch: 'anima-tile-leopard',
    color: '#a9793a',
    tag: 'LEOPARD',
    galleryCount: 8,
  },
  {
    key: 'panther',
    handle: 'anima-panther',
    name: 'Panther',
    tagline: {
      IT: 'Per i momenti di profondità affilata.',
      EN: 'For moments of razor-sharp depth.',
      ES: 'Para los momentos de profundidad afilada.',
    },
    storyHeading: {
      IT: 'Magnetismo silenzioso',
      EN: 'Silent magnetism',
      ES: 'Magnetismo silencioso',
    },
    story: {
      IT: 'Il potere che non ha bisogno di farsi vedere. Dove Leopard dichiara presenza, Panther possiede il silenzio. Una calma magnetica e sinuosa che custodisce la tua straordinaria forza sotto un’armatura di velluto nero. Entra nel tuo mondo solo chi decidi tu.',
      EN: "Power that doesn't need to be seen. Where Leopard declares its presence, Panther owns the silence. A magnetic, sinuous calm that guards your extraordinary strength beneath an armor of black velvet. Only those you choose get into your world.",
      ES: 'El poder que no necesita hacerse ver. Donde Leopard declara presencia, Panther posee el silencio. Una calma magnética y sinuosa que resguarda tu extraordinaria fuerza bajo una armadura de terciopelo negro. En tu mundo entra solo quien tú decides.',
    },
    comingSoon: true,
    swatch: 'anima-tile-panther',
    color: '#3a3536',
    tag: 'PANTHER',
    galleryCount: 11,
  },
  {
    key: 'candyRosa',
    handle: 'anima-candy-rosa',
    name: 'Candy Rosa',
    tagline: {
      IT: 'Per le giornate di intensità dolce.',
      EN: 'For days of sweet intensity.',
      ES: 'Para los días de intensidad dulce.',
    },
    storyHeading: {
      IT: 'Leggera ribellione',
      EN: 'Light rebellion',
      ES: 'Ligera rebeldía',
    },
    story: {
      IT: 'La leggerezza come atto di coraggio. Chi ha detto che diventare grandi significa rinunciare alla meraviglia? Scegli la gioia come tua dichiarazione di indipendenza. Proteggi la tua bambina interiore e risplendi di una dolcezza che resiste a tutto.',
      EN: 'Lightness as an act of courage. Who said growing up means giving up wonder? Choose joy as your declaration of independence. Protect your inner child and shine with a sweetness that withstands everything.',
      ES: 'La ligereza como acto de valentía. ¿Quién dijo que crecer significa renunciar al asombro? Elige la alegría como tu declaración de independencia. Protege a tu niña interior y brilla con una dulzura que resiste todo.',
    },
    swatch: 'anima-tile-candy-rosa',
    color: '#c96b93',
    tag: 'CANDY ROSA',
    galleryCount: 4,
  },
  {
    key: 'candyTiffany',
    handle: 'anima-candy-tiffany',
    name: 'Candy Tiffany',
    tagline: {
      IT: 'Per la leggerezza che sorprende.',
      EN: 'For the lightness that surprises.',
      ES: 'Para la ligereza que sorprende.',
    },
    storyHeading: {
      IT: 'La leggerezza che si fa luce',
      EN: 'Lightness that becomes light',
      ES: 'La ligereza que se hace luz',
    },
    story: {
      IT: 'La tua sensibilità è una frequenza luminosa. La versione più limpida, fresca e aerea della dolcezza. Un’innocenza che si apre con fiducia al mondo, trasformando la fragilità in pura energia diurna. Per i giorni in cui decidi semplicemente di splendere.',
      EN: 'Your sensitivity is a luminous frequency. The clearest, freshest, airiest version of sweetness. An innocence that opens to the world with trust, turning fragility into pure daytime energy. For the days you simply decide to shine.',
      ES: 'Tu sensibilidad es una frecuencia luminosa. La versión más límpida, fresca y aérea de la dulzura. Una inocencia que se abre al mundo con confianza, transformando la fragilidad en pura energía diurna. Para los días en que simplemente decides brillar.',
    },
    comingSoon: true,
    swatch: 'anima-tile-candy-tiffany',
    color: '#6fcfc0',
    tag: 'CANDY TIFFANY',
    galleryCount: 10,
  },
  {
    key: 'street',
    handle: 'anima-street',
    name: 'Street',
    tagline: {
      IT: 'Per la libertà autentica.',
      EN: 'For authentic freedom.',
      ES: 'Para la libertad auténtica.',
    },
    storyHeading: {
      IT: 'Verità senza filtri',
      EN: 'Truth without filters',
      ES: 'Verdad sin filtros',
    },
    story: {
      IT: 'A proprio agio ovunque, fiera di chi sei. Come il tuo paio di jeans più amato, la tua bellezza si scrive nel cammino, non nell’intonso. Senza specchi, senza filtri, con l’autenticità di chi non deve dimostrare niente a nessuno. Questa è la tua libertà quotidiana.',
      EN: "At ease anywhere, proud of who you are. Like your most-loved pair of jeans, your beauty is written in the wear, not in staying pristine. No mirrors, no filters, with the authenticity of someone who has nothing to prove to anyone. This is your everyday freedom.",
      ES: 'A gusto en cualquier lugar, orgullosa de quien eres. Como tu par de jeans más querido, tu belleza se escribe en el camino recorrido, no en lo intacto. Sin espejos, sin filtros, con la autenticidad de quien no tiene nada que demostrarle a nadie. Esta es tu libertad cotidiana.',
    },
    swatch: 'anima-tile-street',
    color: '#4a6280',
    tag: 'STREET',
    galleryCount: 9,
  },
  {
    key: 'urban',
    handle: 'anima-urban',
    name: 'Urban',
    tagline: {
      IT: 'Per le notti intense.',
      EN: 'For intense nights.',
      ES: 'Para las noches intensas.',
    },
    storyHeading: {
      IT: 'Autenticità profonda',
      EN: 'Deep authenticity',
      ES: 'Autenticidad profunda',
    },
    story: {
      IT: 'La tua storia è il tuo sapere più prezioso. La versione notturna, intima e matura di chi cammina a testa alta. Non hai bisogno di esibire la tua forza: la porti dentro di te come medaglia di libertà e consapevolezza.',
      EN: "Your story is your most precious knowledge. The nighttime, intimate, mature version of someone who walks with her head held high. You don't need to show off your strength: you carry it within you like a medal of freedom and awareness.",
      ES: 'Tu historia es tu saber más preciado. La versión nocturna, íntima y madura de quien camina con la cabeza en alto. No necesitas exhibir tu fuerza: la llevas dentro como una medalla de libertad y consciencia.',
    },
    comingSoon: true,
    swatch: 'anima-tile-urban',
    color: '#1c2333',
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

export function findAnimaByTag(
  tags: string[] | undefined | null,
): AnimaDefinition | undefined {
  if (!tags) return undefined;
  return ANIME.find((a) => tags.includes(a.tag));
}

/** /pack/$handle expects the slug without the "anima-" prefix. */
export function getPackPath(anima: AnimaDefinition): string {
  return `/pack/${anima.handle.replace(/^anima-/, '')}`;
}

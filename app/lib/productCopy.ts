import type {LocaleCode} from '~/lib/locale';

/**
 * Short, personal product copy in Anyma's voice (identity over features).
 * Keyed by productType (Shopify "Type") + color tag, since color meaning
 * doesn't change across animas — only the packaging does.
 */
const SHORT_DESCRIPTIONS: Record<LocaleCode, Record<string, Record<string, string>>> = {
  IT: {
    Rossetto: {
      NUDE: 'Un nude che non si nasconde: pigmento pieno, texture setosa, finish che dura tutto il giorno senza pesare sulle labbra.',
      ROSSO: 'Il rosso che parla prima ancora che tu apra bocca. Pigmentazione intensa, texture cremosa, presenza assoluta.',
      VIOLA: 'Un viola magnetico per chi non chiede permesso. Colore pieno dal primo passaggio, finish vellutato.',
      CHERRY: 'Succoso, intenso, impossibile da ignorare. Il cherry che trasforma un gesto quotidiano in una dichiarazione.',
    },
    'Lip Gloss': {
      PINK: 'Shine luminoso, colore che si costruisce a strati. Il pink che illumina senza gridare.',
      YELLOW: 'Un tocco di luce dorata, effetto specchio, comfort totale sulle labbra. Per chi gioca con la luce.',
    },
    'Mascara/Eyeliner': {
      BLACK: 'Volume e allungamento in un solo gesto. Nero intenso, formula leggera, sguardo che non passa inosservato.',
      LILLA: 'Un lilla inaspettato per uno sguardo fuori dagli schemi. Definizione netta, colore che sorprende.',
    },
  },
  EN: {
    Rossetto: {
      NUDE: "A nude that doesn't hide: full pigment, silky texture, an all-day finish that never weighs your lips down.",
      ROSSO: 'The red that speaks before you even open your mouth. Intense pigment, creamy texture, absolute presence.',
      VIOLA: 'A magnetic purple for those who ask no permission. Full color from the first swipe, velvet finish.',
      CHERRY: "Juicy, intense, impossible to ignore. The cherry that turns an everyday gesture into a statement.",
    },
    'Lip Gloss': {
      PINK: 'A luminous shine that builds in layers. The pink that lights up without shouting.',
      YELLOW: 'A touch of golden light, mirror effect, total lip comfort. For those who play with light.',
    },
    'Mascara/Eyeliner': {
      BLACK: 'Volume and length in a single gesture. Intense black, lightweight formula, a gaze that doesn\'t go unnoticed.',
      LILLA: 'An unexpected lilac for a look that breaks the mold. Sharp definition, a color that surprises.',
    },
  },
  ES: {
    Rossetto: {
      NUDE: 'Un nude que no se esconde: pigmento total, textura sedosa, acabado que dura todo el día sin pesar en los labios.',
      ROSSO: 'El rojo que habla antes de que abras la boca. Pigmentación intensa, textura cremosa, presencia absoluta.',
      VIOLA: 'Un violeta magnético para quien no pide permiso. Color total desde el primer trazo, acabado aterciopelado.',
      CHERRY: 'Jugoso, intenso, imposible de ignorar. El cherry que convierte un gesto cotidiano en una declaración.',
    },
    'Lip Gloss': {
      PINK: 'Brillo luminoso, color que se construye en capas. El pink que ilumina sin gritar.',
      YELLOW: 'Un toque de luz dorada, efecto espejo, confort total en los labios. Para quien juega con la luz.',
    },
    'Mascara/Eyeliner': {
      BLACK: 'Volumen y alargamiento en un solo gesto. Negro intenso, fórmula ligera, una mirada que no pasa desapercibida.',
      LILLA: 'Un lila inesperado para una mirada fuera de lo común. Definición nítida, un color que sorprende.',
    },
  },
};

export function getShortDescription(
  productType: string,
  colorTag: string | undefined,
  locale: LocaleCode = 'IT',
): string | undefined {
  if (!colorTag) return undefined;
  return SHORT_DESCRIPTIONS[locale]?.[productType]?.[colorTag];
}

/**
 * A second, more philosophical line for "La community lo indossa" — distinct
 * in tone from the short description above, so the two sections don't repeat
 * the same thought in different words.
 */
const COMMUNITY_TAGLINES: Record<LocaleCode, Record<string, Record<string, string>>> = {
  IT: {
    Rossetto: {
      NUDE: 'Non hai bisogno di alzare la voce per farti sentire.',
      ROSSO: 'Ogni volta che lo indossi, decidi tu chi sei oggi.',
      VIOLA: 'Chi ti guarda si accorge subito che non chiedi permesso.',
      CHERRY: 'La tua energia non si nasconde: si mostra, si vive, si condivide.',
    },
  },
  EN: {
    Rossetto: {
      NUDE: "You don't need to raise your voice to be heard.",
      ROSSO: 'Every time you wear it, you decide who you are today.',
      VIOLA: 'Whoever looks at you notices right away that you ask no permission.',
      CHERRY: "Your energy doesn't hide: it shows, it lives, it's shared.",
    },
  },
  ES: {
    Rossetto: {
      NUDE: 'No necesitas alzar la voz para hacerte sentir.',
      ROSSO: 'Cada vez que lo usas, decides tú quién eres hoy.',
      VIOLA: 'Quien te mira se da cuenta enseguida de que no pides permiso.',
      CHERRY: 'Tu energía no se esconde: se muestra, se vive, se comparte.',
    },
  },
};

export function getCommunityTagline(
  productType: string,
  colorTag: string | undefined,
  locale: LocaleCode = 'IT',
): string | undefined {
  if (!colorTag) return undefined;
  return COMMUNITY_TAGLINES[locale]?.[productType]?.[colorTag];
}

export const COLOR_SWATCH_HEX: Record<string, string> = {
  NUDE: '#C9A488',
  ROSSO: '#B3212E',
  VIOLA: '#5B2A6E',
  CHERRY: '#7A1F2B',
  PINK: '#FF8FC0',
  YELLOW: '#F4C542',
  BLACK: '#1A1A1A',
  LILLA: '#B9A3D9',
};

const KNOWN_COLORS = Object.keys(COLOR_SWATCH_HEX);

/** Pull the color tag (e.g. "NUDE") out of a product's tag list. */
export function getColorTag(tags: string[]): string | undefined {
  return tags.find((t) => KNOWN_COLORS.includes(t.toUpperCase()))?.toUpperCase();
}

const COLOR_LABEL: Record<LocaleCode, Record<string, string>> = {
  IT: {
    NUDE: 'Nude',
    ROSSO: 'Rosso',
    VIOLA: 'Viola',
    CHERRY: 'Cherry',
    PINK: 'Pink',
    YELLOW: 'Yellow',
    BLACK: 'Black',
    LILLA: 'Lilla',
  },
  EN: {
    NUDE: 'Nude',
    ROSSO: 'Red',
    VIOLA: 'Purple',
    CHERRY: 'Cherry',
    PINK: 'Pink',
    YELLOW: 'Yellow',
    BLACK: 'Black',
    LILLA: 'Lilac',
  },
  ES: {
    NUDE: 'Nude',
    ROSSO: 'Rojo',
    VIOLA: 'Violeta',
    CHERRY: 'Cherry',
    PINK: 'Pink',
    YELLOW: 'Yellow',
    BLACK: 'Black',
    LILLA: 'Lila',
  },
};

/** Display label for a color tag (e.g. "ROSSO" -> "Red" in EN). Falls back
 * to the raw tag if it isn't a known color. */
export function getColorLabel(colorTag: string, locale: LocaleCode = 'IT'): string {
  return COLOR_LABEL[locale]?.[colorTag] ?? colorTag;
}

const CATEGORY_LABELS: Record<LocaleCode, Record<string, string>> = {
  IT: {
    Rossetto: 'Rossetto',
    'Lip Gloss': 'Lip Gloss',
    'Mascara/Eyeliner': 'Mascara',
  },
  EN: {
    Rossetto: 'Lipstick',
    'Lip Gloss': 'Lip Gloss',
    'Mascara/Eyeliner': 'Mascara',
  },
  ES: {
    Rossetto: 'Labial',
    'Lip Gloss': 'Lip Gloss',
    'Mascara/Eyeliner': 'Máscara',
  },
};

/** Display label for a Shopify productType (e.g. "Rossetto" -> "Lipstick"
 * in EN). Falls back to the raw productType if it isn't recognized. */
export function getCategoryLabel(
  productType: string,
  locale: LocaleCode = 'IT',
): string {
  return CATEGORY_LABELS[locale]?.[productType] ?? productType;
}

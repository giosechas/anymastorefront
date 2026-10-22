import type {LocaleCode} from '~/lib/locale';

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
  // Announced, no live product yet (see getComingSoonColors in skuData.ts).
  CHOCOLATE: '#5C3A21',
};

const KNOWN_COLORS = Object.keys(COLOR_SWATCH_HEX);

/** Pull the color tag (e.g. "NUDE") out of a product's tag list. */
export function getColorTag(tags: string[]): string | undefined {
  return tags.find((t) => KNOWN_COLORS.includes(t.toUpperCase()))?.toUpperCase();
}

// These are brand/shade names (like "Nude" or "Cherry" already were) —
// same spelling in every locale, not translated.
const COLOR_LABEL: Record<LocaleCode, Record<string, string>> = {
  IT: {
    NUDE: 'Nude',
    ROSSO: 'Red Metal',
    VIOLA: 'Violet',
    CHERRY: 'Cherry',
    PINK: 'Pink',
    YELLOW: 'Light Gold',
    BLACK: 'Super Black',
    LILLA: 'Pervinca',
    CHOCOLATE: 'Chocolate',
  },
  EN: {
    NUDE: 'Nude',
    ROSSO: 'Red Metal',
    VIOLA: 'Violet',
    CHERRY: 'Cherry',
    PINK: 'Pink',
    YELLOW: 'Light Gold',
    BLACK: 'Super Black',
    LILLA: 'Pervinca',
    CHOCOLATE: 'Chocolate',
  },
  ES: {
    NUDE: 'Nude',
    ROSSO: 'Red Metal',
    VIOLA: 'Violet',
    CHERRY: 'Cherry',
    PINK: 'Pink',
    YELLOW: 'Light Gold',
    BLACK: 'Super Black',
    LILLA: 'Pervinca',
    CHOCOLATE: 'Chocolate',
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

/** "Lip Gloss - Light Gold" style title built from the translated category +
 * color labels, used instead of Shopify's raw (Italian) product title so
 * renamed colors show correctly in every locale. */
export function getComposedTitle(
  productType: string,
  colorTag: string | undefined,
  locale: LocaleCode = 'IT',
): string {
  const category = getCategoryLabel(productType, locale);
  const color = colorTag ? getColorLabel(colorTag, locale) : '';
  return color ? `${category} - ${color}` : category;
}

export const FINISH_MAP: Record<string, Record<string, string>> = {
  Rossetto: {
    NUDE: 'Pearly Gloss',
    ROSSO: 'Metallic',
    VIOLA: 'Pearly Gloss',
    CHERRY: 'Pearly Gloss',
  },
  'Lip Gloss': {
    PINK: 'Super Pearly Gloss',
    YELLOW: 'Pearly Gloss',
    CHOCOLATE: 'Pearly Gloss',
    CHERRY: 'Pearly Gloss',
  },
  'Mascara/Eyeliner': {
    BLACK: 'Super Black',
    LILLA: 'Pervinca',
  },
};

const SEO_DESCRIPTIONS: Record<LocaleCode, Record<string, Record<string, string>>> = {
  IT: {
    Rossetto: {
      NUDE: 'Rossetto Nude dal finish Pearly Gloss, pensato per il pre-lancio ANYMA. Texture italiana, colore naturale, personalità decisa.',
      ROSSO: 'Rossetto Red Metal dal finish Metallic intenso. Il colore più audace del pre-lancio ANYMA, per chi non cerca compromessi.',
      VIOLA: 'Rossetto Violet dal finish Pearly Gloss, profondo e luminoso. Un colore che racconta chi sei ancor prima di parlare.',
      CHERRY: 'Rossetto Cherry dal finish Pearly Gloss, caldo e avvolgente. Il tono perfetto per i tuoi momenti più decisi.',
    },
    'Lip Gloss': {
      PINK: 'Lip Gloss Pink dal finish Super Pearly Gloss. Brillantezza leggera e un rosa vibrante per il tuo look quotidiano.',
      YELLOW: 'Lip Gloss Light Gold dal finish Pearly Gloss. Una luce calda e dorata che valorizza ogni espressione.',
    },
    'Mascara/Eyeliner': {
      BLACK: 'Mascara Super Black per ciglia intense e definite. Formula italiana e applicatore di precisione, dal pre-lancio ANYMA.',
      LILLA: 'Mascara Pervinca per uno sguardo inaspettato. Un lilla delicato che gioca con la luce, formula italiana.',
    },
  },
  EN: {
    Rossetto: {
      NUDE: 'Nude Lipstick with Pearly Gloss finish, crafted for the ANYMA pre-launch. Italian texture, natural color, bold personality.',
      ROSSO: 'Red Metal Lipstick with an intense Metallic finish. The boldest shade from the ANYMA pre-launch, for those who seek no compromise.',
      VIOLA: 'Violet Lipstick with Pearly Gloss finish, deep and luminous. A color that tells your story before you speak.',
      CHERRY: 'Cherry Lipstick with Pearly Gloss finish, warm and enveloping. The perfect shade for your most decisive moments.',
    },
    'Lip Gloss': {
      PINK: 'Pink Lip Gloss with Super Pearly Gloss finish. Light brilliance and a vibrant pink for your daily look.',
      YELLOW: 'Light Gold Lip Gloss with Pearly Gloss finish. A warm, golden glow that enhances every expression.',
    },
    'Mascara/Eyeliner': {
      BLACK: 'Super Black Mascara for intense, defined lashes. Italian formula and precision applicator, from the ANYMA pre-launch.',
      LILLA: 'Pervinca Mascara for an unexpected gaze. A delicate lilac that plays with light, Italian formula.',
    },
  },
  ES: {
    Rossetto: {
      NUDE: 'Labial Nude con acabado Pearly Gloss, pensado para el pre-lanzamiento ANYMA. Textura italiana, color natural, personalidad firme.',
      ROSSO: 'Labial Red Metal con acabado Metallic intenso. El tono más audaz del pre-lanzamiento ANYMA, para quien no busca compromisos.',
      VIOLA: 'Labial Violet con acabado Pearly Gloss, profundo y luminoso. Un color que cuenta quién eres antes de hablar.',
      CHERRY: 'Labial Cherry con acabado Pearly Gloss, cálido y envolvente. El tono perfecto para tus momentos más decididos.',
    },
    'Lip Gloss': {
      PINK: 'Lip Gloss Pink con acabado Super Pearly Gloss. Brillo ligero y un rosa vibrante para tu look diario.',
      YELLOW: 'Lip Gloss Light Gold con acabado Pearly Gloss. Una luz cálida y dorada que realza cada expresión.',
    },
    'Mascara/Eyeliner': {
      BLACK: 'Máscara Super Black para pestañas intensas y definidas. Fórmula italiana y aplicador de precisión, del pre-lanzamiento ANYMA.',
      LILLA: 'Máscara Pervinca para una mirada inesperada. Un lila delicado que juega con la luz, fórmula italiana.',
    },
  },
};

export function getSeoDescription(
  productType: string,
  colorTag: string | undefined,
  animaName: string | undefined,
  locale: LocaleCode = 'IT',
): string {
  if (colorTag) {
    const desc = SEO_DESCRIPTIONS[locale]?.[productType]?.[colorTag];
    if (desc) return desc;
  }
  const category = getCategoryLabel(productType, locale);
  const color = colorTag ? getColorLabel(colorTag, locale) : '';
  const anima = animaName ? ` – Anyma ${animaName}` : '';
  if (locale === 'EN') {
    return `${category}${color ? ` ${color}` : ''}${anima}. Discover the ANYMA pre-launch: 800 units, Italian formulas, packaging that tells your story.`;
  }
  if (locale === 'ES') {
    return `${category}${color ? ` ${color}` : ''}${anima}. Descubre el pre-lanzamiento ANYMA: 800 unidades, fórmulas italianas, un packaging que cuenta tu historia.`;
  }
  return `${category}${color ? ` ${color}` : ''}${anima}. Scopri il pre-lancio ANYMA: 800 unità, formule italiane, un packaging che racconta chi sei.`;
}

export function getFinish(productType: string, colorTag: string | undefined): string | undefined {
  if (!colorTag) return undefined;
  return FINISH_MAP[productType]?.[colorTag];
}

/** "ANYMA Leopard · Lip Gloss - Light Gold" style title used on catalog
 * cards and in the cart, combining the anima name with the composed
 * category+color title. */
export function getCatalogTitle(
  productType: string,
  colorTag: string | undefined,
  animaName: string | undefined,
  locale: LocaleCode = 'IT',
): string {
  return `ANYMA ${animaName ?? ''} · ${getComposedTitle(productType, colorTag, locale)}`
    .replace(/\s+/g, ' ')
    .trim();
}

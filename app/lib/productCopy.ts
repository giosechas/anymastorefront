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

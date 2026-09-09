/**
 * Short, personal product copy in Anyma's voice (identity over features).
 * Keyed by productType (Shopify "Type") + color tag, since color meaning
 * doesn't change across animas — only the packaging does.
 */
const SHORT_DESCRIPTIONS: Record<string, Record<string, string>> = {
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
};

export function getShortDescription(
  productType: string,
  colorTag: string | undefined,
): string | undefined {
  if (!colorTag) return undefined;
  return SHORT_DESCRIPTIONS[productType]?.[colorTag];
}

/**
 * A second, more philosophical line for "La community lo indossa" — distinct
 * in tone from the short description above, so the two sections don't repeat
 * the same thought in different words.
 */
const COMMUNITY_TAGLINES: Record<string, Record<string, string>> = {
  Rossetto: {
    NUDE: 'Non hai bisogno di alzare la voce per farti sentire.',
    ROSSO: 'Ogni volta che lo indossi, decidi tu chi sei oggi.',
    VIOLA: 'Chi ti guarda si accorge subito che non chiedi permesso.',
    CHERRY: 'La tua energia non si nasconde: si mostra, si vive, si condivide.',
  },
};

export function getCommunityTagline(
  productType: string,
  colorTag: string | undefined,
): string | undefined {
  if (!colorTag) return undefined;
  return COMMUNITY_TAGLINES[productType]?.[colorTag];
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

export const CATEGORY_LABEL: Record<string, string> = {
  Rossetto: 'Rossetto',
  'Lip Gloss': 'Lip Gloss',
  'Mascara/Eyeliner': 'Mascara',
};

import productsData from '~/data/anymaProducts.json';
import type {LocaleCode} from '~/lib/locale';

/** One row of app/data/anymaProducts.json — per (anima, category, color)
 * SKU. `story_*` is per-color brand copy (identical across every anima for
 * a given color); `open`/`closed` packaging text is per-anima. `comingSoon`
 * rows have no image fields yet — they exist only so the color shows up as
 * an upcoming shade in the UI. */
export interface AnymaSku {
  id: string;
  collection: string;
  category: 'LIPSTICK' | 'GLOSS' | 'MASCARA';
  color: string;
  closed?: string;
  open?: string;
  img?: string;
  imgFmt?: string;
  imgOpen?: string;
  swatch?: string;
  imgClosed?: string;
  finish?: string | null;
  aroma?: string;
  story_it?: string;
  story_en?: string;
  story_es?: string;
  comingSoon?: boolean;
}

const SKUS = productsData as AnymaSku[];

/** Shopify's `productType` -> this dataset's `category`. */
const PRODUCT_TYPE_TO_CATEGORY: Record<string, AnymaSku['category']> = {
  Rossetto: 'LIPSTICK',
  'Lip Gloss': 'GLOSS',
  'Mascara/Eyeliner': 'MASCARA',
};

/** The live Shopify tag for a color (e.g. "ROSSO") -> the new brand name
 * used in this dataset's `color` field (e.g. "RED METAL"). Shopify's own
 * tags weren't renamed, only the displayed name changed. */
const TAG_TO_SKU_COLOR: Record<string, string> = {
  ROSSO: 'RED METAL',
  VIOLA: 'VIOLET',
  BLACK: 'SUPER BLACK',
  LILLA: 'PERVINCA',
  YELLOW: 'LIGHT GOLD',
  NUDE: 'NUDE',
  CHERRY: 'CHERRY',
  PINK: 'PINK',
};

/** Shopify's `productType` -> this dataset's `category`, exposed for
 * modules (e.g. pdpContent.ts) that key their own tables by category. */
export function getCategoryKey(
  productType: string,
): AnymaSku['category'] | undefined {
  return PRODUCT_TYPE_TO_CATEGORY[productType];
}

/** The live Shopify color tag -> this dataset's brand color name, exposed
 * for modules that key their own tables by the new brand color name. */
export function getSkuColorKey(colorTag: string | undefined): string | undefined {
  return colorTag ? TAG_TO_SKU_COLOR[colorTag] ?? colorTag : undefined;
}

function findSku(
  productType: string,
  colorTag: string | undefined,
  animaTag: string | undefined,
): AnymaSku | undefined {
  if (!colorTag || !animaTag) return undefined;
  const category = PRODUCT_TYPE_TO_CATEGORY[productType];
  const color = TAG_TO_SKU_COLOR[colorTag] ?? colorTag;
  return SKUS.find(
    (sku) =>
      sku.category === category &&
      sku.color === color &&
      sku.collection === animaTag,
  );
}

/** The color's brand-voice story (replaces the old short description as
 * the PDP's primary copy), in the given locale. */
export function getSkuStory(
  productType: string,
  colorTag: string | undefined,
  animaTag: string | undefined,
  locale: LocaleCode,
): string | undefined {
  const sku = findSku(productType, colorTag, animaTag);
  if (!sku) return undefined;
  return (
    {IT: sku.story_it, EN: sku.story_en, ES: sku.story_es}[locale] ??
    sku.story_it
  );
}

/** Finish (e.g. "Pearly Gloss") and scent, shown under the color name. */
export function getSkuFinishAroma(
  productType: string,
  colorTag: string | undefined,
  animaTag: string | undefined,
): {finish?: string | null; aroma?: string} | undefined {
  const sku = findSku(productType, colorTag, animaTag);
  if (!sku) return undefined;
  return {finish: sku.finish, aroma: sku.aroma};
}

/** Colors for a product type that are announced but have no live Shopify
 * product yet (no photos) — e.g. Lip Gloss Chocolate/Cherry. Used to show
 * a blurred "coming soon" swatch alongside the real ones. */
export function getComingSoonColors(
  productType: string,
): {color: string; tag: string}[] {
  const category = PRODUCT_TYPE_TO_CATEGORY[productType];
  const seen = new Set<string>();
  const result: {color: string; tag: string}[] = [];
  for (const sku of SKUS) {
    if (sku.category !== category || !sku.comingSoon) continue;
    if (seen.has(sku.color)) continue;
    seen.add(sku.color);
    const tag =
      Object.entries(TAG_TO_SKU_COLOR).find(([, v]) => v === sku.color)?.[0] ??
      sku.color;
    result.push({color: sku.color, tag});
  }
  return result;
}

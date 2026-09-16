import type {CountryCode, LanguageCode} from '@shopify/hydrogen/storefront-api-types';

export type LocaleCode = 'IT' | 'EN' | 'ES';

export const LOCALES: {code: LocaleCode; label: string}[] = [
  {code: 'IT', label: 'IT'},
  {code: 'EN', label: 'EN'},
  {code: 'ES', label: 'ES'},
];

const LOCALE_I18N: Record<
  LocaleCode,
  {language: LanguageCode; country: CountryCode}
> = {
  IT: {language: 'IT', country: 'IT'},
  EN: {language: 'EN', country: 'US'},
  ES: {language: 'ES', country: 'ES'},
};

/** URL prefix for each non-default locale, e.g. `/en`. Italian has none —
 * it lives at the root so existing URLs/SEO don't change. */
export const LOCALE_PREFIXES: Partial<Record<LocaleCode, string>> = {
  EN: '/en',
  ES: '/es',
};

/** "/en/products/foo" -> 'EN'. Falls back to 'IT' for anything else,
 * including the unprefixed root. */
export function getLocaleFromPathname(pathname: string): LocaleCode {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'EN';
  if (pathname === '/es' || pathname.startsWith('/es/')) return 'ES';
  return 'IT';
}

/** Strips any existing locale prefix off a pathname, e.g. "/en/cart" -> "/cart". */
export function stripLocalePrefix(pathname: string): string {
  for (const prefix of Object.values(LOCALE_PREFIXES)) {
    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

/** Prefixes an already-unprefixed internal path with the given locale
 * (no-op for IT), e.g. localizePath('/cart', 'EN') -> '/en/cart'. */
export function localizePath(path: string, code: LocaleCode): string {
  const prefix = LOCALE_PREFIXES[code];
  if (!prefix) return path;
  if (path === '/') return prefix;
  return `${prefix}${path}`;
}

/** Maps a route's `params.locale` (from the `($locale)` optional segment —
 * 'en', 'es', or undefined for the unprefixed Italian root) to our
 * LocaleCode. Use this in `meta` functions, which run outside React and
 * so can't call useLocale(). */
export function getLocaleFromParam(
  param: string | undefined,
): LocaleCode {
  if (param === 'en') return 'EN';
  if (param === 'es') return 'ES';
  return 'IT';
}

/** Picks the string for the current locale out of a per-locale record
 * (used for brand-voice copy that lives alongside its data, e.g. an
 * anima's tagline), falling back to Italian. */
export function pickLocale(
  record: Record<LocaleCode, string>,
  code: LocaleCode,
): string {
  return record[code] ?? record.IT;
}

/** Reads the locale from the request's URL path (`/en/...`, `/es/...`, or
 * unprefixed for Italian) and returns the matching Storefront API i18n
 * context, which feeds every `@inContext` query in the app. */
export function getLocaleFromRequest(request: Request) {
  const {pathname} = new URL(request.url);
  const code = getLocaleFromPathname(pathname);
  return LOCALE_I18N[code];
}

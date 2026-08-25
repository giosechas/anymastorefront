import type {CountryCode, LanguageCode} from '@shopify/hydrogen/storefront-api-types';

export const LOCALE_COOKIE = 'anyma_locale';

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

/** Reads the `anyma_locale` cookie set by the header's language switcher. */
export function getLocaleFromRequest(request: Request) {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const match = cookieHeader.match(new RegExp(`${LOCALE_COOKIE}=([A-Z]{2})`));
  const code = (match?.[1] as LocaleCode | undefined) ?? 'IT';
  return LOCALE_I18N[code] ?? LOCALE_I18N.IT;
}

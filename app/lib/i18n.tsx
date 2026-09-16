import {createContext, useContext, useMemo, type ReactNode} from 'react';
import {localizePath, type LocaleCode} from '~/lib/locale';
import {TRANSLATIONS} from '~/lib/translations';

const LocaleContext = createContext<LocaleCode>('IT');

export function LocaleProvider({
  code,
  children,
}: {
  code: LocaleCode;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={code}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const code = useContext(LocaleContext);
  return useMemo(
    () => ({
      code,
      /** Prefixes an internal path with the current locale (no-op for IT),
       * e.g. href('/cart') -> '/en/cart' when browsing in English. */
      href: (path: string) => localizePath(path, code),
    }),
    [code],
  );
}

type Dict = typeof TRANSLATIONS.IT;

/** The full dictionary object for the current locale — useful for content
 * that isn't a single string, like the hero's rotating tagline array. */
export function useDict(): Dict {
  const {code} = useLocale();
  return TRANSLATIONS[code] as unknown as Dict;
}

/** Reads a dot-path key ("cart.empty") out of the current locale's
 * dictionary, falling back to Italian if a key is ever missing. A key may
 * resolve to a function instead of a plain string when word order needs to
 * change per language (e.g. t('search.nessunRisultato', term)) — any extra
 * args are passed straight through to it. */
export function useT() {
  const {code} = useLocale();
  return useMemo(() => {
    return function t(key: string, ...args: unknown[]): string {
      const table = TRANSLATIONS[code] as unknown as Record<string, unknown>;
      const fallback = TRANSLATIONS.IT as unknown as Record<string, unknown>;
      const value = getPath(table, key) ?? getPath(fallback, key);
      if (typeof value === 'function') {
        return (value as (...a: unknown[]) => string)(...args);
      }
      if (typeof value !== 'string') {
        console.warn(`Missing translation key: ${key}`);
        return key;
      }
      return value;
    };
  }, [code]);
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (acc, segment) =>
        acc && typeof acc === 'object'
          ? (acc as Record<string, unknown>)[segment]
          : undefined,
      obj,
    );
}

export type {Dict};

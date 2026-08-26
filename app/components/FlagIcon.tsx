import type {LocaleCode} from '~/lib/locale';

/** Flat rectangular flags — deliberately not the emoji glyphs, which
 * render with a wavy/ribbon style on some platforms. */
export function FlagIcon({code}: {code: LocaleCode}) {
  switch (code) {
    case 'IT':
      return (
        <svg viewBox="0 0 24 16" className="h-3 w-[18px]" aria-hidden="true">
          <rect width="8" height="16" fill="#009246" />
          <rect x="8" width="8" height="16" fill="#fff" />
          <rect x="16" width="8" height="16" fill="#ce2b37" />
        </svg>
      );
    case 'EN':
      return (
        <svg viewBox="0 0 24 16" className="h-3 w-[18px]" aria-hidden="true">
          <rect width="24" height="16" fill="#b22234" />
          <rect y="1.85" width="24" height="1.85" fill="#fff" />
          <rect y="5.54" width="24" height="1.85" fill="#fff" />
          <rect y="9.23" width="24" height="1.85" fill="#fff" />
          <rect y="12.92" width="24" height="1.85" fill="#fff" />
          <rect width="10" height="8.62" fill="#3c3b6e" />
        </svg>
      );
    case 'ES':
      return (
        <svg viewBox="0 0 24 16" className="h-3 w-[18px]" aria-hidden="true">
          <rect width="24" height="16" fill="#aa151b" />
          <rect y="4" width="24" height="8" fill="#f1bf00" />
        </svg>
      );
    default:
      return null;
  }
}

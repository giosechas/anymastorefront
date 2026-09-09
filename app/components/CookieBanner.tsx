import {useEffect, useState} from 'react';
import {Link} from 'react-router';

const STORAGE_KEY = 'anyma-cookie-consent';

type Consent = 'accepted' | 'rejected';

/**
 * PLACEHOLDER COPY — a qualified Italian lawyer must review this text before
 * launch (Garante Privacy cookie guidelines + GDPR art. 13). This component
 * only handles the mechanics: blocking non-essential tracking until a choice
 * is made, and remembering that choice.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
      else applyConsent(stored as Consent);
    } catch {
      setVisible(true);
    }
  }, []);

  function applyConsent(consent: Consent) {
    const granted = consent === 'accepted';
    try {
      (window as any).Shopify?.customerPrivacy?.setTrackingConsent(
        {
          analytics: granted,
          marketing: granted,
          preferences: granted,
          sale_of_data: granted,
        },
        () => {},
      );
    } catch {
      // Shopify's customerPrivacy API may not be present in dev/mock mode.
    }
  }

  function choose(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // localStorage may be unavailable (private mode); the banner will
      // simply reappear next visit, which is the safe failure mode.
    }
    applyConsent(consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferenze cookie"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-nero/10 bg-paper p-5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-xs leading-relaxed text-nero/70">
          {/* PLACEHOLDER: da rivedere con un legale prima del lancio. */}
          Utilizziamo cookie tecnici necessari al funzionamento del sito e,
          previo consenso, cookie di analisi e marketing. Consulta la{' '}
          <Link to="/legale/privacy-policy" className="underline hover:text-gold">
            Privacy Policy
          </Link>{' '}
          per maggiori informazioni.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="border border-nero/30 px-5 py-2 text-xs uppercase tracking-[0.15em] text-nero/70 transition-colors hover:border-nero hover:text-nero"
          >
            Rifiuta
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="border border-nero bg-nero px-5 py-2 text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-transparent hover:text-nero"
          >
            Accetta tutto
          </button>
        </div>
      </div>
    </div>
  );
}

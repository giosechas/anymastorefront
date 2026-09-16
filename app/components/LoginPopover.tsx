import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router';
import {useLocale, useT} from '~/lib/i18n';

const CLOSE_ANIMATION_MS = 170;
const LOGIN_URL = '/account/login';

export function LoginPopover({transparent = false}: {transparent?: boolean}) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [email, setEmail] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const {href} = useLocale();
  const t = useT();
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    clearTimeout(closeTimeoutRef.current);
    setOpen(false);
    setClosing(false);
  }, [location.pathname, location.search]);

  useEffect(() => () => clearTimeout(closeTimeoutRef.current), []);

  function requestClose() {
    if (closing) return;
    setClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, CLOSE_ANIMATION_MS);
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') requestClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, closing]);

  function goToLogin(hint?: string) {
    const url = hint
      ? `${href(LOGIN_URL)}?login_hint=${encodeURIComponent(hint)}`
      : href(LOGIN_URL);
    void navigate(url);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    goToLogin(email.trim() || undefined);
  }

  return (
    <div className="header-search">
      <button
        type="button"
        aria-label={t('login.accedi')}
        className="header-icon-btn"
        style={{color: transparent ? '#fff' : 'var(--nero)'}}
        onClick={() => (open ? requestClose() : setOpen(true))}
      >
        <AccountIcon />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label={t('login.chiudiAccesso')}
            className="search-popover-backdrop"
            data-closing={closing || undefined}
            onClick={requestClose}
          />
          <div
            className="search-popover-panel login-popover-panel"
            data-closing={closing || undefined}
            role="dialog"
            aria-modal="true"
            aria-label={t('login.accediAlTuoAccount')}
          >
            <p className="login-popover-title">{t('login.accediAlTuoAccount')}</p>
            <form className="login-popover-form" onSubmit={handleSubmit}>
              <label className="login-popover-label" htmlFor="login-popover-email">
                {t('login.email')}
              </label>
              <input
                id="login-popover-email"
                ref={inputRef}
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                autoFocus
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="login-popover-submit">
                {t('login.continua')}
              </button>
            </form>
            <div className="login-popover-links">
              <button type="button" onClick={() => goToLogin(email.trim() || undefined)}>
                {t('login.nonHaiAccount')} <span>{t('login.registrati')}</span>
              </button>
              <button type="button" onClick={() => goToLogin(email.trim() || undefined)}>
                {t('login.passwordDimenticata')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

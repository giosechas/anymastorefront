import {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from 'react-router';
import {useT} from '~/lib/i18n';

const STORAGE_KEY = 'anyma-cookie-consent';
const META_PIXEL_ID = '1678919793761528';
const GA4_ID = 'G-J46BQEYZZ0';

type Consent = 'accepted' | 'rejected';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var fbq: any;
  var _fbq: typeof fbq | undefined;
  var gtag: (...args: unknown[]) => void;
  var dataLayer: unknown[];
}

function loadMetaPixel() {
  if (typeof window === 'undefined') return;
  if (document.getElementById('fb-pixel-script')) return;

  const n = (window.fbq = function (...args: unknown[]) {
    if (n.callMethod) {
      (n.callMethod as (...a: unknown[]) => void)(...args);
    } else {
      (n.queue as unknown[]).push(args);
    }
  } as typeof fbq);
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];

  const script = document.createElement('script');
  script.id = 'fb-pixel-script';
  script.async = true;
  script.src = `https://connect.facebook.net/en_US/fbevents.js`;
  document.head.appendChild(script);

  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
}

function loadGA4() {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ga4-script')) return;

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args);
  };
  gtag('js', new Date());
  gtag('config', GA4_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

function trackMetaPageView(url: string) {
  if (typeof fbq === 'function') {
    fbq('track', 'PageView');
  }
}

function trackGA4PageView(url: string) {
  if (typeof gtag === 'function') {
    gtag('event', 'page_view', {page_location: url});
  }
}

export function useTrackingConsent() {
  try {
    return (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)) as Consent | null;
  } catch {
    return null;
  }
}

export function trackMetaViewContent(params: {
  content_name: string;
  content_ids: string[];
  content_type: string;
}) {
  if (typeof fbq === 'function') {
    fbq('track', 'ViewContent', params);
  }
}

export function trackMetaPreorder(params: {
  content_name: string;
  num_items: number;
}) {
  if (typeof fbq === 'function') {
    fbq('trackCustom', 'PreorderRequested', params);
  }
}

// TikTok Pixel — ready to activate when ID is confirmed
// const TIKTOK_PIXEL_ID = 'TBD';
// function loadTikTokPixel() {
//   if (typeof window === 'undefined') return;
//   if (document.getElementById('tt-pixel-script')) return;
//   (window as any).TiktokAnalyticsObject = 'ttq';
//   const ttq = ((window as any).ttq = (window as any).ttq || []);
//   ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
//   ttq.setAndDefer = function(t: any, e: string){ t[e] = function(){ t.push([e].concat(Array.prototype.slice.call(arguments,0))) } };
//   for (const m of ttq.methods) ttq.setAndDefer(ttq, m);
//   ttq.instance = function(t: string){ const e = ttq._i[t] || []; for (const m of ttq.methods) ttq.setAndDefer(e, m); return e; };
//   ttq.load = function(e: string, n?: unknown){ const r = 'https://analytics.tiktok.com/i18n/pixel/events.js'; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date(); ttq._o = ttq._o || {}; ttq._o[e] = n || {}; const o = document.createElement('script'); o.id = 'tt-pixel-script'; o.type = 'text/javascript'; o.async = true; o.src = r + '?sdkid=' + e + '&lib=ttq'; document.head.appendChild(o); };
//   ttq.load(TIKTOK_PIXEL_ID);
//   ttq.page();
// }

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const t = useT();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      } else {
        applyConsent(stored as Consent);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'accepted') {
        const url = window.location.href;
        trackMetaPageView(url);
        trackGA4PageView(url);
      }
    } catch {}
  }, [location.pathname]);

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
    } catch {}

    if (granted) {
      loadMetaPixel();
      loadGA4();
    }
  }

  function choose(consent: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {}
    applyConsent(consent);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={t('cookies.ariaLabel')}
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-nero/10 bg-paper p-5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:p-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-xs leading-relaxed text-nero/70">
          {t('cookies.body')}{' '}
          <Link to="/legale/privacy-policy" className="underline hover:text-gold">
            {t('cookies.privacyPolicy')}
          </Link>{' '}
          {t('cookies.bodyEnd')}
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="border border-nero/30 px-5 py-2 text-xs uppercase tracking-[0.15em] text-nero/70 transition-colors hover:border-nero hover:text-nero"
          >
            {t('cookies.reject')}
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="border border-nero bg-nero px-5 py-2 text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-transparent hover:text-nero"
          >
            {t('cookies.acceptAll')}
          </button>
        </div>
      </div>
    </div>
  );
}

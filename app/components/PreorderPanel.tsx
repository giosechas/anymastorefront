import {useCallback, useEffect, useRef, useState} from 'react';
import {useRouteLoaderData} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useLocale, useT} from '~/lib/i18n';
import {useAside} from './Aside';
import {findAnimaByTag} from '~/lib/animas';
import {emailImageUrl} from '~/lib/imageTransform';
import type {RootLoader} from '~/root';

interface GoogleGsi {
  initialize(config: {
    client_id: string;
    callback: (response: {credential: string}) => void;
  }): void;
  renderButton(
    element: HTMLElement,
    config: Record<string, unknown>,
  ): void;
}

declare global {
  var google: {accounts: {id: GoogleGsi}} | undefined;
}

type PanelState = 'form' | 'submitting' | 'confirmed';

const SITE_ORIGIN = 'https://anyma-beauty.com';

interface SerializedCartItem {
  title: string;
  variantTitle: string;
  quantity: number;
  productHandle: string;
  color?: string;
  anima?: string;
  image: string;
  url: string;
}

function serializeCart(
  cart: CartApiQueryFragment | null,
): SerializedCartItem[] {
  if (!cart?.lines?.nodes) return [];
  return cart.lines.nodes.map((line) => {
    const merch = line.merchandise;
    const colorOption = merch.selectedOptions?.find(
      (o) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colore',
    );
    const anima = findAnimaByTag(merch.product.tags);
    const rawImageUrl =
      merch.image?.url || merch.product.featuredImage?.url || '';
    return {
      title: merch.product.title,
      variantTitle: merch.title,
      quantity: line.quantity,
      productHandle: merch.product.handle,
      color: colorOption?.value,
      anima: anima?.name,
      image: emailImageUrl(rawImageUrl),
      url: `${SITE_ORIGIN}/products/${merch.product.handle}`,
    };
  });
}

export function PreorderPanel({
  cart,
}: {
  cart: CartApiQueryFragment | null;
}) {
  const t = useT();
  const {code} = useLocale();
  const {close} = useAside();
  const rootData = useRouteLoaderData<RootLoader>('root');
  const googleClientId = rootData?.googleClientId ?? null;

  const [state, setState] = useState<PanelState>('form');
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const consentRef = useRef(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLHeadingElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === 'confirmed' && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [state]);

  const submit = useCallback(
    async (payload: {
      name?: string;
      email?: string;
      marketingConsent: boolean;
      googleIdToken?: string;
    }) => {
      setState('submitting');
      setError(null);
      try {
        const res = await fetch('/api/preorder', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            ...payload,
            honeypot: '',
            cart: serializeCart(cart),
          }),
        });
        const data = (await res.json()) as {success: boolean};
        if (data.success) {
          setState('confirmed');
        } else {
          setError(t('preorder.errorRetry'));
          setState('form');
        }
      } catch {
        setError(t('preorder.errorRetry'));
        setState('form');
      }
    },
    [cart, t],
  );

  useEffect(() => {
    if (state !== 'form' || !googleClientId || !googleBtnRef.current) return;

    const container = googleBtnRef.current;
    const scriptId = 'google-gsi-script';

    function initGsi() {
      if (typeof google === 'undefined') return;
      google.accounts.id.initialize({
        client_id: googleClientId!,
        callback: (response) => {
          if (!consentRef.current) {
            setError(t('preorder.consentRequired'));
            return;
          }
          void submit({googleIdToken: response.credential, marketingConsent: true});
        },
      });
      if (container) {
        google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          locale: code.toLowerCase(),
          width: container.offsetWidth || 300,
        });
      }
    }

    if (document.getElementById(scriptId)) {
      initGsi();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = initGsi;
    document.head.appendChild(script);
  }, [state, googleClientId, code, submit, t]);

  if (state === 'confirmed') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-7 w-7 text-gold animate-[check_0.3s_ease-out]"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2
          ref={confirmRef}
          tabIndex={-1}
          className="font-display text-xl text-nero"
        >
          {t('preorder.confirmTitle')}
        </h2>
        <p className="mt-2 text-sm text-nero/60">
          {t('preorder.confirmBody')}
        </p>
        <button
          type="button"
          onClick={close}
          className="mt-8 rounded-full border border-nero/15 px-8 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-nero transition-colors hover:bg-nero hover:text-paper"
        >
          {t('cart.continueShopping')}
        </button>
      </div>
    );
  }

  if (state === 'submitting') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-nero/15 border-t-nero" />
        <p className="mt-4 text-xs text-nero/60">
          {t('preorder.submitting')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-5 py-6">
      <p id="preorder-desc" className="sr-only">
        {t('preorder.cartNote')}
      </p>

      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-xs text-red-700" role="alert">
          {error}
        </p>
      )}

      {googleClientId && (
        <>
          <div ref={googleBtnRef} className="flex justify-center" />
          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-nero/10" />
            <span className="text-xs text-nero/40">
              {t('preorder.orDivider')}
            </span>
            <span className="h-px flex-1 bg-nero/10" />
          </div>
        </>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!consent) {
            setError(t('preorder.consentRequired'));
            return;
          }
          const fd = new FormData(e.currentTarget);
          void submit({
            name: (fd.get('name') as string) || undefined,
            email: fd.get('email') as string,
            marketingConsent: true,
          });
        }}
        aria-describedby="preorder-desc"
        className="flex flex-1 flex-col"
      >
        <label className="mb-1 text-xs font-medium text-nero/70">
          {t('preorder.nameLabel')}
        </label>
        <input
          ref={nameInputRef}
          type="text"
          name="name"
          placeholder={t('preorder.namePlaceholder')}
          autoComplete="given-name"
          className="mb-4 rounded-md border border-nero/15 bg-transparent px-3 py-2.5 text-xs text-nero placeholder:text-nero/30 focus:border-gold focus:outline-none"
        />

        <label className="mb-1 text-xs font-medium text-nero/70">
          {t('preorder.emailLabel')}
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder={t('preorder.emailPlaceholder')}
          autoComplete="email"
          className="mb-4 rounded-md border border-nero/15 bg-transparent px-3 py-2.5 text-xs text-nero placeholder:text-nero/30 focus:border-gold focus:outline-none"
        />

        <label className="mb-4 flex items-start gap-2.5 text-xs text-nero/70">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              consentRef.current = e.target.checked;
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-nero/15 accent-gold"
          />
          <span className="leading-relaxed">
            {t('preorder.consentLabel')}
          </span>
        </label>

        {/* Honeypot */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 overflow-hidden opacity-0 pointer-events-none"
        />

        <button
          type="submit"
          className="mt-auto flex w-full items-center justify-center rounded-full bg-nero py-3 text-xs font-medium uppercase tracking-[0.1em] text-paper transition-colors hover:bg-nero/90"
        >
          {t('preorder.submitButton')}
        </button>

        <a
          href="/legale/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-center text-[10px] text-nero/40 underline"
        >
          {t('preorder.privacyLink')}
        </a>
      </form>
    </div>
  );
}

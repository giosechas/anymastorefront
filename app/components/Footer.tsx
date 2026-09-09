import {Suspense, useState} from 'react';
import {Await, Link, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import logoNegative from '~/assets/anyma-logo-negative.svg';
import wordmarkWhite from '~/assets/anyma-logo-wordmark-white.png';
import {LEGAL_POLICIES} from '~/lib/legalContent';
import {
  TrackOrderMenuItem,
  ReturnOrderMenuItem,
} from '~/components/FooterSupportPopovers';

const SOCIAL_LINKS = [
  {name: 'Instagram', url: 'https://www.instagram.com/anyma.beauty'},
  {name: 'TikTok', url: 'https://www.tiktok.com/@anyma.beauty'},
  {name: 'YouTube', url: 'https://www.youtube.com/@anymabeauty'},
  {name: 'Facebook', url: 'https://www.facebook.com/anymabeauty'},
];

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="footer">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-14 text-center">
              <img src={logoNegative} alt="Anyma Beauty" className="h-9 w-auto" />
              <p className="font-display text-sm uppercase tracking-[0.25em] text-paper/80">
                Rivela chi sei
              </p>
              {footer?.menu && header.shop.primaryDomain?.url && (
                <FooterMenu
                  menu={footer.menu}
                  primaryDomainUrl={header.shop.primaryDomain.url}
                  publicStoreDomain={publicStoreDomain}
                />
              )}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                <Link
                  to="/about"
                  className="text-xs uppercase tracking-[0.15em] text-paper/60 transition-colors hover:text-paper"
                >
                  La Nostra Storia
                </Link>
                <LegalMenu />
                <TrackOrderMenuItem />
                <ReturnOrderMenuItem />
                <Link
                  to="/lavora-con-noi"
                  className="text-xs uppercase tracking-[0.15em] text-paper/60 transition-colors hover:text-paper"
                >
                  Lavora con noi
                </Link>
              </div>
            </div>

            {/* Bottom bar — minimal: wordmark + year, socials, legal name. */}
            <div className="border-t border-paper/10">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
                <div className="flex items-center gap-2">
                  <img
                    src={wordmarkWhite}
                    alt="Anyma Beauty"
                    className="h-4 w-auto opacity-70"
                  />
                  <span className="text-[10px] text-paper/40">
                    {new Date().getFullYear()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="text-paper/40 transition-colors hover:text-paper"
                    >
                      <SocialIcon name={social.name} />
                    </a>
                  ))}
                </div>
                {/* PLACEHOLDER: dati societari da confermare con il
                   commercialista/legale (Codice del Consumo art. 49). */}
                <p className="text-[10px] text-paper/40">
                  MAD SOLUTION S.R.L. · Tutti i diritti riservati
                </p>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

function SocialIcon({name}: {name: string}) {
  const size = 16;
  switch (name) {
    case 'Instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'TikTok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.5 3c.4 2 1.8 3.6 4 4v3c-1.5 0-2.9-.4-4-1.2v6.4a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.1a2.6 2.6 0 1 0 1.8 2.5V3h3z" />
        </svg>
      );
    case 'YouTube':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="2.5" y="5.5" width="19" height="13" rx="3" />
          <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'Facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9.5" />
          <path d="M13.8 21.5V13h2.2l.4-2.6h-2.6V8.7c0-.8.3-1.3 1.4-1.3h1.3V5.1c-.6-.1-1.4-.2-2.2-.2-2.4 0-3.7 1.4-3.7 3.9v1.6H8.5V13h2.1v8.4" />
        </svg>
      );
    default:
      return null;
  }
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl: FooterProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}

function LegalMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mx-auto flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-paper/60 transition-colors hover:text-paper"
      >
        Area Legale
        <span
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="mx-auto mt-4 w-full max-w-3xl rounded bg-paper px-6 py-5">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {LEGAL_POLICIES.map((policy) => (
              <li key={policy.slug}>
                <Link
                  to={`/legale/${policy.slug}`}
                  className="text-xs uppercase tracking-[0.05em] text-nero/70 transition-colors hover:text-gold"
                >
                  {policy.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

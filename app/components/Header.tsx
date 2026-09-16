import {Suspense, useEffect, useRef, useState} from 'react';
import {Await, NavLink, useAsyncValue, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {SearchPopover} from '~/components/SearchPopover';
import {LoginPopover} from '~/components/LoginPopover';
import {FlagIcon} from '~/components/FlagIcon';
import {useReducedMotion} from '~/hooks/useReducedMotion';
import {ANIME, getPackPath} from '~/lib/animas';
import {useWishlist} from '~/lib/wishlist';
import {LOCALES, localizePath, stripLocalePrefix} from '~/lib/locale';
import {useLocale, useT} from '~/lib/i18n';
import logoPositive from '~/assets/anyma-logo-wordmark.png';
import logoWhite from '~/assets/anyma-logo-wordmark-white.png';

// Shopify menu titles hidden from the header nav — "Home" is redundant
// with the logo (which links home) and "Catalogo" is off for now.
const HIDDEN_MENU_TITLES = ['home', 'catalogo'];

// Mirrors the slug map in routes/prodotti.$type.tsx.
const PRODUCT_TYPE_SLUGS = [
  {slug: 'rossetti', labelKey: 'header.rossetti'},
  {slug: 'gloss', labelKey: 'header.lipGloss'},
  {slug: 'mascara', labelKey: 'header.mascaraEyeliner'},
] as const;

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

// How far from the viewport top the "is the header over a dark section?"
// sample line sits — inside the header's own band, below the marquee.
const HEADER_SAMPLE_LINE = 70;

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop} = header;
  const location = useLocation();
  const {href} = useLocale();
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll('[data-header-theme="dark"]'),
    );
    if (targets.length === 0) {
      setOnDark(false);
      return;
    }

    const active = new Set<Element>();
    let observer: IntersectionObserver;

    const create = () => {
      const bottomMargin = Math.max(
        window.innerHeight - HEADER_SAMPLE_LINE - 1,
        0,
      );
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) active.add(entry.target);
            else active.delete(entry.target);
          }
          setOnDark(active.size > 0);
        },
        {rootMargin: `-${HEADER_SAMPLE_LINE}px 0px -${bottomMargin}px 0px`},
      );
      targets.forEach((target) => observer.observe(target));
    };

    create();
    const onResize = () => {
      observer.disconnect();
      active.clear();
      create();
    };
    window.addEventListener('resize', onResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [location.pathname]);

  return (
    <header className={`header ${onDark ? 'header--on-dark' : ''}`}>
      <HeaderMenuMobileToggle />
      <NavLink
        prefetch="intent"
        to={href('/')}
        end
        aria-label={shop.name}
        className="header-logo"
      >
        <img
          src={onDark ? logoWhite : logoPositive}
          alt={shop.name}
          className="h-5 w-auto md:h-7"
        />
      </NavLink>
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} onDark={onDark} />
    </header>
  );
}

const MARQUEE_ROTATE_MS = 3500;
const MARQUEE_TRANSITION_MS = 450;

export function MarqueeBar() {
  const t = useT();
  const items = [
    {icon: '🎁', text: t('header.marqueeDiscount')},
    {icon: '🚚', text: t('header.marqueeShipping')},
  ];
  const [index, setIndex] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const rotationKey = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => {
        if (!reducedMotion) {
          rotationKey.current += 1;
          setExitingIndex(current);
        }
        return (current + 1) % items.length;
      });
    }, MARQUEE_ROTATE_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  useEffect(() => {
    if (exitingIndex === null) return;
    const timeout = setTimeout(
      () => setExitingIndex(null),
      MARQUEE_TRANSITION_MS,
    );
    return () => clearTimeout(timeout);
  }, [exitingIndex]);

  const item = items[index];

  return (
    <div className="marquee-bar" aria-hidden="true">
      {exitingIndex !== null && (
        <span
          className="marquee-bar-item"
          data-phase="exit"
          key={`exit-${rotationKey.current}`}
        >
          <span>{items[exitingIndex].icon}</span>
          <span>{items[exitingIndex].text}</span>
        </span>
      )}
      <span className="marquee-bar-item" data-phase="enter" key={index}>
        <span>{item.icon}</span>
        <span>{item.text}</span>
      </span>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();
  const {href} = useLocale();
  const t = useT();

  const visibleItems = (menu || FALLBACK_HEADER_MENU).items.filter(
    (item) => !HIDDEN_MENU_TITLES.includes(item.title.trim().toLowerCase()),
  );

  return (
    <nav className="header-menu-mobile" role="navigation">
      <div className="header-menu-item">
        <span>{t('header.leAnyme')}</span>
        <div className="header-menu-anime-mobile">
          <NavLink
            className="header-menu-anime-all"
            onClick={close}
            prefetch="intent"
            to={href('/collections/all')}
          >
            {t('header.tutteLeAnyme')}
          </NavLink>
          {ANIME.map((anima) => (
            <NavLink
              key={anima.key}
              onClick={close}
              prefetch="intent"
              to={href(`/collections/${anima.handle}`)}
            >
              {anima.name}
            </NavLink>
          ))}
          <p className="header-menu-anime-label">{t('header.packPerAnyme')}</p>
          {ANIME.map((anima) => (
            <NavLink
              key={`pack-${anima.key}`}
              onClick={close}
              prefetch="intent"
              to={href(getPackPath(anima))}
            >
              {anima.name}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="header-menu-item">
        <span>{t('header.cercaPerProdotto')}</span>
        <div className="header-menu-anime-mobile">
          {PRODUCT_TYPE_SLUGS.map(({slug, labelKey}) => (
            <NavLink
              key={slug}
              onClick={close}
              prefetch="intent"
              to={href(`/prodotti/${slug}`)}
            >
              {t(labelKey)}
            </NavLink>
          ))}
        </div>
      </div>
      <NavLink
        className="header-menu-item"
        end
        onClick={close}
        prefetch="intent"
        to={href('/about')}
      >
        {t('header.laNostraStoria')}
      </NavLink>
      {visibleItems.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            to={url.startsWith('/') ? href(url) : url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  onDark = false,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {onDark?: boolean}) {
  const {href} = useLocale();
  const t = useT();
  const iconStyle = {color: onDark ? '#fff' : 'var(--nero)'};
  return (
    <nav className="header-ctas" role="navigation">
      <Suspense fallback={<LoginPopover transparent={onDark} />}>
        <Await resolve={isLoggedIn} errorElement={<LoginPopover transparent={onDark} />}>
          {(isLoggedIn) =>
            isLoggedIn ? (
              <NavLink
                prefetch="intent"
                to={href('/account')}
                aria-label={t('header.account')}
                className="header-icon-btn"
                style={iconStyle}
              >
                <AccountIcon filled />
              </NavLink>
            ) : (
              <LoginPopover transparent={onDark} />
            )
          }
        </Await>
      </Suspense>
      <WishlistToggle onDark={onDark} />
      <LanguageSwitcher />
      <SearchPopover transparent={onDark} />
      <CartToggle cart={cart} onDark={onDark} />
    </nav>
  );
}

function AccountIcon({filled = false}: {filled?: boolean}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" fill={filled ? 'currentColor' : 'none'} />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const {code: current} = useLocale();
  const location = useLocation();
  const bare = stripLocalePrefix(location.pathname);

  return (
    <div className="header-lang">
      {LOCALES.map(({code, label}) => (
        <NavLink
          key={code}
          to={`${localizePath(bare, code)}${location.search}`}
          reloadDocument
          aria-label={label}
          aria-current={code === current}
          className="header-lang-item"
          data-active={code === current}
        >
          <FlagIcon code={code} />
        </NavLink>
      ))}
    </div>
  );
}

function WishlistToggle({onDark = false}: {onDark?: boolean}) {
  const count = useWishlist().length;
  const {href} = useLocale();
  const t = useT();
  return (
    <NavLink
      prefetch="intent"
      to={href('/wishlist')}
      aria-label={t('header.wishlist')}
      className="header-icon-btn"
      style={{color: onDark ? '#fff' : 'var(--nero)'}}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20.5c-.2 0-.4-.07-.55-.2C7.4 17 3 13.14 3 8.9 3 5.9 5.36 3.5 8.3 3.5c1.7 0 3.3.82 4.3 2.14A5.4 5.4 0 0 1 20.7 8.9c0 4.24-4.4 8.1-8.45 11.4-.15.13-.35.2-.55.2Z" />
      </svg>
      {count > 0 && <span className="header-icon-badge">{count}</span>}
    </NavLink>
  );
}

function HeaderMenuMobileToggle() {
  const {type, open, close} = useAside();
  const t = useT();
  const isOpen = type === 'mobile';
  return (
    <button
      type="button"
      className="header-menu-mobile-toggle reset"
      aria-label={isOpen ? t('header.chiudiMenu') : t('header.apriMenu')}
      aria-expanded={isOpen}
      onClick={() => (isOpen ? close() : open('mobile'))}
    >
      <span className="hamburger-icon" data-open={isOpen}>
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}

function CartBadge({
  count,
  onDark = false,
}: {
  count: number;
  onDark?: boolean;
}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  const {href} = useLocale();

  return (
    <a
      href={href('/cart')}
      aria-label={`Cart${count > 0 ? ` (${count})` : ''}`}
      className="header-icon-btn"
      style={{color: onDark ? '#fff' : 'var(--nero)'}}
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
    >
      <CartIcon />
      {count > 0 && <span className="header-icon-badge">{count}</span>}
    </a>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function CartToggle({
  cart,
  onDark = false,
}: Pick<HeaderProps, 'cart'> & {onDark?: boolean}) {
  return (
    <Suspense fallback={<CartBadge count={0} onDark={onDark} />}>
      <Await resolve={cart}>
        <CartBanner onDark={onDark} />
      </Await>
    </Suspense>
  );
}

function CartBanner({onDark = false}: {onDark?: boolean}) {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} onDark={onDark} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};


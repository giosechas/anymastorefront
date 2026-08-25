import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue, useLocation} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {SearchPopover} from '~/components/SearchPopover';
import {ANIME, getPackPath} from '~/lib/animas';
import {useWishlist} from '~/lib/wishlist';
import {LOCALES, LOCALE_COOKIE, type LocaleCode} from '~/lib/locale';
import logoPositive from '~/assets/anyma-logo-wordmark.png';
import logoWhite from '~/assets/anyma-logo-wordmark-white.png';

const MARQUEE_ITEMS = [
  {icon: '🎁', text: 'Sconto esclusivo per chi si iscrive'},
  {icon: '🚚', text: 'Spedizione in 48h'},
];

// Shopify menu titles hidden from the header nav — "Home" is redundant
// with the logo (which links home) and "Catalogo" is off for now.
const HIDDEN_MENU_TITLES = ['home', 'catalogo'];

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [transparent, setTransparent] = useState(isHome);

  useEffect(() => {
    if (!isHome) {
      setTransparent(false);
      return;
    }
    const onScroll = () => {
      setTransparent(window.scrollY < window.innerHeight * 0.75);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  return (
    <header className={`header ${transparent ? 'header--transparent' : ''}`}>
      <HeaderMenu
        menu={menu}
        viewport="desktop"
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
        transparent={transparent}
      />
      <NavLink
        prefetch="intent"
        to="/"
        end
        aria-label={shop.name}
        className="header-logo"
      >
        <img
          src={transparent ? logoWhite : logoPositive}
          alt={shop.name}
          className="h-5 w-auto md:h-7"
        />
      </NavLink>
      <HeaderCtas
        isLoggedIn={isLoggedIn}
        cart={cart}
        transparent={transparent}
      />
    </header>
  );
}

const MARQUEE_ROTATE_MS = 3500;

export function MarqueeBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MARQUEE_ITEMS.length);
    }, MARQUEE_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const item = MARQUEE_ITEMS[index];

  return (
    <div className="marquee-bar" aria-hidden="true">
      <span className="marquee-bar-item" key={index}>
        <span>{item.icon}</span>
        <span>{item.text}</span>
      </span>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
  transparent = false,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
  transparent?: boolean;
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();
  const linkStyle = makeActiveLinkStyle(transparent);

  const visibleItems = (menu || FALLBACK_HEADER_MENU).items.filter(
    (item) => !HIDDEN_MENU_TITLES.includes(item.title.trim().toLowerCase()),
  );

  return (
    <nav className={className} role="navigation">
      {viewport === 'desktop' ? (
        <div className="header-menu-item header-menu-anime">
          <span>Le Anyme</span>
          <div className="header-menu-anime-panel">
            <NavLink
              className="header-menu-anime-all"
              onClick={close}
              prefetch="intent"
              to="/collections/all"
            >
              Tutte le Anyme
            </NavLink>
            {ANIME.map((anima) => (
              <NavLink
                key={anima.key}
                onClick={close}
                prefetch="intent"
                to={`/collections/${anima.handle}`}
              >
                {anima.name}
              </NavLink>
            ))}
            <p className="header-menu-anime-label">Pack per Anyme</p>
            {ANIME.map((anima) => (
              <NavLink
                key={`pack-${anima.key}`}
                onClick={close}
                prefetch="intent"
                to={getPackPath(anima)}
              >
                {anima.name}
              </NavLink>
            ))}
          </div>
        </div>
      ) : (
        <div className="header-menu-item">
          <span>Le Anyme</span>
          <div className="header-menu-anime-mobile">
            <NavLink
              className="header-menu-anime-all"
              onClick={close}
              prefetch="intent"
              to="/collections/all"
            >
              Tutte le Anyme
            </NavLink>
            {ANIME.map((anima) => (
              <NavLink
                key={anima.key}
                onClick={close}
                prefetch="intent"
                to={`/collections/${anima.handle}`}
              >
                {anima.name}
              </NavLink>
            ))}
            <p className="header-menu-anime-label">Pack per Anyme</p>
            {ANIME.map((anima) => (
              <NavLink
                key={`pack-${anima.key}`}
                onClick={close}
                prefetch="intent"
                to={getPackPath(anima)}
              >
                {anima.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
      <NavLink
        className="header-menu-item"
        end
        onClick={close}
        prefetch="intent"
        style={linkStyle}
        to="/about"
      >
        La nostra storia
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
            style={linkStyle}
            to={url}
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
  transparent = false,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'> & {transparent?: boolean}) {
  const iconStyle = {color: transparent ? '#fff' : 'var(--nero)'};
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className="header-icon-btn"
        style={iconStyle}
      >
        <Suspense fallback={<AccountIcon />}>
          <Await resolve={isLoggedIn} errorElement={<AccountIcon />}>
            {(isLoggedIn) => (
              <span aria-label={isLoggedIn ? 'Account' : 'Sign in'}>
                <AccountIcon filled={isLoggedIn} />
              </span>
            )}
          </Await>
        </Suspense>
      </NavLink>
      <WishlistToggle transparent={transparent} />
      <LanguageSwitcher transparent={transparent} />
      <SearchPopover transparent={transparent} />
      <CartToggle cart={cart} />
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

function LanguageSwitcher({transparent = false}: {transparent?: boolean}) {
  const [current, setCurrent] = useState<LocaleCode>('IT');

  useEffect(() => {
    const match = document.cookie.match(
      new RegExp(`${LOCALE_COOKIE}=([A-Z]{2})`),
    );
    if (match?.[1]) setCurrent(match[1] as LocaleCode);
  }, []);

  return (
    <div
      className="header-lang"
      style={{color: transparent ? '#fff' : 'var(--nero)'}}
    >
      {LOCALES.map(({code, label}, i) => (
        <span key={code}>
          {i > 0 && <span className="header-lang-sep">/</span>}
          <button
            type="button"
            aria-current={code === current}
            className="header-lang-item"
            data-active={code === current}
            onClick={() => {
              document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=31536000`;
              window.location.reload();
            }}
          >
            {label}
          </button>
        </span>
      ))}
    </div>
  );
}

function WishlistToggle({transparent = false}: {transparent?: boolean}) {
  const count = useWishlist().length;
  return (
    <NavLink
      prefetch="intent"
      to="/wishlist"
      aria-label="Wishlist"
      className="header-icon-btn"
      style={{color: transparent ? '#fff' : 'var(--nero)'}}
    >
      <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 20.5c-.2 0-.4-.07-.55-.2C7.4 17 3 13.14 3 8.9 3 5.9 5.36 3.5 8.3 3.5c1.7 0 3.3.82 4.3 2.14A5.4 5.4 0 0 1 20.7 8.9c0 4.24-4.4 8.1-8.45 11.4-.15.13-.35.2-.55.2Z" />
      </svg>
      {count > 0 && <span className="header-icon-badge">{count}</span>}
    </NavLink>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
    >
      <h3>☰</h3>
    </button>
  );
}

function CartBadge({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
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
      Cart <span aria-label={`(items: ${count})`}>{count}</span>
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
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

function makeActiveLinkStyle(transparent: boolean) {
  return ({isActive, isPending}: {isActive: boolean; isPending: boolean}) => ({
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : transparent ? '#fff' : 'var(--nero)',
  });
}

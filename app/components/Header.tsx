import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {ANIME} from '~/lib/animas';
import logoPositive from '~/assets/anyma-logo-positive.svg';
import sealY from '~/assets/images/seal-y-positive.png';

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
  return (
    <div className="header-wrap">
      <header className="header">
        <NavLink prefetch="intent" to="/" end aria-label={shop.name}>
          <img
            src={logoPositive}
            alt={shop.name}
            className="h-8 w-auto md:h-10"
          />
        </NavLink>
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </header>
      <MarqueeBar />
    </div>
  );
}

function MarqueeBar() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="marquee-bar" aria-hidden="true">
      <div className="marquee-bar-track">
        {[0, 1].map((rep) => (
          <div className="marquee-bar-track-group" key={rep}>
            {items.map((item, i) => (
              <span className="marquee-bar-item" key={`${rep}-${i}`}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
                <img src={sealY} alt="" className="marquee-bar-sep" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

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
            <p className="header-menu-anime-label">Pack per Anyma</p>
            {ANIME.map((anima) => (
              <NavLink
                key={`pack-${anima.key}`}
                onClick={close}
                prefetch="intent"
                to={`/pack/${anima.handle}`}
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
            <p className="header-menu-anime-label">Pack per Anyma</p>
            {ANIME.map((anima) => (
              <NavLink
                key={`pack-${anima.key}`}
                onClick={close}
                prefetch="intent"
                to={`/pack/${anima.handle}`}
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
        style={activeLinkStyle}
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

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle />
      <CartToggle cart={cart} />
    </nav>
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

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
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

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'var(--nero)',
  };
}

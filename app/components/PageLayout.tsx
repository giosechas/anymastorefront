import {Await, Link} from 'react-router';
import {Component, Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {
  Header,
  HeaderMenu,
  LanguageSwitcher,
} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {PreorderPanel} from '~/components/PreorderPanel';
import {CookieBanner} from '~/components/CookieBanner';
import {useLocale, useT} from '~/lib/i18n';
import {usePrelaunchMode} from '~/root';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  const prelaunchMode = usePrelaunchMode();

  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      {prelaunchMode && <PreorderAside cart={cart} />}
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main className="pt-[var(--top-bars-height)]">{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
      <CookieBanner />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  const t = useT();
  return (
    <Aside type="cart" heading={t('account.cartHeading')}>
      <CartErrorBoundary>
        <Suspense fallback={<p>{t('account.loadingCart')}</p>}>
          <Await resolve={cart}>
            {(cart) => {
              return <CartMain cart={cart} layout="aside" />;
            }}
          </Await>
        </Suspense>
      </CartErrorBoundary>
    </Aside>
  );
}

class CartErrorBoundary extends Component<
  {children: React.ReactNode},
  {error: Error | null}
> {
  state: {error: Error | null} = {error: null};

  static getDerivedStateFromError(error: Error) {
    return {error};
  }

  componentDidCatch(error: Error) {
    console.warn('[CartErrorBoundary]', error.message);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="px-6 py-10 text-center">
          <p className="text-sm text-nero/70">
            Qualcosa non ha funzionato. Riprova.
          </p>
          <button
            type="button"
            onClick={() => this.setState({error: null})}
            className="mt-4 border border-nero px-5 py-2 text-xs uppercase tracking-[0.12em] text-nero transition-colors hover:bg-nero hover:text-paper"
          >
            Riprova
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function PreorderAside({cart}: {cart: PageLayoutProps['cart']}) {
  const t = useT();
  return (
    <Aside type="preorder" heading={t('preorder.panelTitle')}>
      <Suspense fallback={<p className="p-4 text-xs text-nero/40">{t('account.loadingCart')}</p>}>
        <Await resolve={cart}>
          {(cart) => <PreorderPanel cart={cart} />}
        </Await>
      </Suspense>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  const {href} = useLocale();
  const t = useT();
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading={t('account.menuHeading')}>
        <HeaderMenu
          menu={header.menu}
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <div className="header-menu-mobile-lang">
          <LanguageSwitcher />
        </div>
        <Link to={href('/account/login')} className="header-menu-register">
          {t('account.registrati')}
        </Link>
      </Aside>
    )
  );
}

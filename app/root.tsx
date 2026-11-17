import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
  useLocation,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/images/seal-y-positive.png';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import {LocaleProvider} from '~/lib/i18n';
import type {LocaleCode} from '~/lib/locale';
import {LOCALE_PREFIXES, stripLocalePrefix, getLocaleFromPathname} from '~/lib/locale';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';
import {isPrelaunchMode} from '~/lib/config';

export type RootLoader = typeof loader;

export function usePrelaunchMode(): boolean {
  const data = useRouteLoaderData<RootLoader>('root');
  return data?.prelaunchMode ?? true;
}

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/png', href: favicon},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    prelaunchMode: isPrelaunchMode(env),
    googleClientId: isPrelaunchMode(env) ? (env.GOOGLE_CLIENT_ID ?? null) : null,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

const ORIGIN = 'https://anyma-beauty.com';

function HreflangLinks() {
  const location = useLocation();
  const pathname = location.pathname;
  const bare = stripLocalePrefix(pathname);

  const itUrl = `${ORIGIN}${bare}`;
  const enUrl = `${ORIGIN}/en${bare === '/' ? '' : bare}`;
  const esUrl = `${ORIGIN}/es${bare === '/' ? '' : bare}`;

  return (
    <>
      <link rel="alternate" hrefLang="it" href={itUrl} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="es" href={esUrl} />
      <link rel="alternate" hrefLang="x-default" href={itUrl} />
    </>
  );
}

export function Layout({children}: {children?: React.ReactNode}) {
  const nonce = useNonce();
  const data = useRouteLoaderData<RootLoader>('root');
  const location = useLocation();
  const localeFromPath = getLocaleFromPathname(location.pathname);
  const htmlLang =
    localeFromPath !== 'IT'
      ? localeFromPath.toLowerCase()
      : (data?.consent.language.toLowerCase() ?? 'it');

  return (
    <html lang={htmlLang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss}></link>
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <meta property="og:site_name" content="Anyma Beauty" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="facebook-domain-verification" content="wi20oq3xxes2c0ix5ulqclt07uyejx" />
        <HreflangLinks />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <LocaleProvider code={data.consent.language as LocaleCode}>
        <PageLayout {...data}>
          <Outlet />
        </PageLayout>
      </LocaleProvider>
    </Analytics.Provider>
  );
}

const ANIME_LINKS = [
  {name: 'Leopard', path: '/collections/anima-leopard'},
  {name: 'Candy Rosa', path: '/collections/anima-candy-rosa'},
  {name: 'Street', path: '/collections/anima-street'},
];

export function ErrorBoundary() {
  const error = useRouteError();
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
  }

  if (errorStatus === 404) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
        <link rel="canonical" href="https://anyma-beauty.com/" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-nero/40">404</p>
        <h1 className="mt-2 font-display text-2xl uppercase tracking-[0.05em] text-nero">
          Pagina non trovata
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-nero/60">
          La pagina che cerchi non esiste o è stata spostata. Scopri le nostre ANYMA:
        </p>
        <nav className="mt-6 flex flex-wrap justify-center gap-3">
          {ANIME_LINKS.map((a) => (
            <a
              key={a.path}
              href={a.path}
              className="border border-nero px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-nero transition-colors hover:bg-nero hover:text-paper"
            >
              Anyma {a.name}
            </a>
          ))}
        </nav>
        <a
          href="/"
          className="mt-8 text-xs uppercase tracking-[0.1em] text-nero/50 underline underline-offset-4 hover:text-nero"
        >
          Torna alla home
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <h1 className="font-display text-2xl uppercase tracking-[0.05em] text-nero">
        Errore {errorStatus}
      </h1>
      <a
        href="/"
        className="mt-6 text-xs uppercase tracking-[0.1em] text-nero/50 underline underline-offset-4 hover:text-nero"
      >
        Torna alla home
      </a>
    </div>
  );
}

import {Suspense} from 'react';
import {Await, Link, useLoaderData} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {Route} from './+types/($locale).wishlist';
import {useWishlist, removeWishlistItem} from '~/lib/wishlist';
import {ProductItem} from '~/components/ProductItem';
import {useLocale, useT} from '~/lib/i18n';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Anyma Beauty | Wishlist'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(WISHLIST_RECOMMENDATIONS_QUERY)
    .catch(() => null);

  return {recommendedProducts};
}

export default function Wishlist() {
  const items = useWishlist();
  const {recommendedProducts} = useLoaderData<typeof loader>();
  const wishlistHandles = new Set(items.map((item) => item.handle));
  const {href} = useLocale();
  const t = useT();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
        {t('wishlistPage.laTuaWishlist')}
      </p>
      <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
        {t('wishlistPage.title')}
      </h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-sm text-nero/70">{t('wishlistPage.empty')}</p>
          <Link
            to={href('/collections/all')}
            className="mt-6 inline-block border border-nero px-6 py-3 text-xs uppercase tracking-[0.2em] text-nero transition-colors hover:bg-nero hover:text-paper"
          >
            {t('wishlistPage.scopriIProdotti')}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <Link to={href(`/products/${item.handle}`)} className="block">
                <div className="aspect-[4/5] bg-nero/5">
                  {item.image && (
                    <img
                      src={item.image.url}
                      alt={item.image.altText ?? item.title}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
                <h4 className="mt-3 text-xs uppercase tracking-[0.05em] text-nero">
                  {item.title}
                </h4>
                {item.price && (
                  <small className="text-xs text-nero/60">
                    <Money data={item.price} />
                  </small>
                )}
              </Link>
              <button
                type="button"
                aria-label={t('wishlist.remove')}
                onClick={() => removeWishlistItem(item.id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 text-gold backdrop-blur-sm transition-transform hover:scale-110"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 20.5c-.2 0-.4-.07-.55-.2C7.4 17 3 13.14 3 8.9 3 5.9 5.36 3.5 8.3 3.5c1.7 0 3.3.82 4.3 2.14A5.4 5.4 0 0 1 20.7 8.9c0 4.24-4.4 8.1-8.45 11.4-.15.13-.35.2-.55.2Z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 border-t border-nero/10 pt-8">
        <h2 className="font-display text-lg uppercase tracking-[0.1em] text-nero">
          {t('wishlistPage.potrebberoPiacertiAnche')}
        </h2>
        <Suspense fallback={null}>
          <Await resolve={recommendedProducts}>
            {(response) => {
              const products = (response?.products.nodes ?? []).filter(
                (product) => !wishlistHandles.has(product.handle),
              );
              if (products.length === 0) return null;
              return (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {products.slice(0, 8).map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </div>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

const WISHLIST_RECOMMENDATIONS_QUERY = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    productType
    tags
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
  }
  query WishlistRecommendations($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 12, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;

import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {findAnimaByCollectionHandle} from '~/lib/animas';
import {getAnimaAnimalVideo} from '~/lib/animaVideo';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const anima = findAnimaByCollectionHandle(collection.handle);
  const animalVideo = anima ? getAnimaAnimalVideo(anima.key) : undefined;

  return (
    <div className="bg-paper">
      <header className="mx-auto max-w-3xl px-6 pb-6 pt-16 text-center sm:pt-24">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">
          Anyma Beauty
        </p>
        <h1 className="font-display text-4xl uppercase tracking-[0.03em] text-nero sm:text-5xl">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-nero/70">
            {collection.description}
          </p>
        )}
      </header>

      {anima && (
        <section className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 px-6 py-10 sm:grid-cols-2 sm:gap-12 sm:py-16">
          <div className={animalVideo ? '' : 'sm:col-span-2 sm:text-center'}>
            <p
              className={`mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-gold ${animalVideo ? '' : 'sm:justify-center'}`}
            >
              L’anima {anima.name}
              {anima.comingSoon && (
                <span className="border border-fuchsia px-2 py-0.5 text-[10px] tracking-[0.15em] text-fuchsia">
                  In arrivo
                </span>
              )}
            </p>
            <h2 className="font-display text-2xl uppercase tracking-[0.02em] text-fuchsia sm:text-3xl">
              {anima.storyHeading}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-nero/80 sm:mx-0">
              {anima.story}
            </p>
          </div>
          {animalVideo && (
            <div className="aspect-[4/5] overflow-hidden rounded bg-nero/5">
              <video
                src={animalVideo.src}
                poster={animalVideo.poster}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </section>
      )}

      <div className="mx-auto max-w-6xl px-6 pb-24">
        <PaginatedResourceSection<ProductItemFragment>
          connection={collection.products}
          resourcesClassName="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {({node: product, index}) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 8 ? 'eager' : undefined}
            />
          )}
        </PaginatedResourceSection>
      </div>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
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
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

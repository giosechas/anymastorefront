import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductGallery} from '~/components/ProductGallery';
import {ProductForm} from '~/components/ProductForm';
import {YRating} from '~/components/YRating';
import {ProductVideos} from '~/components/ProductVideos';
import {WishlistHeart} from '~/components/WishlistHeart';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {
  ANIME,
  findAnimaByCollectionHandle,
  getAnimaGalleryImages,
  getPackPath,
  type AnimaDefinition,
} from '~/lib/animas';
import {
  COLOR_SWATCH_HEX,
  getColorTag,
  getShortDescription,
} from '~/lib/productCopy';
import {getProductVideo} from '~/lib/productVideo';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Anyma Beauty | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  const anima = findAnimaByCollectionHandle(
    product.collections.nodes.find((c) => c.handle.startsWith('anima-'))
      ?.handle,
  );

  let siblings: {title: string; handle: string; tags: string[]}[] = [];
  if (anima) {
    const {products} = await storefront.query(ANIMA_SIBLINGS_QUERY, {
      variables: {
        searchQuery: `tag:"${anima.tag}" AND product_type:"${product.productType}"`,
      },
    });
    siblings = products.nodes;
  }

  // Same product (category + color), across every anima — lets the
  // customer switch soul without losing the color they picked.
  const colorTag = getColorTag(product.tags);
  let animaVariants: {anima: AnimaDefinition; handle: string}[] = [];
  if (colorTag) {
    const {products} = await storefront.query(ANIMA_VARIANTS_QUERY, {
      variables: {
        searchQuery: `tag:"${colorTag}" AND product_type:"${product.productType}"`,
      },
    });
    animaVariants = products.nodes
      .map((node: {handle: string; collections: {nodes: {handle: string}[]}}) => {
        const collectionHandle = node.collections.nodes.find(
          (c: {handle: string}) => c.handle.startsWith('anima-'),
        )?.handle;
        const nodeAnima = findAnimaByCollectionHandle(collectionHandle);
        return nodeAnima ? {anima: nodeAnima, handle: node.handle} : null;
      })
      .filter(
        (
          entry: {anima: AnimaDefinition; handle: string} | null,
        ): entry is {anima: AnimaDefinition; handle: string} => Boolean(entry),
      );
  }

  return {
    product,
    anima,
    siblings,
    animaVariants,
  };
}

function loadDeferredData({context, params}: Route.LoaderArgs) {
  return {};
}

export default function Product() {
  const {product, anima, siblings, animaVariants} = useLoaderData<typeof loader>();

  const orderedAnimaVariants = ANIME.map((a) =>
    animaVariants.find((v) => v.anima.key === a.key),
  ).filter((v): v is {anima: AnimaDefinition; handle: string} => Boolean(v));

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const colorTag = getColorTag(product.tags);
  const shortDescription = getShortDescription(product.productType, colorTag);
  const displayTitle = product.title.split('·').pop()?.trim() ?? product.title;
  const video = getProductVideo(product.productType, anima?.handle);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <div className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 sm:gap-16">
        <div>
          <ProductGallery images={product.images.nodes} video={video} />

          {anima && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-fuchsia">
                {anima.storyHeading}
              </p>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-nero/80">
                {anima.story}
              </p>
            </div>
          )}

          {anima && (
            <Link
              to={getPackPath(anima)}
              className="group relative mt-6 block aspect-[16/9] overflow-hidden rounded bg-nero/5"
            >
              <img
                src={getAnimaGalleryImages(anima)[0]}
                alt={`Trittico Anyma ${anima.name}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-nero/30 transition-colors group-hover:bg-nero/40" />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-white/80">
                  Trittico Anyma {anima.name}
                </p>
                <p className="mt-1 font-display text-lg uppercase tracking-[0.03em] text-white">
                  Componi il tuo Pack →
                </p>
              </div>
            </Link>
          )}
        </div>

        <div>
          {anima && (
            <Link
              to={`/collections/${anima.handle}`}
              className="mb-2 inline-block border border-gold px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-nero"
            >
              Anyma {anima.name}
            </Link>
          )}

          {orderedAnimaVariants.length > 1 && (
            <div className="mb-4">
              <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-nero/50">
                Cambia Anyma, stesso colore
              </p>
              <div className="flex flex-wrap gap-2">
                {orderedAnimaVariants.map(({anima: variantAnima, handle}) => {
                  const isCurrent = variantAnima.key === anima?.key;
                  return isCurrent ? (
                    <span
                      key={variantAnima.key}
                      aria-current="true"
                      className="border border-nero px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-nero"
                    >
                      {variantAnima.name}
                    </span>
                  ) : (
                    <Link
                      key={variantAnima.key}
                      to={`/products/${handle}`}
                      className="border border-nero/20 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-nero/60 transition-colors hover:border-nero hover:text-nero"
                    >
                      {variantAnima.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
              {displayTitle}
            </h1>
            <WishlistHeart
              className="static shrink-0 bg-transparent"
              item={{
                id: product.id,
                handle: product.handle,
                title: product.title,
                image: product.images.nodes[0]
                  ? {
                      url: product.images.nodes[0].url,
                      altText: product.images.nodes[0].altText,
                    }
                  : undefined,
                price: selectedVariant?.price,
              }}
            />
          </div>

          <div className="mt-3">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-nero/80">
            {shortDescription ?? product.description}
          </p>

          {siblings.length > 1 && (
            <div className="mt-8">
              <p className="mb-2 text-xs uppercase tracking-[0.15em] text-nero/60">
                Altri colori · Anyma {anima?.name}
              </p>
              <div className="flex flex-wrap gap-3">
                {siblings.map((sibling) => {
                  const siblingColor = getColorTag(sibling.tags);
                  const isCurrent = sibling.handle === product.handle;
                  return (
                    <Link
                      key={sibling.handle}
                      to={`/products/${sibling.handle}`}
                      aria-label={sibling.title}
                      aria-current={isCurrent}
                      className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        isCurrent
                          ? 'border-nero'
                          : 'border-transparent hover:border-nero/30'
                      }`}
                      style={{
                        backgroundColor: siblingColor
                          ? COLOR_SWATCH_HEX[siblingColor]
                          : '#ccc',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8">
            <YRating />
          </div>

          <div className="mt-4">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              buttonClassName="w-full border border-nero bg-nero px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-nero disabled:cursor-not-allowed disabled:opacity-40"
            />
          </div>

          <div className="mt-12">
            <ProductVideos />
          </div>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    tags
    productType
    encodedVariantExistence
    encodedVariantAvailability
    collections(first: 5) {
      nodes {
        handle
        title
      }
    }
    images(first: 6) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

const ANIMA_SIBLINGS_QUERY = `#graphql
  query AnimaSiblings($searchQuery: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, query: $searchQuery) {
      nodes {
        title
        handle
        tags
      }
    }
  }
` as const;

const ANIMA_VARIANTS_QUERY = `#graphql
  query AnimaVariants($searchQuery: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 10, query: $searchQuery) {
      nodes {
        handle
        collections(first: 5) {
          nodes {
            handle
          }
        }
      }
    }
  }
` as const;

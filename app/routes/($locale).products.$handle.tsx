import {Suspense, useState} from 'react';
import {Link, useLoaderData, Await} from 'react-router';
import type {Route} from './+types/($locale).products.$handle';
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
import {ScrollReveal} from '~/components/ScrollReveal';
import {ProductVideos} from '~/components/ProductVideos';
import {WishlistHeart} from '~/components/WishlistHeart';
import {ProductCarousel} from '~/components/ProductCarousel';
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
  getColorLabel,
  getComposedTitle,
  getCommunityTagline,
} from '~/lib/productCopy';
import {
  getSkuStory,
  getSkuFinishAroma,
  getComingSoonColors,
} from '~/lib/skuData';
import {
  getPdpDescrizione,
  getPdpApplicazione,
  getPdpFormula,
  getPdpAnatomia,
} from '~/lib/pdpContent';
import {pickLocale, getLocaleFromParam} from '~/lib/locale';
import {useLocale, useT} from '~/lib/i18n';
import {getProductVideo} from '~/lib/productVideo';
import {
  getLipstickModelPhotos,
  getLipstickModelVideos,
} from '~/lib/lipstickModelPhoto';
import {getGlossModelPhotos, getGlossModelVideos} from '~/lib/glossModelPhoto';
import {getMascaraModelPhoto} from '~/lib/mascaraModelPhoto';
import {getMascaraModelVideos} from '~/lib/mascaraModelVideo';
import {getLipstickHeroVideo} from '~/lib/lipstickHeroVideo';

export const meta: Route.MetaFunction = ({data, params}) => {
  const code = getLocaleFromParam(params.locale);
  const colorTag = data ? getColorTag(data.product.tags) : undefined;
  const title = data
    ? getComposedTitle(data.product.productType, colorTag, code)
    : '';
  const story = data
    ? getSkuStory(data.product.productType, colorTag, data.anima?.tag, code)
    : undefined;
  return [
    {title: `Anyma Beauty | ${title}`},
    {
      name: 'description',
      content: (story ?? data?.product.description ?? '').slice(0, 160),
    },
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  const deferredData = loadDeferredData(
    args,
    criticalData.product.id,
    criticalData.product.handle,
  );

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

function loadDeferredData(
  {context}: Route.LoaderArgs,
  productId: string,
  currentHandle: string,
) {
  const recommendedProducts = Promise.all([
    context.storefront
      .query(PRODUCT_RECOMMENDATIONS_QUERY, {variables: {productId}})
      .catch(() => null),
    context.storefront
      .query(FALLBACK_RECOMMENDATIONS_QUERY)
      .catch(() => null),
  ]).then(([primary, fallback]) => {
    const primaryItems = primary?.productRecommendations ?? [];
    if (primaryItems.length > 0) return primaryItems;
    return (fallback?.products.nodes ?? []).filter(
      (item) => item.handle !== currentHandle,
    );
  });

  return {recommendedProducts};
}

export default function Product() {
  const {product, anima, siblings, animaVariants, recommendedProducts} =
    useLoaderData<typeof loader>();
  const {code, href} = useLocale();
  const t = useT();

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
  const story = getSkuStory(product.productType, colorTag, anima?.tag, code);
  // A shorter, distinct caption for "Guardalo addosso" — just the story's
  // first sentence, so it doesn't repeat the full poetic text verbatim.
  const shortStory = story?.split(/(?<=[.!?])\s+/)[0] ?? product.description;
  const finishAroma = getSkuFinishAroma(
    product.productType,
    colorTag,
    anima?.tag,
  );
  const descrizione = getPdpDescrizione(product.productType, colorTag, code);
  const applicazione = getPdpApplicazione(product.productType, code);
  const formula = getPdpFormula(product.productType, code);
  const anatomia = getPdpAnatomia(product.productType, code);
  const rawPdpTabs: (PdpTab | null)[] = [
    descrizione
      ? {key: 'descrizione', label: t('pdp.descrizione'), content: descrizione}
      : null,
    applicazione
      ? {key: 'applicazione', label: t('pdp.applicazione'), content: applicazione}
      : null,
    formula ? {key: 'formula', label: t('pdp.formula'), content: formula} : null,
    anatomia
      ? {key: 'anatomia', label: t('pdp.anatomia'), content: anatomia}
      : null,
    {
      key: 'ingredienti',
      label: t('pdp.ingredienti'),
      content: t('pdp.ingredientiInArrivo'),
    },
  ];
  const pdpTabs = rawPdpTabs.filter((tab): tab is PdpTab => tab !== null);
  const comingSoonColors = getComingSoonColors(product.productType).filter(
    (c) => c.tag !== colorTag,
  );
  const displayTitle = getComposedTitle(product.productType, colorTag, code);
  const video = getProductVideo(product.productType, anima?.handle);
  const mascaraModelPhoto = getMascaraModelPhoto(
    product.productType,
    anima?.handle,
  );
  const lipstickModelPhotos = getLipstickModelPhotos(
    product.productType,
    colorTag,
  );
  const glossModelPhotos = getGlossModelPhotos(product.productType, colorTag);
  const colorModelPhotos = lipstickModelPhotos.length
    ? lipstickModelPhotos
    : glossModelPhotos;
  const modelPhotos = mascaraModelPhoto ? [mascaraModelPhoto] : colorModelPhotos;
  const lipstickModelVideos = getLipstickModelVideos(
    product.productType,
    colorTag,
  );
  const glossModelVideos = getGlossModelVideos(product.productType, colorTag);
  const mascaraModelVideos = getMascaraModelVideos(
    product.productType,
    anima?.handle,
  );
  const colorModelVideos = lipstickModelVideos.length
    ? lipstickModelVideos
    : glossModelVideos.length
      ? glossModelVideos
      : mascaraModelVideos;
  const [colorVideoIndex, setColorVideoIndex] = useState(() =>
    Math.floor(Math.random() * colorModelVideos.length),
  );
  const colorVideo = colorModelVideos[colorVideoIndex];
  const guardaloAddossoPhoto = !colorVideo ? mascaraModelPhoto : undefined;
  const heroVideo = getLipstickHeroVideo(
    product.productType,
    anima?.key,
    colorTag,
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:py-16">
      <div className="grid grid-cols-1 items-stretch gap-10 sm:grid-cols-2 sm:gap-16">
        <ProductGallery
          images={product.images.nodes}
          modelPhotos={modelPhotos}
          video={video}
        />

        <div className="flex flex-col sm:justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-2xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
                  {displayTitle}
                </h1>
                {finishAroma?.finish && (
                  <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-nero/50">
                    {finishAroma.finish}
                  </p>
                )}
              </div>
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

            <div className="mt-2 flex items-center gap-3">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
              {anima && (
                <Link
                  to={href(`/collections/${anima.handle}`)}
                  className="inline-block border border-gold px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-nero"
                >
                  {t('collection.anymaLabel', anima.name)}
                </Link>
              )}
            </div>

            {orderedAnimaVariants.length > 1 && (
              <div className="mt-4">
                <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-nero/50">
                  {t('pdp.cambiaAnymaStessoColore')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {orderedAnimaVariants.map(({anima: variantAnima, handle}) => {
                    const isCurrent = variantAnima.key === anima?.key;
                    return isCurrent ? (
                      <span
                        key={variantAnima.key}
                        aria-current="true"
                        className="rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] text-paper"
                        style={{backgroundColor: variantAnima.color}}
                      >
                        {variantAnima.name}
                      </span>
                    ) : (
                      <Link
                        key={variantAnima.key}
                        to={href(`/products/${handle}`)}
                        className="rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] opacity-70 transition-opacity hover:opacity-100"
                        style={{
                          borderColor: variantAnima.color,
                          color: variantAnima.color,
                        }}
                      >
                        {variantAnima.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <PdpDetailTabs tabs={pdpTabs} />

            {siblings.length > 1 && (
              <div className="mt-8">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-nero/60">
                  {t('pdp.altriColori', anima?.name ?? '')}
                </p>
                <div className="flex flex-wrap gap-3">
                  {siblings.map((sibling) => {
                    const siblingColor = getColorTag(sibling.tags);
                    const isCurrent = sibling.handle === product.handle;
                    return (
                      <Link
                        key={sibling.handle}
                        to={href(`/products/${sibling.handle}`)}
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
                  {comingSoonColors.map(({tag: comingSoonTag}) => (
                    <span
                      key={comingSoonTag}
                      title={`${getColorLabel(comingSoonTag, code)} · ${t('pdp.inArrivo')}`}
                      aria-label={`${getColorLabel(comingSoonTag, code)} · ${t('pdp.inArrivo')}`}
                      className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-nero/25"
                      style={{
                        backgroundColor: `${COLOR_SWATCH_HEX[comingSoonTag] ?? '#ccc'}55`,
                      }}
                    >
                      <span className="absolute inset-0 rounded-full backdrop-blur-[1px]" />
                    </span>
                  ))}
                </div>
                {comingSoonColors.length > 0 && (
                  <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-nero/40">
                    {comingSoonColors
                      .map((c) => getColorLabel(c.tag, code))
                      .join(', ')}{' '}
                    · {t('pdp.inArrivo')}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 space-y-6 sm:mt-4">
            <ProductForm
              productOptions={productOptions}
              selectedVariant={selectedVariant}
              buttonClassName="w-full border border-nero bg-nero px-8 py-4 text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-nero disabled:cursor-not-allowed disabled:opacity-40"
            />
            <YRating />
          </div>
        </div>
      </div>

      {(colorVideo || guardaloAddossoPhoto) && (
        <div className="mt-12 grid grid-cols-1 items-center gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-10">
          <div className="aspect-[9/16] max-h-[600px] w-full overflow-hidden rounded bg-nero/5">
            {colorVideo ? (
              <video
                key={colorVideo.src}
                src={colorVideo.src}
                poster={colorVideo.poster}
                autoPlay
                muted
                playsInline
                onEnded={() =>
                  setColorVideoIndex((i) => (i + 1) % colorModelVideos.length)
                }
                className="h-full w-full object-cover"
              />
            ) : (
              guardaloAddossoPhoto && (
                <img
                  src={guardaloAddossoPhoto.url}
                  alt={guardaloAddossoPhoto.altText}
                  className="h-full w-full object-cover"
                />
              )
            )}
          </div>
          <div>
            <p className="font-display text-lg uppercase tracking-[0.25em] text-fuchsia sm:text-xl">
              {t('pdp.guardaloAddosso')}
            </p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-nero/80 sm:text-base">
              {shortStory}
            </p>
          </div>
        </div>
      )}

      {anima && (
        <div className="mt-12 grid grid-cols-1 items-center gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-10">
          <div>
            <p className="font-display text-lg uppercase tracking-[0.25em] text-fuchsia sm:text-xl">
              {t('pdp.unRitualeCompleto')}
            </p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-nero/80 sm:text-base">
              {t('pdp.ritualeBody', anima.name)}
            </p>
          </div>
          <Link
            to={href(getPackPath(anima))}
            className="group relative block aspect-[16/9] overflow-hidden rounded bg-nero/5"
          >
            <img
              src={getAnimaGalleryImages(anima)[0]}
              alt={t('pdp.trittico', anima.name)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-nero/30 transition-colors group-hover:bg-nero/40" />
            <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-white/80">
                {t('pdp.trittico', anima.name)}
              </p>
              <p className="mt-1 font-display text-lg uppercase tracking-[0.03em] text-white">
                {t('pdp.componiIlTuoPack')}
              </p>
            </div>
          </Link>
        </div>
      )}

      {anima && (
        <div className="relative mt-12 aspect-[2/1] w-full overflow-hidden rounded bg-nero sm:mt-16">
          {heroVideo ? (
            <video
              key={heroVideo.src}
              src={heroVideo.src}
              poster={heroVideo.poster}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            product.productType === 'Rossetto' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs uppercase tracking-[0.3em] text-paper/40">
                  {t('pdp.videoInArrivo')}
                </p>
              </div>
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-nero/80 via-nero/10 to-transparent" />
          <ScrollReveal className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <p className="font-display text-lg uppercase tracking-[0.25em] text-fuchsia sm:text-xl">
              {pickLocale(anima.storyHeading, code)}
            </p>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-paper sm:text-base">
              {pickLocale(anima.story, code)}
            </p>
          </ScrollReveal>
        </div>
      )}

      <div className="mt-12">
        <ProductVideos
          videos={lipstickModelVideos.length ? lipstickModelVideos : undefined}
          tagline={getCommunityTagline(product.productType, colorTag, code)}
        />
      </div>

      <div className="mt-12 border-t border-nero/10 pt-8">
        <h2 className="font-display text-lg uppercase tracking-[0.1em] text-nero">
          {t('pdp.tiPotrebberoAncePiacere')}
        </h2>
        <Suspense fallback={null}>
          <Await resolve={recommendedProducts}>
            {(items) => {
              if (!items || items.length === 0) return null;
              return (
                <div className="mt-4">
                  <ProductCarousel products={items.slice(0, 8)} />
                </div>
              );
            }}
          </Await>
        </Suspense>
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

type PdpTab = {key: string; label: string; content: React.ReactNode};

/** Descrizione/Applicazione/Formula/Anatomia/Ingredienti below the poetic
 * story: small labels laid out side by side, each opening the same
 * accordion panel underneath when picked. */
function PdpDetailTabs({tabs}: {tabs: PdpTab[]}) {
  const [openKey, setOpenKey] = useState<string | null>(tabs[0]?.key ?? null);
  const openTab = tabs.find((tab) => tab.key === openKey);

  return (
    <div className="mt-6 max-w-md border-y border-nero/10 py-3">
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() =>
              setOpenKey((current) => (current === tab.key ? null : tab.key))
            }
            className={`border-b pb-0.5 text-[9px] uppercase tracking-[0.12em] transition-colors ${
              openKey === tab.key
                ? 'border-nero text-nero'
                : 'border-transparent text-nero/55 hover:text-nero'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {openTab && (
        <div className="mt-3 text-xs leading-relaxed text-nero/70">
          {openTab.content}
        </div>
      )}
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

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
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
  query ProductRecommendations(
    $productId: ID!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productRecommendations(productId: $productId) {
      ...ProductItem
    }
  }
` as const;

// Shopify's productRecommendations has no purchase history to draw on for
// this store and returns []; this covers that case with a general product
// list so the section never renders empty.
const FALLBACK_RECOMMENDATIONS_QUERY = `#graphql
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
  query FallbackRecommendations($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 9, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;

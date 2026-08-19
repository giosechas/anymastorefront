import {useMemo, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/pack.$handle';
import {Image, Money} from '@shopify/hydrogen';
import {findAnimaByCollectionHandle} from '~/lib/animas';
import {COLOR_SWATCH_HEX, getColorTag} from '~/lib/productCopy';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {
      title: `Anyma Beauty | Componi il tuo Pack ${data?.anima?.name ?? ''}`,
    },
  ];
};

const PACK_CATEGORIES = ['Rossetto', 'Lip Gloss', 'Mascara/Eyeliner'] as const;
const CATEGORY_TITLE: Record<(typeof PACK_CATEGORIES)[number], string> = {
  Rossetto: 'Rossetto',
  'Lip Gloss': 'Lip Gloss',
  'Mascara/Eyeliner': 'Mascara',
};

export async function loader({context, params}: Route.LoaderArgs) {
  const {handle} = params;
  const animaHandle = `anima-${handle}`;
  const anima = findAnimaByCollectionHandle(animaHandle);

  if (!anima) {
    throw new Response('Anima non trovata', {status: 404});
  }

  const {storefront} = context;
  const {products} = await storefront.query(PACK_PRODUCTS_QUERY, {
    variables: {searchQuery: `tag:"${anima.tag}"`},
  });

  const byCategory = Object.fromEntries(
    PACK_CATEGORIES.map((category) => [
      category,
      products.nodes.filter((p) => p.productType === category),
    ]),
  ) as Record<(typeof PACK_CATEGORIES)[number], typeof products.nodes>;

  return {anima, byCategory};
}

export default function Pack() {
  const {anima, byCategory} = useLoaderData<typeof loader>();

  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const category of PACK_CATEGORIES) {
      const first = byCategory[category]?.[0];
      if (first) initial[category] = first.handle;
    }
    return initial;
  });

  const selectedProducts = PACK_CATEGORIES.map((category) =>
    byCategory[category]?.find((p) => p.handle === selection[category]),
  );

  const allSelected = selectedProducts.every(Boolean);
  const total = selectedProducts.reduce(
    (sum, p) => sum + Number(p?.priceRange.minVariantPrice.amount ?? 0),
    0,
  );
  const currency =
    selectedProducts[0]?.priceRange.minVariantPrice.currencyCode ?? 'EUR';
  const allAvailable = selectedProducts.every(
    (p) => p?.variants.nodes[0]?.availableForSale,
  );

  const checkoutHref = useMemo(() => {
    if (!allSelected) return undefined;
    const lines = selectedProducts
      .map((p) => p?.variants.nodes[0]?.id)
      .filter(Boolean)
      .map((gid) => `${gid!.split('/').pop()}:1`)
      .join(',');
    return `/cart/${lines}`;
  }, [selectedProducts, allSelected]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-16">
      <Link
        to={`/collections/${anima.handle}`}
        className="text-xs uppercase tracking-[0.15em] text-nero/50 hover:text-nero"
      >
        ← Anima {anima.name}
      </Link>

      <h1 className="font-display mt-4 text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
        Componi il tuo Pack
      </h1>
      <p className="mt-2 text-sm text-nero/70">
        Un rossetto, un gloss, un mascara — la tua Anima {anima.name} in una
        sola scatola.
      </p>

      <div className="mt-10 space-y-10">
        {PACK_CATEGORIES.map((category) => (
          <div key={category}>
            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-nero/60">
              {CATEGORY_TITLE[category]}
            </p>
            <div className="flex flex-wrap gap-4">
              {byCategory[category]?.map((product) => {
                const colorTag = getColorTag(product.tags);
                const isSelected = selection[category] === product.handle;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() =>
                      setSelection((s) => ({...s, [category]: product.handle}))
                    }
                    className={`flex flex-col items-center gap-2 border p-3 transition-colors ${
                      isSelected
                        ? 'border-nero'
                        : 'border-transparent hover:border-nero/20'
                    }`}
                  >
                    {product.featuredImage && (
                      <div className="h-20 w-20 bg-nero/5">
                        <Image
                          data={product.featuredImage}
                          sizes="80px"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <span
                      className="h-4 w-4 rounded-full border border-nero/20"
                      style={{
                        backgroundColor: colorTag
                          ? COLOR_SWATCH_HEX[colorTag]
                          : '#ccc',
                      }}
                    />
                    <span className="text-[10px] uppercase tracking-wide text-nero/70">
                      {colorTag ?? ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-nero/10 pt-6">
        <div className="flex items-center justify-between text-sm text-nero">
          <span className="uppercase tracking-[0.1em]">Totale Pack</span>
          <Money data={{amount: String(total), currencyCode: currency}} />
        </div>

        {checkoutHref && allAvailable ? (
          <a
            href={checkoutHref}
            className="mt-6 block w-full border border-nero bg-nero px-8 py-4 text-center text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-transparent hover:text-nero"
          >
            Vai al pagamento
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-6 block w-full cursor-not-allowed border border-nero/30 bg-nero/10 px-8 py-4 text-center text-xs uppercase tracking-[0.2em] text-nero/40"
          >
            Esaurito
          </button>
        )}
      </div>
    </div>
  );
}

const PACK_PRODUCTS_QUERY = `#graphql
  query PackProducts($searchQuery: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 20, query: $searchQuery) {
      nodes {
        id
        handle
        title
        tags
        productType
        featuredImage {
          id
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          nodes {
            id
            availableForSale
          }
        }
      }
    }
  }
` as const;

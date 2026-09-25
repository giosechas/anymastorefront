import {useLoaderData} from 'react-router';
import {useMemo, useState} from 'react';
import type {Route} from './+types/($locale).prodotti.$type';
import {ProductItem} from '~/components/ProductItem';
import {getColorTag, getColorLabel, COLOR_SWATCH_HEX} from '~/lib/productCopy';
import {getComingSoonColors} from '~/lib/skuData';
import {getLocaleFromParam} from '~/lib/locale';
import {useLocale, useT} from '~/lib/i18n';
import {TRANSLATIONS} from '~/lib/translations';
import type {ProductItemFragment} from 'storefrontapi.generated';

type ViewMode = 'anima' | 'color';

/** "ANYMA LEOPARD · LIPSTICK ROSSO" -> "LEOPARD" */
function getAnimaName(title: string): string {
  return title.split('·')[0]?.replace(/^ANYMA\s+/i, '').trim() ?? '';
}

const TYPE_MAP: Record<
  string,
  {labelKey: 'rossetti' | 'lipGloss' | 'mascaraEyeliner'; productType: string}
> = {
  rossetti: {labelKey: 'rossetti', productType: 'Rossetto'},
  gloss: {labelKey: 'lipGloss', productType: 'Lip Gloss'},
  mascara: {labelKey: 'mascaraEyeliner', productType: 'Mascara/Eyeliner'},
};

export const meta: Route.MetaFunction = ({params}) => {
  const code = getLocaleFromParam(params.locale);
  const info = params.type ? TYPE_MAP[params.type] : undefined;
  const label = info ? TRANSLATIONS[code].header[info.labelKey] : undefined;
  return [{title: `Anyma Beauty | ${label ?? 'Prodotti'}`}];
};

export async function loader({context, params}: Route.LoaderArgs) {
  const info = params.type ? TYPE_MAP[params.type] : undefined;
  if (!info) {
    throw new Response('Tipo di prodotto non trovato', {status: 404});
  }

  const {storefront} = context;
  const {products} = await storefront.query(PRODUCTS_BY_TYPE_QUERY, {
    variables: {searchQuery: `product_type:"${info.productType}"`},
  });

  return {info, products: products.nodes};
}

export default function ProductsByType() {
  const {info, products} = useLoaderData<typeof loader>();
  const [viewMode, setViewMode] = useState<ViewMode>('anima');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const {code} = useLocale();
  const t = useT();
  const typeLabel = t(`header.${info.labelKey}`);

  const groups = useMemo(() => {
    const byGroup = new Map<string, typeof products>();
    for (const product of products) {
      const key =
        viewMode === 'anima'
          ? getAnimaName(product.title)
          : getColorTag(product.tags) ?? '';
      if (!byGroup.has(key)) byGroup.set(key, []);
      byGroup.get(key)!.push(product);
    }
    return Array.from(byGroup.entries())
      .filter(([key]) => key)
      .sort(([a], [b]) => a.localeCompare(b));
  }, [products, viewMode]);

  const visibleGroups = activeFilter
    ? groups.filter(([key]) => key === activeFilter)
    : groups;

  const comingSoonColors = getComingSoonColors(info.productType);

  return (
    <div className="bg-paper">
      <header className="mx-auto max-w-3xl px-6 pb-6 pt-16 text-center sm:pt-24">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">
          {t('productsByType.cercaPerProdotto')}
        </p>
        <h1 className="font-display text-4xl uppercase tracking-[0.03em] text-nero sm:text-5xl">
          {typeLabel}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-nero/70">
          {t('productsByType.subtitle')}
        </p>
      </header>

      {products.length > 0 && (
        <div className="mx-auto flex max-w-6xl justify-center gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={() => {
              setViewMode('anima');
              setActiveFilter(null);
            }}
            className={`border px-5 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
              viewMode === 'anima'
                ? 'border-nero bg-nero text-paper'
                : 'border-nero/30 text-nero/70 hover:border-nero'
            }`}
          >
            {t('productsByType.vediPerAnyma')}
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('color');
              setActiveFilter(null);
            }}
            className={`border px-5 py-2 text-xs uppercase tracking-[0.15em] transition-colors ${
              viewMode === 'color'
                ? 'border-nero bg-nero text-paper'
                : 'border-nero/30 text-nero/70 hover:border-nero'
            }`}
          >
            {t('productsByType.vediPerColore')}
          </button>
        </div>
      )}

      {groups.length > 1 && (
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2.5 px-6 pb-3">
          {groups.map(([key]) =>
            viewMode === 'color' ? (
              <button
                key={key}
                type="button"
                aria-label={getColorLabel(key, code)}
                title={getColorLabel(key, code)}
                onClick={() =>
                  setActiveFilter((current) => (current === key ? null : key))
                }
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  activeFilter === key
                    ? 'border-nero'
                    : 'border-transparent hover:border-nero/30'
                }`}
                style={{
                  backgroundColor: COLOR_SWATCH_HEX[key] ?? '#ccc',
                }}
              />
            ) : (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setActiveFilter((current) => (current === key ? null : key))
                }
                className={`rounded-full border px-3.5 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  activeFilter === key
                    ? 'border-gold bg-gold text-nero'
                    : 'border-nero/20 text-nero/60 hover:border-nero/50'
                }`}
              >
                {getColorLabel(key, code)}
              </button>
            ),
          )}
          {viewMode === 'color' &&
            comingSoonColors.map(({tag}) => (
              <span
                key={tag}
                title={`${getColorLabel(tag, code)} · ${t('pdp.inArrivo')}`}
                className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-nero/25"
                style={{backgroundColor: `${COLOR_SWATCH_HEX[tag] ?? '#ccc'}55`}}
              >
                <span className="absolute inset-0 rounded-full backdrop-blur-[1px]" />
              </span>
            ))}
        </div>
      )}

      {viewMode === 'color' && comingSoonColors.length > 0 && (
        <p className="mx-auto mb-8 max-w-6xl px-6 text-center text-[10px] uppercase tracking-[0.15em] text-nero/40">
          {comingSoonColors.map((c) => getColorLabel(c.tag, code)).join(', ')}{' '}
          · {t('pdp.inArrivo')}
        </p>
      )}

      <div className="mx-auto max-w-6xl px-6 pb-24">
        {products.length === 0 ? (
          <p className="text-center text-sm text-nero/60">
            {t('productsByType.nessunProdotto')}
          </p>
        ) : (
          visibleGroups.map(([groupKey, groupProducts]) => (
            <div key={groupKey} className="mb-12">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-nero/50">
                {viewMode === 'color' ? getColorLabel(groupKey, code) : groupKey}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {groupProducts.map((product, index) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    loading={index < 8 ? 'eager' : undefined}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const PRODUCTS_BY_TYPE_QUERY = `#graphql
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
  query ProductsByType(
    $searchQuery: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 48, query: $searchQuery, sortKey: TITLE) {
      nodes {
        ...ProductItem
      }
    }
  }
` as const;

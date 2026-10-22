import type {Route} from './+types/($locale).collections.all';
import {useLoaderData, useSearchParams} from 'react-router';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {getLocaleFromParam} from '~/lib/locale';
import {useT} from '~/lib/i18n';
import {TRANSLATIONS} from '~/lib/translations';
import {ACTIVE_ANIMAS, ANIME} from '~/lib/animas';
import {
  getColorTag,
  getFinish,
  COLOR_SWATCH_HEX,
  getColorLabel,
  getCategoryLabel,
} from '~/lib/productCopy';
import {findAnimaByTag} from '~/lib/animas';
import {useCallback, useMemo, useState} from 'react';

export const meta: Route.MetaFunction = ({params}) => {
  const code = getLocaleFromParam(params.locale);
  return [
    {title: TRANSLATIONS[code].allProducts.metaTitle},
    {name: 'description', content: TRANSLATIONS[code].allProducts.metaDescription},
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const excludeQuery = ANIME.filter((a) => a.comingSoon)
    .map((a) => `NOT tag:"${a.tag}"`)
    .join(' AND ');

  const {products} = await storefront.query(CATALOG_QUERY, {
    variables: {first: 100, query: excludeQuery},
  });
  return {products: products.nodes};
}

// --- Filter definitions ---

const PRODUCT_TYPES = ['Rossetto', 'Lip Gloss', 'Mascara/Eyeliner'] as const;
const COLOR_ORDER = [
  'NUDE',
  'ROSSO',
  'VIOLA',
  'CHERRY',
  'PINK',
  'YELLOW',
  'CHOCOLATE',
  'BLACK',
  'LILLA',
] as const;
const FINISHES = [
  'Metallic',
  'Pearly Gloss',
  'Super Pearly Gloss',
  'Super Black',
  'Pervinca',
] as const;
const SORT_OPTIONS = [
  'recommended',
  'price-asc',
  'price-desc',
  'newest',
] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

const COMING_SOON_COLORS: Record<string, string[]> = {
  'Lip Gloss': ['CHOCOLATE', 'CHERRY'],
};

function isComingSoonSku(productType: string, colorTag: string | undefined): boolean {
  if (!colorTag) return false;
  return COMING_SOON_COLORS[productType]?.includes(colorTag) ?? false;
}

function getProductColor(p: CollectionItemFragment): string | undefined {
  return getColorTag(p.tags);
}

function getProductAnima(p: CollectionItemFragment) {
  return findAnimaByTag(p.tags);
}

function getProductFinish(p: CollectionItemFragment): string | undefined {
  const color = getProductColor(p);
  return getFinish(p.productType, color);
}

// --- Helpers ---

function sortProducts(
  products: CollectionItemFragment[],
  sort: SortOption,
): CollectionItemFragment[] {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount),
      );
    case 'price-desc':
      return sorted.sort(
        (a, b) =>
          parseFloat(b.priceRange.minVariantPrice.amount) -
          parseFloat(a.priceRange.minVariantPrice.amount),
      );
    case 'newest':
      return sorted.reverse();
    default:
      return sorted;
  }
}

// Colors that exist for a given product type
function colorsForType(
  products: CollectionItemFragment[],
  productType: string | null,
): Set<string> {
  const colors = new Set<string>();
  for (const p of products) {
    if (productType && p.productType !== productType) continue;
    const c = getProductColor(p);
    if (c) colors.add(c);
  }
  return colors;
}

// --- Component ---

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();
  const t = useT();
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Read filters from URL
  const selectedAnimas = searchParams.getAll('anyma');
  const selectedTypes = searchParams.getAll('prodotto');
  const selectedColors = searchParams.getAll('colore');
  const selectedFinishes = searchParams.getAll('finitura');
  const selectedAvailability = searchParams.get('disponibilita');
  const sortBy = (searchParams.get('ordina') ?? 'recommended') as SortOption;

  const setFilter = useCallback(
    (key: string, values: string[]) => {
      setSearchParams(
        (prev) => {
          prev.delete(key);
          for (const v of values) prev.append(key, v);
          return prev;
        },
        {replace: true},
      );
    },
    [setSearchParams],
  );

  const toggleFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const existing = prev.getAll(key);
          if (existing.includes(value)) {
            prev.delete(key);
            for (const v of existing.filter((v) => v !== value))
              prev.append(key, v);
          } else {
            prev.append(key, value);
          }
          return prev;
        },
        {replace: true},
      );
    },
    [setSearchParams],
  );

  const clearAll = useCallback(() => {
    setSearchParams({}, {replace: true});
  }, [setSearchParams]);

  const removeFilter = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const existing = prev.getAll(key);
          prev.delete(key);
          for (const v of existing.filter((v) => v !== value))
            prev.append(key, v);
          return prev;
        },
        {replace: true},
      );
    },
    [setSearchParams],
  );

  // Filter products
  const filtered = useMemo(() => {
    let result = products.filter((p: CollectionItemFragment) => {
      const anima = getProductAnima(p);
      const color = getProductColor(p);
      const finish = getProductFinish(p);
      const isComing = isComingSoonSku(p.productType, color);

      if (selectedAnimas.length > 0 && anima) {
        if (!selectedAnimas.includes(anima.key)) return false;
      }
      if (selectedTypes.length > 0) {
        if (!selectedTypes.includes(p.productType)) return false;
      }
      if (selectedColors.length > 0 && color) {
        if (!selectedColors.includes(color)) return false;
      }
      if (selectedFinishes.length > 0 && finish) {
        if (!selectedFinishes.includes(finish)) return false;
      }
      if (selectedAvailability === 'available' && isComing) return false;
      if (selectedAvailability === 'coming' && !isComing) return false;

      return true;
    });
    return sortProducts(result, sortBy);
  }, [
    products,
    selectedAnimas,
    selectedTypes,
    selectedColors,
    selectedFinishes,
    selectedAvailability,
    sortBy,
  ]);

  // Count per filter value (against the OTHER active filters, excluding the one being counted)
  const counts = useMemo(() => {
    const countFor = (
      key: string,
      extractor: (p: CollectionItemFragment) => string | undefined,
    ) => {
      const map: Record<string, number> = {};
      for (const p of products) {
        const anima = getProductAnima(p);
        const color = getProductColor(p);
        const finish = getProductFinish(p);
        const isComing = isComingSoonSku(p.productType, color);

        if (
          key !== 'anyma' &&
          selectedAnimas.length > 0 &&
          anima &&
          !selectedAnimas.includes(anima.key)
        )
          continue;
        if (
          key !== 'prodotto' &&
          selectedTypes.length > 0 &&
          !selectedTypes.includes(p.productType)
        )
          continue;
        if (
          key !== 'colore' &&
          selectedColors.length > 0 &&
          color &&
          !selectedColors.includes(color)
        )
          continue;
        if (
          key !== 'finitura' &&
          selectedFinishes.length > 0 &&
          finish &&
          !selectedFinishes.includes(finish)
        )
          continue;
        if (key !== 'disponibilita') {
          if (selectedAvailability === 'available' && isComing) continue;
          if (selectedAvailability === 'coming' && !isComing) continue;
        }

        const val = extractor(p);
        if (val) map[val] = (map[val] ?? 0) + 1;
      }
      return map;
    };

    return {
      anyma: countFor('anyma', (p) => getProductAnima(p)?.key),
      prodotto: countFor('prodotto', (p) => p.productType),
      colore: countFor('colore', (p) => getProductColor(p)),
      finitura: countFor('finitura', (p) => getProductFinish(p)),
      disponibilita: countFor('disponibilita', (p) => {
        const color = getProductColor(p);
        return isComingSoonSku(p.productType, color)
          ? 'coming'
          : 'available';
      }),
    };
  }, [
    products,
    selectedAnimas,
    selectedTypes,
    selectedColors,
    selectedFinishes,
    selectedAvailability,
  ]);

  // Available colors — filtered by selected product type
  const availableColors = useMemo(() => {
    const type = selectedTypes.length === 1 ? selectedTypes[0] : null;
    return colorsForType(products, type);
  }, [products, selectedTypes]);

  const hasActiveFilters =
    selectedAnimas.length > 0 ||
    selectedTypes.length > 0 ||
    selectedColors.length > 0 ||
    selectedFinishes.length > 0 ||
    selectedAvailability !== null;

  const activeChips: {key: string; value: string; label: string}[] = [];
  for (const a of selectedAnimas) {
    const anima = ACTIVE_ANIMAS.find((x) => x.key === a);
    activeChips.push({key: 'anyma', value: a, label: anima?.name ?? a});
  }
  for (const tp of selectedTypes) {
    activeChips.push({key: 'prodotto', value: tp, label: getCategoryLabel(tp)});
  }
  for (const c of selectedColors) {
    activeChips.push({key: 'colore', value: c, label: getColorLabel(c)});
  }
  for (const f of selectedFinishes) {
    activeChips.push({key: 'finitura', value: f, label: f});
  }
  if (selectedAvailability) {
    activeChips.push({
      key: 'disponibilita',
      value: selectedAvailability,
      label:
        selectedAvailability === 'available'
          ? t('allProducts.availableNow')
          : t('allProducts.comingSoon'),
    });
  }

  const filterPanel = (
    <FilterPanel
      t={t}
      selectedAnimas={selectedAnimas}
      selectedTypes={selectedTypes}
      selectedColors={selectedColors}
      selectedFinishes={selectedFinishes}
      selectedAvailability={selectedAvailability}
      sortBy={sortBy}
      toggleFilter={toggleFilter}
      setFilter={setFilter}
      counts={counts}
      availableColors={availableColors}
      setSearchParams={setSearchParams}
    />
  );

  const productCountLabel =
    filtered.length === 1
      ? t('allProducts.productCountOne')
      : t('allProducts.productCount').replace(
          '{n}',
          String(filtered.length),
        );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h1 className="font-display text-2xl uppercase tracking-[0.03em] text-nero sm:text-3xl">
          {t('allProducts.title')}
        </h1>
        <p className="mt-1 text-xs text-nero/50">{productCountLabel}</p>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}`}
              onClick={() => removeFilter(chip.key, chip.value)}
              className="flex items-center gap-1.5 rounded-full border border-nero/20 px-3 py-1 text-[10px] uppercase tracking-[0.1em] text-nero transition-colors hover:border-nero"
            >
              {chip.label}
              <XIcon />
            </button>
          ))}
          <button
            onClick={clearAll}
            className="text-[10px] uppercase tracking-[0.1em] text-nero/50 underline transition-colors hover:text-nero"
          >
            {t('allProducts.clearAll')}
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden w-56 shrink-0 sm:block">
          <div className="sticky top-24">{filterPanel}</div>
        </div>

        {/* Product grid */}
        <div className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-nero/60">
                {t('allProducts.noResults')}
              </p>
              <button
                onClick={clearAll}
                className="mt-4 border border-gold bg-gold px-6 py-2.5 text-[10px] uppercase tracking-[0.15em] text-nero transition-colors hover:bg-white hover:border-white"
              >
                {t('allProducts.noResultsCta')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
              {filtered.map((product: CollectionItemFragment, index: number) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  loading={index < 6 ? 'eager' : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-nero px-6 py-3 text-[11px] uppercase tracking-[0.15em] text-paper shadow-lg transition-transform active:scale-95 sm:hidden"
      >
        <FilterIcon />
        {t('allProducts.filterButton')}
        {hasActiveFilters && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[9px] text-nero">
            {activeChips.length}
          </span>
        )}
      </button>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-nero/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper">
            <div className="flex items-center justify-between border-b border-nero/10 px-6 py-4">
              <h2 className="font-display text-sm uppercase tracking-[0.1em] text-nero">
                {t('allProducts.filterButton')}
              </h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 text-nero/60"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {filterPanel}
            </div>
            <div className="border-t border-nero/10 px-6 py-4">
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full bg-nero py-3 text-center text-[11px] uppercase tracking-[0.15em] text-paper transition-colors hover:bg-nero/80"
              >
                {filtered.length === 1
                  ? t('allProducts.showResult')
                  : t('allProducts.showResults').replace(
                      '{n}',
                      String(filtered.length),
                    )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Filter Panel ---

function FilterPanel({
  t,
  selectedAnimas,
  selectedTypes,
  selectedColors,
  selectedFinishes,
  selectedAvailability,
  sortBy,
  toggleFilter,
  setFilter,
  counts,
  availableColors,
  setSearchParams,
}: {
  t: (key: string) => string;
  selectedAnimas: string[];
  selectedTypes: string[];
  selectedColors: string[];
  selectedFinishes: string[];
  selectedAvailability: string | null;
  sortBy: SortOption;
  toggleFilter: (key: string, value: string) => void;
  setFilter: (key: string, values: string[]) => void;
  counts: Record<string, Record<string, number>>;
  availableColors: Set<string>;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
}) {
  return (
    <div className="space-y-6">
      {/* Anyma */}
      <FilterSection title={t('allProducts.filterAnyma')} defaultOpen>
        <div className="space-y-1.5">
          {ACTIVE_ANIMAS.map((anima) => {
            const count = counts.anyma[anima.key] ?? 0;
            const active = selectedAnimas.includes(anima.key);
            return (
              <FilterCheckbox
                key={anima.key}
                label={anima.name}
                count={count}
                active={active}
                disabled={count === 0 && !active}
                onClick={() => toggleFilter('anyma', anima.key)}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Prodotto */}
      <FilterSection title={t('allProducts.filterProduct')} defaultOpen>
        <div className="space-y-1.5">
          {PRODUCT_TYPES.map((type) => {
            const count = counts.prodotto[type] ?? 0;
            const active = selectedTypes.includes(type);
            return (
              <FilterCheckbox
                key={type}
                label={getCategoryLabel(type)}
                count={count}
                active={active}
                disabled={count === 0 && !active}
                onClick={() => toggleFilter('prodotto', type)}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Colore */}
      <FilterSection title={t('allProducts.filterColor')}>
        <div className="grid grid-cols-3 gap-2">
          {COLOR_ORDER.filter((c) => availableColors.has(c)).map((color) => {
            const count = counts.colore[color] ?? 0;
            const active = selectedColors.includes(color);
            const hex = COLOR_SWATCH_HEX[color];
            return (
              <button
                key={color}
                onClick={() => toggleFilter('colore', color)}
                disabled={count === 0 && !active}
                className={`flex flex-col items-center gap-1 rounded p-1.5 transition-all ${
                  active
                    ? 'bg-nero/5 ring-1 ring-nero'
                    : count === 0 && !active
                      ? 'opacity-30'
                      : 'hover:bg-nero/5'
                }`}
              >
                <span
                  className="h-6 w-6 rounded-full border border-nero/10"
                  style={{backgroundColor: hex}}
                />
                <span className="text-[8px] uppercase tracking-[0.05em] text-nero/70">
                  {getColorLabel(color)}
                </span>
                <span className="text-[8px] text-nero/40">({count})</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Finitura */}
      <FilterSection title={t('allProducts.filterFinish')}>
        <div className="space-y-1.5">
          {FINISHES.map((finish) => {
            const count = counts.finitura[finish] ?? 0;
            const active = selectedFinishes.includes(finish);
            return (
              <FilterCheckbox
                key={finish}
                label={finish}
                count={count}
                active={active}
                disabled={count === 0 && !active}
                onClick={() => toggleFilter('finitura', finish)}
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Disponibilità */}
      <FilterSection title={t('allProducts.filterAvailability')}>
        <div className="space-y-1.5">
          {(['available', 'coming'] as const).map((val) => {
            const count = counts.disponibilita[val] ?? 0;
            const active = selectedAvailability === val;
            return (
              <FilterCheckbox
                key={val}
                label={
                  val === 'available'
                    ? t('allProducts.availableNow')
                    : t('allProducts.comingSoon')
                }
                count={count}
                active={active}
                disabled={count === 0 && !active}
                onClick={() =>
                  setFilter('disponibilita', active ? [] : [val])
                }
              />
            );
          })}
        </div>
      </FilterSection>

      {/* Ordina per */}
      <FilterSection title={t('allProducts.filterSort')}>
        <div className="space-y-1.5">
          {SORT_OPTIONS.map((opt) => {
            const labels: Record<SortOption, string> = {
              recommended: t('allProducts.sortRecommended'),
              'price-asc': t('allProducts.sortPriceAsc'),
              'price-desc': t('allProducts.sortPriceDesc'),
              newest: t('allProducts.sortNewest'),
            };
            return (
              <button
                key={opt}
                onClick={() =>
                  setSearchParams(
                    (prev) => {
                      if (opt === 'recommended') {
                        prev.delete('ordina');
                      } else {
                        prev.set('ordina', opt);
                      }
                      return prev;
                    },
                    {replace: true},
                  )
                }
                className={`block w-full text-left text-[11px] tracking-[0.05em] transition-colors ${
                  sortBy === opt
                    ? 'font-semibold text-nero'
                    : 'text-nero/60 hover:text-nero'
                }`}
              >
                {labels[opt]}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </div>
  );
}

// --- Reusable pieces ---

function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-nero/10 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-nero">
          {title}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  label,
  count,
  active,
  disabled,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-2 text-left text-[11px] tracking-[0.03em] transition-colors ${
        disabled
          ? 'cursor-not-allowed text-nero/30'
          : active
            ? 'font-semibold text-nero'
            : 'text-nero/70 hover:text-nero'
      }`}
    >
      <span
        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center border transition-colors ${
          active ? 'border-nero bg-nero' : 'border-nero/30'
        }`}
      >
        {active && (
          <svg viewBox="0 0 10 8" className="h-2 w-2.5" fill="none">
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="var(--paper)"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </span>
      <span className="flex-1">{label}</span>
      <span className="text-nero/40">({count})</span>
    </button>
  );
}

function ChevronIcon({open}: {open: boolean}) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-3 w-3 text-nero/40 transition-transform ${
        open ? 'rotate-180' : ''
      }`}
      fill="none"
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function XIcon({size = 12}: {size?: number}) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      fill="none"
      className="shrink-0"
    >
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path
        d="M2 4h12M4 8h8M6 12h4"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

// --- GraphQL ---

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
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
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
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

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $query: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor, query: $query) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;

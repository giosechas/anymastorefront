import {useLoaderData} from 'react-router';
import type {Route} from './+types/prodotti.$type';
import {ProductItem} from '~/components/ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';

const TYPE_MAP: Record<string, {label: string; productType: string}> = {
  rossetti: {label: 'Rossetti', productType: 'Rossetto'},
  gloss: {label: 'Lip Gloss', productType: 'Lip Gloss'},
  mascara: {label: 'Mascara & Eyeliner', productType: 'Mascara/Eyeliner'},
};

export const meta: Route.MetaFunction = ({params}) => {
  const info = params.type ? TYPE_MAP[params.type] : undefined;
  return [{title: `Anyma Beauty | ${info?.label ?? 'Prodotti'}`}];
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

  return (
    <div className="bg-paper">
      <header className="mx-auto max-w-3xl px-6 pb-6 pt-16 text-center sm:pt-24">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">
          Cerca per prodotto
        </p>
        <h1 className="font-display text-4xl uppercase tracking-[0.03em] text-nero sm:text-5xl">
          {info.label}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-nero/70">
          Lo stesso gesto, in tutte le Anyme. Trova il tuo colore.
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-24">
        {products.length === 0 ? (
          <p className="text-center text-sm text-nero/60">
            Nessun prodotto trovato per questa categoria.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={index < 8 ? 'eager' : undefined}
              />
            ))}
          </div>
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

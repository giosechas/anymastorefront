import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const {open} = useAside();
  const image = product.featuredImage;
  const variant = product.variants?.nodes?.[0];

  return (
    <div className="group relative">
      <Link
        className="block"
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
        <div className="aspect-[4/5] bg-nero/5">
          {image && (
            <Image
              alt={image.altText || product.title}
              data={image}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <h4 className="mt-3 text-xs uppercase tracking-[0.05em] text-nero">
          {product.title}
        </h4>
        <small className="text-xs text-nero/60">
          <Money data={product.priceRange.minVariantPrice} />
        </small>
      </Link>

      {variant && (
        <div className="pointer-events-none absolute inset-0 bottom-[3.25rem] flex items-center justify-center bg-nero/0 opacity-0 transition-all duration-200 group-hover:bg-nero/40 group-hover:opacity-100">
          <div className="pointer-events-auto">
            <AddToCartButton
              disabled={!variant.availableForSale}
              onClick={() => open('cart')}
              lines={[{merchandiseId: variant.id, quantity: 1, selectedVariant: variant}]}
              className="border border-paper bg-paper/0 px-5 py-2 text-[11px] uppercase tracking-[0.15em] text-paper transition-colors hover:bg-paper hover:text-nero disabled:cursor-not-allowed disabled:opacity-50"
            >
              {variant.availableForSale ? 'Aggiungi al carrello' : 'Esaurito'}
            </AddToCartButton>
          </div>
        </div>
      )}
    </div>
  );
}

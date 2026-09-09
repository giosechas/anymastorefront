import {useEffect, useState} from 'react';
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
import {WishlistHeart} from '~/components/WishlistHeart';
import {NotifyBell} from '~/components/NotifyBell';
import {findAnimaByTag} from '~/lib/animas';
import {getMascaraModelPhoto} from '~/lib/mascaraModelPhoto';
import {getLipstickModelPhotos} from '~/lib/lipstickModelPhoto';
import {getGlossModelPhotos} from '~/lib/glossModelPhoto';
import {getColorTag} from '~/lib/productCopy';

const IMAGE_ROTATE_MS = 3000;

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
  // Only the product's open/closed shots for now — skip swatch smears,
  // video thumbnails, etc. until more categorized photography exists.
  const gallery = 'images' in product ? product.images.nodes.slice(0, 2) : [];
  const images = gallery.length > 1 ? gallery : [product.featuredImage];
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialDelay] = useState(() => Math.random() * IMAGE_ROTATE_MS);
  const image = images[activeIndex] ?? product.featuredImage;
  const variant = product.variants?.nodes?.[0];
  const anima =
    'tags' in product ? findAnimaByTag(product.tags) : undefined;
  const mascaraModelPhoto =
    'productType' in product
      ? getMascaraModelPhoto(product.productType, anima?.handle)
      : undefined;
  const colorTag = 'tags' in product ? getColorTag(product.tags) : undefined;
  const lipstickModelPhotos =
    'productType' in product
      ? getLipstickModelPhotos(product.productType, colorTag)
      : [];
  const glossModelPhotos =
    'productType' in product
      ? getGlossModelPhotos(product.productType, colorTag)
      : [];
  const colorModelPhotos = lipstickModelPhotos.length
    ? lipstickModelPhotos
    : glossModelPhotos;
  const [colorPhotoIndex, setColorPhotoIndex] = useState(0);
  function pickNextColorPhoto() {
    if (colorModelPhotos.length < 2) return;
    setColorPhotoIndex((prev) => {
      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * colorModelPhotos.length);
      }
      return next;
    });
  }
  const modelPhoto = mascaraModelPhoto ?? colorModelPhotos[colorPhotoIndex];

  useEffect(() => {
    if (images.length < 2) return;
    let intervalId: ReturnType<typeof setInterval>;
    const nextRandomIndex = (current: number) => {
      if (images.length < 3) return (current + 1) % images.length;
      let next = current;
      while (next === current) next = Math.floor(Math.random() * images.length);
      return next;
    };
    const timeoutId = setTimeout(() => {
      setActiveIndex((i) => nextRandomIndex(i));
      intervalId = setInterval(() => {
        setActiveIndex((i) => nextRandomIndex(i));
      }, IMAGE_ROTATE_MS);
    }, initialDelay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, initialDelay]);

  return (
    <div
      className="group relative"
      onMouseEnter={
        colorModelPhotos.length > 1 ? pickNextColorPhoto : undefined
      }
    >
      <Link
        className="block"
        key={product.id}
        prefetch="intent"
        to={variantUrl}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-white">
          {image && (
            <Image
              alt={image.altText || product.title}
              data={image}
              loading={loading}
              sizes="(min-width: 45em) 400px, 100vw"
              className="relative z-[1] h-full w-full object-cover transition-[opacity,transform] duration-500"
            />
          )}
          {modelPhoto && (
            <img
              src={modelPhoto.url}
              alt={modelPhoto.altText}
              style={{
                transformOrigin: mascaraModelPhoto ? '50% 22%' : '50% 68%',
              }}
              className={`absolute inset-0 z-[2] h-full w-full scale-100 object-cover opacity-0 transition-[opacity,transform] duration-500 group-hover:opacity-100 ${
                mascaraModelPhoto ? 'group-hover:scale-[1.9]' : 'group-hover:scale-[1.15]'
              }`}
            />
          )}
          <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
            <WishlistHeart
              item={{
                id: product.id,
                handle: product.handle,
                title: product.title,
                image: image
                  ? {url: image.url, altText: image.altText}
                  : undefined,
                price: product.priceRange.minVariantPrice,
              }}
            />
            {variant?.availableForSale ? (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <AddToCartButton
                  onClick={() => open('cart')}
                  lines={[
                    {merchandiseId: variant.id, quantity: 1, selectedVariant: variant},
                  ]}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 backdrop-blur-sm transition-transform hover:scale-110"
                >
                  <CartAddIcon />
                </AddToCartButton>
              </div>
            ) : (
              variant && <NotifyBell productId={product.id} />
            )}
          </div>
        </div>
        <h4 className="mt-3 text-[10px] uppercase tracking-[0.05em] text-nero no-underline transition-colors group-hover:text-gold">
          {product.title}
        </h4>
        <small className="text-[10px] text-nero/60 no-underline transition-colors group-hover:text-gold">
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

function CartAddIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="var(--nero)"
      strokeWidth={1.5}
    >
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

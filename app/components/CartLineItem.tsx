import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout, LineItemChildrenMap} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {HIDE_PRICES} from '~/lib/config';
import {useAside} from './Aside';
import {useLocale, useT} from '~/lib/i18n';
import {getColorTag, getColorLabel, getCatalogTitle} from '~/lib/productCopy';
import {findAnimaByTag} from '~/lib/animas';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

export type CartLine = OptimisticCartLine<CartApiQueryFragment>;

export function CartLineItem({
  layout,
  line,
  childrenMap,
}: {
  layout: CartLayout;
  line: CartLine;
  childrenMap: LineItemChildrenMap;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions = []} = merchandise;
  const lineItemUrl = useVariantUrl(product?.handle ?? '', selectedOptions);
  const {close} = useAside();
  const {code} = useLocale();
  const t = useT();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;
  const colorTag = product && 'tags' in product ? getColorTag(product.tags) : undefined;
  const anima = product && 'tags' in product ? findAnimaByTag(product.tags) : undefined;
  const displayTitle =
    product && 'productType' in product && product.productType
      ? getCatalogTitle(product.productType, colorTag, anima?.name, code)
      : product?.title ?? title;

  const colorLabel = selectedOptions?.find(
    (o) => o.name === 'Color' || o.name === 'Colore',
  );

  const imgSize = layout === 'aside' ? 80 : 100;

  return (
    <li key={id} className="border-b border-nero/10 py-4 last:border-b-0">
      <div className="flex gap-4">
        {image && (
          <Link
            prefetch="intent"
            to={lineItemUrl}
            onClick={() => layout === 'aside' && close()}
            className="shrink-0"
          >
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={imgSize}
              loading="lazy"
              width={imgSize}
              className="rounded-md bg-nero/5"
            />
          </Link>
        )}

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => layout === 'aside' && close()}
              className="transition-colors hover:text-gold"
            >
              <p className="text-sm font-medium leading-tight text-nero">
                {anima && (
                  <span className="text-[11px] uppercase tracking-[0.06em] text-nero/50">
                    Anyma {anima.name} ·{' '}
                  </span>
                )}
                {displayTitle}
              </p>
            </Link>
            {colorLabel && (
              <p className="mt-0.5 text-xs text-nero/50">
                {getColorLabel(colorLabel.value, code)}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <CartLineQuantity line={line} />
            <div className="text-right">
              {!HIDE_PRICES && (
                <ProductPrice price={line?.cost?.totalAmount} />
              )}
            </div>
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div className="mt-2 pl-[calc(80px+1rem)]">
          <p id={childrenLabelId} className="sr-only">
            {t('cart.lineItemsWith', displayTitle)}
          </p>
          <ul aria-labelledby={childrenLabelId} className="space-y-2">
            {lineItemChildren.map((childLine) => (
              <CartLineItem
                childrenMap={childrenMap}
                key={childLine.id}
                line={childLine}
                layout={layout}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  const t = useT();
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center rounded-full border border-nero/15">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button
            aria-label={t('cart.decreaseQuantity')}
            disabled={quantity <= 1 || !!isOptimistic}
            name="decrease-quantity"
            value={prevQuantity}
            className="flex h-7 w-7 items-center justify-center text-nero/60 transition-colors hover:text-nero disabled:opacity-30"
          >
            <span className="text-sm">&#8722;</span>
          </button>
        </CartLineUpdateButton>
        <span className="min-w-[1.5rem] text-center text-xs font-medium tabular-nums">
          {quantity}
        </span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button
            aria-label={t('cart.increaseQuantity')}
            name="increase-quantity"
            value={nextQuantity}
            disabled={!!isOptimistic}
            className="flex h-7 w-7 items-center justify-center text-nero/60 transition-colors hover:text-nero disabled:opacity-30"
          >
            <span className="text-sm">&#43;</span>
          </button>
        </CartLineUpdateButton>
      </div>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  const t = useT();
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        type="submit"
        className="ml-1 text-[11px] text-nero/40 underline transition-colors hover:text-nero disabled:opacity-30"
        aria-label={t('cart.remove')}
      >
        {t('cart.remove')}
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

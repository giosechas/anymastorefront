import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem, type CartLine} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {useLocale, useT} from '~/lib/i18n';
import {usePrelaunchMode} from '~/root';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

export type LineItemChildrenMap = {[parentId: string]: CartLine[]};

function getLineItemChildrenMap(lines: CartLine[]): LineItemChildrenMap {
  const children: LineItemChildrenMap = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const lineChildren = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(lineChildren)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}

export function CartMain({layout, cart: originalCart}: CartMainProps) {
  const cart = useOptimisticCart(originalCart);
  const t = useT();
  const prelaunchMode = usePrelaunchMode();

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  return (
    <section
      className={layout === 'aside' ? 'flex h-full flex-col' : ''}
      aria-label={layout === 'page' ? t('cart.cartPage') : t('cart.cartDrawer')}
    >
      <CartEmpty hidden={linesCount} layout={layout} />

      {linesCount && (
        <>
          <div
            className={
              layout === 'aside' ? 'flex-1 overflow-y-auto px-4' : ''
            }
          >
            <p id="cart-lines" className="sr-only">
              {t('cart.lineItems')}
            </p>
            <ul aria-labelledby="cart-lines">
              {(cart?.lines?.nodes ?? []).map((line) => {
                if (
                  'parentRelationship' in line &&
                  line.parentRelationship?.parent
                ) {
                  return null;
                }
                return (
                  <CartLineItem
                    key={line.id}
                    line={line}
                    layout={layout}
                    childrenMap={childrenMap}
                  />
                );
              })}
            </ul>
          </div>

          {(cartHasItems || prelaunchMode) && (
            <CartSummary cart={cart} layout={layout} />
          )}
        </>
      )}
    </section>
  );
}

function CartEmpty({
  hidden = false,
  layout,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  const {href} = useLocale();
  const t = useT();

  return (
    <div
      hidden={hidden}
      className="flex flex-col items-center px-6 py-12 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-nero/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-8 w-8 text-nero/30"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
      </div>
      <p className="font-display text-lg tracking-wide text-nero">
        {t('cart.emptyTitle')}
      </p>
      <p className="mt-2 max-w-[240px] text-sm text-nero/50">
        {t('cart.emptyBody')}
      </p>
      <Link
        to={href('/collections/all')}
        onClick={close}
        prefetch="viewport"
        className="mt-6 inline-block rounded-full border border-nero bg-nero px-6 py-2.5 text-xs font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:bg-transparent hover:text-nero"
      >
        {t('cart.continueShopping')}
      </Link>
    </div>
  );
}

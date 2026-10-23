import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';
import {HIDE_PRICES} from '~/lib/config';
import {useT} from '~/lib/i18n';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  const t = useT();
  if (HIDE_PRICES) {
    return (
      <div aria-label="Price" className="product-price" role="group">
        <span className="text-[11px] uppercase tracking-[0.08em] text-fuchsia">
          {t('product.soldOut')}
        </span>
      </div>
    );
  }
  return (
    <div aria-label="Price" className="product-price" role="group">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

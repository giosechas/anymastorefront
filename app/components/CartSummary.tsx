import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {HIDE_PRICES} from '~/lib/config';
import {usePrelaunchMode} from '~/root';
import {useEffect, useId, useRef, useState} from 'react';
import {useFetcher} from 'react-router';
import {useT} from '~/lib/i18n';
import {useAside} from './Aside';
import {PaymentIcons} from './PaymentIcons';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const t = useT();
  const prelaunchMode = usePrelaunchMode();
  const summaryId = useId();
  const discountsHeadingId = useId();
  const discountCodeInputId = useId();
  const giftCardHeadingId = useId();
  const giftCardInputId = useId();

  const isAside = layout === 'aside';

  return (
    <div
      aria-labelledby={summaryId}
      className={
        isAside
          ? 'shrink-0 border-t border-nero/10 bg-paper px-4 pb-4 pt-3'
          : 'mt-6'
      }
    >
      <h4 id={summaryId} className="sr-only">
        {t('cart.totals')}
      </h4>

      {prelaunchMode ? (
        <p className="py-3 text-center text-xs leading-relaxed text-nero/60">
          {t('preorder.cartNote')}
        </p>
      ) : (
        <>
          {!HIDE_PRICES && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-nero/60">{t('cart.subtotal')}</span>
              <span className="text-sm font-medium">
                {cart?.cost?.subtotalAmount?.amount ? (
                  <Money data={cart.cost.subtotalAmount} />
                ) : (
                  '-'
                )}
              </span>
            </div>
          )}

          <p className="text-xs text-nero/40">{t('cart.shippingNote')}</p>

          <CartDiscounts
            discountCodes={cart?.discountCodes}
            discountsHeadingId={discountsHeadingId}
            discountCodeInputId={discountCodeInputId}
          />

          <CartGiftCard
            giftCardCodes={cart?.appliedGiftCards}
            giftCardHeadingId={giftCardHeadingId}
            giftCardInputId={giftCardInputId}
          />
        </>
      )}

      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} prelaunchMode={prelaunchMode} />

      {!prelaunchMode && <CartTrustElements />}
    </div>
  );
}

function CartCheckoutActions({checkoutUrl, prelaunchMode}: {checkoutUrl?: string; prelaunchMode: boolean}) {
  const t = useT();
  const {open} = useAside();

  if (prelaunchMode) {
    return (
      <button
        type="button"
        onClick={() => open('preorder')}
        className="mt-3 flex w-full items-center justify-center rounded-full bg-nero py-3 text-xs font-medium uppercase tracking-[0.1em] text-paper transition-colors hover:bg-nero/90"
      >
        {t('preorder.ctaButton')}
      </button>
    );
  }

  if (!checkoutUrl) return null;

  return (
    <a
      href={checkoutUrl}
      target="_self"
      className="mt-3 flex w-full items-center justify-center rounded-full bg-nero py-3 text-xs font-medium uppercase tracking-[0.1em] text-paper transition-colors hover:bg-nero/90"
    >
      {t('cart.continueToCheckout')}
    </a>
  );
}

function CartTrustElements() {
  const t = useT();
  return (
    <div className="mt-4 space-y-2">
      <TrustLine icon={<LockIcon />} text={t('cart.secureCheckout')} />
      <TrustLine icon={<TruckIcon />} text={t('cart.shippingNote')} />
      <TrustLine icon={<ReturnIcon />} text={t('cart.freeReturns')} />
      <TrustLine icon={<PinIcon />} text={t('cart.madeInItaly')} />
      <PaymentIcons className="mt-3 justify-center" />
    </div>
  );
}

function TrustLine({icon, text}: {icon: React.ReactNode; text: string}) {
  return (
    <div className="flex items-center gap-2 text-nero/40">
      {icon}
      <span className="text-[11px]">{text}</span>
    </div>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
      <path d="M6.5 3c-1.045 0-2.062.27-2.97.77A1.5 1.5 0 002 5.15V12.5A1.5 1.5 0 003.5 14h.25a2.75 2.75 0 005.5 0h1.5a2.75 2.75 0 005.5 0h.25a1.5 1.5 0 001.5-1.5v-3a4.5 4.5 0 00-4.5-4.5H12V4.5A1.5 1.5 0 0010.5 3h-4zM6.5 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm7 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
      <path fillRule="evenodd" d="M7.793 2.232a.75.75 0 01-.025 1.06L3.622 7.25h10.003a5.375 5.375 0 010 10.75H10.75a.75.75 0 010-1.5h2.875a3.875 3.875 0 000-7.75H3.622l4.146 3.957a.75.75 0 01-1.036 1.085l-5.5-5.25a.75.75 0 010-1.085l5.5-5.25a.75.75 0 011.06.025z" clipRule="evenodd" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0">
      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.274 1.765 11.307 11.307 0 00.757.433c.115.06.2.1.281.14l.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    </svg>
  );
}

function CartDiscounts({
  discountCodes,
  discountsHeadingId,
  discountCodeInputId,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
  discountsHeadingId: string;
  discountCodeInputId: string;
}) {
  const t = useT();
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <section aria-label={t('cart.discounts')} className="mt-3">
      <dl hidden={!codes.length}>
        <div>
          <dt id={discountsHeadingId} className="sr-only">
            {t('cart.discounts')}
          </dt>
          <UpdateDiscountForm>
            <div
              className="flex items-center gap-2 rounded-md bg-gold/10 px-3 py-1.5"
              role="group"
              aria-labelledby={discountsHeadingId}
            >
              <code className="text-xs font-medium text-nero">
                {codes?.join(', ')}
              </code>
              <button
                type="submit"
                className="ml-auto text-[11px] text-nero/40 underline"
                aria-label={t('cart.removeDiscount')}
              >
                {t('cart.remove')}
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex gap-2">
          <label htmlFor={discountCodeInputId} className="sr-only">
            {t('cart.discountCode')}
          </label>
          <input
            id={discountCodeInputId}
            type="text"
            name="discountCode"
            placeholder={t('cart.discountCode')}
            className="flex-1 rounded-md border border-nero/15 bg-transparent px-3 py-2 text-xs text-nero placeholder:text-nero/30 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md border border-nero/15 px-4 py-2 text-xs font-medium text-nero transition-colors hover:bg-nero hover:text-paper"
            aria-label={t('cart.applyDiscountCode')}
          >
            {t('cart.apply')}
          </button>
        </div>
      </UpdateDiscountForm>
    </section>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
  giftCardHeadingId,
  giftCardInputId,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
  giftCardHeadingId: string;
  giftCardInputId: string;
}) {
  const t = useT();
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const removeButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const previousCardIdsRef = useRef<string[]>([]);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const [removedCardIndex, setRemovedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      if (giftCardCodeInput.current !== null) {
        giftCardCodeInput.current.value = '';
      }
    }
  }, [giftCardAddFetcher.data]);

  useEffect(() => {
    const currentCardIds = giftCardCodes?.map((card) => card.id) || [];

    if (removedCardIndex !== null && giftCardCodes) {
      const focusTargetIndex = Math.min(
        removedCardIndex,
        giftCardCodes.length - 1,
      );
      const focusTargetCard = giftCardCodes[focusTargetIndex];
      const focusButton = focusTargetCard
        ? removeButtonRefs.current.get(focusTargetCard.id)
        : null;

      if (focusButton) {
        focusButton.focus();
      } else if (giftCardCodeInput.current) {
        giftCardCodeInput.current.focus();
      }

      setRemovedCardIndex(null);
    }

    previousCardIdsRef.current = currentCardIds;
  }, [giftCardCodes, removedCardIndex]);

  const handleRemoveClick = (cardId: string) => {
    const index = previousCardIdsRef.current.indexOf(cardId);
    if (index !== -1) {
      setRemovedCardIndex(index);
    }
  };

  return (
    <section aria-label={t('cart.giftCards')} className="mt-2">
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl>
          <dt id={giftCardHeadingId} className="sr-only">
            {t('cart.appliedGiftCards')}
          </dt>
          {giftCardCodes.map((giftCard) => (
            <dd key={giftCard.id}>
              <RemoveGiftCardForm
                giftCardId={giftCard.id}
                lastCharacters={giftCard.lastCharacters}
                onRemoveClick={() => handleRemoveClick(giftCard.id)}
                buttonRef={(el: HTMLButtonElement | null) => {
                  if (el) {
                    removeButtonRefs.current.set(giftCard.id, el);
                  } else {
                    removeButtonRefs.current.delete(giftCard.id);
                  }
                }}
              >
                <div className="flex items-center gap-2 rounded-md bg-gold/10 px-3 py-1.5">
                  <code className="text-xs text-nero">
                    ***{giftCard.lastCharacters}
                  </code>
                  <Money
                    data={giftCard.amountUsed}
                    className="text-xs text-nero/60"
                  />
                </div>
              </RemoveGiftCardForm>
            </dd>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="flex gap-2">
          <label htmlFor={giftCardInputId} className="sr-only">
            {t('cart.giftCardCode')}
          </label>
          <input
            id={giftCardInputId}
            type="text"
            name="giftCardCode"
            placeholder={t('cart.giftCardCode')}
            ref={giftCardCodeInput}
            className="flex-1 rounded-md border border-nero/15 bg-transparent px-3 py-2 text-xs text-nero placeholder:text-nero/30 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            disabled={giftCardAddFetcher.state !== 'idle'}
            className="rounded-md border border-nero/15 px-4 py-2 text-xs font-medium text-nero transition-colors hover:bg-nero hover:text-paper disabled:opacity-40"
            aria-label={t('cart.applyGiftCardCode')}
          >
            {t('cart.apply')}
          </button>
        </div>
      </AddGiftCardForm>
    </section>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  lastCharacters,
  children,
  onRemoveClick,
  buttonRef,
}: {
  giftCardId: string;
  lastCharacters: string;
  children: React.ReactNode;
  onRemoveClick?: () => void;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}) {
  const t = useT();
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
      <button
        type="submit"
        className="ml-auto text-[11px] text-nero/40 underline"
        aria-label={t('cart.removeGiftCard', lastCharacters)}
        onClick={onRemoveClick}
        ref={buttonRef}
      >
        {t('cart.remove')}
      </button>
    </CartForm>
  );
}

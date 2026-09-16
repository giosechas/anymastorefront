import {useState} from 'react';
import {useT} from '~/lib/i18n';

const SUPPORT_EMAIL = 'info@anyma-beauty.com';

function buildMailto(subject: string, orderNumber: string, email: string, extra?: string) {
  const body = [
    `Numero d'ordine: ${orderNumber || '[non specificato]'}`,
    `Email dell'ordine: ${email || '[non specificata]'}`,
    extra,
  ]
    .filter(Boolean)
    .join('\n');
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** Shared chrome for the footer's small action popovers (matches the
 * header's search-popover visual language). */
function FooterPopover({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const t = useT();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs uppercase tracking-[0.15em] text-nero/60 transition-colors hover:text-nero"
      >
        {label}
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label={t('support.close')}
            className="search-popover-backdrop"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="search-popover-panel text-left"
          >
            <p className="font-display text-lg uppercase tracking-[0.03em] text-nero">
              {title}
            </p>
            {children(() => setOpen(false))}
          </div>
        </>
      )}
    </>
  );
}

export function TrackOrderMenuItem() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const t = useT();

  return (
    <FooterPopover label={t('support.trackOrder')} title={t('support.trackOrder')}>
      {() => (
        <>
          <p className="mt-2 text-sm leading-relaxed text-nero/70">
            {t('support.trackOrderBody')}
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={t('support.orderNumberPlaceholder')}
              className="border border-nero/20 bg-transparent px-4 py-2.5 text-sm text-nero placeholder:text-nero/40 focus:border-nero focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('support.orderEmailPlaceholder')}
              className="border border-nero/20 bg-transparent px-4 py-2.5 text-sm text-nero placeholder:text-nero/40 focus:border-nero focus:outline-none"
            />
            <a
              href={buildMailto(t('support.trackOrderSubject'), orderNumber, email)}
              className="border border-nero bg-nero px-5 py-2.5 text-center text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-transparent hover:text-nero"
            >
              {t('support.send')}
            </a>
          </div>
        </>
      )}
    </FooterPopover>
  );
}

export function ReturnOrderMenuItem() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const t = useT();

  return (
    <FooterPopover label={t('support.returnOrder')} title={t('support.returnOrder')}>
      {() => (
        <>
          <p className="mt-2 text-sm font-medium text-nero/80">
            {t('support.returnOrderHeadline')}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-nero/70">
            {t('support.returnOrderBody')}
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder={t('support.orderNumberPlaceholder')}
              className="border border-nero/20 bg-transparent px-4 py-2.5 text-sm text-nero placeholder:text-nero/40 focus:border-nero focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('support.orderEmailPlaceholder')}
              className="border border-nero/20 bg-transparent px-4 py-2.5 text-sm text-nero placeholder:text-nero/40 focus:border-nero focus:outline-none"
            />
            <a
              href={buildMailto(
                t('support.returnRequestSubject'),
                orderNumber,
                email,
                t('support.returnItemsLabel'),
              )}
              className="border border-nero bg-nero px-5 py-2.5 text-center text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-transparent hover:text-nero"
            >
              {t('support.sendRequest')}
            </a>
          </div>
        </>
      )}
    </FooterPopover>
  );
}

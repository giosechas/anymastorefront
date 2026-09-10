import {useState} from 'react';

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
            aria-label="Chiudi"
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

  return (
    <FooterPopover label="Monitora il tuo ordine" title="Monitora il tuo ordine">
      {() => (
        <>
          <p className="mt-2 text-sm leading-relaxed text-nero/70">
            Inserisci il numero d&apos;ordine e l&apos;email usata per
            l&apos;acquisto: ti risponderemo con lo stato della spedizione.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Numero d'ordine (es. #1234)"
              className="border border-nero/20 bg-transparent px-4 py-2.5 text-sm text-nero placeholder:text-nero/40 focus:border-nero focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email dell'ordine"
              className="border border-nero/20 bg-transparent px-4 py-2.5 text-sm text-nero placeholder:text-nero/40 focus:border-nero focus:outline-none"
            />
            <a
              href={buildMailto('Monitora il mio ordine', orderNumber, email)}
              className="border border-nero bg-nero px-5 py-2.5 text-center text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-transparent hover:text-nero"
            >
              Invia
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

  return (
    <FooterPopover label="Reso Online" title="Reso Online">
      {() => (
        <>
          <p className="mt-2 text-sm font-medium text-nero/80">
            Come posso restituire l&apos;articolo?
          </p>
          <p className="mt-1 text-sm leading-relaxed text-nero/70">
            Hai 14 giorni dal ricevimento per richiedere il reso. Il prodotto
            deve essere sigillato e non utilizzato. Inserisci numero d&apos;ordine
            ed email: ti risponderemo entro 48 ore con le istruzioni per la
            spedizione di ritorno.
          </p>
          <div className="mt-4 flex flex-col gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Numero d'ordine (es. #1234)"
              className="border border-nero/20 bg-transparent px-4 py-2.5 text-sm text-nero placeholder:text-nero/40 focus:border-nero focus:outline-none"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email dell'ordine"
              className="border border-nero/20 bg-transparent px-4 py-2.5 text-sm text-nero placeholder:text-nero/40 focus:border-nero focus:outline-none"
            />
            <a
              href={buildMailto(
                'Richiesta di reso',
                orderNumber,
                email,
                'Prodotto/i da restituire: ',
              )}
              className="border border-nero bg-nero px-5 py-2.5 text-center text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-transparent hover:text-nero"
            >
              Invia richiesta
            </a>
          </div>
        </>
      )}
    </FooterPopover>
  );
}

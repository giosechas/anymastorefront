import {toggleNotifyItem, useIsNotifyRequested} from '~/lib/notifyList';

export function NotifyBell({
  productId,
  className = '',
}: {
  productId: string;
  className?: string;
}) {
  const requested = useIsNotifyRequested(productId);

  return (
    <button
      type="button"
      aria-label={
        requested ? 'Annulla avviso disponibilità' : 'Avvisami quando disponibile'
      }
      aria-pressed={requested}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleNotifyItem(productId);
      }}
      className={`z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 backdrop-blur-sm transition-transform hover:scale-110 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={requested ? 'var(--gold)' : 'none'}
        stroke={requested ? 'var(--gold)' : 'var(--nero)'}
        strokeWidth={1.5}
      >
        <path d="M6 10a6 6 0 1 1 12 0c0 3.2 1 5.2 1.8 6.2.3.4 0 1-.5 1H4.7c-.5 0-.8-.6-.5-1C5 15.2 6 13.2 6 10Z" />
        <path d="M10 19.5a2 2 0 0 0 4 0" strokeLinecap="round" />
      </svg>
    </button>
  );
}

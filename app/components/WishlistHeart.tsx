import {useIsWished, toggleWishlistItem, type WishlistItem} from '~/lib/wishlist';

export function WishlistHeart({
  item,
  className = '',
}: {
  item: WishlistItem;
  className?: string;
}) {
  const wished = useIsWished(item.id);

  return (
    <button
      type="button"
      aria-label={wished ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
      aria-pressed={wished}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlistItem(item);
      }}
      className={`z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 backdrop-blur-sm transition-transform hover:scale-110 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill={wished ? 'var(--fuchsia)' : 'none'}
        stroke={wished ? 'var(--fuchsia)' : 'var(--nero)'}
        strokeWidth={1.5}
      >
        <path d="M12 20.5c-.2 0-.4-.07-.55-.2C7.4 17 3 13.14 3 8.9 3 5.9 5.36 3.5 8.3 3.5c1.7 0 3.3.82 4.3 2.14A5.4 5.4 0 0 1 20.7 8.9c0 4.24-4.4 8.1-8.45 11.4-.15.13-.35.2-.55.2Z" />
      </svg>
    </button>
  );
}

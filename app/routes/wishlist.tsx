import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import type {Route} from './+types/wishlist';
import {useWishlist, removeWishlistItem} from '~/lib/wishlist';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Anyma Beauty | Preferiti'}];
};

export default function Wishlist() {
  const items = useWishlist();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
        I tuoi preferiti
      </p>
      <h1 className="font-display text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
        Preferiti
      </h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-sm text-nero/70">
            Non hai ancora salvato nessun prodotto. Tocca il cuore su un
            prodotto per aggiungerlo qui.
          </p>
          <Link
            to="/collections/all"
            className="mt-6 inline-block border border-nero px-6 py-3 text-xs uppercase tracking-[0.2em] text-nero transition-colors hover:bg-nero hover:text-paper"
          >
            Scopri i prodotti
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative">
              <Link to={`/products/${item.handle}`} className="block">
                <div className="aspect-[4/5] bg-nero/5">
                  {item.image && (
                    <img
                      src={item.image.url}
                      alt={item.image.altText ?? item.title}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
                <h4 className="mt-3 text-xs uppercase tracking-[0.05em] text-nero">
                  {item.title}
                </h4>
                {item.price && (
                  <small className="text-xs text-nero/60">
                    <Money data={item.price} />
                  </small>
                )}
              </Link>
              <button
                type="button"
                aria-label="Rimuovi dai preferiti"
                onClick={() => removeWishlistItem(item.id)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 text-fuchsia backdrop-blur-sm transition-transform hover:scale-110"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 20.5c-.2 0-.4-.07-.55-.2C7.4 17 3 13.14 3 8.9 3 5.9 5.36 3.5 8.3 3.5c1.7 0 3.3.82 4.3 2.14A5.4 5.4 0 0 1 20.7 8.9c0 4.24-4.4 8.1-8.45 11.4-.15.13-.35.2-.55.2Z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import {useEffect, useRef, useState} from 'react';
import {ProductItem} from '~/components/ProductItem';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';

const AUTOSCROLL_MS = 2000;
const RESUME_DELAY_MS = 4000;

type CarouselProduct =
  | CollectionItemFragment
  | ProductItemFragment
  | RecommendedProductFragment;

/** Auto-scrolling horizontal product row, shared by the homepage's
 * "featured products" section and the PDP's "you might also like" section. */
export function ProductCarousel({products}: {products: CarouselProduct[]}) {
  const ref = useRef<HTMLDivElement>(null);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const canScrollDown =
        e.deltaY > 0 && el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
      const canScrollUp = e.deltaY < 0 && el.scrollLeft > 0;
      if (canScrollDown || canScrollUp) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', onWheel, {passive: false});
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      // The list is rendered twice back to back — once we've scrolled past
      // one full copy, snap back by exactly that width (instant, and
      // invisible since the content repeats) so it never visibly "resets".
      const setWidth = el.scrollWidth / 2;
      if (el.scrollLeft >= setWidth) {
        el.scrollLeft -= setWidth;
      }
      el.scrollBy({left: 220, behavior: 'smooth'});
    }, AUTOSCROLL_MS);
    return () => clearInterval(id);
  }, [paused]);

  const pauseThenResume = () => {
    setPaused(true);
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => setPaused(false), RESUME_DELAY_MS);
  };

  const scrollByPage = (direction: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({left: direction * el.clientWidth * 0.7, behavior: 'smooth'});
    pauseThenResume();
  };

  if (products.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        aria-label="Prodotti precedenti"
        onClick={() => scrollByPage(-1)}
        className="absolute left-0 top-1/2 z-10 -translate-x-2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-nero/15 bg-paper text-nero shadow-sm transition-colors hover:border-nero"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={ref}
        className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 sm:mx-0 sm:gap-4 sm:px-0"
      >
        {[...products, ...products].map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="w-[65%] shrink-0 sm:w-[36%] lg:w-[29%]"
          >
            <ProductItem product={product} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Altri prodotti"
        onClick={() => scrollByPage(1)}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-2 flex h-9 w-9 items-center justify-center rounded-full border border-nero/15 bg-paper text-nero shadow-sm transition-colors hover:border-nero"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

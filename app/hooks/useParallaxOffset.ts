import {useEffect, useRef, useState} from 'react';

/**
 * Tracks how far an element's center is from the viewport center as the
 * page scrolls, mapped to [-strength, strength]px. Attach the returned
 * ref to the element whose position should drive the parallax, and apply
 * the offset (e.g. `translateY(${offset}px)`) to whatever should move.
 */
export function useParallaxOffset<T extends HTMLElement>(strength = 30) {
  const ref = useRef<T>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let ticking = false;

    const update = () => {
      ticking = false;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const progress = (center - vh / 2) / (vh / 2 + rect.height / 2);
      setOffset(Math.max(-1, Math.min(1, progress)) * strength);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [strength]);

  return {ref, offset};
}

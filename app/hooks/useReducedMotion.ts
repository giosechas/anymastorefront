import {useEffect, useState} from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/** Reactive `prefers-reduced-motion` flag; false during SSR/first paint. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    setReduced(query.matches);
    const onChange = () => setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

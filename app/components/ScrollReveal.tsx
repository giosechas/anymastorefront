import {useEffect, useRef, useState} from 'react';
import {useReducedMotion} from '~/hooks/useReducedMotion';

type Direction = 'up' | 'down' | 'left' | 'right';

const OFFSET_CLASS: Record<Direction, string> = {
  up: 'translate-y-12',
  down: '-translate-y-12',
  left: '-translate-x-12',
  right: 'translate-x-12',
};

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {threshold: 0.15, rootMargin: '0px 0px -10% 0px'},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offsetClass = reducedMotion ? '' : OFFSET_CLASS[direction];

  return (
    <div
      ref={ref}
      className={`transition-[transform,opacity] duration-1000 ease-out ${
        visible
          ? 'translate-x-0 translate-y-0 opacity-100'
          : `opacity-0 ${offsetClass}`
      } ${className}`}
      style={{transitionDelay: `${delay}ms`}}
    >
      {children}
    </div>
  );
}

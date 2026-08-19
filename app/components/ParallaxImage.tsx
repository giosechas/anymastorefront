import {useEffect, useRef, useState} from 'react';

/**
 * Moves the image vertically inside its (overflow-hidden) container as the
 * page scrolls, at a different rate than the page itself — the classic
 * parallax depth effect. `strength` is the max travel in px each direction.
 */
export function ParallaxImage({
  src,
  alt = '',
  className = '',
  strength = 30,
  objectPosition = 'center',
}: {
  src: string;
  alt?: string;
  className?: string;
  strength?: number;
  objectPosition?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const el = containerRef.current;
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

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute left-0 w-full object-cover will-change-transform"
        style={{
          top: '-15%',
          height: '130%',
          objectPosition,
          transform: `translateY(${offset}px)`,
        }}
      />
    </div>
  );
}

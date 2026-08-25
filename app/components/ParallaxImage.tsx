import {useParallaxOffset} from '~/hooks/useParallaxOffset';

/**
 * Moves the image vertically inside its (overflow-hidden) container as the
 * page scrolls, at a different rate than the page itself — the classic
 * parallax depth effect. `strength` is the max travel in px each direction.
 */
export function ParallaxImage({
  src,
  alt = '',
  className = '',
  strength = 60,
  objectPosition = 'center',
}: {
  src: string;
  alt?: string;
  className?: string;
  strength?: number;
  objectPosition?: string;
}) {
  const {ref, offset} = useParallaxOffset<HTMLDivElement>(strength);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="absolute left-0 w-full object-cover will-change-transform"
        style={{
          top: '-30%',
          height: '160%',
          objectPosition,
          transform: `translateY(${offset}px)`,
        }}
      />
    </div>
  );
}

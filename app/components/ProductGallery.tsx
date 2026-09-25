import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';
import {useT} from '~/lib/i18n';

type ImageSlide = {
  kind: 'image';
  id: string;
  image: ProductFragment['images']['nodes'][number];
};
type StaticImageSlide = {
  kind: 'staticImage';
  id: string;
  url: string;
  altText: string;
};
type VideoSlide = {kind: 'video'; id: 'video'; src: string; poster: string};
type Slide = ImageSlide | StaticImageSlide | VideoSlide;

export function ProductGallery({
  images,
  modelPhotos,
  video,
}: {
  images: ProductFragment['images']['nodes'];
  modelPhotos?: {url: string; altText: string}[];
  video?: {src: string; poster: string};
}) {
  // Product shots (open, closed — Shopify's own order) first, then the
  // video as the 3rd slide, then the swatch shot and the model photos.
  const imageSlides: ImageSlide[] = images.map((image) => ({
    kind: 'image',
    id: image.id ?? image.url,
    image,
  }));
  const slides: Slide[] = [
    ...imageSlides.slice(0, 2),
    ...(video ? [{kind: 'video', id: 'video', ...video} as VideoSlide] : []),
    ...imageSlides.slice(2),
    ...(modelPhotos ?? []).map(
      (photo, i): StaticImageSlide => ({
        kind: 'staticImage',
        id: `model-photo-${i}`,
        ...photo,
      }),
    ),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const active = slides[activeIndex] ?? slides[0];
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [isZooming, setIsZooming] = useState(false);

  if (!active) return <div className="aspect-[2/3] bg-nero/5" />;

  const activeAspectRatio =
    active.kind === 'image' && active.image.width && active.image.height
      ? `${active.image.width} / ${active.image.height}`
      : '2 / 3';

  const canZoom = active.kind !== 'video';
  const t = useT();

  function updateZoomOrigin(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!canZoom) return;
    updateZoomOrigin(event);
    setIsZooming((zooming) => !zooming);
  }

  function goTo(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
    setIsZooming(false);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`relative w-full overflow-hidden bg-nero/5 ${
          canZoom ? (isZooming ? 'cursor-zoom-out' : 'cursor-zoom-in') : ''
        }`}
        style={{aspectRatio: activeAspectRatio}}
        onClick={handleClick}
        onMouseMove={canZoom && isZooming ? updateZoomOrigin : undefined}
      >
        {active.kind === 'video' ? (
          <video
            key={active.id}
            src={active.src}
            poster={active.poster}
            autoPlay
            muted
            playsInline
            loop
            className="h-full w-full object-contain"
          />
        ) : active.kind === 'staticImage' ? (
          <img
            key={active.id}
            src={active.url}
            alt={active.altText}
            className="h-full w-full object-cover transition-transform duration-300 ease-out"
            style={{
              transform: isZooming ? 'scale(2)' : 'scale(1)',
              transformOrigin: zoomOrigin,
            }}
          />
        ) : (
          <Image
            data={active.image}
            key={active.id}
            sizes="(min-width: 45em) 50vw, 100vw"
            className="h-full w-full object-contain transition-transform duration-300 ease-out"
            style={{
              transform: isZooming ? 'scale(2)' : 'scale(1)',
              transformOrigin: zoomOrigin,
            }}
          />
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label={t('gallery.previous')}
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-paper/80 text-nero backdrop-blur-sm transition-transform hover:scale-110"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              aria-label={t('gallery.next')}
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-paper/80 text-nero backdrop-blur-sm transition-transform hover:scale-110"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={t('gallery.goTo', i + 1)}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex
                  ? 'w-6 bg-nero'
                  : 'w-1.5 bg-nero/25 hover:bg-nero/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChevronIcon({direction}: {direction: 'left' | 'right'}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';

type ImageSlide = {
  kind: 'image';
  id: string;
  image: ProductFragment['images']['nodes'][number];
};
type StaticImageSlide = {
  kind: 'staticImage';
  id: 'model-photo';
  url: string;
  altText: string;
};
type VideoSlide = {kind: 'video'; id: 'video'; src: string; poster: string};
type Slide = ImageSlide | StaticImageSlide | VideoSlide;

export function ProductGallery({
  images,
  modelPhoto,
  video,
}: {
  images: ProductFragment['images']['nodes'];
  modelPhoto?: {url: string; altText: string};
  video?: {src: string; poster: string};
}) {
  const slides: Slide[] = [
    ...images.map(
      (image): ImageSlide => ({
        kind: 'image',
        id: image.id ?? image.url,
        image,
      }),
    ),
    ...(modelPhoto
      ? [{kind: 'staticImage', id: 'model-photo', ...modelPhoto} as StaticImageSlide]
      : []),
    ...(video ? [{kind: 'video', id: 'video', ...video} as VideoSlide] : []),
  ];

  const [activeId, setActiveId] = useState(slides[0]?.id);
  const active = slides.find((s) => s.id === activeId) ?? slides[0];
  const [zoomOrigin, setZoomOrigin] = useState('50% 50%');
  const [isZooming, setIsZooming] = useState(false);

  if (!active) return <div className="aspect-[2/3] bg-nero/5" />;

  const activeAspectRatio =
    active.kind === 'image' && active.image.width && active.image.height
      ? `${active.image.width} / ${active.image.height}`
      : '2 / 3';

  const canZoom = active.kind !== 'video';

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
  }

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row-reverse">
      <div
        className={`min-w-0 flex-1 overflow-hidden bg-nero/5 ${
          canZoom ? 'sm:cursor-zoom-in' : ''
        }`}
        style={{aspectRatio: activeAspectRatio}}
        onMouseEnter={() => canZoom && setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={canZoom ? handleMouseMove : undefined}
      >
        {active.kind === 'video' ? (
          <video
            key={active.id}
            src={active.src}
            poster={active.poster}
            controls
            playsInline
            loop
            className="h-full w-full object-contain"
          />
        ) : active.kind === 'staticImage' ? (
          <img
            key={active.id}
            src={active.url}
            alt={active.altText}
            className="h-full w-full object-contain transition-transform duration-300 ease-out"
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
      </div>
      {slides.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {slides.map((slide) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveId(slide.id)}
              className={`relative aspect-square w-16 shrink-0 border transition-colors sm:w-20 ${
                slide.id === active.id
                  ? 'border-nero'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {slide.kind === 'video' ? (
                <>
                  <img
                    src={slide.poster}
                    alt="Video"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 text-[10px] text-nero">
                      ▶
                    </span>
                  </span>
                </>
              ) : slide.kind === 'staticImage' ? (
                <img
                  src={slide.url}
                  alt={slide.altText}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Image
                  data={slide.image}
                  sizes="80px"
                  className="h-full w-full object-contain"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

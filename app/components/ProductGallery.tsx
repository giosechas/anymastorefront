import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';

type ImageSlide = {
  kind: 'image';
  id: string;
  image: ProductFragment['images']['nodes'][number];
};
type VideoSlide = {kind: 'video'; id: 'video'; src: string; poster: string};
type Slide = ImageSlide | VideoSlide;

export function ProductGallery({
  images,
  video,
}: {
  images: ProductFragment['images']['nodes'];
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
    ...(video ? [{kind: 'video', id: 'video', ...video} as VideoSlide] : []),
  ];

  const [activeId, setActiveId] = useState(slides[0]?.id);
  const active = slides.find((s) => s.id === activeId) ?? slides[0];

  if (!active) return <div className="aspect-square bg-nero/5" />;

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row-reverse">
      <div className="aspect-square min-w-0 flex-1 bg-nero/5">
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
        ) : (
          <Image
            data={active.image}
            key={active.id}
            aspectRatio="1/1"
            sizes="(min-width: 45em) 50vw, 100vw"
            className="h-full w-full object-contain"
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
              ) : (
                <Image
                  data={slide.image}
                  aspectRatio="1/1"
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

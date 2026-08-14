import {useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductGallery({
  images,
}: {
  images: ProductFragment['images']['nodes'];
}) {
  const [activeId, setActiveId] = useState(images[0]?.id);
  const active = images.find((img) => img.id === activeId) ?? images[0];

  if (!active) return <div className="aspect-square bg-nero/5" />;

  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row-reverse">
      <div className="aspect-square min-w-0 flex-1 bg-nero/5">
        <Image
          data={active}
          key={active.id}
          aspectRatio="1/1"
          sizes="(min-width: 45em) 50vw, 100vw"
          className="h-full w-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveId(img.id)}
              className={`aspect-square w-16 shrink-0 border transition-colors sm:w-20 ${
                img.id === active.id
                  ? 'border-nero'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                data={img}
                aspectRatio="1/1"
                sizes="80px"
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

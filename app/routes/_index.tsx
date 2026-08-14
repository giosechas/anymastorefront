import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense, useEffect, useState} from 'react';
import {Image} from '@shopify/hydrogen';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import {ANIME, type AnimaKey} from '~/lib/animas';
import heroImage1 from '~/assets/images/hero/hero-1.webp';
import heroImage2 from '~/assets/images/hero/hero-2.webp';
import heroImage3 from '~/assets/images/hero/hero-3.webp';
import heroImage4 from '~/assets/images/hero/hero-4.webp';
import heroImage5 from '~/assets/images/hero/hero-5.webp';
import sealPositive from '~/assets/images/seal-y-positive.png';
import sealNegative from '~/assets/images/seal-y-negative.png';
import philosophyTruth from '~/assets/images/philosophy/truth.webp';
import philosophyIdentity from '~/assets/images/philosophy/identity.webp';

const HERO_IMAGES = [heroImage1, heroImage2, heroImage3, heroImage4, heroImage5];
const HERO_ROTATE_MS = 5000;

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Anyma Beauty | Rivela chi sei'},
    {
      name: 'description',
      content:
        'Anyma Beauty — il make-up con personalità. Scegli la tua Anima, poi il colore.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const animeCollections = await context.storefront.query(
    ANIME_COLLECTIONS_QUERY,
  );

  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
    animeCollections,
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}
      <Hero />
      <SealDivider bg="light" />
      <AnimeGrid
        collections={data.animeCollections as Record<AnimaKey, any>}
      />
      <PhilosophySection />
      <BrandStoryTeaser />
      <SealDivider bg="light" />
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate flex min-h-[86vh] flex-col items-center justify-center overflow-hidden bg-nero px-6 text-center text-paper">
      {HERO_IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Le Anime di Anyma Beauty"
          className={`absolute inset-0 -z-10 h-full w-full object-cover object-top transition-opacity duration-1000 ${
            i === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-nero/55" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-nero/70 via-transparent to-nero/20" />
      <p className="mb-6 text-xs uppercase tracking-[0.5em] text-gold">
        Anyma Beauty
      </p>
      <h1 className="font-display max-w-4xl text-balance text-5xl uppercase leading-[1.05] tracking-[0.04em] sm:text-6xl md:text-7xl">
        Rivela chi sei
      </h1>
      <p className="font-display mt-4 text-base italic tracking-[0.1em] text-paper/70 sm:text-lg">
        Reveal your soul
      </p>
      <p className="mt-8 max-w-md text-sm leading-relaxed text-paper/80">
        Non esiste una sola te. Sei sportiva e sensuale, delicata e dominante,
        minimal e audace — a volte tutto questo nella stessa settimana. Il
        pack che scegli oggi è il simbolo di chi sei oggi.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="#anime"
          className="border border-gold px-8 py-3 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold hover:text-nero"
        >
          Scopri le tue Anime
        </a>
        <Link
          to="/pages/about"
          className="px-8 py-3 text-xs uppercase tracking-[0.2em] text-white underline underline-offset-4 transition-colors hover:text-gold"
        >
          La nostra storia
        </Link>
      </div>
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {HERO_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`Immagine ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? 'w-6 bg-gold' : 'w-1.5 bg-paper/40 hover:bg-paper/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function SealDivider({bg}: {bg: 'light' | 'dark'}) {
  const seal = bg === 'light' ? sealPositive : sealNegative;
  const line = bg === 'light' ? 'bg-nero/15' : 'bg-paper/25';
  const container = bg === 'light' ? 'bg-paper' : 'bg-nero';
  return (
    <div
      className={`flex items-center justify-center gap-6 px-6 py-10 ${container}`}
    >
      <span className={`h-px w-16 sm:w-24 ${line}`} />
      <img src={seal} alt="" aria-hidden="true" className="h-8 w-auto sm:h-10" />
      <span className={`h-px w-16 sm:w-24 ${line}`} />
    </div>
  );
}

function AnimeGrid({
  collections,
}: {
  collections: Record<AnimaKey, {handle: string; image: any} | null>;
}) {
  return (
    <section id="anime" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
          Le 6 Anime
        </p>
        <h2 className="font-display text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
          Scegli la tua Anima
        </h2>
        <p className="mx-auto mt-4 whitespace-nowrap text-base text-nero/70">
          Ogni Anima ha la sua estetica. Il pack che scegli non è un contenitore: è un simbolo.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ANIME.map((anima) => {
          const collection = collections?.[anima.key];
          const image = collection?.image;
          return (
            <Link
              key={anima.key}
              to={`/collections/${anima.handle}`}
              className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden p-6 ${anima.swatch}`}
            >
              {image && (
                <Image
                  data={image}
                  aspectRatio="4/5"
                  sizes="(min-width: 64em) 33vw, (min-width: 40em) 50vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="relative">
                <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-paper">
                  {anima.name}
                </h3>
                <p className="mt-1 text-xs text-paper/80">{anima.tagline}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="bg-paper">
      <PhilosophyBlock
        image={philosophyTruth}
        quote="La bellezza non è coerenza."
        subquote="È verità."
      />
      <PhilosophyBlock
        image={philosophyIdentity}
        quote="La personalità"
        subquote="non ha colore."
        reverse
      />
    </section>
  );
}

function PhilosophyBlock({
  image,
  quote,
  subquote,
  reverse,
}: {
  image: string;
  quote: string;
  subquote: string;
  reverse?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div
        className={`aspect-[4/5] sm:aspect-auto ${reverse ? 'sm:order-2' : ''}`}
      >
        <img src={image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center sm:px-16">
        <p className="font-display max-w-md text-balance text-3xl uppercase leading-[1.15] tracking-[0.02em] text-nero sm:text-4xl lg:text-5xl">
          {quote}
          <br />
          <span className="text-gold">{subquote}</span>
        </p>
      </div>
    </div>
  );
}

function BrandStoryTeaser() {
  return (
    <section className="bg-paper px-6 py-20 text-center sm:py-28">
      <blockquote className="font-display mx-auto max-w-2xl text-2xl uppercase tracking-[0.03em] text-nero sm:text-3xl">
        &ldquo;Non esiste una sola te.&rdquo;
      </blockquote>
      <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-nero/70">
        Riveliamo le anime attraverso il make-up. Non vendiamo rossetti.
        Creiamo gli oggetti con cui le persone si raccontano ogni giorno.
      </p>
      <Link
        to="/pages/about"
        className="mt-8 inline-block border-b border-nero pb-1 text-xs uppercase tracking-[0.2em] text-nero hover:text-gold hover:border-gold"
      >
        Scopri la nostra storia
      </Link>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section
      className="mx-auto max-w-6xl px-6 pb-24"
      aria-labelledby="recommended-products"
    >
      <h2
        id="recommended-products"
        className="font-display mb-8 text-center text-2xl uppercase tracking-[0.03em] text-nero"
      >
        Prodotti in evidenza
      </h2>
      <Suspense fallback={<div className="text-center text-sm">Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 sm:mx-0 sm:px-0">
              {response
                ? response.products.nodes.map((product) => (
                    <div
                      key={product.id}
                      className="w-[62%] shrink-0 snap-start sm:w-[38%] lg:w-[23%]"
                    >
                      <ProductItem product={product} />
                    </div>
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

const ANIME_COLLECTIONS_QUERY = `#graphql
  fragment AnimaCollection on Collection {
    id
    handle
    title
    image {
      id
      url
      altText
      width
      height
    }
  }
  query AnimeCollections($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    leopard: collection(handle: "anima-leopard") { ...AnimaCollection }
    panther: collection(handle: "anima-panther") { ...AnimaCollection }
    candyRosa: collection(handle: "anima-candy-rosa") { ...AnimaCollection }
    candyTiffany: collection(handle: "anima-candy-tiffany") { ...AnimaCollection }
    street: collection(handle: "anima-street") { ...AnimaCollection }
    urban: collection(handle: "anima-urban") { ...AnimaCollection }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
    variants(first: 1) {
      nodes {
        id
        availableForSale
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

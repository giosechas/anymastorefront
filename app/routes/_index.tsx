import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense, useEffect, useState} from 'react';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {MockShopNotice} from '~/components/MockShopNotice';
import {ScrollReveal} from '~/components/ScrollReveal';
import {useParallaxOffset} from '~/hooks/useParallaxOffset';
import {
  ANIME,
  getAnimaGalleryImages,
  getPackPath,
  type AnimaDefinition,
} from '~/lib/animas';
import heroImage1 from '~/assets/images/hero/hero-1.webp';
import heroImage2 from '~/assets/images/hero/hero-2.webp';
import heroImage3 from '~/assets/images/hero/hero-3.webp';
import heroImage4 from '~/assets/images/hero/hero-4.webp';
import heroImage5 from '~/assets/images/hero/hero-5.webp';
import heroImage6 from '~/assets/images/hero/hero-6.webp';
import heroImage7 from '~/assets/images/hero/hero-7.webp';
import heroImage8 from '~/assets/images/hero/hero-8.webp';
import sealPositive from '~/assets/images/seal-y-positive.png';
import sealNegative from '~/assets/images/seal-y-negative.png';
import philosophyTruth1 from '~/assets/images/philosophy/pool/truth1.webp';
import philosophyTruth2 from '~/assets/images/philosophy/pool/truth2.webp';
import philosophyTruth3 from '~/assets/images/philosophy/pool/truth3.webp';
import philosophyTruth4 from '~/assets/images/philosophy/pool/truth4.webp';
import philosophyIdentity1 from '~/assets/images/philosophy/pool/identity1.webp';
import philosophyIdentity2 from '~/assets/images/philosophy/pool/identity2.webp';
import philosophyIdentity3 from '~/assets/images/philosophy/pool/identity3.webp';

const PHILOSOPHY_TRUTH_IMAGES = [
  philosophyTruth1,
  philosophyTruth2,
  philosophyTruth3,
  philosophyTruth4,
];
const PHILOSOPHY_IDENTITY_IMAGES = [
  philosophyIdentity1,
  philosophyIdentity2,
  philosophyIdentity3,
];
const PHILOSOPHY_ROTATE_MS = 4000;

const HERO_IMAGES = [
  heroImage1,
  heroImage2,
  heroImage3,
  heroImage4,
  heroImage5,
  heroImage6,
  heroImage7,
  heroImage8,
];
const HERO_ROTATE_MS = 5000;

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Anyma Beauty | Rivela chi sei'},
    {
      name: 'description',
      content:
        'Anyma Beauty — il make-up con personalità. Scegli la tua Anyma, poi il colore.',
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  return {
    isShopLinked: Boolean(context.env.PUBLIC_STORE_DOMAIN),
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
      <AnimeGrid />
      <PhilosophySection />
      <BrandStoryTeaser />
      <SealDivider bg="light" />
      <RecommendedProducts products={data.recommendedProducts} />
      <FoundersSection />
    </div>
  );
}

function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {ref: parallaxRef, offset} = useParallaxOffset<HTMLDivElement>(50);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % HERO_IMAGES.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-nero px-6 py-20 text-center text-paper sm:min-h-[86vh] sm:py-6">
      <div
        ref={parallaxRef}
        className="absolute inset-0 -z-10 h-full w-full overflow-hidden will-change-transform"
        style={{transform: `translateY(${offset}px)`}}
      >
        {HERO_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt="Le Anyme di Anyma Beauty"
            className={`absolute inset-0 h-[130%] w-full object-cover object-center transition-opacity duration-1000 ${
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{top: '-15%'}}
          />
        ))}
      </div>
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
          Scopri le tue Anyme
        </a>
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
    <ScrollReveal
      direction="up"
      className={`flex items-center justify-center gap-6 px-6 py-10 ${container}`}
    >
      <span className={`h-px w-16 sm:w-24 ${line}`} />
      <img src={seal} alt="" aria-hidden="true" className="h-8 w-auto sm:h-10" />
      <span className={`h-px w-16 sm:w-24 ${line}`} />
    </ScrollReveal>
  );
}

function AnimeGrid() {
  return (
    <section id="anime" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
          Le 6 Anyme
        </p>
        <h2 className="font-display text-3xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
          Scegli la tua Anyma
        </h2>
        <p className="mx-auto mt-4 whitespace-nowrap text-base text-nero/70">
          Ogni Anyma ha la sua estetica. Il pack che scegli non è un contenitore: è un simbolo.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ANIME.map((anima) => (
          <AnimaTile key={anima.key} anima={anima} />
        ))}
      </div>
    </section>
  );
}

const ANIMA_TILE_ROTATE_MS = 5000;

function AnimaTile({anima}: {anima: AnimaDefinition}) {
  const images = getAnimaGalleryImages(anima);
  const [activeIndex, setActiveIndex] = useState(0);
  // Randomized per-tile so the 6 tiles don't all flip in sync.
  const [initialDelay] = useState(() => Math.random() * ANIMA_TILE_ROTATE_MS);

  useEffect(() => {
    if (images.length < 2) return;
    let intervalId: ReturnType<typeof setInterval>;
    const nextRandomIndex = (current: number) => {
      if (images.length < 3) return (current + 1) % images.length;
      let next = current;
      while (next === current) next = Math.floor(Math.random() * images.length);
      return next;
    };
    const timeoutId = setTimeout(() => {
      setActiveIndex((i) => nextRandomIndex(i));
      intervalId = setInterval(() => {
        setActiveIndex((i) => nextRandomIndex(i));
      }, ANIMA_TILE_ROTATE_MS);
    }, initialDelay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [images.length, initialDelay]);

  return (
    <div
      className={`group relative aspect-[4/5] overflow-hidden ${anima.swatch}`}
    >
      <Link
        to={`/collections/${anima.handle}`}
        className="absolute inset-0 flex flex-col justify-end p-6"
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              i === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-nero/70 via-nero/5 to-transparent" />
        <div className="relative">
          <h3 className="font-display text-2xl uppercase tracking-[0.05em] text-paper">
            {anima.name}
          </h3>
          <p className="mt-1 text-xs text-paper/80">{anima.tagline}</p>
        </div>
      </Link>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-nero/0 opacity-0 transition-all duration-200 group-hover:bg-nero/40 group-hover:opacity-100">
        <Link
          to={getPackPath(anima)}
          className="pointer-events-auto border border-white bg-nero/80 px-6 py-3 text-xs uppercase tracking-[0.15em] text-white transition-colors hover:bg-nero"
        >
          Compra il Pack
        </Link>
      </div>
    </div>
  );
}

type PhilosophySlide =
  | {kind: 'image'; src: string}
  | {kind: 'video'; src: string; poster: string};

function PhilosophySection() {
  return (
    <section className="bg-paper">
      <PhilosophyBlock
        slides={[
          ...PHILOSOPHY_TRUTH_IMAGES.map(
            (src): PhilosophySlide => ({kind: 'image', src}),
          ),
          {
            kind: 'video',
            src: '/videos/philosophy/truth-beach.mp4',
            poster: '/videos/philosophy/posters/truth-beach.jpg',
          },
        ]}
        quote="La bellezza non è coerenza."
        subquote="È verità."
      />
      <PhilosophyBlock
        slides={[
          ...PHILOSOPHY_IDENTITY_IMAGES.map(
            (src): PhilosophySlide => ({kind: 'image', src}),
          ),
          {
            kind: 'video',
            src: '/videos/philosophy/identity-hand.mp4',
            poster: '/videos/philosophy/posters/identity-hand.jpg',
          },
        ]}
        quote="La personalità"
        subquote="non ha colore."
        reverse
      />
    </section>
  );
}

function PhilosophyBlock({
  slides,
  quote,
  subquote,
  reverse,
}: {
  slides: PhilosophySlide[];
  quote: string;
  subquote: string;
  reverse?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialDelay] = useState(() => Math.random() * PHILOSOPHY_ROTATE_MS);
  const {ref: parallaxRef, offset} = useParallaxOffset<HTMLDivElement>(40);

  useEffect(() => {
    if (slides.length < 2) return;
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
      intervalId = setInterval(() => {
        setActiveIndex((i) => (i + 1) % slides.length);
      }, PHILOSOPHY_ROTATE_MS);
    }, initialDelay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [slides.length, initialDelay]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div
        ref={parallaxRef}
        className={`relative aspect-[3/4] overflow-hidden sm:aspect-auto ${reverse ? 'sm:order-2' : ''}`}
      >
        <div
          className="absolute inset-0 h-[130%] w-full will-change-transform"
          style={{top: '-15%', transform: `translateY(${offset}px)`}}
        >
          {slides.map((slide, i) =>
            slide.kind === 'video' ? (
              <video
                key={slide.src}
                src={slide.src}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <img
                key={slide.src}
                src={slide.src}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ),
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center sm:px-12">
        <p className="font-display max-w-xl text-balance text-5xl uppercase leading-[1.05] tracking-[0.02em] text-nero sm:text-7xl lg:text-8xl">
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
      <ScrollReveal direction="up">
        <blockquote className="font-display mx-auto max-w-2xl text-2xl uppercase tracking-[0.03em] text-nero sm:text-3xl">
          &ldquo;Non esiste una sola te.&rdquo;
        </blockquote>
        <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-nero/70">
          Riveliamo le anyme attraverso il make-up. Non vendiamo rossetti.
          Creiamo gli oggetti con cui le persone si raccontano ogni giorno.
        </p>
        <Link
          to="/about"
          className="mt-8 inline-block border-b border-nero pb-1 text-xs uppercase tracking-[0.2em] text-nero hover:text-gold hover:border-gold"
        >
          Scopri la nostra storia
        </Link>
      </ScrollReveal>
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
      <ScrollReveal direction="up">
        <h2
          id="recommended-products"
          className="font-display mb-8 text-center text-2xl uppercase tracking-[0.03em] text-nero"
        >
          Prodotti in evidenza
        </h2>
      </ScrollReveal>
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

function FoundersSection() {
  return (
    <section className="relative overflow-hidden bg-nero px-6 py-20 text-paper sm:py-28">
      <ScrollReveal direction="up" className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-gold">
          Solo per le prime 800 fondatrici
        </p>
        <h2 className="font-display text-4xl uppercase tracking-[0.03em] sm:text-5xl">
          Diventa Anyma Prima
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-paper/80">
          Chi scegli oggi non è chi sceglierai domani — ma le prime 800 anyme
          che entrano nell'universo ANYMA ricevono privilegi che restano per
          sempre.
        </p>
      </ScrollReveal>

      <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-16">
        <ScrollReveal direction="left" className="text-center sm:text-left">
          <p className="mb-5 text-xs uppercase tracking-[0.2em] text-gold">
            I privilegi delle fondatrici
          </p>
          <ul className="space-y-4 text-sm leading-relaxed text-paper/90">
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="font-display text-base uppercase tracking-[0.02em] text-paper">
                Spedizione gratuita a vita
              </span>
              <span className="text-paper/70">
                su ogni ordine, senza eccezioni.
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="font-display text-base uppercase tracking-[0.02em] text-paper">
                Tessera d'acciaio numerata
              </span>
              <span className="text-paper/70">
                il tuo posto tra le prime 800 anyme.
              </span>
            </li>
          </ul>
        </ScrollReveal>

        <ScrollReveal direction="right" className="text-center sm:text-left">
          <p className="mb-5 text-xs uppercase tracking-[0.2em] text-gold">
            Al tuo primo acquisto
          </p>
          <ul className="space-y-4 text-sm leading-relaxed text-paper/90">
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="font-display text-base uppercase tracking-[0.02em] text-paper">
                15% di benvenuto
              </span>
              <span className="text-paper/70">quando ti registri.</span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="font-display text-base uppercase tracking-[0.02em] text-paper">
                Spedizione gratuita
              </span>
              <span className="text-paper/70">
                sul trittico della tua Anyma.
              </span>
            </li>
            <li className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="font-display text-base uppercase tracking-[0.02em] text-paper">
                Tote Bag in omaggio
              </span>
              <span className="text-paper/70">con ogni trittico.</span>
            </li>
          </ul>
        </ScrollReveal>
      </div>

      <div className="mt-14 text-center">
        <Link
          to="/account/login"
          className="inline-block border border-gold px-10 py-4 text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold hover:text-nero"
        >
          Registrati e rivela la tua Anyma
        </Link>
      </div>
    </section>
  );
}

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

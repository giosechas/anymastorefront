import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/($locale)._index';
import {Suspense, useEffect, useRef, useState} from 'react';
import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {ProductCarousel} from '~/components/ProductCarousel';
import {MockShopNotice} from '~/components/MockShopNotice';
import {ScrollReveal} from '~/components/ScrollReveal';
import {useParallaxOffset} from '~/hooks/useParallaxOffset';
import {getTikTokPosts} from '~/lib/tiktok';
import {getInstagramPosts} from '~/lib/instagram';
import {mergeSocialFeed, type SocialPost} from '~/lib/socialFeed';
import {
  ACTIVE_ANIMAS,
  getAnimaGalleryImages,
  getPackPath,
  getPackPhoto,
  getPackVideo,
  isComingSoonProduct,
  type AnimaDefinition,
} from '~/lib/animas';
import {pickLocale, getLocaleFromParam} from '~/lib/locale';
import {useLocale, useT, useDict} from '~/lib/i18n';
import {TRANSLATIONS} from '~/lib/translations';
import {getOrganizationJsonLd} from '~/lib/structuredData';
import brandStoryBg from '~/assets/images/brand-story/all-models.webp';
import philosophyTruth5 from '~/assets/images/philosophy/pool/truth5.webp';
import philosophyStreetPiazza from '~/assets/images/philosophy/pool/street-piazza.webp';
import philosophyBeachCandyrosa from '~/assets/images/philosophy/pool/beach-candyrosa.webp';
import founderImage1 from '~/assets/images/founders/founder-1.webp';

const PHILOSOPHY_TRUTH_IMAGES = [philosophyTruth5, philosophyStreetPiazza, philosophyBeachCandyrosa];
const PHILOSOPHY_ROTATE_MS = 4000;

// More founder-campaign photos will land here over time — the section
// crossfades through whatever is in this array.
const FOUNDERS_IMAGES = [founderImage1];
const FOUNDERS_ROTATE_MS = 6000;
// Placeholder until real signups are wired in.
const FOUNDERS_REGISTERED = 247;
const FOUNDERS_TOTAL = 800;

const HERO_SLIDES: Array<{kind: 'image' | 'video'; src: string}> = [
  {kind: 'video', src: '/videos/hero/hero-main.mp4'},
];
const HERO_IMAGE_ROTATE_MS = 4000;
const HERO_TEXT_ROTATE_MS = 8000;

export const meta: Route.MetaFunction = ({params}) => {
  const code = getLocaleFromParam(params.locale);
  return [
    {title: TRANSLATIONS[code].meta.homeTitle},
    {
      name: 'description',
      content: TRANSLATIONS[code].meta.homeDescription,
    },
    {
      'script:ld+json': getOrganizationJsonLd(),
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
    .then((data) => {
      if (!data?.products?.nodes) return data;
      const visible = data.products.nodes.filter(
        (p: {tags: string[]}) => !isComingSoonProduct(p.tags),
      );
      return {
        ...data,
        products: {
          ...data.products,
          nodes: diversifyProducts(visible),
        },
      };
    })
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  const socialFeed = Promise.all([
    getInstagramPosts(context.env).catch((err: Error) => {
      console.error(err);
      return [];
    }),
    getTikTokPosts(context.storefront).catch((err: Error) => {
      console.error(err);
      return [];
    }),
  ]).then(([ig, tt]) => mergeSocialFeed(ig, tt, 6));

  return {
    recommendedProducts,
    socialFeed,
  };
}

const RECOMMENDED_DISPLAY_COUNT = 20;

/** "ANYMA LEOPARD · LIPSTICK ROSSO" -> {anima: "LEOPARD", category: "LIPSTICK"} */
function parseProductMeta(title: string) {
  const [animaPart, rest] = title.split('·').map((s) => s.trim());
  return {
    anima: animaPart?.replace(/^ANYMA\s+/i, '') ?? '',
    category: rest?.split(' ')[0] ?? '',
  };
}

function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomizes product order and greedily avoids back-to-back picks from the
 * same anima or category, so the featured row doesn't clump on one soul or
 * one product type.
 */
function diversifyProducts<T extends {title: string}>(nodes: T[]): T[] {
  const pool = shuffle(nodes).map((node) => ({
    node,
    meta: parseProductMeta(node.title),
  }));
  const result: typeof pool = [];

  while (pool.length && result.length < RECOMMENDED_DISPLAY_COUNT) {
    const last = result[result.length - 1];
    let index = pool.findIndex(
      (item) =>
        !last ||
        (item.meta.anima !== last.meta.anima &&
          item.meta.category !== last.meta.category),
    );
    if (index === -1) index = 0;
    result.push(pool.splice(index, 1)[0]);
  }

  return result.map((item) => item.node);
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      {data.isShopLinked ? null : <MockShopNotice />}
      <Hero />
      <div className="my-2 h-[3px] w-full bg-fuchsia sm:my-3" />
      <RecommendedProducts products={data.recommendedProducts} />
      <div className="my-2 h-[3px] w-full bg-fuchsia sm:my-3" />
      <AnimeGrid />
      <PackSection />
      <PhilosophySection />
      <BrandStoryTeaser />
      <SocialSection feed={data.socialFeed} />
      <FoundersSection />
    </div>
  );
}

function Hero() {
  const dict = useDict();
  const t = useT();
  const {href} = useLocale();
  const [activeIndex, setActiveIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const heroSlides = dict.hero.slides;
  const {ref: parallaxRef, offset} = useParallaxOffset<HTMLDivElement>(100);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((i) => {
        if (HERO_SLIDES.length < 3) return (i + 1) % HERO_SLIDES.length;
        let next = i;
        while (next === i) next = Math.floor(Math.random() * HERO_SLIDES.length);
        return next;
      });
    }, HERO_IMAGE_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      setTextIndex((i) => (i + 1) % heroSlides.length);
    }, HERO_TEXT_ROTATE_MS);
    return () => clearInterval(id);
  }, [heroSlides.length]);

  return (
    <section
      data-header-theme="dark"
      className="bleed-under-header relative isolate flex min-h-[70vh] flex-col items-start justify-end overflow-hidden bg-nero px-6 py-20 text-left text-paper sm:min-h-[86vh] sm:py-6"
    >
      <div ref={parallaxRef} className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div
          className="absolute inset-0 h-[160%] w-full will-change-transform"
          style={{top: '-30%', transform: `translateY(${offset}px)`}}
        >
          {HERO_SLIDES.map((slide, i) => (
            slide.kind === 'image' ? (
              <img
                key={`image-${i}`}
                src={slide.src}
                alt="Le ANYMA di Anyma Beauty"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ) : (
              <video
                key={`video-${i}`}
                src={slide.src}
                autoPlay
                muted
                playsInline
                loop
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )
          ))}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-nero/7" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-nero/5 via-nero/27 to-nero/13" />
      <div className="grid max-w-4xl">
        {heroSlides.map((slide, i) => {
          const Tag = i === 0 ? 'h1' : 'p';
          return (
            <div
              key={i}
              className={`col-start-1 row-start-1 transition-opacity ease-in-out ${
                i === textIndex ? 'opacity-100 duration-[1200ms]' : 'pointer-events-none opacity-0 duration-[800ms]'
              }`}
            >
              <Tag className="font-display text-balance text-[18px] uppercase leading-[1.05] tracking-[0.04em] text-fuchsia [text-shadow:0_2px_10px_rgba(0,0,0,0.35)] sm:text-[30px] md:text-[42px]">
                {slide}
              </Tag>
            </div>
          );
        })}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-start gap-4">
        <Link
          to={href('/collections/all')}
          className="border border-gold bg-gold px-8 py-3 text-xs uppercase tracking-[0.2em] text-nero transition-colors hover:bg-white hover:border-white"
        >
          {t('hero.shopNow')}
        </Link>
        <a
          href="#anime"
          className="border border-white bg-white px-8 py-3 text-xs uppercase tracking-[0.2em] text-nero transition-colors hover:border-fuchsia hover:bg-fuchsia hover:text-white"
        >
          {dict.hero.rotatingCta[textIndex % dict.hero.rotatingCta.length]}
        </a>
      </div>
      {HERO_SLIDES.length > 1 && (
        <div className="absolute bottom-8 right-6 flex items-center gap-3">
          <span className="text-[10px] tracking-[0.2em] text-paper/80">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <div className="relative h-px w-24 overflow-hidden bg-paper/25">
            <div
              className="absolute inset-y-0 left-0 bg-gold transition-all duration-500"
              style={{
                width: `${((activeIndex + 1) / HERO_SLIDES.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-[10px] tracking-[0.2em] text-paper/40">
            {String(HERO_SLIDES.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </section>
  );
}

function AnimeGrid() {
  const t = useT();
  const {href} = useLocale();
  return (
    <section id="anime" className="mx-auto max-w-6xl px-6 py-12 sm:py-28">
      <div className="mb-8 text-center sm:mb-12">
        <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
          {t('animaGrid.le6Anyme')}
        </p>
        <h2 className="font-display text-2xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
          {t('animaGrid.scegliLaTuaAnyma')}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-nero/70 sm:max-w-none sm:text-base sm:whitespace-nowrap">
          {t('animaGrid.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {ACTIVE_ANIMAS.map((anima) => (
          <AnimaTile key={anima.key} anima={anima} />
        ))}
        <Link
          to={href('/prossimamente')}
          className="group relative flex aspect-[4/5] flex-col items-center justify-center overflow-hidden p-6 text-center"
          style={{background: 'linear-gradient(to bottom right, #231F20, #C8A96E)'}}
        >
          <h3 className="font-display text-xl uppercase tracking-[0.1em] text-paper sm:text-2xl">
            {t('animaGrid.comingSoonTitle')}
          </h3>
          <p className="mt-3 max-w-[200px] text-xs leading-relaxed text-paper/70 sm:text-sm">
            {t('animaGrid.comingSoonSubtitle')}
          </p>
          <span className="mt-5 text-2xl text-paper/60 transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}

const ANIMA_TILE_ROTATE_MS = 5000;

function AnimaTile({anima}: {anima: AnimaDefinition}) {
  const images = getAnimaGalleryImages(anima);
  const {href} = useLocale();
  const t = useT();
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialDelay] = useState(() => Math.random() * ANIMA_TILE_ROTATE_MS);
  const hoverOnlyRotate = anima.key === 'candyRosa';

  useEffect(() => {
    if (images.length < 2 || hoverOnlyRotate) return;
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
  }, [images.length, initialDelay, hoverOnlyRotate]);

  const handleMouseEnter = hoverOnlyRotate
    ? () => setActiveIndex((i) => (i + 1) % images.length)
    : undefined;

  return (
    <div
      className={`group relative aspect-[4/5] overflow-hidden ${anima.swatch}`}
      onMouseEnter={handleMouseEnter}
    >
      <Link
        to={href(`/collections/${anima.handle}`)}
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
        </div>
      </Link>
    </div>
  );
}

function PackSection() {
  const t = useT();
  const {href} = useLocale();
  return (
    <section
      className="bg-paper py-12 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10 text-center sm:mb-16">
          <h2 className="font-display text-2xl uppercase tracking-[0.03em] text-nero sm:text-4xl">
            {t('packSection.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-nero/70 sm:text-base">
            {t('packSection.subtitle')}
          </p>
        </div>
        <div className="space-y-10 sm:space-y-16">
          {ACTIVE_ANIMAS.map((anima, i) => (
            <div
              key={anima.key}
              className={`flex gap-2 sm:gap-6 ${
                i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              <div className="relative aspect-[4/5] w-1/2 overflow-hidden">
                <img
                  src={getPackPhoto(anima)}
                  alt={anima.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-nero/70 via-nero/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center p-3 pb-4 text-center sm:p-6 sm:pb-8">
                  <h3 className="font-display text-lg uppercase tracking-[0.05em] text-paper sm:text-4xl">
                    {anima.name}
                  </h3>
                  <Link
                    to={href(getPackPath(anima))}
                    className="mt-2 border border-gold bg-gold px-3 py-1.5 text-[8px] uppercase tracking-[0.15em] text-nero transition-colors hover:bg-white hover:border-white sm:mt-4 sm:px-6 sm:py-2.5 sm:text-[10px]"
                  >
                    {t('packSection.cta')}
                  </Link>
                </div>
              </div>
              <div className="aspect-[4/5] w-1/2 overflow-hidden">
                <video
                  src={getPackVideo(anima)}
                  autoPlay
                  muted
                  playsInline
                  loop
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type PhilosophySlide =
  | {kind: 'image'; src: string}
  | {kind: 'video'; src: string; poster: string};

function PhilosophySection() {
  const t = useT();
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
        quote={t('philosophy.truthQuote')}
        subquote={t('philosophy.truthSubquote')}
      />
    </section>
  );
}

function PhilosophyBlock({
  slides,
  quote,
  subquote,
  accent = 'gold',
  reverse,
}: {
  slides: PhilosophySlide[];
  quote: string;
  subquote: string;
  accent?: 'gold' | 'fuchsia';
  reverse?: boolean;
}) {
  const [{current: activeIndex, prev: prevIndex}, setIndices] = useState<{
    current: number;
    prev: number | null;
  }>({current: 0, prev: null});
  const [initialDelay] = useState(() => Math.random() * PHILOSOPHY_ROTATE_MS);

  useEffect(() => {
    if (slides.length < 2) return;
    let intervalId: ReturnType<typeof setInterval>;
    const advance = () =>
      setIndices(({current}) => ({
        current: (current + 1) % slides.length,
        prev: current,
      }));
    const timeoutId = setTimeout(() => {
      advance();
      intervalId = setInterval(advance, PHILOSOPHY_ROTATE_MS);
    }, initialDelay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [slides.length, initialDelay]);

  // "Push" carousel: the active slide sits at 0%, the slide it replaced
  // slides out to -100%, and every other slide is parked at +100% ready
  // to push in from the right on its turn.
  function slideX(i: number) {
    if (i === activeIndex) return 0;
    if (i === prevIndex) return -100;
    return 100;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div
        className={`relative aspect-[9/16] overflow-hidden ${reverse ? 'sm:order-2' : ''}`}
      >
        <div className="absolute inset-0 h-full w-full">
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
                style={{
                  transform: `translateX(${slideX(i)}%)`,
                  transition:
                    i === activeIndex || i === prevIndex
                      ? 'transform 700ms ease-in-out'
                      : 'none',
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <img
                key={slide.src}
                src={slide.src}
                alt=""
                style={{
                  transform: `translateX(${slideX(i)}%)`,
                  transition:
                    i === activeIndex || i === prevIndex
                      ? 'transform 700ms ease-in-out'
                      : 'none',
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ),
          )}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-8 py-10 text-center sm:px-12 sm:py-16">
        <p className="font-display max-w-xl text-balance text-[17px] uppercase leading-[1.05] tracking-[0.02em] text-nero sm:text-[41px] lg:text-[53px]">
          {quote}
          <br />
          <span className={accent === 'fuchsia' ? 'text-fuchsia' : 'text-gold'}>
            {subquote}
          </span>
        </p>
      </div>
    </div>
  );
}

function BrandStoryTeaser() {
  const t = useT();
  const {href} = useLocale();
  return (
    <section
      data-header-theme="dark"
      className="relative isolate overflow-hidden px-6 py-28 text-center sm:py-48"
    >
      <img
        src={brandStoryBg}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 -z-10 bg-nero/55" />
      <ScrollReveal direction="up">
        <blockquote className="font-display mx-auto max-w-2xl text-2xl uppercase tracking-[0.03em] text-paper sm:text-3xl">
          <span className="text-fuchsia">&ldquo;</span>
          {t('brandStory.quote')}
          <span className="text-fuchsia">&rdquo;</span>
        </blockquote>
        <p className="mx-auto mt-6 max-w-xl text-[9px] leading-relaxed text-paper/80">
          {t('brandStory.body')}
        </p>
        <Link
          to={href('/about')}
          className="mt-8 inline-block border-b border-paper pb-1 text-xs uppercase tracking-[0.2em] text-paper hover:text-gold hover:border-gold"
        >
          {t('brandStory.cta')}
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
      className="mx-auto max-w-6xl px-6 py-12 sm:py-16"
      aria-label="Prodotti in evidenza"
    >
      <Suspense fallback={<div className="text-center text-sm">Loading...</div>}>
        <Await resolve={products}>
          {(response) => {
            if (!response) return null;
            return <ProductCarousel products={response.products.nodes} rotateLabels />;
          }}
        </Await>
      </Suspense>
    </section>
  );
}

const TIKTOK_HANDLE = '@anyma.beauty';
const TIKTOK_URL = 'https://www.tiktok.com/@anyma.beauty';
const INSTAGRAM_HANDLE = '@anyma_beauty';
const INSTAGRAM_URL = 'https://www.instagram.com/anyma_beauty/';

function SocialSection({feed}: {feed: Promise<SocialPost[]>}) {
  const t = useT();

  return (
    <section className="overflow-hidden bg-nero px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal direction="up">
          <div className="mb-10 text-center sm:mb-14">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-gold">
              {t('social.seguici')}
            </p>
            <h2 className="font-display text-3xl uppercase tracking-[0.03em] text-paper sm:text-4xl">
              {t('social.guardaciSu')}{' '}
              <span className="text-fuchsia">TikTok</span> &{' '}
              <span className="text-fuchsia">Instagram</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper/70">
              {t('social.body')}
            </p>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('social.segui', TIKTOK_HANDLE)}
                className="inline-flex items-center gap-2 border border-paper px-6 py-3 text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-paper hover:text-nero"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M16.6 5.82c-.9-.86-1.47-2.03-1.6-3.32h-3.02v13.9c0 1.7-1.38 3.08-3.08 3.08a3.08 3.08 0 0 1-1.13-5.95 3.06 3.06 0 0 1 1.13-.21c.28 0 .55.03.81.09v-3.1a6.1 6.1 0 0 0-.81-.05A6.1 6.1 0 0 0 3.28 16.5 6.1 6.1 0 0 0 8.9 22.6a6.1 6.1 0 0 0 6.1-6.1V8.94a8.2 8.2 0 0 0 4.8 1.53V7.45c-1.13 0-2.19-.35-3.2-1.63Z" />
                </svg>
                {t('social.segui', TIKTOK_HANDLE)}
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('instagram.segui', INSTAGRAM_HANDLE)}
                className="inline-flex items-center gap-2 border border-paper px-6 py-3 text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-paper hover:text-nero"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
                </svg>
                {t('instagram.segui', INSTAGRAM_HANDLE)}
              </a>
            </div>
          </div>
        </ScrollReveal>

        <Suspense fallback={null}>
          <Await resolve={feed}>
            {(posts) => {
              if (!posts || posts.length === 0) return null;
              return <SocialGrid posts={posts} />;
            }}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

function SocialGrid({posts}: {posts: SocialPost[]}) {
  return (
    <>
      {/* Mobile: horizontal scroll-snap carousel */}
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4 sm:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {posts.map((post) => (
          <SocialCard key={post.id} post={post} className="w-[70vw] flex-shrink-0 snap-start" />
        ))}
      </div>
      {/* Desktop: 3-col grid */}
      <div className="hidden gap-3 sm:grid sm:grid-cols-3">
        {posts.map((post) => (
          <SocialCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

function SocialCard({post, className = ''}: {post: SocialPost; className?: string}) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative aspect-square overflow-hidden rounded bg-paper/10 ${className}`}
    >
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-nero">
          <svg viewBox="0 0 24 24" className="h-10 w-10 text-paper/30" fill="currentColor">
            <path d="M16.6 5.82c-.9-.86-1.47-2.03-1.6-3.32h-3.02v13.9c0 1.7-1.38 3.08-3.08 3.08a3.08 3.08 0 0 1-1.13-5.95 3.06 3.06 0 0 1 1.13-.21c.28 0 .55.03.81.09v-3.1a6.1 6.1 0 0 0-.81-.05A6.1 6.1 0 0 0 3.28 16.5 6.1 6.1 0 0 0 8.9 22.6a6.1 6.1 0 0 0 6.1-6.1V8.94a8.2 8.2 0 0 0 4.8 1.53V7.45c-1.13 0-2.19-.35-3.2-1.63Z" />
          </svg>
        </div>
      )}
      <div className="absolute inset-0 bg-nero/0 transition-colors duration-300 group-hover:bg-nero/20" />
      {/* Network badge */}
      <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-nero/60 text-paper backdrop-blur-sm">
        {post.source === 'tiktok' ? (
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M16.6 5.82c-.9-.86-1.47-2.03-1.6-3.32h-3.02v13.9c0 1.7-1.38 3.08-3.08 3.08a3.08 3.08 0 0 1-1.13-5.95 3.06 3.06 0 0 1 1.13-.21c.28 0 .55.03.81.09v-3.1a6.1 6.1 0 0 0-.81-.05A6.1 6.1 0 0 0 3.28 16.5 6.1 6.1 0 0 0 8.9 22.6a6.1 6.1 0 0 0 6.1-6.1V8.94a8.2 8.2 0 0 0 4.8 1.53V7.45c-1.13 0-2.19-.35-3.2-1.63Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
          </svg>
        )}
      </span>
    </a>
  );
}

function FoundersSection() {
  const t = useT();
  const [activeIndex, setActiveIndex] = useState(0);
  const {ref: parallaxRef, offset} = useParallaxOffset<HTMLDivElement>(90);

  useEffect(() => {
    if (FOUNDERS_IMAGES.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % FOUNDERS_IMAGES.length);
    }, FOUNDERS_ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      data-header-theme="dark"
      className="relative isolate flex items-end overflow-hidden bg-nero text-paper"
    >
      <div ref={parallaxRef} className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
        <div
          className="absolute inset-0 h-[160%] w-full will-change-transform"
          style={{top: '-30%', transform: `translateY(${offset}px)`}}
        >
          {FOUNDERS_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ${
                i === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-nero/20" />

      <ScrollReveal
        direction="up"
        className="w-full px-6 py-8 sm:px-10 sm:py-10"
      >
        <p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-fuchsia">
          {t('founders.postiLimitati')}
        </p>
        <h2 className="font-display text-xl uppercase tracking-[0.03em] sm:text-2xl">
          {t('founders.title')}
        </h2>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-paper/80">
          {t('founders.subtitle')}
        </p>

        <div className="mt-4 max-w-sm">
          <FoundersCounter />
        </div>

        <FoundersEmailForm />
      </ScrollReveal>
    </section>
  );
}

function FoundersCounter() {
  const t = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const pct = Math.round((FOUNDERS_REGISTERED / FOUNDERS_TOTAL) * 100);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setVisible(true);
        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          setCount(Math.round(progress * FOUNDERS_REGISTERED));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      {threshold: 0.4},
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <p className="flex items-baseline gap-2">
        <span className="font-display text-3xl text-fuchsia">{count}</span>
        <span className="text-xs uppercase tracking-[0.15em] text-paper/70">
          {t('founders.countOf', FOUNDERS_TOTAL)}
        </span>
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-paper/15">
        <div
          className="h-full rounded-full bg-fuchsia transition-all duration-1000 ease-out"
          style={{width: `${visible ? pct : 0}%`}}
        />
      </div>
    </div>
  );
}

function FoundersEmailForm() {
  const t = useT();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="mt-8 text-sm uppercase tracking-[0.1em] text-gold">
        {t('founders.thanks')}
      </p>
    );
  }

  return (
    <form
      className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('founders.emailPlaceholder')}
        className="w-full border border-paper/30 bg-transparent px-3 py-2 text-xs text-paper placeholder:text-paper/50 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        className="whitespace-nowrap border border-gold px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-gold hover:text-nero"
      >
        {t('founders.reserveSpot')}
      </button>
    </form>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    productType
    tags
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
    images(first: 4) {
      nodes {
        id
        url
        altText
        width
        height
      }
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
    products(first: 40, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;

import type {LocaleCode} from '~/lib/locale';
import {getCategoryLabel, getColorLabel} from '~/lib/productCopy';

const ORIGIN = 'https://anyma-beauty.com';

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ANYMA BEAUTY S.R.L.',
    url: ORIGIN,
    logo: `${ORIGIN}/images/anyma-logo-wordmark.png`,
    sameAs: [
      'https://www.instagram.com/anyma_beauty/',
      'https://www.tiktok.com/@anyma.beauty',
      'https://www.youtube.com/@anymabeauty',
      'https://www.facebook.com/share/1Cg45D3Q3J/',
    ],
  };
}

export function getBreadcrumbJsonLd(
  items: {name: string; url: string}[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getPdpBreadcrumbs(
  locale: LocaleCode,
  localePrefix: string,
  productType: string,
  colorTag: string | undefined,
  animaName: string | undefined,
  productHandle: string,
) {
  const prefix = localePrefix ? `${ORIGIN}/${localePrefix}` : ORIGIN;
  const category = getCategoryLabel(productType, locale);
  const color = colorTag ? getColorLabel(colorTag, locale) : '';
  const productName = color ? `${category} - ${color}` : category;

  const items = [
    {name: 'Anyma Beauty', url: ORIGIN},
    {name: locale === 'EN' ? 'All Products' : locale === 'ES' ? 'Todos los Productos' : 'Tutti i Prodotti', url: `${prefix}/collections/all`},
  ];

  if (animaName) {
    items.push({
      name: `Anyma ${animaName}`,
      url: `${prefix}/collections/anima-${animaName.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }

  items.push({
    name: productName,
    url: `${prefix}/products/${productHandle}`,
  });

  return getBreadcrumbJsonLd(items);
}

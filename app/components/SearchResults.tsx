import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';
import {useLocale, useT} from '~/lib/i18n';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  const {href} = useLocale();
  const t = useT();
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>{t('search.articoli')}</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: href(`/blogs/${article.handle}`),
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  const {href} = useLocale();
  const t = useT();
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>{t('search.pagine')}</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: href(`/pages/${page.handle}`),
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  const {href} = useLocale();
  const t = useT();
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>{t('search.prodotti')}</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: href(`/products/${product.handle}`),
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <Link
                className="search-results-item"
                key={product.id}
                prefetch="intent"
                to={productUrl}
              >
                {image && (
                  <Image data={image} alt={product.title} sizes="200px" />
                )}
                <p>{product.title}</p>
                <small>{price && <Money data={price} />}</small>
              </Link>
            );
          });

          return (
            <>
              <div className="search-results-pagination">
                <PreviousLink>
                  {isLoading ? t('search.caricamento') : <span>{t('search.precedenti')}</span>}
                </PreviousLink>
              </div>
              <div className="search-results-grid">{ItemsMarkup}</div>
              <div className="search-results-pagination">
                <NextLink>
                  {isLoading ? t('search.caricamento') : <span>{t('search.altriProdotti')}</span>}
                </NextLink>
              </div>
            </>
          );
        }}
      </Pagination>
    </div>
  );
}

function SearchResultsEmpty() {
  const t = useT();
  return (
    <p className="mt-10 text-sm text-nero/60">
      {t('search.nessunRisultatoGenerico')}
    </p>
  );
}

import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';
import {useLocale} from '~/lib/i18n';

export function useVariantUrl(
  handle: string,
  selectedOptions?: SelectedOption[],
) {
  const {href} = useLocale();

  return useMemo(() => {
    return getVariantUrl({handle, href, selectedOptions});
  }, [handle, selectedOptions, href]);
}

export function getVariantUrl({
  handle,
  href,
  selectedOptions,
}: {
  handle: string;
  href: (path: string) => string;
  selectedOptions?: SelectedOption[];
}) {
  const path = href(`/products/${handle}`);
  const searchParams = new URLSearchParams();

  selectedOptions?.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}

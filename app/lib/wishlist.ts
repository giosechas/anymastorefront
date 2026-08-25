import {useSyncExternalStore} from 'react';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';

export type WishlistItem = {
  id: string;
  handle: string;
  title: string;
  image?: {url: string; altText?: string | null} | null;
  price?: {amount: string; currencyCode: CurrencyCode} | null;
};

const STORAGE_KEY = 'anyma-wishlist';
const CHANGE_EVENT = 'anyma-wishlist-change';

function read(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishlistItem[]) : [];
  } catch {
    return [];
  }
}

function write(items: WishlistItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function toggleWishlistItem(item: WishlistItem): boolean {
  const items = read();
  const index = items.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    items.splice(index, 1);
    write(items);
    return false;
  }
  items.push(item);
  write(items);
  return true;
}

export function removeWishlistItem(id: string) {
  write(read().filter((i) => i.id !== id));
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot() {
  if (typeof window === 'undefined') return '[]';
  return window.localStorage.getItem(STORAGE_KEY) ?? '[]';
}

function getServerSnapshot() {
  return '[]';
}

/** Reactive wishlist, backed by localStorage — no account/backend needed. */
export function useWishlist(): WishlistItem[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  try {
    return JSON.parse(raw) as WishlistItem[];
  } catch {
    return [];
  }
}

export function useIsWished(id: string): boolean {
  const items = useWishlist();
  return items.some((i) => i.id === id);
}

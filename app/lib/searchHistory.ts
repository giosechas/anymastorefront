import {useSyncExternalStore} from 'react';

const STORAGE_KEY = 'anyma-search-history';
const CHANGE_EVENT = 'anyma-search-history-change';
const MAX_TERMS = 8;

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(terms: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(terms));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

export function addSearchTerm(term: string) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const deduped = read().filter(
    (t) => t.toLowerCase() !== trimmed.toLowerCase(),
  );
  write([trimmed, ...deduped].slice(0, MAX_TERMS));
}

export function removeSearchTerm(term: string) {
  write(read().filter((t) => t !== term));
}

export function clearSearchHistory() {
  write([]);
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

/** Reactive recent-search list, backed by localStorage. */
export function useSearchHistory(): string[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

import {useSyncExternalStore} from 'react';

const STORAGE_KEY = 'anyma-notify-list';
const CHANGE_EVENT = 'anyma-notify-list-change';

function read(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

/** Toggles a "notify me when back in stock" flag for a product id. */
export function toggleNotifyItem(id: string): boolean {
  const ids = read();
  const index = ids.indexOf(id);
  if (index >= 0) {
    ids.splice(index, 1);
    write(ids);
    return false;
  }
  ids.push(id);
  write(ids);
  return true;
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

/** Whether the visitor has asked to be notified when this product is back in stock. */
export function useIsNotifyRequested(id: string): boolean {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  try {
    return (JSON.parse(raw) as string[]).includes(id);
  } catch {
    return false;
  }
}

const SHOPIFY_CDN = 'cdn.shopify.com';

export function emailImageUrl(src: string): string {
  if (!src) return '';
  try {
    const u = new URL(src);
    if (!u.hostname.endsWith(SHOPIFY_CDN)) return '';
    if (u.pathname.endsWith('.svg')) return '';
    u.searchParams.set('width', '320');
    u.searchParams.set('crop', 'center');
    return u.toString();
  } catch {
    return '';
  }
}

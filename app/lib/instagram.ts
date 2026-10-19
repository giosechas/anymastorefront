/**
 * Instagram feed via the Instagram Graph API (Basic Display / long-lived token).
 *
 * The token (INSTAGRAM_ACCESS_TOKEN) lasts 60 days and must be refreshed
 * manually — see INSTAGRAM_TOKEN.md at the repo root for instructions.
 *
 * Server-side only: called from route loaders, never from client components.
 */

const GRAPH_URL = 'https://graph.instagram.com/me/media';
const FIELDS =
  'id,media_type,media_url,thumbnail_url,permalink,caption,timestamp';
const LIMIT = 6;
const CACHE_TTL_MS = 45 * 60 * 1000; // 45 min

export interface InstagramPost {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  imageUrl: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

let cachedPosts: InstagramPost[] | null = null;
let cacheTime = 0;

export async function getInstagramPosts(
  env: Env,
): Promise<InstagramPost[]> {
  const now = Date.now();
  if (cachedPosts && now - cacheTime < CACHE_TTL_MS) {
    return cachedPosts;
  }

  const token = env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const url = `${GRAPH_URL}?fields=${FIELDS}&limit=${LIMIT}&access_token=${token}`;
    const res = await fetch(url);

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as {
        error?: {code?: number; type?: string; message?: string};
      };
      const code = body.error?.code;
      if (code === 190 || code === 102) {
        console.error(
          '[Instagram] Token expired or invalid — regenerate it. See INSTAGRAM_TOKEN.md.',
          body.error?.message,
        );
      } else {
        console.error('[Instagram] API error', res.status, body);
      }
      return cachedPosts ?? [];
    }

    const data = (await res.json()) as {
      data?: Array<{
        id: string;
        media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
        media_url?: string;
        thumbnail_url?: string;
        permalink: string;
        caption?: string;
        timestamp: string;
      }>;
    };

    const posts: InstagramPost[] = (data.data ?? []).map((item) => ({
      id: item.id,
      mediaType: item.media_type,
      imageUrl:
        item.media_type === 'VIDEO'
          ? (item.thumbnail_url ?? item.media_url ?? '')
          : (item.media_url ?? ''),
      permalink: item.permalink,
      caption: item.caption ?? '',
      timestamp: item.timestamp,
    }));

    cachedPosts = posts;
    cacheTime = now;
    return posts;
  } catch (err) {
    console.error('[Instagram] fetch failed', err);
    return cachedPosts ?? [];
  }
}

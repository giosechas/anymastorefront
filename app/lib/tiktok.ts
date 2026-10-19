/**
 * TikTok feed via Shopify metaobjects (type "social_video") + oEmbed thumbnails.
 *
 * Videos are added manually in Shopify admin as metaobject entries with fields:
 *   - url: the TikTok video URL
 *   - published_at: date/time for sorting
 *   - title: optional description
 *
 * Thumbnails come from TikTok's public oEmbed endpoint and are cached ~60 min
 * because the image URLs expire.
 *
 * Server-side only: called from route loaders.
 */

import type {Storefront} from '@shopify/hydrogen';

const OEMBED_URL = 'https://www.tiktok.com/oembed';
const OEMBED_CACHE_TTL_MS = 60 * 60 * 1000; // 60 min

export interface TikTokPost {
  id: string;
  permalink: string;
  imageUrl: string;
  title: string;
  timestamp: string;
}

const oembedCache = new Map<string, {imageUrl: string; fetchedAt: number}>();

async function fetchOEmbedThumbnail(videoUrl: string): Promise<string> {
  const cached = oembedCache.get(videoUrl);
  if (cached && Date.now() - cached.fetchedAt < OEMBED_CACHE_TTL_MS) {
    return cached.imageUrl;
  }

  try {
    const res = await fetch(
      `${OEMBED_URL}?url=${encodeURIComponent(videoUrl)}`,
    );
    if (!res.ok) return '';

    const data = (await res.json()) as {thumbnail_url?: string};
    const imageUrl = data.thumbnail_url ?? '';

    if (imageUrl) {
      oembedCache.set(videoUrl, {imageUrl, fetchedAt: Date.now()});
    }
    return imageUrl;
  } catch {
    return '';
  }
}

export async function getTikTokPosts(
  storefront: Storefront,
): Promise<TikTokPost[]> {
  try {
    const {metaobjects} = await storefront.query(SOCIAL_VIDEOS_QUERY);
    if (!metaobjects?.nodes?.length) return [];

    const entries: Array<{
      id: string;
      url: string;
      publishedAt: string;
      title: string;
    }> = [];

    for (const node of metaobjects.nodes) {
      const fields = node.fields as Array<{key: string; value: string | null}>;
      const urlField = fields.find((f) => f.key === 'url')?.value;
      const publishedAt =
        fields.find((f) => f.key === 'published_at')?.value ?? '';
      const title = fields.find((f) => f.key === 'title')?.value ?? '';

      if (urlField) {
        entries.push({id: node.id, url: urlField, publishedAt, title});
      }
    }

    entries.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

    const posts = await Promise.all(
      entries.map(async (entry): Promise<TikTokPost> => {
        const imageUrl = await fetchOEmbedThumbnail(entry.url);
        return {
          id: entry.id,
          permalink: entry.url,
          imageUrl,
          title: entry.title,
          timestamp: entry.publishedAt,
        };
      }),
    );

    return posts;
  } catch (err) {
    console.error('[TikTok] metaobject query failed', err);
    return [];
  }
}

const SOCIAL_VIDEOS_QUERY = `#graphql
  query SocialVideos($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    metaobjects(type: "social_video", first: 20) {
      nodes {
        id
        fields {
          key
          value
        }
      }
    }
  }
` as const;

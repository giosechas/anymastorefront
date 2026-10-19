/**
 * Merges Instagram and TikTok posts into a single feed sorted by date.
 * Server-side only.
 */

import type {InstagramPost} from './instagram';
import type {TikTokPost} from './tiktok';

export interface SocialPost {
  id: string;
  source: 'instagram' | 'tiktok';
  imageUrl: string;
  permalink: string;
  timestamp: string;
}

export function mergeSocialFeed(
  igPosts: InstagramPost[],
  ttPosts: TikTokPost[],
  limit = 6,
): SocialPost[] {
  const merged: SocialPost[] = [
    ...igPosts.map(
      (p): SocialPost => ({
        id: `ig-${p.id}`,
        source: 'instagram',
        imageUrl: p.imageUrl,
        permalink: p.permalink,
        timestamp: p.timestamp,
      }),
    ),
    ...ttPosts.map(
      (p): SocialPost => ({
        id: `tt-${p.id}`,
        source: 'tiktok',
        imageUrl: p.imageUrl,
        permalink: p.permalink,
        timestamp: p.timestamp,
      }),
    ),
  ];

  merged.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return merged.slice(0, limit);
}

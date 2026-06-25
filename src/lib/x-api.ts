import { LIST_IDS } from "./lists";

type XMedia = {
  media_key: string;
  type?: string;
  url?: string;
  preview_image_url?: string;
  variants?: Array<{
    url?: string;
    content_type?: string;
    bit_rate?: number;
  }>;
};

type XTweet = {
  id: string;
  text: string;
  created_at?: string;
  note_tweet?: { text?: string };
  attachments?: { media_keys?: string[] };
};

type XListTweetsResponse = {
  data?: XTweet[];
  includes?: { media?: XMedia[] };
  errors?: Array<{ detail?: string; title?: string }>;
};

export type TweetMedia = {
  type: "photo" | "video" | "animated_gif";
  imageUrl?: string;
  videoUrl?: string;
};

export type FeedTweet = {
  id: string;
  text: string;
  createdAt: string;
  media: TweetMedia[];
};

function authHeader(): string | null {
  const userToken = process.env.X_USER_ACCESS_TOKEN;
  if (userToken) return `Bearer ${userToken}`;
  const bearer = process.env.X_BEARER_TOKEN;
  if (bearer) return `Bearer ${bearer}`;
  return null;
}

function mediaUrl(media: XMedia): TweetMedia {
  const type = (media.type ?? "photo") as TweetMedia["type"];
  if (type === "photo") {
    return { type, imageUrl: media.url ?? media.preview_image_url };
  }

  const mp4 =
    media.variants
      ?.filter((v) => v.content_type === "video/mp4" && v.url)
      .sort((a, b) => (b.bit_rate ?? 0) - (a.bit_rate ?? 0))[0]?.url ??
    media.url;

  return {
    type,
    imageUrl: media.preview_image_url ?? media.url,
    videoUrl: mp4,
  };
}

function tweetText(tweet: XTweet): string {
  return tweet.note_tweet?.text ?? tweet.text;
}

async function fetchListTweets(
  listId: string,
  authorization: string
): Promise<FeedTweet[]> {
  const params = new URLSearchParams({
    max_results: "100",
    "tweet.fields": "created_at,attachments,note_tweet",
    expansions: "attachments.media_keys",
    "media.fields": "url,preview_image_url,type,variants",
  });

  const res = await fetch(
    `https://api.x.com/2/lists/${listId}/tweets?${params}`,
    {
      headers: { Authorization: authorization },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return [];

  const json = (await res.json()) as XListTweetsResponse;
  const mediaByKey = new Map(
    (json.includes?.media ?? []).map((m) => [m.media_key, m])
  );

  return (json.data ?? []).map((tweet) => ({
    id: tweet.id,
    text: tweetText(tweet),
    createdAt: tweet.created_at ?? new Date(0).toISOString(),
    media: (tweet.attachments?.media_keys ?? [])
      .map((key) => mediaByKey.get(key))
      .filter((m): m is XMedia => Boolean(m))
      .map(mediaUrl),
  }));
}

export async function fetchFeedTweets(): Promise<FeedTweet[]> {
  const authorization = authHeader();
  if (!authorization) return [];

  const batches = await Promise.all(
    LIST_IDS.map((id) => fetchListTweets(id, authorization))
  );

  const byId = new Map<string, FeedTweet>();
  for (const tweet of batches.flat()) {
    byId.set(tweet.id, tweet);
  }

  return [...byId.values()].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

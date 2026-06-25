import { Card, CardContent } from "@/components/ui/card";
import type { FeedTweet } from "@/lib/x-api";

function TweetMediaBlock({ media }: { media: FeedTweet["media"][number] }) {
  if (media.videoUrl) {
    return (
      <video
        className="max-w-full rounded-sm"
        controls
        playsInline
        poster={media.imageUrl}
        preload="metadata"
      >
        <source src={media.videoUrl} type="video/mp4" />
      </video>
    );
  }

  if (media.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.imageUrl}
        alt=""
        className="max-w-full rounded-sm"
        loading="lazy"
      />
    );
  }

  return null;
}

export function TweetFeed({ tweets }: { tweets: FeedTweet[] }) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 p-4">
      {tweets.map((tweet) => (
        <Card key={tweet.id} className="border-0 shadow-none">
          <CardContent className="space-y-3 px-0">
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
              {tweet.text}
            </p>
            {tweet.media.length > 0 && (
              <div className="flex flex-col gap-2">
                {tweet.media.map((item, i) => (
                  <TweetMediaBlock key={`${tweet.id}-${i}`} media={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { TweetFeed } from "@/components/tweet-feed";
import { fetchFeedTweets } from "@/lib/x-api";

export const revalidate = 60;

export default async function Home() {
  const tweets = await fetchFeedTweets();

  return (
    <main className="min-h-full bg-background">
      <TweetFeed tweets={tweets} />
    </main>
  );
}

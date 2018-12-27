import { RSSService, FeedResponseData, EpisodeReponseData } from "../types";

export const defaultMockEpisode: EpisodeReponseData = {
  entity: "episode",
  ID: "unique-guid",
  name: "Episode 1",
  description: "Here are the show notes.",
  episode: 1,
  episodeType: "full",
  audioURL: "https://audio.podcast.com/episode1.mp3"
};

export const defaultMockFeed: FeedResponseData = {
  entity: "feed",
  description: "This is our podcast",
  episodes: [defaultMockEpisode]
};

let getFeedOutput: FeedResponseData = defaultMockFeed;
export function setGetFeedOutput(output: FeedResponseData) {
  getFeedOutput = output;
}

export default function createRSSService(): RSSService {
  return {
    getFeed() {
      return Promise.resolve(getFeedOutput);
    }
  };
}

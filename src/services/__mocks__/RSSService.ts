import {
  RSSService,
  FeedInputData,
  EpisodeInputData
} from "../../stores/types";

export const defaultMockEpisode: EpisodeInputData = {
  entity: "episode",
  ID: "unique-guid",
  name: "Episode 1",
  description: "Here are the show notes.",
  episode: 1,
  episodeType: "full",
  audioURL: "https://audio.podcast.com/episode1.mp3"
};

export const defaultMockFeed: FeedInputData = {
  entity: "feed",
  description: "This is our podcast",
  episodes: [defaultMockEpisode]
};

let getFeedOutput: FeedInputData = defaultMockFeed;
export function setGetFeedOutput(output: FeedInputData) {
  getFeedOutput = output;
}

export default function createRSSService(): RSSService {
  return {
    getFeed() {
      return Promise.resolve(getFeedOutput);
    }
  };
}

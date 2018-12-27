import {
  ApplicationError,
  PodcastData,
  isComplete,
  FeedData
} from "../../types";
import {
  ITunesService,
  RSSService,
  PodcastResponseData,
  FeedResponseData
} from "../../services/types";
import {
  fetchPodcastRequested,
  fetchPodcastSucceeded,
  fetchPodcastFailed,
  searchPodcastsRequested,
  searchPodcastsSucceeded,
  searchPodcastsFailed,
  fetchFeedRequested,
  fetchFeedFailed,
  fetchFeedSuccessful
} from "./actionCreators";
import {
  PodcastActionCreators,
  FetchPodcast,
  SearchPodcasts,
  FetchFeed
} from "../types";

function initPodcastData(data: PodcastResponseData): PodcastData {
  return {
    ID: data.ID,
    name: data.name,
    author: data.author,
    feed: {
      data: { URL: data.feedURL }
    }
  };
}

function initFeedData(URL: string, data: FeedResponseData): FeedData {
  return {
    URL,
    description: data.description,
    episodes: data.episodes
  };
}

export default function createPodcastActions(
  iTunes: ITunesService,
  RSS: RSSService
): PodcastActionCreators {
  return {
    // fetch podcast by ID
    fetchPodcast(ID: number): FetchPodcast {
      return async dispatch => {
        dispatch(fetchPodcastRequested(ID));

        try {
          const p = await iTunes.getPodcastByID(ID);
          return dispatch(fetchPodcastSucceeded(initPodcastData(p)));
        } catch (e) {
          if (e instanceof ApplicationError) {
            return dispatch(fetchPodcastFailed(ID, e));
          }

          throw e;
        }
      };
    },
    // search podcasts by term
    searchPodcasts(term: string): SearchPodcasts {
      return async dispatch => {
        dispatch(searchPodcastsRequested());

        try {
          const results = await iTunes.searchPodcasts(term);
          return dispatch(
            searchPodcastsSucceeded(results.map(r => initPodcastData(r)))
          );
        } catch (e) {
          if (e instanceof ApplicationError) {
            return dispatch(searchPodcastsFailed(e));
          }

          throw e;
        }
      };
    },
    // get feed by podcast ID
    fetchFeed(podcastID: number): FetchFeed {
      return async (dispatch, getState) => {
        const podcast = getState().podcasts[podcastID];

        if (podcast === undefined || !isComplete(podcast)) {
          throw new ApplicationError(
            "No podcast found",
            "No podcast corresponding to the given id: " + podcastID
          );
        }

        const URL = podcast.data.feed.data.URL;
        try {
          dispatch(fetchFeedRequested(podcastID));

          const feed = await RSS.getFeed(URL);
          return dispatch(
            fetchFeedSuccessful(podcastID, initFeedData(URL, feed))
          );
        } catch (e) {
          if (e instanceof ApplicationError) {
            return dispatch(fetchFeedFailed(podcastID, e));
          }

          throw e;
        }
      };
    }
  };
}

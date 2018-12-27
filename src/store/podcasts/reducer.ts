import { isComplete, PodcastData, Feed } from "../../types";
import {
  ActionTypes,
  isPending,
  isFailed,
  isSuccessful,
  Action,
  PodcastState
} from "../types";

function mergeFeed(podcastData: PodcastData, feed: Partial<Feed>): PodcastData {
  return {
    ...podcastData,
    feed: {
      ...podcastData.feed,
      ...feed
    }
  };
}

// Reducer
export default function podcasts(state: PodcastState = {}, action: Action) {
  switch (action.type) {
    case ActionTypes.FETCH_PODCAST: {
      const ID = action.data.ID;
      const podcast = state[ID];
      if (isPending(action)) {
        return {
          ...state,
          [ID]: {
            data: action.data,
            ...podcast,
            pending: true
          }
        };
      } else if (isFailed(action)) {
        return {
          ...state,
          [ID]: {
            data: action.data,
            ...podcast,
            error: action.error,
            pending: false
          }
        };
      } else {
        return {
          ...state,
          [ID]: {
            ...podcast,
            lastUpdated: action.lastUpdated,
            data: action.data,
            error: undefined,
            pending: false
          }
        };
      }
    }
    case ActionTypes.SEARCH_PODCASTS: {
      if (isSuccessful(action)) {
        const newState = { ...state };
        action.data.results.forEach(r => {
          newState[r.ID] = {
            ...state[r.ID],
            data: r,
            error: undefined,
            pending: false
          };
        });
        return newState;
      }

      return state;
    }
    case ActionTypes.FETCH_PODCAST_FEED: {
      const ID = action.data.podcastID;
      const podcast = state[ID];

      if (podcast === undefined || !isComplete(podcast)) {
        return state;
      }

      if (isPending(action)) {
        return {
          ...state,
          [ID]: {
            ...podcast,
            data: mergeFeed(podcast.data, { pending: true })
          }
        };
      } else if (isFailed(action)) {
        return {
          ...state,
          [ID]: {
            ...podcast,
            data: mergeFeed(podcast.data, {
              pending: false,
              error: action.error
            })
          }
        };
      } else {
        return {
          ...state,
          [ID]: {
            ...podcast,
            data: mergeFeed(podcast.data, {
              pending: false,
              lastUpdated: action.lastUpdated,
              data: action.data
            })
          }
        };
      }
    }
    default:
      return state;
  }
}

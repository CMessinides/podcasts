import { ApplicationError, PodcastData, FeedData } from "../../types";
import {
  ActionTypes,
  ActionStatuses,
  FetchPodcastFailedAction,
  FetchPodcastRequestedAction,
  FetchPodcastSuccessfulAction,
  SearchPodcastsRequestedAction,
  SearchPodcastsFailedAction,
  SearchPodcastsSuccessfulAction,
  FetchFeedRequestedAction,
  FetchFeedFailedAction,
  FetchFeedSuccessfulAction
} from "../../components/types";

export function fetchPodcastRequested(ID: number): FetchPodcastRequestedAction {
  return {
    type: ActionTypes.FETCH_PODCAST,
    status: ActionStatuses.PENDING,
    data: { ID }
  };
}

export function fetchPodcastFailed(
  ID: number,
  error: ApplicationError
): FetchPodcastFailedAction {
  return {
    type: ActionTypes.FETCH_PODCAST,
    status: ActionStatuses.FAILED,
    error,
    data: { ID }
  };
}

export function fetchPodcastSucceeded(
  data: PodcastData
): FetchPodcastSuccessfulAction {
  return {
    type: ActionTypes.FETCH_PODCAST,
    status: ActionStatuses.SUCCESSFUL,
    lastUpdated: Date.now(),
    data
  };
}

export function searchPodcastsRequested(): SearchPodcastsRequestedAction {
  return {
    type: ActionTypes.SEARCH_PODCASTS,
    status: ActionStatuses.PENDING,
    data: {}
  };
}

export function searchPodcastsFailed(
  error: ApplicationError
): SearchPodcastsFailedAction {
  return {
    type: ActionTypes.SEARCH_PODCASTS,
    status: ActionStatuses.FAILED,
    error,
    data: {}
  };
}

export function searchPodcastsSucceeded(
  results: PodcastData[]
): SearchPodcastsSuccessfulAction {
  return {
    type: ActionTypes.SEARCH_PODCASTS,
    status: ActionStatuses.SUCCESSFUL,
    lastUpdated: Date.now(),
    data: { results }
  };
}

export function fetchFeedRequested(
  podcastID: number
): FetchFeedRequestedAction {
  return {
    type: ActionTypes.FETCH_PODCAST_FEED,
    status: ActionStatuses.PENDING,
    data: { podcastID }
  };
}

export function fetchFeedFailed(
  podcastID: number,
  error: ApplicationError
): FetchFeedFailedAction {
  return {
    type: ActionTypes.FETCH_PODCAST_FEED,
    status: ActionStatuses.FAILED,
    error,
    data: { podcastID }
  };
}

export function fetchFeedSuccessful(
  podcastID: number,
  data: FeedData
): FetchFeedSuccessfulAction {
  return {
    type: ActionTypes.FETCH_PODCAST_FEED,
    status: ActionStatuses.SUCCESSFUL,
    lastUpdated: Date.now(),
    data: {
      podcastID,
      ...data
    }
  };
}

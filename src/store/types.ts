import { Action } from "redux";
import {
  PodcastData,
  PodcastPartial,
  FeedData,
  AudioData,
  ApplicationError,
  Podcast
} from "../types";
import { ITunesService, RSSService } from "../services/types";
import { ThunkAction } from "redux-thunk";

// Action types
export enum ActionTypes {
  FETCH_PODCAST,
  FETCH_PODCAST_FEED,
  FETCH_AUTHOR,
  SEARCH_PODCASTS,
  FETCH_EPISODE_AUDIO
}

export enum ActionStatuses {
  PENDING,
  FAILED,
  SUCCESSFUL
}

// Generic actions
interface BaseAction<T> extends Action<T> {
  [key: string]: any;
}

interface BaseAsyncAction<T> extends BaseAction<T> {
  status: ActionStatuses;
  error?: ApplicationError;
}

export interface PendingAction<T, P> extends BaseAsyncAction<T> {
  status: ActionStatuses.PENDING;
  data: P;
}

export interface FailedAction<T, P> extends BaseAsyncAction<T> {
  status: ActionStatuses.FAILED;
  error: ApplicationError;
  data: P;
}

export interface SuccessfulAction<T, D> extends BaseAsyncAction<T> {
  status: ActionStatuses.SUCCESSFUL;
  lastUpdated: number;
  data: D;
}

export function isPending<T extends ActionTypes, P>(
  a: BaseAsyncAction<T>
): a is PendingAction<T, P> {
  return a.status === ActionStatuses.PENDING;
}

export function isFailed<T extends ActionTypes, P>(
  a: BaseAsyncAction<T>
): a is FailedAction<T, P> {
  return a.status === ActionStatuses.FAILED;
}

export function isSuccessful<T extends ActionTypes, D>(
  a: BaseAsyncAction<T>
): a is SuccessfulAction<T, D> {
  return a.status === ActionStatuses.SUCCESSFUL;
}

export type AsyncAction<T extends ActionTypes, P, D> =
  | PendingAction<T, P>
  | FailedAction<T, P>
  | SuccessfulAction<T, D>;

// Actions
type PodcastRequest = PodcastPartial;
type PodcastResult = PodcastData;
export type FetchPodcastRequestedAction = PendingAction<
  ActionTypes.FETCH_PODCAST,
  PodcastRequest
>;
export type FetchPodcastFailedAction = FailedAction<
  ActionTypes.FETCH_PODCAST,
  PodcastRequest
>;
export type FetchPodcastSuccessfulAction = SuccessfulAction<
  ActionTypes.FETCH_PODCAST,
  PodcastResult
>;
export type FetchPodcastAction =
  | FetchPodcastRequestedAction
  | FetchPodcastFailedAction
  | FetchPodcastSuccessfulAction;

interface PodcastSearchRequest {}
interface PodcastSearchResults {
  results: PodcastResult[];
}
export type SearchPodcastsRequestedAction = PendingAction<
  ActionTypes.SEARCH_PODCASTS,
  PodcastSearchRequest
>;
export type SearchPodcastsFailedAction = FailedAction<
  ActionTypes.SEARCH_PODCASTS,
  PodcastSearchRequest
>;
export type SearchPodcastsSuccessfulAction = SuccessfulAction<
  ActionTypes.SEARCH_PODCASTS,
  PodcastSearchResults
>;
export type SearchPodcastsAction =
  | SearchPodcastsRequestedAction
  | SearchPodcastsFailedAction
  | SearchPodcastsSuccessfulAction;

interface BelongsToPodcast {
  podcastID: number;
}
type FeedRequest = BelongsToPodcast;
type FeedResult = BelongsToPodcast & FeedData;
export type FetchFeedRequestedAction = PendingAction<
  ActionTypes.FETCH_PODCAST_FEED,
  FeedRequest
>;
export type FetchFeedFailedAction = FailedAction<
  ActionTypes.FETCH_PODCAST_FEED,
  FeedRequest
>;
export type FetchFeedSuccessfulAction = SuccessfulAction<
  ActionTypes.FETCH_PODCAST_FEED,
  FeedResult
>;
export type FetchFeedAction =
  | FetchFeedRequestedAction
  | FetchFeedFailedAction
  | FetchFeedSuccessfulAction;

interface BelongsToEpisode {
  episodeID: string;
}
type AudioRequest = BelongsToPodcast & BelongsToEpisode;
type AudioResult = BelongsToPodcast & BelongsToEpisode & AudioData;
export type FetchAudioRequestedAction = PendingAction<
  ActionTypes.FETCH_EPISODE_AUDIO,
  AudioRequest
>;
export type FetchAudioFailedAction = FailedAction<
  ActionTypes.FETCH_EPISODE_AUDIO,
  AudioRequest
>;
export type FetchAudioSuccessfulAction = SuccessfulAction<
  ActionTypes.FETCH_EPISODE_AUDIO,
  AudioResult
>;
type FetchAudioAction =
  | FetchAudioRequestedAction
  | FetchAudioFailedAction
  | FetchAudioSuccessfulAction;

export type Action =
  | FetchPodcastAction
  | SearchPodcastsAction
  | FetchFeedAction
  | FetchAudioAction;

// Thunks
export type FetchPodcast = ThunkAction<
  Promise<FetchPodcastAction>,
  State,
  null,
  FetchPodcastAction
>;

export type SearchPodcasts = ThunkAction<
  Promise<SearchPodcastsAction>,
  State,
  null,
  SearchPodcastsAction
>;

export type FetchFeed = ThunkAction<
  Promise<FetchFeedAction>,
  State,
  null,
  FetchFeedAction
>;

export type FetchAudio = ThunkAction<
  Promise<FetchAudioAction>,
  State,
  null,
  FetchAudioAction
>;

export interface PodcastActionCreators {
  fetchPodcast: (ID: number) => FetchPodcast;
  searchPodcasts: (term: string) => SearchPodcasts;
  fetchFeed: (podcastID: number) => FetchFeed;
  // fetchAudio: (podcastID: number, episodeID: number) => FetchAudio;
}

export type ActionCreators = PodcastActionCreators;

export interface ActionCreatorsFactory {
  (iTunes: ITunesService, RSS: RSSService): ActionCreators;
}

// State
export type PodcastState = {
  [ID: number]: Podcast | undefined;
};

export interface State {
  podcasts: PodcastState;
}

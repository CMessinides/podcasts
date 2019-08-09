type RequireOnly<T, K extends keyof T> = Pick<T, K> &
  Partial<Pick<T, Exclude<keyof T, K>>>;

interface BaseEntity {
  lastUpdated?: number;
  pending?: boolean;
  error?: ApplicationError;
}

interface IncompleteEntity<P> extends BaseEntity {
  data: P;
}

interface CompleteEntity<D> extends BaseEntity {
  lastUpdated: number;
  data: D;
}

export function isComplete<P, D extends P>(
  e: IncompleteEntity<P> | CompleteEntity<D> | undefined
): e is CompleteEntity<D> {
  if (typeof e === "undefined") return false;
  return typeof e.lastUpdated === "number";
}

export interface PodcastData {
  ID: number;
  name: string;
  author: RequireOnly<AuthorData, "name">;
  thumbnails: {
    30: string;
    60: string;
    100: string;
    600: string;
  };
  feed: Feed;
}

export type PodcastPartial = RequireOnly<PodcastData, "ID">;

export type IncompletePodcast = IncompleteEntity<PodcastPartial>;
export type CompletePodcast = CompleteEntity<PodcastData>;
export type Podcast = IncompletePodcast | CompletePodcast;

export interface AuthorData {
  ID: number;
  name: string;
}

export type AuthorPartial = RequireOnly<AuthorData, "ID">;

export type IncompleteAuthor = IncompleteEntity<AuthorPartial>;
export type CompleteAuthor = CompleteEntity<AuthorData>;
export type Author = IncompleteAuthor | CompleteAuthor;

export interface FeedData {
  URL: string;
  description?: string;
  episodes: Episode[];
}

export type FeedPartial = RequireOnly<FeedData, "URL">;

export type IncompleteFeed = IncompleteEntity<FeedPartial>;
export type CompleteFeed = CompleteEntity<FeedData>;
export type Feed = IncompleteFeed | CompleteFeed;

export interface Episode {
  ID?: string;
  name?: string;
  description?: string;
  audio?: Audio;
}

export interface ValidEpisode extends Episode {
  ID: string;
  audio: Audio;
}

export function isValidEpisode(e: Episode | undefined): e is ValidEpisode {
  if (e === undefined) return false;
  return e.ID !== undefined && e.audio !== undefined;
}

export interface AudioData {
  URL: string;
}

export type AudioPartial = Partial<AudioData>;

export type IncompleteAudio = IncompleteEntity<AudioPartial>;
export type CompleteAudio = CompleteEntity<AudioData>;
export type Audio = IncompleteAudio | CompleteAudio;

// Custom error types
export interface ErrorData {
  [key: string]: any;
}

export type PreviousError = Error | ApplicationError | null;

export class ApplicationError {
  name: string;
  message: string;
  code: string;
  prev: PreviousError;
  data?: ErrorData;
  constructor(
    name: string = "ApplicationError",
    message: string = "Application encountered an error",
    code: string = "error",
    prev: PreviousError = null,
    data: ErrorData = {}
  ) {
    this.name = name;
    this.message = message;
    this.code = code;
    this.prev = prev;
    this.data = data;
  }
}

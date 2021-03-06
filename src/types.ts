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

// type Entity<P, D extends P> = IncompleteEntity<P> | CompleteEntity<D>;

export function isComplete<P, D extends P>(
  e: IncompleteEntity<P> | CompleteEntity<D>
): e is CompleteEntity<D> {
  return typeof e.lastUpdated === "number";
}

export interface PodcastPartial {
  ID: number;
}

export interface PodcastData extends PodcastPartial {
  name: string;
  author: {
    ID?: number;
    name: string;
  };
  feed: Feed;
}

export type IncompletePodcast = IncompleteEntity<PodcastPartial>;
export type CompletePodcast = CompleteEntity<PodcastData>;
export type Podcast = IncompletePodcast | CompletePodcast;

export interface AuthorPartial {
  ID: number;
  name: string;
}

export interface AuthorData extends AuthorPartial {}

export type IncompleteAuthor = IncompleteEntity<AuthorPartial>;
export type CompleteAuthor = CompleteEntity<AuthorData>;
export type Author = IncompleteAuthor | CompleteAuthor;

export interface FeedPartial {
  URL: string;
}

export interface FeedData extends FeedPartial {
  description?: string;
  episodes: Episode[];
}

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

export function isValidEpisode(e: Episode): e is ValidEpisode {
  return e.ID !== undefined && e.audio !== undefined;
}

export interface AudioPartial {
  URL: string;
}

export interface AudioData extends AudioPartial {}

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

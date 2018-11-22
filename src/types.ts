// Common aliases
export type FetchFn = GlobalFetch["fetch"];

// Network service interface
export interface NetworkService {
  fetch(url: string): Promise<Response>;
}

// iTunes service interfaces
export interface ITunesSearchParams {
  term: string;
  country: string;
  entity: "podcast" | "podcastAuthor";
  attribute:
    | "titleTerm"
    | "languageTerm"
    | "authorTerm"
    | "genreIndex"
    | "artistTerm"
    | "ratingIndex"
    | "keywordsTerm"
    | "descriptionTerm";
  limit: number;
  lang: "en_us" | "ja_jp";
  explicit: "yes" | "no";
}

export interface ITunesResponse {
  resultCount: number;
}

export interface ITunesTrackResponse extends ITunesResponse {
  results: ITunesTrack[];
}

export interface ITunesArtistResponse extends ITunesResponse {
  results: ITunesArtist[];
}

export interface ITunesTrack {
  wrapperType: string;
  kind: string;
  artistId?: number;
  collectionId: number;
  trackId: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  trackCensoredName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  feedUrl: string;
  trackViewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  collectionPrice: number;
  trackPrice: number;
  trackRentalPrice: number;
  collectionHdPrice: number;
  trackHdPrice: number;
  trackHdRentalPrice: number;
  releaseDate: Date;
  collectionExplicitness: string;
  trackExplicitness: string;
  trackCount: number;
  country: string;
  currency: string;
  primaryGenreName: string;
  contentAdvisoryRating: string;
  artworkUrl600: string;
  genreIds: string[];
  genres: string[];
}

export interface ITunesArtist {
  wrapperType: string;
  artistType: string;
  artistName: string;
  artistLinkUrl: string;
  artistId: number;
  primaryGenreName: string;
  primaryGenreId: number;
}

export interface ITunesGateway {
  readPodcast(data: ITunesTrack): PodcastResult;
  readAuthor(data: ITunesArtist): AuthorResult;
}

export interface ITunesService {
  searchPodcasts(
    term: string,
    params?: Partial<ITunesSearchParams>
  ): Promise<PodcastResult[]>;
  searchAuthors(
    term: string,
    params?: Partial<ITunesSearchParams>
  ): Promise<AuthorResult[]>;
  getPodcastByID(id: number): Promise<PodcastResult | null>;
  getAuthorByID(id: number): Promise<AuthorResult | null>;
}

// RSS service interfaces
export interface RSSGateway {
  read(xml: string): FeedResult;
}

export interface RSSService {
  feed(url: string): Promise<FeedResult>;
}

// Result interfaces; returned by services
export interface PodcastResult {
  iTunesID: number;
  iTunesAuthorID?: number;
  name: string;
  censoredName: string;
  explicit: boolean;
  thumbnailURLs: {
    x30: string;
    x60: string;
    x100: string;
    x600: string;
  };
}

export interface AuthorResult {
  iTunesID: number;
  name: string;
}

export interface FeedResult {
  description: string;
  episodes: EpisodeResult[];
}

export interface EpisodeResult {
  guid: string;
  name: string;
  description: string;
  episode?: number;
  episodeType?: string;
  audioURL?: string;
}

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

// Network service interfaces
export interface NetworkService {
  fetch(url: string): Promise<Response>;
}

export interface NetworkServiceFactory {
  (fetch: GlobalFetch["fetch"]): NetworkService;
}

// ITunes service interfaces
export interface ITunesParams {
  limit: number;
  explicit: "yes" | "no";
}

export interface ITunesService {
  searchPodcasts(
    term: string,
    params?: Partial<ITunesParams>
  ): Promise<PodcastInputData[]>;
  searchAuthors(
    term: string,
    params?: Partial<ITunesParams>
  ): Promise<AuthorInputData[]>;
  getPodcastByID(id: number): Promise<PodcastInputData>;
  getAuthorByID(id: number): Promise<AuthorInputData>;
}

export interface ITunesServiceFactory {
  (
    network: NetworkService,
    searchEndpoint?: string,
    lookupEndpoint?: string
  ): ITunesService;
}

// RSS service interfaces
export interface RSSService {
  getFeed(url: string): Promise<FeedInputData>;
}

export interface RSSServiceFactory {
  (network: NetworkService): RSSService;
}

// Entity input interfaces
interface EntityInputData {
  entity: "podcast" | "author" | "feed" | "episode";
}

export interface PodcastInputData extends EntityInputData {
  entity: "podcast";
  ID: number;
  name: string;
  censoredName: string;
  explicit: boolean;
  feedURL: string;
  thumbnailURLs: {
    x30: string;
    x60: string;
    x100: string;
    x600: string;
  };
  author: {
    ID: number | null;
    name: string;
  };
}

export interface AuthorInputData extends EntityInputData {
  entity: "author";
  ID: number;
  name: string;
}

export interface FeedInputData extends EntityInputData {
  entity: "feed";
  description: string | null;
  episodes: EpisodeInputData[];
}

export interface EpisodeInputData extends EntityInputData {
  entity: "episode";
  ID: string | null;
  name: string;
  description: string | null;
  episode: number | null;
  episodeType: string | null;
  audioURL: string | null;
}

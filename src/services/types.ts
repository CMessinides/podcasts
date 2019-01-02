// Network service interfaces
export interface NetworkService {
  fetch(url: string, opts?: { proxy?: boolean }): Promise<Response>;
}

export type NetworkServiceFactoryOpts = {
  proxyEndpoint?: string;
  proxyKey?: string;
};

export interface NetworkServiceFactory {
  (
    fetch: GlobalFetch["fetch"],
    opts?: NetworkServiceFactoryOpts
  ): NetworkService;
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
  ): Promise<PodcastResponseData[]>;
  searchAuthors(
    term: string,
    params?: Partial<ITunesParams>
  ): Promise<AuthorResponseData[]>;
  getPodcastByID(id: number): Promise<PodcastResponseData>;
  getAuthorByID(id: number): Promise<AuthorResponseData>;
}

export type ITunesServiceFactoryOpts = {
  searchEndpoint?: string;
  lookupEndpoint?: string;
  proxy?: boolean;
};

export interface ITunesServiceFactory {
  (network: NetworkService, opts?: ITunesServiceFactoryOpts): ITunesService;
}

// RSS service interfaces
export interface RSSService {
  getFeed(url: string): Promise<FeedResponseData>;
}

export type RSSServiceFactoryOpts = {
  proxy?: boolean;
};

export interface RSSServiceFactory {
  (network: NetworkService, opts?: RSSServiceFactoryOpts): RSSService;
}

// Entity input interfaces
interface EntityInputData {
  entity: "podcast" | "author" | "feed" | "episode";
}

export interface PodcastResponseData extends EntityInputData {
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
    ID?: number;
    name: string;
  };
}

export interface AuthorResponseData extends EntityInputData {
  entity: "author";
  ID: number;
  name: string;
}

export interface FeedResponseData extends EntityInputData {
  entity: "feed";
  description?: string;
  episodes: EpisodeReponseData[];
}

export interface EpisodeReponseData extends EntityInputData {
  entity: "episode";
  ID: string;
  audioURL: string;
  name?: string;
  description?: string;
  episode?: number;
  episodeType?: string;
}

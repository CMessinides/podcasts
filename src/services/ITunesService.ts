import { ApplicationError } from "../types";
import {
  ITunesService,
  ITunesParams,
  PodcastResponseData,
  AuthorResponseData,
  NetworkService
} from "../store/types";

interface ITunesSearchParams extends ITunesParams {
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

interface ITunesResponse {
  resultCount: number;
  results: ITunesEntity[];
}

interface ITunesTrack {
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

interface ITunesArtist {
  wrapperType: string;
  artistType: string;
  artistName: string;
  artistLinkUrl: string;
  artistId: number;
  primaryGenreName: string;
  primaryGenreId: number;
}

type ITunesEntity = ITunesArtist | ITunesTrack;
function isTrack(entity: ITunesEntity): entity is ITunesTrack {
  return entity.wrapperType === "track";
}

interface ITunesGateway {
  read(entity: ITunesEntity): PodcastResponseData | AuthorResponseData;
}

export enum ITunesErrors {
  READ_ERROR = "itunes/read-error",
  PODCAST_NOT_FOUND = "itunes/podcast-not-found",
  AUTHOR_NOT_FOUND = "itunes/author-not-found"
}

function createQueryString(params: { [key: string]: any }): string {
  return (
    "?" +
    Object.keys(params)
      .map(key => {
        return key + "=" + params[key];
      })
      .join("&")
  );
}

async function getParsedResponse(
  endpoint: string,
  params: { [key: string]: any },
  network: NetworkService
): Promise<any> {
  const response = await network.fetch(endpoint + createQueryString(params));
  try {
    return await response.json();
  } catch (error) {
    throw new ApplicationError(
      "ITunesReadError",
      "ITunes Service cannot read response body",
      ITunesErrors.READ_ERROR,
      error,
      { params, response }
    );
  }
}

function readPodcast(entity: ITunesTrack): PodcastResponseData {
  return {
    entity: "podcast",
    ID: entity.collectionId,
    author: {
      ID: entity.artistId || undefined,
      name: entity.artistName
    },
    name: entity.collectionName,
    censoredName: entity.collectionCensoredName,
    explicit: entity.collectionExplicitness === "explicit",
    feedURL: entity.feedUrl,
    thumbnailURLs: {
      x30: entity.artworkUrl30,
      x60: entity.artworkUrl60,
      x100: entity.artworkUrl100,
      x600: entity.artworkUrl600
    }
  };
}

function readAuthor(entity: ITunesArtist): AuthorResponseData {
  return {
    entity: "author",
    ID: entity.artistId,
    name: entity.artistName
  };
}

export function createITunesGateway(): ITunesGateway {
  return {
    read(entity: ITunesEntity): PodcastResponseData | AuthorResponseData {
      return isTrack(entity) ? readPodcast(entity) : readAuthor(entity);
    }
  };
}

export default function createITunesService(
  network: NetworkService,
  searchEndpoint = "https://itunes.apple.com/search",
  lookupEndpoint = "https://itunes.apple.com/lookup"
): ITunesService {
  const gateway = createITunesGateway();
  return {
    async searchPodcasts(
      term: string,
      params: Partial<ITunesSearchParams> = {}
    ) {
      const queryParams = {
        ...params,
        term: encodeURIComponent(term).replace("%20", "+"),
        media: "podcast"
      };
      const parsed = (await getParsedResponse(
        searchEndpoint,
        queryParams,
        network
      )) as ITunesResponse;
      return parsed.results.map(r => gateway.read(r) as PodcastResponseData);
    },

    async searchAuthors(
      term: string,
      params: Partial<ITunesSearchParams> = {}
    ) {
      const queryParams = {
        ...params,
        term: encodeURIComponent(term).replace("%20", "+"),
        media: "podcast",
        entity: "podcastAuthor"
      };
      const parsed = (await getParsedResponse(
        searchEndpoint,
        queryParams,
        network
      )) as ITunesResponse;
      return parsed.results.map(r => gateway.read(r) as AuthorResponseData);
    },

    async getPodcastByID(ID: number) {
      const parsed = (await getParsedResponse(
        lookupEndpoint,
        { id: ID },
        network
      )) as ITunesResponse;
      if (parsed.resultCount === 0)
        throw new ApplicationError(
          "Podcast not found",
          "ITunes Service could not find any podcast matching the given ID: " +
            ID,
          ITunesErrors.PODCAST_NOT_FOUND
        );
      return gateway.read(parsed.results[0]) as PodcastResponseData;
    },

    async getAuthorByID(ID: number) {
      const parsed = (await getParsedResponse(
        lookupEndpoint,
        { id: ID },
        network
      )) as ITunesResponse;
      if (parsed.resultCount === 0)
        throw new ApplicationError(
          "Author not found",
          "ITunes Service could not find any author matching the given ID: " +
            ID,
          ITunesErrors.AUTHOR_NOT_FOUND
        );
      return gateway.read(parsed.results[0]) as AuthorResponseData;
    }
  };
}

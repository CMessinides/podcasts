import {
  FetchFn,
  ITunesService,
  ITunesTrackResponse,
  ITunesArtistResponse,
  ApplicationError,
  ITunesSearchParams,
  AuthorResult,
  NetworkService,
  ITunesGateway,
  ITunesTrack,
  ITunesArtist,
  PodcastResult
} from "../types";
import createNetworkConnection from "./NetworkService";

export const ITUNES_ERROR = "itunes/error";
export const ITUNES_READ_ERROR = "itunes/read-error";

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

function ReadError(
  error: Error,
  params: { [key: string]: any },
  response: Response
): ApplicationError {
  return new ApplicationError(
    "ITunesReadError",
    "ITunes service cannot read response body",
    ITUNES_READ_ERROR,
    error,
    { params, response }
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
    throw ReadError(error, params, response);
  }
}

export function createITunesGateway(): ITunesGateway {
  return {
    readPodcast(data: ITunesTrack): PodcastResult {
      return {
        iTunesID: data.collectionId,
        iTunesAuthorID: data.artistId,
        name: data.collectionName,
        censoredName: data.collectionCensoredName,
        explicit: data.collectionExplicitness === "explicit",
        thumbnailURLs: {
          x30: data.artworkUrl30,
          x60: data.artworkUrl60,
          x100: data.artworkUrl100,
          x600: data.artworkUrl600
        }
      };
    },

    readAuthor(data: ITunesArtist): AuthorResult {
      return {
        iTunesID: data.artistId,
        name: data.artistName
      };
    }
  };
}

export default function createITunesService(
  fetch: FetchFn = window.fetch
): ITunesService {
  const searchEndpoint = "https://itunes.apple.com/search";
  const lookupEndpoint = "https://itunes.apple.com/lookup";
  const network = createNetworkConnection(fetch);
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
      )) as ITunesTrackResponse;
      return parsed.results.map(r => gateway.readPodcast(r));
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
      )) as ITunesArtistResponse;
      return parsed.results.map(r => gateway.readAuthor(r));
    },

    async getPodcastByID(id: number) {
      const parsed = (await getParsedResponse(
        lookupEndpoint,
        { id },
        network
      )) as ITunesTrackResponse;
      if (parsed.resultCount === 0) return null;
      return gateway.readPodcast(parsed.results[0]);
    },

    async getAuthorByID(id: number) {
      const parsed = (await getParsedResponse(
        lookupEndpoint,
        { id },
        network
      )) as ITunesArtistResponse;
      if (parsed.resultCount === 0) return null;
      return gateway.readAuthor(parsed.results[0]);
    }
  };
}

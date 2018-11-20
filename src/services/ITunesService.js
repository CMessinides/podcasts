import Podcast from "../domain/Podcast";
import Author from "../domain/Author";

async function fetchAPIData(endpoint, params, fetch) {
  const queryString =
    "?" +
    Object.entries(params)
      .map(([key, value]) => key + "=" + value)
      .join("&");
  const url = new URL(endpoint + queryString);

  try {
    var response = await fetch(url);
  } catch (error) {
    return {
      error: new Error(
        "iTunes service encountered network error: " + error.message
      ),
      data: null
    };
  }

  if (!response.ok) {
    return {
      error: new Error(
        `iTunes service encountered HTTP error: Status ${response.status} - ${
          response.statusText
        }`
      ),
      data: null
    };
  }

  return {
    error: null,
    data: await response.json()
  };
}

export function createPodcastList(iTunesData) {
  return iTunesData.results.map(
    result =>
      new Podcast({
        iTunesID: result.collectionId,
        name: result.collectionName,
        feedURL: result.feedURL,
        thumbnailURLs: {
          "30": result.artworkUrl30,
          "60": result.artworkUrl60,
          "100": result.artworkUrl100,
          "600": result.artworkUrl600
        }
      })
  );
}

export function createAuthorList(iTunesData) {
  return iTunesData.results.map(
    result =>
      new Author({
        iTunesID: result.artistID,
        name: result.artistName
      })
  );
}

export default class ITunesService {
  constructor(endpoint, fetch = window ? window.fetch : global.fetch) {
    this.searchEndpoint = new URL("/search", endpoint);
    this.lookupEndpoint = new URL("/lookup", endpoint);
    this.fetch = fetch;
  }

  async searchPodcasts(params = {}) {
    // if no term provided, return early with error
    if (params.term === undefined) {
      return {
        error: new Error("No term provided for the iTunes Search API"),
        podcasts: []
      };
    }

    // force a podcast-only search
    params.media = "podcast";
    params.entity = "podcast";

    const { data, error } = await fetchAPIData(
      this.searchEndpoint,
      params,
      this.fetch
    );
    if (error) return { error, podcasts: [] };

    return {
      error: null,
      podcasts: createPodcastList(data)
    };
  }

  async searchAuthors(params = {}) {
    // if no term provided, return early with error
    if (params.term === undefined) {
      return {
        error: new Error("No term provided for the iTunes Search API"),
        authors: []
      };
    }

    // force a author-only search
    params.media = "podcast";
    params.entity = "podcastAuthor";

    const { data, error } = await fetchAPIData(
      this.searchEndpoint,
      params,
      this.fetch
    );
    if (error) return { error, authors: [] };

    return {
      error: null,
      authors: createAuthorList(data)
    };
  }
}

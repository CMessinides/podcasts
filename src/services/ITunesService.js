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
    throw new Error(
      "iTunes service encountered network error: " + error.message
    );
  }

  if (!response.ok) {
    throw new Error(
      `iTunes service encountered HTTP error: Status ${response.status} - ${
        response.statusText
      }`
    );
  }

  return await response.json();
}

export function translatePodcast(result) {
  if (result === undefined) return null;
  return new Podcast({
    iTunesID: result.collectionId,
    name: result.collectionName,
    feedURL: result.feedUrl,
    thumbnailURLs: {
      "30": result.artworkUrl30,
      "60": result.artworkUrl60,
      "100": result.artworkUrl100,
      "600": result.artworkUrl600
    }
  });
}

export function translateAuthor(result) {
  if (result === undefined) return null;
  return new Author({
    iTunesID: result.artistId,
    name: result.artistName
  });
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
      throw new Error("No term provided for the iTunes Search API");
    }

    // force a podcast-only search
    params.media = "podcast";
    params.entity = "podcast";

    const data = await fetchAPIData(this.searchEndpoint, params, this.fetch);

    return data.results.map(r => translatePodcast(r));
  }

  async searchAuthors(params = {}) {
    // if no term provided, return early with error
    if (params.term === undefined) {
      throw new Error("No term provided for the iTunes Search API");
    }

    // force a author-only search
    params.media = "podcast";
    params.entity = "podcastAuthor";

    const data = await fetchAPIData(this.searchEndpoint, params, this.fetch);

    return data.results.map(r => translateAuthor(r));
  }

  async getPodcast(podcastID) {
    const id = parseInt(podcastID, 10);
    if (isNaN(id)) {
      throw new Error(
        "The ID provided to the iTunes Search API must be a valid integer. ID given was: " +
          podcastID
      );
    }

    const data = await fetchAPIData(this.lookupEndpoint, { id }, this.fetch);
    return translatePodcast(data.results[0]);
  }

  async getAuthor(authorID) {
    const id = parseInt(authorID, 10);
    if (isNaN(id)) {
      throw new Error(
        "The ID provided to the iTunes Search API must be a valid integer. ID given was: " +
          authorID
      );
    }

    const data = await fetchAPIData(this.lookupEndpoint, { id }, this.fetch);
    return translateAuthor(data.results[0]);
  }
}

import {
  ITunesService,
  PodcastResponseData,
  AuthorResponseData
} from "../types";

export const defaultMockPodcast: PodcastResponseData = {
  entity: "podcast",
  ID: 1,
  author: {
    ID: 1,
    name: "Author Name"
  },
  censoredName: "Name",
  name: "Name",
  explicit: false,
  feedURL: "https://feed.podcast.com/feed.rss",
  thumbnailURLs: {
    30: "https://image.podcast.com/thumb-30.jpg",
    60: "https://image.podcast.com/thumb-60.jpg",
    100: "https://image.podcast.com/thumb-100.jpg",
    600: "https://image.podcast.com/thumb-600.jpg"
  }
};

export const defaultMockAuthor: AuthorResponseData = {
  entity: "author",
  ID: 1,
  name: "Author Name"
};

let searchPodcastsOutput: PodcastResponseData[] = [defaultMockPodcast];
export function setSearchPodcastsOutput(output: PodcastResponseData[]) {
  searchPodcastsOutput = output;
}

let searchAuthorsOutput: AuthorResponseData[] = [defaultMockAuthor];
export function setSearchAuthorsOutput(output: AuthorResponseData[]) {
  searchAuthorsOutput = output;
}

let getPodcastByIDOutput: PodcastResponseData = defaultMockPodcast;
export function setGetPodcastByIDOutput(output: PodcastResponseData) {
  getPodcastByIDOutput = output;
}

let getAuthorByIDOutput: AuthorResponseData = defaultMockAuthor;
export function setGetAuthorByID(output: AuthorResponseData) {
  getAuthorByIDOutput = output;
}

export default function createITunesService(): ITunesService {
  return {
    searchPodcasts() {
      return Promise.resolve(searchPodcastsOutput);
    },
    searchAuthors() {
      return Promise.resolve(searchAuthorsOutput);
    },
    getPodcastByID() {
      return Promise.resolve(getPodcastByIDOutput);
    },
    getAuthorByID() {
      return Promise.resolve(getAuthorByIDOutput);
    }
  };
}

import {
  ITunesService,
  PodcastInputData,
  AuthorInputData
} from "../../stores/types";

export const defaultMockPodcast: PodcastInputData = {
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
    x30: "https://image.podcast.com/thumb-30.jpg",
    x60: "https://image.podcast.com/thumb-60.jpg",
    x100: "https://image.podcast.com/thumb-100.jpg",
    x600: "https://image.podcast.com/thumb-600.jpg"
  }
};

export const defaultMockAuthor: AuthorInputData = {
  entity: "author",
  ID: 1,
  name: "Author Name"
};

let searchPodcastsOutput: PodcastInputData[] = [defaultMockPodcast];
export function setSearchPodcastsOutput(output: PodcastInputData[]) {
  searchPodcastsOutput = output;
}

let searchAuthorsOutput: AuthorInputData[] = [defaultMockAuthor];
export function setSearchAuthorsOutput(output: AuthorInputData[]) {
  searchAuthorsOutput = output;
}

let getPodcastByIDOutput: PodcastInputData = defaultMockPodcast;
export function setGetPodcastByIDOutput(output: PodcastInputData) {
  getPodcastByIDOutput = output;
}

let getAuthorByIDOutput: AuthorInputData = defaultMockAuthor;
export function setGetAuthorByID(output: AuthorInputData) {
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

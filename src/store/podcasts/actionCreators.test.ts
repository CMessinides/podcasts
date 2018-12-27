import {
  fetchPodcastRequested,
  fetchPodcastFailed,
  fetchPodcastSucceeded
} from "./actionCreators";
import { ActionStatuses, ActionTypes } from "../types";
import { ApplicationError, PodcastData } from "../../types";

describe("fetchPodcastRequested", () => {
  it("should return a pending FetchPodcast action", () => {
    const ID = 1;
    const action = fetchPodcastRequested(ID);

    expect(action).toEqual({
      type: ActionTypes.FETCH_PODCAST,
      status: ActionStatuses.PENDING,
      data: { ID }
    });
  });
});

describe("fetchPodcastFailed", () => {
  it("should return a failed FetchPodcast action", () => {
    const ID = 1;
    const error = new ApplicationError();
    const action = fetchPodcastFailed(ID, error);

    expect(action).toEqual({
      type: ActionTypes.FETCH_PODCAST,
      status: ActionStatuses.FAILED,
      error,
      data: { ID }
    });
  });
});

describe("fetchPodcastSuccessful", () => {
  it("should return a successful FetchPodcast action", () => {
    const data: PodcastData = {
      ID: 1,
      name: "Podcast",
      author: {
        ID: 2,
        name: "Author"
      },
      feed: {
        data: {
          URL: "feed.com"
        }
      }
    };
    const action = fetchPodcastSucceeded(data);

    expect(action).toEqual({
      type: ActionTypes.FETCH_PODCAST,
      status: ActionStatuses.SUCCESSFUL,
      lastUpdated: expect.any(Number),
      data
    });
  });
});

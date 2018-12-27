import podcasts from "./reducer";
import {
  PodcastState,
  ActionStatuses,
  ActionTypes,
  FetchPodcastRequestedAction,
  FetchPodcastFailedAction,
  FetchPodcastSuccessfulAction
} from "../types";
import { defaultMockPodcast } from "../../services/__mocks__/ITunesService";
import { ApplicationError, Podcast } from "../../types";

const defaultPodcast = {
  lastUpdated: Date.now(),
  pending: false,
  error: undefined,
  data: {
    ID: defaultMockPodcast.ID,
    name: defaultMockPodcast.name,
    author: defaultMockPodcast.author,
    feed: {
      data: {
        URL: defaultMockPodcast.feedURL
      }
    }
  }
};

describe("fetch podcast", () => {
  describe("on pending", () => {
    const action: FetchPodcastRequestedAction = {
      type: ActionTypes.FETCH_PODCAST,
      status: ActionStatuses.PENDING,
      data: { ID: defaultPodcast.data.ID }
    };

    it("should add a new podcast to the store if needed", () => {
      const newState = podcasts({}, action);
      expect(newState).toEqual(<PodcastState>{
        [action.data.ID]: {
          pending: true,
          data: action.data
        }
      });
    });

    it("should not overwrite existing data or errors", () => {
      const ID = action.data.ID;
      const oldState = {
        [ID]: {
          ...defaultPodcast,
          error: new ApplicationError()
        }
      };
      const newState = podcasts(oldState, action);

      expect(newState).toEqual(<PodcastState>{
        [ID]: {
          ...oldState[ID],
          pending: true
        }
      });
    });
  });

  describe("on failure", () => {
    const action: FetchPodcastFailedAction = {
      type: ActionTypes.FETCH_PODCAST,
      status: ActionStatuses.FAILED,
      error: new ApplicationError("new error"),
      data: { ID: defaultPodcast.data.ID }
    };

    it("should add a podcast to the store if needed", () => {
      const newState = podcasts({}, action);
      expect(newState).toEqual(<PodcastState>{
        [action.data.ID]: {
          pending: false,
          error: action.error,
          data: action.data
        }
      });
    });

    it("should overwrite pending and error fields", () => {
      const ID = action.data.ID;
      const oldState = {
        [ID]: {
          pending: false,
          error: new ApplicationError("old error"),
          data: { ID }
        }
      };
      const newState = podcasts(oldState, action);

      expect(newState[ID].pending).toBe(false);
      expect(newState[ID].error).toBe(action.error);
    });

    it("should not overwrite data or time of last update", () => {
      const ID = action.data.ID;
      const oldState = {
        [ID]: defaultPodcast
      };
      const newState = podcasts(oldState, action);

      expect(newState[ID].data).toEqual(oldState[ID].data);
      expect(newState[ID].lastUpdated).toBe(oldState[ID].lastUpdated);
    });
  });

  describe("on success", () => {
    const action: FetchPodcastSuccessfulAction = {
      type: ActionTypes.FETCH_PODCAST,
      status: ActionStatuses.SUCCESSFUL,
      lastUpdated: defaultPodcast.lastUpdated + 1000,
      data: defaultPodcast.data
    };

    it("should add a podcast to the store if needed", () => {
      const newState = podcasts({}, action);
      expect(newState).toEqual({
        [action.data.ID]: {
          pending: false,
          error: undefined,
          lastUpdated: action.lastUpdated,
          data: action.data
        }
      });
    });

    it("should overwrite all fields", () => {
      const ID = action.data.ID;
      const oldState = {
        [ID]: {
          lastUpdated: defaultPodcast.lastUpdated,
          error: new ApplicationError(),
          pending: true,
          data: {
            ...defaultPodcast.data,
            name: "Different name"
          }
        }
      };
      const newState = podcasts(oldState, action);

      expect(newState).toEqual({
        [ID]: {
          pending: false,
          error: undefined,
          lastUpdated: action.lastUpdated,
          data: action.data
        }
      });
    });
  });
});

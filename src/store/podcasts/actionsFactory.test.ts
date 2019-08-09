import createPodcastActions from "./actionsFactory";
import createITunesService, {
  defaultMockPodcast
} from "../../services/__mocks__/ITunesService";
import createRSSService, {
  defaultMockFeed
} from "../../services/__mocks__/RSSService";
import { ThunkDispatch } from "redux-thunk";
import {
  FetchPodcastAction,
  State,
  ActionStatuses,
  Action,
  SearchPodcastsAction,
  FetchFeedAction
} from "../types";
import { ApplicationError } from "../../types";

type MockDispatch<A extends Action> = jest.Mock<ThunkDispatch<State, null, A>>;

const defaultPodcastData = {
  ID: defaultMockPodcast.ID,
  name: defaultMockPodcast.name,
  author: defaultMockPodcast.author,
  thumbnails: defaultMockPodcast.thumbnailURLs,
  feed: {
    data: {
      URL: defaultMockPodcast.feedURL
    }
  }
};

const defaultFeedData = {
  URL: defaultMockPodcast.feedURL,
  description: defaultMockFeed.description,
  episodes: defaultMockFeed.episodes
};

const mockGetState = (s = {}) => () => s as State;

describe("fetchPodcast", () => {
  const { fetchPodcast } = createPodcastActions(
    createITunesService(),
    createRSSService()
  );
  const dispatch: MockDispatch<FetchPodcastAction> = jest.fn(a => a);

  afterEach(() => {
    dispatch.mockClear();
  });

  it("should dispatch a pending action first", async () => {
    expect.assertions(1);

    const ID = defaultMockPodcast.ID;

    await fetchPodcast(ID)(dispatch, mockGetState(), null);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ActionStatuses.PENDING,
        data: { ID }
      })
    );
  });

  it("should dispatch a successful action last", async () => {
    expect.assertions(2);

    const ID = defaultMockPodcast.ID;

    await fetchPodcast(ID)(dispatch, mockGetState(), null);

    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        status: ActionStatuses.FAILED
      })
    );
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: ActionStatuses.SUCCESSFUL,
        data: defaultPodcastData
      })
    );
  });

  describe("on error", () => {
    it("should dispatch a failed action last", async () => {
      expect.assertions(2);

      const ID = 1;
      const error = new ApplicationError();
      const iTunes = createITunesService();
      iTunes.getPodcastByID = () => {
        return Promise.reject(error);
      };

      const { fetchPodcast } = createPodcastActions(iTunes, createRSSService());

      await fetchPodcast(ID)(dispatch, mockGetState(), null);

      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          status: ActionStatuses.SUCCESSFUL
        })
      );
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: ActionStatuses.FAILED,
          error,
          data: { ID }
        })
      );
    });
  });
});

describe("searchPodcasts", () => {
  const { searchPodcasts } = createPodcastActions(
    createITunesService(),
    createRSSService()
  );
  const dispatch: MockDispatch<SearchPodcastsAction> = jest.fn(a => a);

  afterEach(() => {
    dispatch.mockClear();
  });

  it("should dispatch a pending action first", async () => {
    expect.assertions(1);

    await searchPodcasts("term")(dispatch, mockGetState(), null);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        status: ActionStatuses.PENDING,
        data: {}
      })
    );
  });

  it("should dispatch a successful action last", async () => {
    expect.assertions(2);

    await searchPodcasts("term")(dispatch, mockGetState(), null);

    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        status: ActionStatuses.FAILED
      })
    );
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: ActionStatuses.SUCCESSFUL,
        data: {
          results: [defaultPodcastData]
        }
      })
    );
  });

  describe("on error", () => {
    it("should dispatch a failed action last", async () => {
      expect.assertions(2);

      const error = new ApplicationError();
      const iTunes = createITunesService();
      iTunes.searchPodcasts = () => Promise.reject(error);
      const { searchPodcasts } = createPodcastActions(
        iTunes,
        createRSSService()
      );

      await searchPodcasts("term")(dispatch, mockGetState(), null);

      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          status: ActionStatuses.SUCCESSFUL
        })
      );
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: ActionStatuses.FAILED,
          data: {}
        })
      );
    });
  });
});

describe("FetchFeed", () => {
  const podcastID = defaultPodcastData.ID;
  const { fetchFeed } = createPodcastActions(
    createITunesService(),
    createRSSService()
  );
  const dispatch: MockDispatch<FetchFeedAction> = jest.fn(a => a);
  const getState = mockGetState({
    podcasts: {
      [podcastID]: {
        pending: false,
        lastUpdated: Date.now(),
        data: defaultPodcastData
      }
    }
  });

  afterEach(() => {
    dispatch.mockClear();
  });

  it("should dispatch a pending action first", async () => {
    expect.assertions(1);

    await fetchFeed(podcastID)(dispatch, getState, null);

    expect(dispatch).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        status: ActionStatuses.PENDING,
        data: { podcastID }
      })
    );
  });

  it("should dispatch a successful action last", async () => {
    expect.assertions(2);

    await fetchFeed(podcastID)(dispatch, getState, null);

    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        status: ActionStatuses.FAILED
      })
    );
    expect(dispatch).toHaveBeenLastCalledWith(
      expect.objectContaining({
        status: ActionStatuses.SUCCESSFUL,
        data: {
          podcastID,
          ...defaultFeedData
        }
      })
    );
  });

  describe("on error", () => {
    it("should dispatch a failed action last", async () => {
      expect.assertions(2);

      const error = new ApplicationError();
      const RSS = createRSSService();
      RSS.getFeed = () => Promise.reject(error);
      const { fetchFeed } = createPodcastActions(createITunesService(), RSS);

      await fetchFeed(podcastID)(dispatch, getState, null);

      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          status: ActionStatuses.SUCCESSFUL
        })
      );
      expect(dispatch).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: ActionStatuses.FAILED,
          error,
          data: {
            podcastID
          }
        })
      );
    });
  });

  describe("on missing/incomplete podcast", () => {
    const getState = mockGetState({ podcasts: {} });

    it("should not call dispatch", async () => {
      expect.assertions(1);

      try {
        await fetchFeed(podcastID)(dispatch, getState, null);
      } catch (e) {
        if (!(e instanceof ApplicationError)) {
          throw e;
        }
      }

      expect(dispatch).not.toBeCalled();
    });

    it("should reject", async () => {
      expect.assertions(1);

      await expect(
        fetchFeed(podcastID)(dispatch, getState, null)
      ).rejects.toEqual(expect.any(ApplicationError));
    });
  });
});

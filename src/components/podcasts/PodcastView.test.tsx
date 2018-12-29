import React from "react";
import createPodcastView, {
  PodcastView,
  CompletePodcastView,
  GhostPodcastView
} from "./PodcastView";
import {
  ActionCreators,
  FetchPodcastAction,
  State,
  SearchPodcastsAction,
  FetchFeedAction,
  FetchPodcast
} from "../../store/types";
import { shallow } from "enzyme";
import { ApplicationError } from "../../types";

const dispatch = (a: any) => a;
const getState = () => ({} as State);

const defaultPodcast = {
  pending: false,
  error: undefined,
  lastUpdated: Date.now(),
  data: {
    ID: 1,
    name: "Podcast",
    author: {
      ID: 2,
      name: "Author"
    },
    feed: {
      data: {
        URL: "https://feeds.com/feed.rss"
      }
    }
  }
};

const mockActions: ActionCreators = {
  fetchPodcast: jest.fn(
    (): FetchPodcast => () => Promise.resolve({} as FetchPodcastAction)
  ),
  searchPodcasts: jest.fn(() => () =>
    Promise.resolve({} as SearchPodcastsAction)
  ),
  fetchFeed: jest.fn(() => () => Promise.resolve({} as FetchFeedAction))
};

describe("connected PodcastView", () => {
  it("should render without throwing", () => {
    const PodcastView = createPodcastView(mockActions);

    expect(() => shallow(<PodcastView ID={1} />)).not.toThrow();
  });
});

describe("PodcastView", () => {
  const ID = defaultPodcast.data.ID;
  const fetchPodcast = (ID: number) => {
    return mockActions.fetchPodcast(ID)(dispatch, getState, null);
  };

  describe("when podcast is complete", () => {
    const props = {
      fetchPodcast,
      podcast: {
        ...defaultPodcast,
        // should show all the podcast data regardless of loading or error state
        pending: true,
        error: new ApplicationError()
      }
    };

    it("should render a CompletePodcastView", () => {
      const wrapper = shallow(<PodcastView {...props} />);
      expect(wrapper.find(CompletePodcastView).exists()).toBe(true);
    });
  });

  describe("when podcast is pending", () => {
    const props = {
      fetchPodcast,
      podcast: {
        // should show a loading state even if error is present
        error: new ApplicationError(),
        pending: true,
        data: { ID }
      }
    };

    it("should render a GhostPodcastView", () => {
      const wrapper = shallow(<PodcastView {...props} />);
      expect(wrapper.find(GhostPodcastView).exists()).toBe(true);
    });
  });

  describe("when podcast has an error", () => {
    const error = new ApplicationError("name", "message");
    const props = {
      fetchPodcast,
      podcast: {
        error,
        // should show error only if not loading
        pending: false,
        data: { ID }
      }
    };

    it("should render a div with error message", () => {
      const wrapper = shallow(<PodcastView {...props} />);
      const div = wrapper.find("div");

      expect(div.exists()).toBe(true);
      expect(div.text()).toBe(error.message);
    });
  });

  describe("when a null podcast provided", () => {
    const props = { podcast: { data: { ID } }, fetchPodcast };
    it("should fetch the podcast", () => {
      shallow(<PodcastView {...props} />);

      expect(mockActions.fetchPodcast).toHaveBeenCalledWith(ID);
    });

    it("should render nothing", () => {
      const wrapper = shallow(<PodcastView {...props} />);

      expect(wrapper.children().length).toBe(0);
    });
  });
});

import React from "react";
import createPodcastView, {
  PodcastView,
  IncompletePodcastView,
  CompletePodcastView,
  PodcastViewSwitch
} from "./Podcast";
import {
  ActionCreators,
  FetchPodcastAction,
  State,
  SearchPodcastsAction,
  FetchFeedAction,
  FetchPodcast
} from "../../store/types";
import { shallow } from "enzyme";

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
  // No tests until Enzyme supports Suspense!
});

describe("PodcastViewSwitch", () => {
  const ID = defaultPodcast.data.ID;
  const fetchPodcast = (ID: number) => {
    return mockActions.fetchPodcast(ID)(dispatch, getState, null);
  };

  describe("when no podcast provided", () => {
    const props = { ID, fetchPodcast };
    it("should throw a promise", () => {
      expect(() => {
        shallow(<PodcastViewSwitch {...props} />);
      }).toThrow(Promise);
    });
  });

  describe("when podcast is incomplete", () => {
    const props = {
      ID,
      fetchPodcast,
      podcast: {
        pending: true,
        data: { ID }
      }
    };
    it("should render an IncompletePodcastView", () => {
      const wrapper = shallow(<PodcastViewSwitch {...props} />);
      expect(wrapper.find(IncompletePodcastView).exists()).toBe(true);
    });
  });

  describe("when podcast is complete", () => {
    const props = {
      ID,
      fetchPodcast,
      podcast: defaultPodcast
    };
    it("should render a CompletePodcastView", () => {
      const wrapper = shallow(<PodcastViewSwitch {...props} />);
      expect(wrapper.find(CompletePodcastView).exists()).toBe(true);
    });
  });
});

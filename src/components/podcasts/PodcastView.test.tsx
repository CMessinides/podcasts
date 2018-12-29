import React from "react";
import PodcastView, { PodcastViewBase } from "./PodcastView";
import PodcastErrorState from "./PodcastErrorState";
import PodcastHeader from "./PodcastHeader";
import PodcastEpisodesList from "./PodcastEpisodesList";
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

describe("PodcastView", () => {
  it("should render without throwing", () => {
    expect(() => shallow(<PodcastView ID={1} />)).not.toThrow();
  });
});

describe("PodcastViewBase", () => {
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

    it("should render a PodcastHeader with the podcast", () => {
      const header = shallow(<PodcastViewBase {...props} />).find(
        PodcastHeader
      );
      expect(header.exists()).toBe(true);
      expect(header.prop("podcast")).toBe(props.podcast);
    });

    it("should render a PodcastEpisodeList with the podcast ID", () => {
      const list = shallow(<PodcastViewBase {...props} />).find(
        PodcastEpisodesList
      );
      expect(list.exists()).toBe(true);
      expect(list.prop("podcastID")).toBe(props.podcast.data.ID);
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

    it("should render a defualt PodcastHeader", () => {
      const header = shallow(<PodcastViewBase {...props} />).find(
        PodcastHeader
      );
      expect(header.exists()).toBe(true);
      expect(header.prop("podcast")).toBe(undefined);
    });

    it("should not render a PodcastEpisodesList", () => {
      const list = shallow(<PodcastViewBase {...props} />).find(
        PodcastEpisodesList
      );
      expect(list.exists()).toBe(false);
    });
  });

  describe("when podcast has an error", () => {
    const error = new ApplicationError();
    const props = {
      fetchPodcast,
      podcast: {
        error,
        // should show error only if not loading
        pending: false,
        data: { ID }
      }
    };

    it("should render a PodcastErrorState", () => {
      const errorState = shallow(<PodcastViewBase {...props} />).find(
        PodcastErrorState
      );

      expect(errorState.exists()).toBe(true);
    });
  });

  describe("when a null podcast provided", () => {
    const props = { podcast: { data: { ID } }, fetchPodcast };
    it("should fetch the podcast", () => {
      shallow(<PodcastViewBase {...props} />);

      expect(mockActions.fetchPodcast).toHaveBeenCalledWith(ID);
    });

    it("should render nothing", () => {
      const wrapper = shallow(<PodcastViewBase {...props} />);

      expect(wrapper.children().length).toBe(0);
    });
  });
});

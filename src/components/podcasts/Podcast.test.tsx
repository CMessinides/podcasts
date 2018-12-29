import React from "react";
import Podcast from "./Podcast";
import { shallow } from "enzyme";
import PodcastView from "./PodcastView";
import PodcastErrorState from "./PodcastErrorState";

describe("with valid ID", () => {
  // valid IDs
  const IDs = ["1", "135352323", "2325u334"];

  it("renders a PodcastView with given ID", () => {
    IDs.forEach(ID => {
      const view = shallow(<Podcast ID={ID} />).find(PodcastView);

      expect(view.exists()).toBe(true);
      expect(view.prop("ID")).toBe(parseInt(ID, 10));
    });
  });
});

describe("with invalid ID", () => {
  // invalid IDs
  const IDs = [null, {}, "", "foo"];

  it("renders a PodcastErrorState", () => {
    IDs.forEach(ID => {
      const errorState = shallow(<Podcast ID={ID as string} />).find(
        PodcastErrorState
      );

      expect(errorState.exists()).toBe(true);
    });
  });
});

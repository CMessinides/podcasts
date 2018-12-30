import React from "react";
import PodcastHeader from "./PodcastHeader";
import { shallow } from "enzyme";
import LoadingState from "../core/LoadingState";

describe("with no podcast provided", () => {
  it("should render a loading state", () => {
    const loadingState = shallow(<PodcastHeader />).find(LoadingState);

    expect(loadingState.exists()).toBe(true);
  });
});

import React from "react";
import PodcastHeader from "./PodcastHeader";
import { shallow } from "enzyme";
import Fallback from "../fallback/Fallback";

describe("with no podcast provided", () => {
  it("should render a Fallback component", () => {
    const fallback = shallow(<PodcastHeader />).find(Fallback);

    expect(fallback.exists()).toBe(true);
  });
});

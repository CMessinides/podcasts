import React from "react";
import PodcastErrorState from "./PodcastErrorState";
import { shallow } from "enzyme";
import ErrorState from "../core/ErrorState";
import errorMsgs from "../../tokens/errorMessages.json";

it("should render an ErrorState with PODCAST_NOT_FOUND message", () => {
  const { title, details } = errorMsgs.PODCAST_NOT_FOUND;
  const errorState = shallow(<PodcastErrorState />).find(ErrorState);

  expect(errorState.exists()).toBe(true);
  expect(errorState.prop("title")).toBe(title);
  expect(errorState.prop("details")).toBe(details);
});

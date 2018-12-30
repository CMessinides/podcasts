import React from "react";
import PodcastErrorState from "./PodcastErrorState";
import { shallow } from "enzyme";
import ErrorState from "../core/ErrorState";
import ERROR_MESSAGES, { ErrorCodes } from "../../strings/errorMessages";

it("should render an ErrorState with PODCAST_NOT_FOUND message", () => {
  const { title, details } = ERROR_MESSAGES[ErrorCodes.PODCAST_NOT_FOUND];
  const errorState = shallow(<PodcastErrorState />).find(ErrorState);

  expect(errorState.exists()).toBe(true);
  expect(errorState.prop("title")).toBe(title);
  expect(errorState.prop("details")).toBe(details);
});

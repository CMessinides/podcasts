import React from "react";
import ErrorState from "./ErrorState";
import { shallow } from "enzyme";
import ERROR_MESSAGES, { ErrorCodes } from "../../strings/errorMessages";

it("renders a default error message", () => {
  const { title, details } = ERROR_MESSAGES[ErrorCodes.DEFAULT];
  const wrapper = shallow(<ErrorState />);
  const heading = wrapper.find("h1");
  const detail = wrapper.find("p");
  const btnGroup = wrapper.find(".btnGroup");

  expect(heading.exists()).toBe(true);
  expect(detail.exists()).toBe(true);
  expect(btnGroup.exists()).toBe(false);

  expect(heading.text()).toBe(title);
  expect(detail.text()).toBe(details);
});
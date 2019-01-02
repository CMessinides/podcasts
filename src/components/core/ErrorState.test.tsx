import React from "react";
import ErrorState from "./ErrorState";
import { shallow } from "enzyme";
import errorMsgs from "../../tokens/errorMessages.json";

it("renders a default error message", () => {
  const { title, details } = errorMsgs.DEFAULT;
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

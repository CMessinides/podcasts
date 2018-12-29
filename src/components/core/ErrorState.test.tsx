import React from "react";
import ErrorState from "./ErrorState";
import { shallow } from "enzyme";

it("renders a default error message", () => {
  const wrapper = shallow(<ErrorState />);
  const heading = wrapper.find("h1");
  const detail = wrapper.find("p");
  const btnGroup = wrapper.find(".btnGroup");

  expect(heading.exists()).toBe(true);
  expect(detail.exists()).toBe(true);
  expect(btnGroup.exists()).toBe(false);

  expect(heading.text()).toBe("Whoops!");
  expect(detail.text()).toBe(
    "We ran into an unexpected error. Please try reloading the page."
  );
});

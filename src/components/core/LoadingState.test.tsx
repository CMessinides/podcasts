import React from "react";
import LoadingState from "./LoadingState";
import { shallow, mount } from "enzyme";

const defaultDelay = 1000;

const Child = () => {
  return <div>Loading...</div>;
};

beforeEach(() => {
  jest.useFakeTimers();
});

it("should render", () => {
  expect(() =>
    shallow(
      <LoadingState>
        <Child />
      </LoadingState>
    )
  ).not.toThrow();
});

it(`should render children after a delay (default ${defaultDelay}ms)`, () => {
  const wrapper = mount(
    <LoadingState>
      <Child />
    </LoadingState>
  );

  expect(wrapper.find("div").exists()).toBe(false);

  jest.runTimersToTime(defaultDelay);
  wrapper.update();

  expect(wrapper.find("div").exists()).toBe(true);
});

it("should allow a custom delay", () => {
  const customDelay = 3000;
  const wrapper = mount(
    <LoadingState delay={customDelay}>
      <Child />
    </LoadingState>
  );

  jest.runTimersToTime(defaultDelay);
  wrapper.update();

  expect(wrapper.find("div").exists()).toBe(false);

  jest.runTimersToTime(customDelay - defaultDelay);
  wrapper.update();

  expect(wrapper.find("div").exists()).toBe(true);
});

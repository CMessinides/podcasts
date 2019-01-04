import React from "react";
import FallbackCoordinator, { FallbackContext } from "./FallbackCoordinator";
import { shallow, mount } from "enzyme";

class TestChild extends React.Component {
  static contextType = FallbackContext;
  context!: React.ContextType<typeof FallbackContext>;

  render() {
    return this.context.shouldFallback ? <div className="fallback" /> : null;
  }
}

const defaultDelay = 1000;

beforeEach(() => {
  jest.useFakeTimers();
});

it("should render", () => {
  expect(() => {
    shallow(
      <FallbackCoordinator>
        <TestChild />
      </FallbackCoordinator>
    );
  }).not.toThrow();
});

it("should initially provide { shouldFallback: false } to consumers", () => {
  const div = mount(
    <FallbackCoordinator>
      <TestChild />
    </FallbackCoordinator>
  ).find("div");

  expect(div.exists()).toBe(false);
});

it("should provide { shouldFallback: true } to consumers after a delay ", () => {
  const wrapper = mount(
    <FallbackCoordinator>
      <TestChild />
    </FallbackCoordinator>
  );

  expect(wrapper.find(".fallback").exists()).toBe(false);

  jest.runTimersToTime(defaultDelay);
  wrapper.update();

  expect(wrapper.find(".fallback").exists()).toBe(true);
});

it("should allow for a custom delay", () => {
  const customDelay = 3000;
  const wrapper = mount(
    <FallbackCoordinator delay={customDelay}>
      <TestChild />
    </FallbackCoordinator>
  );

  jest.advanceTimersByTime(defaultDelay);
  wrapper.update();

  expect(wrapper.find(".fallback").exists()).toBe(false);

  jest.advanceTimersByTime(customDelay - defaultDelay);
  wrapper.update();

  expect(wrapper.find(".fallback").exists()).toBe(true);
});

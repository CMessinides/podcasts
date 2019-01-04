import React from "react";
import { FallbackContext } from "./FallbackCoordinator";
import Fallback from "./Fallback";
import { shallow, mount } from "enzyme";

const Provider = FallbackContext.Provider;

it("should render", () => {
  expect(() => shallow(<Fallback>{() => null}</Fallback>)).not.toThrow();
});

it("should fallback if it has no provider", () => {
  expect.hasAssertions();

  mount(
    <Fallback>
      {({ shouldFallback }) => {
        expect(shouldFallback).toBe(true);
        return null;
      }}
    </Fallback>
  );
});

it("should pass the provided { shouldFallback } to the render function", () => {
  expect.hasAssertions();

  mount(
    <Provider value={{ shouldFallback: false }}>
      <Fallback>
        {({ shouldFallback }) => {
          expect(shouldFallback).toBe(false);
          return null;
        }}
      </Fallback>
    </Provider>
  );
});

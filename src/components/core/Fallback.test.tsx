import React from "react";
import {
  FallbackProvider,
  FallbackConsumer,
  FallbackContext,
  CanFallbackProps
} from "./Fallback";
import { shallow, mount } from "enzyme";

const { Provider } = FallbackContext;

class TestConsumer extends React.Component<{
  name: string;
  children: (renderProps: CanFallbackProps) => React.ReactNode;
}> {
  static contextType = FallbackContext;
  context!: React.ContextType<typeof FallbackContext>;

  componentDidMount() {
    if (typeof this.context.register !== "function") return;
    this.context.register(this.props.name);
  }

  componentWillUnmount() {
    if (typeof this.context.unregister !== "function") return;
    this.context.unregister(this.props.name);
  }

  render() {
    const renderProps = {
      shouldFallback: this.context.shouldFallback,
      staggerBy:
        (this.context.messages[this.props.name] &&
          this.context.messages[this.props.name].staggerBy) ||
        0
    };
    return this.props.children(renderProps);
  }
}

describe("FallbackProvider", () => {
  const defaultDelay = 1000;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  it("should render", () => {
    expect(() => {
      shallow(
        <FallbackProvider>
          <TestConsumer name="foo">{() => null}</TestConsumer>
        </FallbackProvider>
      );
    }).not.toThrow();
  });

  it("should initially provide { shouldFallback: false } to consumers", () => {
    const wrapper = mount(
      <FallbackProvider>
        <TestConsumer name="foo">
          {({ shouldFallback }) =>
            shouldFallback ? <div className="fallback" /> : null
          }
        </TestConsumer>
      </FallbackProvider>
    );

    expect(wrapper.find(".fallback").exists()).toBe(false);
  });

  describe("fallback delay", () => {
    const TestFallbackDelayChild = () => (
      <TestConsumer name="foo">
        {({ shouldFallback }) =>
          shouldFallback ? <div className="fallback" /> : null
        }
      </TestConsumer>
    );
    it("should provide { shouldFallback: true } to consumers after a delay ", () => {
      const wrapper = mount(
        <FallbackProvider>
          <TestFallbackDelayChild />
        </FallbackProvider>
      );

      expect(wrapper.find(".fallback").exists()).toBe(false);

      jest.runTimersToTime(defaultDelay);
      wrapper.update();

      expect(wrapper.find(".fallback").exists()).toBe(true);
    });

    it("should allow for a custom delay", () => {
      const customDelay = 3000;
      const wrapper = mount(
        <FallbackProvider fallbackAfter={customDelay}>
          <TestFallbackDelayChild />
        </FallbackProvider>
      );

      jest.advanceTimersByTime(defaultDelay);
      wrapper.update();

      expect(wrapper.find(".fallback").exists()).toBe(false);

      jest.advanceTimersByTime(customDelay - defaultDelay);
      wrapper.update();

      expect(wrapper.find(".fallback").exists()).toBe(true);
    });
  });

  describe("staggered animation delay", () => {
    const TestAnimationDelayChild = ({
      name,
      children
    }: {
      name: string;
      children: () => React.ReactNode;
    }) => <TestConsumer name={name}>{children}</TestConsumer>;

    it("should provide staggered animation delays to sibling consumers", () => {
      const renderFn1 = jest.fn(() => null);
      const renderFn2 = jest.fn(() => null);
      mount(
        <FallbackProvider>
          <TestAnimationDelayChild name="foo1">
            {renderFn1}
          </TestAnimationDelayChild>
          <TestAnimationDelayChild name="foo2">
            {renderFn2}
          </TestAnimationDelayChild>
        </FallbackProvider>
      );

      expect(renderFn1).toHaveBeenLastCalledWith(
        expect.objectContaining({ staggerBy: 0 })
      );
      expect(renderFn2).toHaveBeenLastCalledWith(
        expect.objectContaining({ staggerBy: 300 })
      );
    });
  });
});

describe("FallbackConsumer", () => {
  const renderFn = jest.fn(() => null);

  afterEach(() => {
    renderFn.mockClear();
  });

  it("should render", () => {
    expect(() =>
      shallow(<FallbackConsumer name="foo">{renderFn}</FallbackConsumer>)
    ).not.toThrow();
  });

  describe("without provider", () => {
    const ConsumerWithoutProvider = ({
      name = "name"
    }: { name?: string } = {}) => {
      return <FallbackConsumer name={name}>{renderFn}</FallbackConsumer>;
    };
    it("should pass { shouldFallback: true } to the render function", () => {
      mount(<ConsumerWithoutProvider />);

      expect(renderFn).toHaveBeenCalledWith(
        expect.objectContaining({ shouldFallback: true })
      );
    });

    it("should pass { staggerBy: 0 } to the render function", () => {
      mount(<ConsumerWithoutProvider />);

      expect(renderFn).toHaveBeenCalledWith(
        expect.objectContaining({ staggerBy: 0 })
      );
    });
  });

  describe("with provider", () => {
    const register = jest.fn(() => {});
    const unregister = jest.fn(() => {});

    const defaultContextValue = {
      shouldFallback: false,
      messages: {},
      register,
      unregister
    };

    const ConsumerWithProvider = ({
      name = "name",
      value = {}
    }: {
      name?: string;
      value?: Partial<React.ContextType<typeof FallbackContext>>;
    } = {}) => {
      return (
        <Provider value={{ ...defaultContextValue, ...value }}>
          <FallbackConsumer name={name}>{renderFn}</FallbackConsumer>
        </Provider>
      );
    };

    afterEach(() => {
      register.mockClear();
      unregister.mockClear();
    });

    it("should pass the provided { shouldFallback } to the render function", () => {
      mount(<ConsumerWithProvider />);

      expect(renderFn).toHaveBeenCalledWith(
        expect.objectContaining({ shouldFallback: false })
      );
    });

    it("should pass { staggerBy: 0 } to the render function if provided no message", () => {
      mount(<ConsumerWithProvider />);

      expect(renderFn).toHaveBeenCalledWith(
        expect.objectContaining({ staggerBy: 0 })
      );
    });

    it("should pass the provided { staggerBy } to the render function if provided a message", () => {
      const name = "hasMessage";
      const staggerBy = 300;
      mount(
        <ConsumerWithProvider
          name={name}
          value={{ messages: { [name]: { staggerBy } } }}
        />
      );

      expect(renderFn).toHaveBeenCalledWith(
        expect.objectContaining({ staggerBy })
      );
    });

    it("should call the provided { register() } function on mount", () => {
      const name = "consumer";
      mount(<ConsumerWithProvider name={name} />);

      expect(register).toHaveBeenCalledWith(name);
    });

    it("should call the provided { unregiester() } function on unmount", () => {
      const name = "consumer";
      mount(<ConsumerWithProvider name={name} />).unmount();

      expect(unregister).toHaveBeenCalledWith(name);
    });
  });
});

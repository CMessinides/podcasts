import React from "react";

type Message = { staggerBy: number };

type ProviderProps = Partial<ProviderDefaultProps>;

type ProviderDefaultProps = {
  fallbackAfter: number;
  staggerStart: number;
  staggerAmount: number;
};

type ProviderState = {
  value: Context;
  subscribers: string[];
  timeoutID?: number;
};

type ConsumerProps = {
  name: string;
  children: (renderProps: CanFallbackProps) => React.ReactNode;
};

type Context = {
  shouldFallback: boolean;
  messages: Record<string, Message>;
  register(name: string): void;
  unregister(name: string): void;
};

export interface CanFallbackProps {
  shouldFallback: boolean;
  staggerBy: number;
}

export const FallbackContext = React.createContext<Context>({
  shouldFallback: true,
  messages: {},
  register: () => {},
  unregister: () => {}
});

export class FallbackProvider extends React.Component<
  ProviderProps,
  ProviderState
> {
  static defaultProps: ProviderDefaultProps = {
    fallbackAfter: 1000,
    staggerStart: 0,
    staggerAmount: 300
  };

  constructor(props: ProviderProps) {
    super(props);

    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.updateStateWithSubscribers = this.updateStateWithSubscribers.bind(
      this
    );

    this.state = {
      value: {
        shouldFallback: this.props.fallbackAfter === 0 ? true : false,
        messages: {},
        register: this.register,
        unregister: this.unregister
      },
      subscribers: []
    };
  }

  register(name: string) {
    this.setState(state => {
      const index = state.subscribers.indexOf(name);
      if (index !== -1) return state;
      const subscribers = [...state.subscribers, name];
      return this.updateStateWithSubscribers(state, subscribers);
    });
  }

  unregister(name: string) {
    this.setState(state => {
      const index = state.subscribers.indexOf(name);
      if (index === -1) return state;
      const subscribers = [
        ...state.subscribers.slice(0, index),
        ...state.subscribers.slice(index + 1)
      ];
      return this.updateStateWithSubscribers(state, subscribers);
    });
  }

  updateStateWithSubscribers(
    state: ProviderState,
    subscribers: string[]
  ): ProviderState {
    const messages = subscribers.reduce(
      (acc, name, i) => {
        acc[name] = {
          staggerBy: i * this.props.staggerAmount! + this.props.staggerStart!
        };
        return acc;
      },
      {} as Record<string, Message>
    );

    return {
      ...state,
      subscribers,
      value: {
        ...state.value,
        messages
      }
    };
  }

  componentDidMount() {
    if (this.props.fallbackAfter !== 0) {
      const timeoutID = window.setTimeout(() => {
        this.setState(state => {
          return {
            ...state,
            value: {
              ...state.value,
              shouldFallback: true
            }
          };
        });
      }, this.props.fallbackAfter!);
      this.setState({ timeoutID });
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.state.timeoutID);
  }

  render() {
    return (
      <FallbackContext.Provider value={this.state.value}>
        {this.props.children}
      </FallbackContext.Provider>
    );
  }
}

export class FallbackConsumer extends React.Component<ConsumerProps> {
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
    return this.props.children({
      shouldFallback: this.context.shouldFallback,
      staggerBy:
        (this.context.messages &&
          this.context.messages[this.props.name] &&
          this.context.messages[this.props.name].staggerBy) ||
        0
    });
  }
}

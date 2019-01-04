import React from "react";

type FallbackCoordinatorProps = {
  delay?: number;
};

type FallbackCoordinatorState = {
  value: { shouldFallback: boolean };
  timeoutID?: number;
};

export const FallbackContext = React.createContext<{ shouldFallback: boolean }>(
  { shouldFallback: true }
);

export default class FallbackCoordinator extends React.Component<
  FallbackCoordinatorProps,
  FallbackCoordinatorState
> {
  state: FallbackCoordinatorState = {
    value: { shouldFallback: false }
  };

  componentDidMount() {
    const delay = this.props.delay || 1000;
    const timeoutID = window.setTimeout(() => {
      this.setState({ value: { shouldFallback: true } });
    }, delay);
    this.setState({ timeoutID });
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

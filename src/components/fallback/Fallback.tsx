import React from "react";
import { FallbackContext } from "./FallbackCoordinator";

type FallbackProps = {
  children: (renderProps: { shouldFallback: boolean }) => React.ReactNode;
};

export default class Fallback extends React.Component<FallbackProps> {
  render() {
    return (
      <FallbackContext.Consumer>
        {({ shouldFallback }) => this.props.children({ shouldFallback })}
      </FallbackContext.Consumer>
    );
  }
}

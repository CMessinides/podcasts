import { Component } from "react";

interface LoadingStateProps {
  delay?: number;
}

interface LoadingStateState {
  shouldFallback: boolean;
  timeoutID?: number;
}

export default class LoadingState extends Component<
  LoadingStateProps,
  LoadingStateState
> {
  constructor(props: LoadingStateProps) {
    super(props);

    this.state = {
      shouldFallback: false
    };
  }

  componentDidMount() {
    const delay = this.props.delay || 1000;
    const timeoutID = window.setTimeout(() => {
      this.setState({ shouldFallback: true });
    }, delay);
    this.setState({ timeoutID });
  }

  componentWillUnmount() {
    window.clearTimeout(this.state.timeoutID);
  }

  render() {
    if (this.state.shouldFallback) {
      return this.props.children;
    }
    return null;
  }
}

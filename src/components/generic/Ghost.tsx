import { Component } from "react";

interface GhostProps {
  delay?: number;
}

interface GhostState {
  shouldFallback: boolean;
  timeoutID?: number;
}

export default class Ghost extends Component<GhostProps, GhostState> {
  constructor(props: GhostProps) {
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

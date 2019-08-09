import React, { Component } from "react";
import { State, Action, FetchPodcastAction } from "../../store/types";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Podcast, isComplete } from "../../types";
import actions from "../../store/actions";
import PodcastErrorState from "./PodcastErrorState";

interface PodcastViewBaseProps {
  podcast: Podcast;
  fetchPodcast(ID: number): Promise<FetchPodcastAction>;
}

export class PodcastViewBase extends Component<PodcastViewBaseProps> {
  constructor(props: PodcastViewBaseProps) {
    super(props);

    this.fetchPodcastIfNeeded = this.fetchPodcastIfNeeded.bind(this);
  }

  fetchPodcastIfNeeded() {
    if (this.props.podcast.pending === undefined) {
      this.props.fetchPodcast(this.props.podcast.data.ID);
    }
  }

  componentDidMount() {
    this.fetchPodcastIfNeeded();
  }

  componentDidUpdate() {
    this.fetchPodcastIfNeeded();
  }

  render() {
    const podcast = this.props.podcast;

    if (isComplete(podcast)) {
    }

    // It's possible that a podcast both has an error and is pending,
    // i.e. the user encountered the error on a previous attempt and
    // is now retrying. In that case, we'll want to prefer the pending
    // status and show a loading indicator.
    if (!podcast.pending && podcast.error) {
      return <PodcastErrorState />;
    }

    if (podcast.pending) {
    }

    return null;
  }
}

const mapStateToProps = (state: State, { ID }: { ID: number }) => {
  return {
    podcast: state.podcasts[ID] || { data: { ID } }
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<State, null, Action>) => {
  return {
    fetchPodcast(ID: number) {
      return dispatch(actions.fetchPodcast(ID));
    }
  };
};

const PodcastView = connect(
  mapStateToProps,
  mapDispatchToProps
)(PodcastViewBase);

export default PodcastView;

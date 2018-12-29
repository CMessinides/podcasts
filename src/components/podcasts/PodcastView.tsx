import React, { Component } from "react";
import { State, Action, FetchPodcastAction } from "../../store/types";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Podcast, isComplete } from "../../types";
import PodcastHeader from "./PodcastHeader";
import actions from "../../store/actions";
import PodcastEpisodesList from "./PodcastEpisodesList";
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

  shouldComponentUpdate({ podcast: next }: Readonly<PodcastViewBaseProps>) {
    const prev = this.props.podcast;
    return (
      next.pending !== prev.pending ||
      next.error !== prev.error ||
      next.lastUpdated !== prev.lastUpdated ||
      false
    );
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
      return (
        <>
          <PodcastHeader podcast={podcast} />
          <PodcastEpisodesList podcastID={podcast.data.ID} />
        </>
      );
    } else if (podcast.pending === true) {
      return <PodcastHeader />;
    } else if (podcast.error) {
      return <PodcastErrorState />;
    } else {
      return null;
    }
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

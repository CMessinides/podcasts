import React, { Component, Suspense, Fragment } from "react";
import {
  State,
  ActionCreators,
  Action,
  FetchPodcastAction
} from "../../store/types";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Podcast, isComplete, CompletePodcast } from "../../types";

type FetchPodcastFn = (ID: number) => Promise<FetchPodcastAction>;

interface ConnectedPodcastViewProps {
  ID: number;
}

interface PodcastViewProps {
  podcast: Podcast;
  fetchPodcast: FetchPodcastFn;
}

interface CompletePodcastViewProps {
  podcast: CompletePodcast;
}

export function GhostPodcastView() {
  return <div>Podcast loading...</div>;
}

export function CompletePodcastView({ podcast }: CompletePodcastViewProps) {
  return (
    <div>
      <h2>{podcast.data.name}</h2>
      <p>{podcast.data.author.name}</p>
    </div>
  );
}

export class PodcastView extends Component<PodcastViewProps> {
  constructor(props: PodcastViewProps) {
    super(props);
  }

  shouldComponentUpdate({ podcast: nextPodcast }: Readonly<PodcastViewProps>) {
    if (nextPodcast.pending !== this.props.podcast.pending) {
      return true;
    }

    if (nextPodcast.error !== this.props.podcast.error) {
      return true;
    }

    if (nextPodcast.lastUpdated !== this.props.podcast.lastUpdated) {
      return true;
    }

    return false;
  }

  render() {
    const podcast = this.props.podcast;
    if (isComplete(podcast)) {
      return <CompletePodcastView podcast={podcast} />;
    } else if (podcast.pending === true) {
      return <GhostPodcastView />;
    } else if (podcast.error) {
      return <div>{podcast.error.message}</div>;
    } else {
      this.props.fetchPodcast(podcast.data.ID);
      return <Fragment />;
    }
  }
}

export default function createPodcastView(actions: ActionCreators) {
  const mapStateToProps = (state: State, { ID }: ConnectedPodcastViewProps) => {
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

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(PodcastView);
}

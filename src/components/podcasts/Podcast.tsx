import React, { Suspense } from "react";
import {
  State,
  ActionCreators,
  Action,
  FetchPodcastAction
} from "../../store/types";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import {
  Podcast,
  isComplete,
  IncompletePodcast,
  CompletePodcast
} from "../../types";

type FetchPodcastFn = (ID: number) => Promise<FetchPodcastAction>;

interface ConnectedPodcastViewProps {
  ID: number;
}

interface PodcastViewProps extends ConnectedPodcastViewProps {
  podcast?: Podcast;
  fetchPodcast: FetchPodcastFn;
}

interface IncompletePodcastViewProps {
  podcast: IncompletePodcast;
}

interface CompletePodcastViewProps {
  podcast: CompletePodcast;
}

export function GhostPodcastView() {
  return <div>Podcast loading...</div>;
}

export function IncompletePodcastView({ podcast }: IncompletePodcastViewProps) {
  if (podcast.error) {
    return <div>{podcast.error.message}</div>;
  }

  return <GhostPodcastView />;
}

export function CompletePodcastView({ podcast }: CompletePodcastViewProps) {
  return (
    <div>
      <h2>{podcast.data.name}</h2>
      <p>{podcast.data.author.name}</p>
    </div>
  );
}

export function PodcastViewSwitch({
  ID,
  podcast,
  fetchPodcast
}: PodcastViewProps) {
  if (podcast === undefined) {
    throw fetchPodcast(ID);
  } else if (isComplete(podcast)) {
    return <CompletePodcastView podcast={podcast} />;
  } else {
    return <IncompletePodcastView podcast={podcast} />;
  }
}

export function PodcastView(props: PodcastViewProps) {
  return (
    <Suspense fallback={<GhostPodcastView />}>
      <PodcastViewSwitch {...props} />
    </Suspense>
  );
}

export default function createPodcastView(actions: ActionCreators) {
  const mapStateToProps = (state: State, { ID }: ConnectedPodcastViewProps) => {
    return {
      podcast: state.podcasts[ID]
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

import React from "react";
import { ActionCreators } from "../store/types";
import createPodcastView from "./podcasts/PodcastView";
import { Router as ReachRouter, RouteComponentProps } from "@reach/router";

export default function createRouter(actions: ActionCreators) {
  const PodcastView = createPodcastView(actions);

  function PodcastPage(props: RouteComponentProps<{ ID?: string }>) {
    if (props.ID && parseInt(props.ID, 10)) {
      return <PodcastView ID={parseInt(props.ID, 10)} />;
    }

    // TODO: Add a better fallback!
    return <div>No ID provided!</div>;
  }

  return function Router() {
    return (
      <ReachRouter>
        <PodcastPage path="podcasts/:ID" />
      </ReachRouter>
    );
  };
}

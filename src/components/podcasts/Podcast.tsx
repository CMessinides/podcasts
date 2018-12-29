import React from "react";
import { RouteComponentProps } from "@reach/router";
import PodcastView from "./PodcastView";

export default function Podcast(props: RouteComponentProps<{ ID?: string }>) {
  if (props.ID && parseInt(props.ID, 10)) {
    return <PodcastView ID={parseInt(props.ID, 10)} />;
  }

  // TODO: Add a better fallback!
  return <div>No ID provided!</div>;
}

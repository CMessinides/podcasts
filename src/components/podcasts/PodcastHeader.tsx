import React from "react";
import LoadingState from "../core/LoadingState";
import { CompletePodcast } from "../../types";

export default function PodcastHeader({
  podcast
}: {
  podcast?: CompletePodcast;
}) {
  if (podcast) {
    return (
      <div>
        <h2>{podcast.data.name}</h2>
        <p>{podcast.data.author.name}</p>
      </div>
    );
  } else {
    return (
      <LoadingState>
        <div>Podcast loading...</div>
      </LoadingState>
    );
  }
}

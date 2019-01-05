import React from "react";
import { CompletePodcast } from "../../types";

export default function PodcastHeader({
  podcast
}: {
  podcast?: CompletePodcast;
}) {
  if (podcast !== undefined) {
    return (
      <div>
        <h2>{podcast.data.name}</h2>
        <p>{podcast.data.author.name}</p>
      </div>
    );
  } else {
    return <div>Podcast loading...</div>;
  }
}

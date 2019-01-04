import React from "react";
import Fallback from "../fallback/Fallback";
import { CompletePodcast } from "../../types";

export default function PodcastHeader({
  podcast
}: {
  podcast?: CompletePodcast;
}) {
  return (
    <Fallback>
      {({ shouldFallback }) => {
        if (podcast !== undefined) {
          return (
            <div>
              <h2>{podcast.data.name}</h2>
              <p>{podcast.data.author.name}</p>
            </div>
          );
        } else if (shouldFallback) {
          return <div>Podcast loading...</div>;
        } else {
          return null;
        }
      }}
    </Fallback>
  );
}

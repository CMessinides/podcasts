import React from "react";
import ErrorState from "../core/ErrorState";
import errorMsgs from "../../tokens/data/errorMessages.json";

export default function PodcastErrorState() {
  const error = errorMsgs.PODCAST_NOT_FOUND;
  return <ErrorState {...error} />;
}

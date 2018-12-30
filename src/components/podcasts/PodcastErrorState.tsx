import React from "react";
import ErrorState from "../core/ErrorState";
import errorMsg from "../../tokens/errorMsg";

export default function PodcastErrorState() {
  const error = errorMsg("PODCAST_NOT_FOUND");
  return <ErrorState {...error} />;
}

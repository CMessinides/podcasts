import React from "react";
import ErrorState from "../core/ErrorState";
import ERROR_MESSAGES, { ErrorCodes } from "../../strings/errorMessages";

export default function PodcastErrorState() {
  const error = ERROR_MESSAGES[ErrorCodes.PODCAST_NOT_FOUND];
  return <ErrorState {...error} />;
}

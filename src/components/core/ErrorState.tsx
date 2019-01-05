import React from "react";
import errorMsgs from "../../tokens/data/errorMessages.json";

interface ErrorStateProps {
  title?: string;
  details?: string;
}

const defaultMessage = errorMsgs.DEFAULT;

export default function ErrorState({
  title = defaultMessage.title,
  details = defaultMessage.details
}: ErrorStateProps = {}) {
  return (
    <>
      <h1>{title}</h1>
      <p>{details}</p>
    </>
  );
}

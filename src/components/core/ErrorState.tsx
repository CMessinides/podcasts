import React from "react";
import ERROR_MESSAGES, { ErrorCodes } from "../../strings/errorMessages";

interface ErrorStateProps {
  title?: string;
  details?: string;
}

const defaultMessage = ERROR_MESSAGES[ErrorCodes.DEFAULT];

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

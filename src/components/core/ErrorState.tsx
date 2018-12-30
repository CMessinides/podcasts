import React from "react";
import errorMsg from "../../tokens/errorMsg";

interface ErrorStateProps {
  title?: string;
  details?: string;
}

const defaultMessage = errorMsg();

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

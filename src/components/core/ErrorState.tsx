import React from "react";

export default function ErrorState({
  title = "Whoops!",
  detail = "We ran into an unexpected error. Please try reloading the page."
}: {
  title?: string;
  detail?: string;
}) {
  return (
    <>
      <h1>{title}</h1>
      <p>{detail}</p>
    </>
  );
}

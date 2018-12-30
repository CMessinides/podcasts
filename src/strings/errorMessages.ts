interface ErrorMessage {
  title: string;
  details: string;
}

export enum ErrorCodes {
  DEFAULT,
  PODCAST_NOT_FOUND
}

const ERROR_MESSAGES: Readonly<{ [x in ErrorCodes]: ErrorMessage }> = {
  [ErrorCodes.DEFAULT]: {
    title: "Error",
    details: "We ran into an unexpected error. Please try reloading the page."
  },
  [ErrorCodes.PODCAST_NOT_FOUND]: {
    title: "Podcast Not Found",
    details: "We couldn't find the podcast you were looking for."
  }
};

export default ERROR_MESSAGES;

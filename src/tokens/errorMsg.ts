import errorMessages from "./data/errorMessages.json";

type ErrorMessageMap = { [c in ErrorMessageCode]: ErrorMessage };

type ErrorMessageCode = "DEFAULT" | "PODCAST_NOT_FOUND";

interface ErrorMessage {
  title: string;
  details: string;
}

export default function errorMsg(code: ErrorMessageCode = "DEFAULT") {
  return (<ErrorMessageMap>errorMessages)[code];
}

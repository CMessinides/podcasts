export type ColorMap = { [c in ColorName]: ColorScale };

export type ColorScale = { [l in ColorLevel]: Color };

export type Color = {
  r: number;
  g: number;
  b: number;
};

export type ColorName = "grey" | "brand" | "success" | "warning" | "error";
export type ColorLevel =
  | "lighter"
  | "light"
  | "default"
  | "dark"
  | "darker"
  | "text";

export type ErrorMessageMap = { [c in ErrorMessageCode]: ErrorMessage };

export type ErrorMessageCode = "DEFAULT" | "PODCAST_NOT_FOUND";

export interface ErrorMessage {
  title: string;
  details: string;
}

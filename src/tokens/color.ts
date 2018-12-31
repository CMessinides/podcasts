import colors from "./data/colors.json";

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

export function rgba(r: number, g: number, b: number, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function color(
  name: ColorName | "white" | "black",
  {
    level = "default",
    alpha = 1
  }: {
    level?: ColorLevel;
    alpha?: number;
  } = {}
) {
  if (name === "white") return rgba(255, 255, 255, alpha);
  if (name === "black") return rgba(0, 0, 0, alpha);

  const scale = (<ColorMap>colors)[name];
  if (!scale) return "";

  const color = scale[level];
  if (!color) return "";

  return rgba(color.r, color.g, color.b, alpha);
}

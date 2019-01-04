import colorData from "./colors.json";
import rgba from "../styles/utils/rgba.js";

type ColorLabel = "grey" | "brand" | "success" | "error" | "warning";
type ColorLevel = "lighter" | "light" | "default" | "dark" | "darker" | "text";
type ColorData = Record<
  ColorLabel,
  Record<ColorLevel, [number, number, number]>
>;
type ColorMap = Record<ColorLabel, Record<ColorLevel, string>>;

const colors: ColorMap = Object.keys(colorData).reduce(
  (acc: ColorMap, label) => {
    const scale = (<ColorData>colorData)[<ColorLabel>label];
    return {
      ...acc,
      [<ColorLabel>label]: Object.keys(scale).reduce(
        (acc: Record<ColorLevel, string>, level) => {
          return {
            ...acc,
            [<ColorLevel>level]: rgba(...scale[<ColorLevel>level])
          };
        },
        {} as Record<ColorLevel, string>
      )
    };
  },
  {} as ColorMap
);

export default colors;

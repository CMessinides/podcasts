import colorData from "./data/colors.json";
import rgba from "../styles/utils/rgba";

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
          const [r, g, b] = scale[<ColorLevel>level];
          return {
            ...acc,
            [<ColorLevel>level]: rgba(r, g, b)
          };
        },
        {} as Record<ColorLevel, string>
      )
    };
  },
  {} as ColorMap
);

export default colors;

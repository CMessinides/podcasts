import { css } from "../styled-components";
import { ArgumentsType, CssFunction } from "./types";

type SizeMap = typeof sizes;
type SizeLevel = keyof SizeMap;

const sizes = {
  lg: 960,
  md: 640,
  sm: 400
};

const media = Object.keys(sizes).reduce(
  (acc, label) => {
    const fn = (
      ...args: ArgumentsType<CssFunction>
    ): ReturnType<CssFunction> => css`
      @media (min-width: ${sizes[label as SizeLevel] / 16}em) {
        ${css(...args)}
      }
    `;
    acc[label as SizeLevel] = fn;
    return acc;
  },
  {} as Record<
    SizeLevel,
    (...args: ArgumentsType<CssFunction>) => ReturnType<CssFunction>
  >
);

export default media;

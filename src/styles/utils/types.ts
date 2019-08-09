import { ThemeInterface } from "../theme";
import { BaseThemedCssFunction } from "styled-components";

export type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never;
export type CssFunction = BaseThemedCssFunction<ThemeInterface>;

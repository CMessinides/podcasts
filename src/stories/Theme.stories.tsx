import React from "react";
import { storiesOf } from "@storybook/react";
import color, {
  rgba,
  ColorMap,
  ColorName,
  ColorLevel,
  ColorScale
} from "../tokens/color";
import colors from "../tokens/data/colors.json";
import styled from "../styles/styled-components";

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 16px;
`;

const ColorStack = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 4px 10px 0 ${color("black", { alpha: 0.12 })};
`;

interface SwatchProps {
  bg: string;
  fg: string;
}

const ColorItem = styled.li<SwatchProps>`
  background-color: ${props => props.bg};
  padding: 20px 12px;
  color: ${props => props.fg};
`;

function ColorScaleView({ name, scale }: { name: string; scale: ColorScale }) {
  return (
    <div>
      <h2>{capitalize(name)}</h2>
      <ColorStack>
        {Object.keys(scale).map(key => {
          const { r, g, b } = scale[key as ColorLevel];
          const bg = rgba(r, g, b, 1);
          const fg =
            key === "light" || key === "lighter"
              ? rgba(scale.text.r, scale.text.g, scale.text.b, 1)
              : color("white");
          return (
            <ColorItem {...{ key, bg, fg }}>
              {capitalize(name)} ({capitalize(key)})
            </ColorItem>
          );
        })}
      </ColorStack>
    </div>
  );
}

function ThemeColors({ colors }: { colors: ColorMap }) {
  return (
    <ColorGrid>
      {Object.keys(colors).map(key => {
        const scale = colors[key as ColorName];
        return <ColorScaleView {...{ key, name: key, scale }} />;
      })}
    </ColorGrid>
  );
}

function capitalize(s: string): string {
  const [first, ...rest] = s;
  return first.toUpperCase() + rest.join("");
}

storiesOf("Theme", module).add("colors", () => <ThemeColors colors={colors} />);

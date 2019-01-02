import React from "react";
import { storiesOf } from "@storybook/react";
import rgba from "../styles/utils/rgba";
import colors from "../tokens/colors.json";
import styled from "../styles/styled-components";

type ColorMap = { [c: string]: ColorScale };
type ColorScale = { [l: string]: Color };
type Color = [number, number, number];

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
  box-shadow: 0 4px 10px 0 ${rgba(0, 0, 0, 0.12)};
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
          const bg = rgba(...(scale[key] as Color));
          const fg =
            key === "light" || key === "lighter"
              ? rgba(...scale.text)
              : rgba(255, 255, 255);
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

function ThemeColors() {
  return (
    <ColorGrid>
      {Object.keys(colors).map(key => {
        const scale = ((colors as unknown) as ColorMap)[key];
        return <ColorScaleView {...{ key, name: key, scale }} />;
      })}
    </ColorGrid>
  );
}

function capitalize(s: string): string {
  const [first, ...rest] = s;
  return first.toUpperCase() + rest.join("");
}

storiesOf("Theme", module).add("colors", () => <ThemeColors />);

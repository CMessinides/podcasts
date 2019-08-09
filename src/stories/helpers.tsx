import React from "react";
import { RenderFunction } from "@storybook/react";

interface WrapperProps {
  maxWidth?: string;
  margin?: string;
  padding?: string;
}

export const Wrapper: React.FunctionComponent<WrapperProps> = function({
  maxWidth = "600px",
  margin = "0 auto",
  padding = "20px",
  children
}) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin,
        padding,
        maxWidth
      }}
    >
      {children}
    </div>
  );
};

export function withWrapper(story: RenderFunction) {
  return <Wrapper>{story()}</Wrapper>;
}

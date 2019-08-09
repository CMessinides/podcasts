import React from "react";
import styled from "../../styles/styled-components";
import { TextPlaceholder, PlaceholderProps } from "./Placeholder";
import media from "../../styles/utils/media";
import typescale from "../../styles/utils/typescale";

interface PageTitleProps {
  placeholder?: Pick<PlaceholderProps, "play" | "delay">;
}

const PageTitleBase = styled.h2`
  ${typescale("h5")}
  font-weight: 600;

  ${media.sm`
    ${typescale("h4")}
  `}
`;

const PageTitle: React.FunctionComponent<PageTitleProps> = function({
  placeholder,
  children
}) {
  return placeholder ? (
    <TextPlaceholder
      level="h4"
      play={placeholder.play}
      delay={placeholder.delay}
    />
  ) : (
    <PageTitleBase>{children}</PageTitleBase>
  );
};

export default PageTitle;

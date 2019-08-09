import typography from "../../tokens/data/typography.json";
import styled, { keyframes } from "../../styles/styled-components";
import colors from "../../tokens/colors";

type TypeLevel = keyof typeof typography;

export interface PlaceholderProps {
  play?: boolean;
  delay?: number;
  maxHeight?: string;
  maxWidth?: string;
}

export interface BlockPlaceholderProps extends PlaceholderProps {
  height?: string;
  width?: string;
}

export interface TextPlaceholderProps extends PlaceholderProps {
  level?: TypeLevel;
}

export interface ParagraphPlaceholderProps extends TextPlaceholderProps {
  lines: number;
}

const fade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const PlaceholderBase = styled.div.attrs({ role: "presentation" })<
  PlaceholderProps
>`
  animation: ${fade} 1s ease-in-out infinite alternate both;
  animation-delay: ${props => (props.delay !== undefined ? props.delay : 0)}ms;
  animation-play-state: ${props => (props.play ? "running" : "paused")};
  max-height: ${({ maxHeight = "100%" }) => maxHeight};
  max-width: ${({ maxWidth = "100%" }) => maxWidth};
`;

export const BlockPlaceholder = styled(PlaceholderBase)<BlockPlaceholderProps>`
  background-color: ${colors.grey.light};
  height: ${({ height = "100%" }) => height};
  width: ${({ width = "100%" }) => width};
`;

export const TextPlaceholder = styled(PlaceholderBase)<TextPlaceholderProps>`
  background-color: ${colors.grey.light};
  height: ${({ level = "body" }: { level?: TypeLevel }) =>
    typography[level].size / 16}rem;
`;

export const ParagraphPlaceholder = styled(PlaceholderBase)<
  ParagraphPlaceholderProps
>`
  background: repeating-linear-gradient(
    180deg,
    ${colors.grey.light}
      ${({ level = "body" }: { level?: TypeLevel }) => {
        return typography[level].size / 16;
      }}rem,
    ${({ level = "body" }: { level?: TypeLevel }) => {
      const { size: fontSize, leading } = typography[level];
      return (leading - fontSize) / 16;
    }}rem
  );
  height: ${({
    lines,
    level = "body"
  }: {
    lines: number;
    level?: TypeLevel;
  }) => {
    const { leading } = typography[level];
    return (lines * leading) / 16;
  }}rem;
`;

import React from "react";
import { storiesOf } from "@storybook/react";
import colors from "../tokens/colors";
import styled, { keyframes } from "../styles/styled-components";
import {
  FallbackProvider,
  FallbackConsumer
} from "../components/core/Fallback";

const fade = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`;

const SkeletonItem = styled.div<{ delay?: number }>`
  background-color: ${colors.grey.light};
  height: 80px;
  border-radius: 4px;
  animation: ${fade} 1s ease-in-out infinite alternate both;
  animation-delay: ${props => (props.delay !== undefined ? props.delay : 0)}ms
  margin: 20px auto;
  max-width: 500px;
`;

storiesOf("Fallback", module).add("basic", () => (
  <FallbackProvider>
    {["fb1", "fb2", "fb3", "fb4", "fb5"].map(key => (
      <FallbackConsumer key={key} name={key}>
        {({ shouldFallback, staggerBy }) =>
          shouldFallback ? <SkeletonItem delay={staggerBy} /> : null
        }
      </FallbackConsumer>
    ))}
  </FallbackProvider>
));

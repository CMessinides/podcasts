import { css } from "../styled-components";

const sizes = {
  lg: 960,
  md: 640,
  sm: 400
};

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label] / 16}em) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

export default media;

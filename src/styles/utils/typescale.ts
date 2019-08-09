import typography from "../../tokens/data/typography.json";

export default function typescale(level: keyof typeof typography = "body") {
  const { size, leading } = typography[level];
  return `
    font-size: ${size / 16}rem;
    line-height: ${leading / size};
  `;
}

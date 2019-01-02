export default function rgba(...color: [number, number, number, number?]) {
  const alpha = color[3] !== undefined ? color[3] : 1;
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

export interface ThemeInterface {
  borderRadius: string;
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
}

const theme: ThemeInterface = {
  borderRadius: "4px",
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 32,
    xl: 64,
    xxl: 128
  }
};

export default theme;

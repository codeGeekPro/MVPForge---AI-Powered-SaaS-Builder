// theme.ts
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#e3f9f5",
      100: "#c1ece4",
      200: "#a1dfd3",
      300: "#7fd2c2",
      400: "#5ec5b1",
      500: "#3db89f",
      600: "#319383",
      700: "#246e67",
      800: "#16494b",
      900: "#08242f",
    },
  },
  fonts: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  components: {
    Button: {
      variants: {
        subtle: { bg: "brand.50", color: "brand.800" },
        solid: { bg: "brand.500", color: "white" },
      },
    },
  },
});

export default theme;

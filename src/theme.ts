import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    gray: {
      50: "#f9f9f9",
      100: "#ededed",
      200: "#d3d3d3",
      300: "#b3b3b3",
      400: "#a0a0a0",
      500: "#898989",
      600: "#6c6c6c",
      700: "#202020",
      800: "#121212",
      900: "#111",
    },
  },
  components: {
    Button: {
      variants: {
        solid: (props: { colorScheme: string }) => {
          const { colorScheme } = props;
          if (
            colorScheme === "green" ||
            colorScheme === "red" ||
            colorScheme === "blue" ||
            colorScheme === "teal" ||
            colorScheme === "grey"
          ) {
            return {
              bg: `${colorScheme}.900`,
              color: "gray.200",
              _hover: {
                bg: `${colorScheme}.700`,
                color: "gray.100",
              },
              _active: {
                bg: `${colorScheme}.700`,
                color: "gray.100",
              },
            };
          }
          return {};
        },
      },
    },
  },
});

export default theme;

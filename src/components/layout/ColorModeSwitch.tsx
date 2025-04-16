import { HStack, Switch, Text, useColorMode } from "@chakra-ui/react";
import { useEffect } from "react";

const ColorModeSwitch = () => {
  const { toggleColorMode, colorMode } = useColorMode();

  return (
    <HStack spacing={1} alignItems="center">
      <Switch
        size="sm"
        colorScheme="green"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
      {/* <Text
        fontSize="0.65rem"
        lineHeight="1"
        as="em"
        whiteSpace="nowrap"
        color="gray.500"
      >
        Dark Mode
      </Text> */}
    </HStack>
  );
};

export default ColorModeSwitch;

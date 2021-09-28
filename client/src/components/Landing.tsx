import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, LightMode, useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

interface LandingProps { }

export const Landing: React.FC<LandingProps> = ({ }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Flex h="100%" maxW={1000} w="100%" mx="auto" my="15%" px={5} flexDirection="column">
      <Heading size="4xl">Welcome to CareerBird.</Heading>
      <Heading size="xl" mt={4}>Connecting you to opportunity.</Heading>
      <Box mt={6}>
        <LightMode>
          <NextLink href="/register">
            <Button colorScheme="red">
              Get Started
            </Button>
          </NextLink>
          <Button colorScheme="red" onClick={toggleColorMode}>
            toggle
          </Button>
        </LightMode>
      </Box>
    </Flex>
  );
};

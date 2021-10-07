import { Button } from "@chakra-ui/button";
import { Box, Flex, Heading, LightMode } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

interface LandingProps { }

export const Landing: React.FC<LandingProps> = ({ }) => {
  return (
    <Flex
      h="100%"
      maxW={1000}
      w="100%"
      mx="auto"
      px={5}
      justifyContent="center"
      flexDirection="column"
    >
      <Heading size="4xl">
        Welcome to
        <Box as="span" color="red.400">
          {" "}
          CareerBird.
        </Box>
      </Heading>
      <Heading size="xl" mt={4}>
        Connecting you to opportunity.
      </Heading>
      <Box mt={6}>
        <LightMode>
          <NextLink href="/register">
            <Button colorScheme="red">Get Started</Button>
          </NextLink>
        </LightMode>
      </Box>
    </Flex>
  );
};

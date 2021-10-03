import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Flex, Link } from "@chakra-ui/layout";
import { Button, IconButton, Image, useColorMode } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import {
  MeDocument,
  useLogoutMutation,
  useMeQuery,
} from "../generated/graphql";

interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [logout, { loading: logoutLoading, error }] = useLogoutMutation();
  const { data, loading: meLoading } = useMeQuery();
  let body = null;

  if (meLoading) {
    body = null;
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2} color="white">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout({
              update: (cache) => {
                cache.writeQuery({
                  query: MeDocument,
                  data: {
                    me: null,
                  },
                });
              },
            });
          }}
          isLoading={logoutLoading}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato">
      <NextLink href="/">
        <Link maxW={65} maxH={65} mx={2} my="auto">
          <Image src="/assets/CareerBird.png" alt="careerbird" />
        </Link>
      </NextLink>
      <Box ml="auto" p={4}>
        <IconButton
          aria-label="Toggle Color Mode"
          icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          mr={4}
          onClick={toggleColorMode}
        />
        {body}
      </Box>
    </Flex>
  );
};

import { Box, Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { useMeQuery } from "../generated/graphql";
import { ListingCard } from "./ListingCard";

interface HomeProps { }

export const Home: React.FC<HomeProps> = ({ }) => {
  const { data, loading } = useMeQuery();
  return loading ? null : !data ? null : (
    <>
      <Flex m={20}>
        <Heading>
          Welcome,{" "}
          <Box as="span" ml={2} color="red.400">
            {data.me?.username}
          </Box>
          .
        </Heading>
      </Flex>
      <ListingCard />
    </>
  );
};

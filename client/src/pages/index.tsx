import { Flex } from "@chakra-ui/react";
import React from "react";
import { Home } from "../components/Home";
import { Landing } from "../components/Landing";
import { NavBar } from "../components/NavBar";
import { useMeQuery } from "../generated/graphql";

const Index = () => {
  const { loading, error, data } = useMeQuery();
  return (
    <Flex h="100vh" flexDirection="column">
      <NavBar />
      {loading ? null : !data?.me ? <Landing /> : <Home />}
    </Flex>
  );
};

export default Index;

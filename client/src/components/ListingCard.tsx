import { Box, useAccordionItem } from "@chakra-ui/react";
import React from "react";

interface ListingCardProps { }

export const ListingCard: React.FC<ListingCardProps> = ({ ...props }) => {
  return (
    <Box
      maxW={350}
      maxH={450}
      h="100%"
      w="100%"
      borderWidth={1}
      shadow="lg"
      rounded="lg"
      backgroundColor="white"
      mx="auto"
      {...props}
    ></Box>
  );
};

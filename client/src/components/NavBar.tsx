import { Box, Flex, Link } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import {
	MeDocument,
	useLogoutMutation,
	useMeQuery,
} from "../generated/graphql";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
	const [logout, { loading: logoutLoading, error }] = useLogoutMutation();
	const { data, loading: meLoading } = useMeQuery();
	let body = null;

	if (meLoading) {
		body = null;
	} else if (!data?.me) {
		body = (
			<>
				<NextLink href="/login">
					<Link mr={2}>Login</Link>
				</NextLink>
				<NextLink href="/register">
					<Link>Register</Link>
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
		<Flex bg="tomato" p={4}>
			<Box ml="auto">{body}</Box>
		</Flex>
	);
};

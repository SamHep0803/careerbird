import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
	const router = useRouter();
	const [login] = useLoginMutation();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ usernameOrEmail: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await login({
						variables: values,
						update: (cache, { data }) => {
							cache.writeQuery<MeQuery>({
								query: MeDocument,
								data: {
									__typename: "Query",
									me: data?.login.user,
								},
							});
						},
					});

					console.log(response);

					if (response.data?.login.errors) {
						setErrors(toErrorMap(response.data.login.errors));
					} else if (response.data?.login.user) {
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="usernameOrEmail"
							placeholder="username or email"
							label="Username or Email"
						/>

						<Box mt={2}>
							<InputField
								name="password"
								placeholder="password"
								label="Password"
								type="password"
							/>
						</Box>
						<Flex style={{ alignItems: "center" }} mt={2}>
							<Box mt={2}>
								Don't have an account?
								<NextLink href="/register">
									<Link href="/register" color="blue.300">
										{" "}
										Sign Up
									</Link>
								</NextLink>
							</Box>
							<Button type="submit" mt={4} ml="auto" isLoading={isSubmitting}>
								Login
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Login;

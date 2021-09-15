import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { MeDocument, useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
	const router = useRouter();
	const [register] = useRegisterMutation();
	return (
		<Wrapper variant="small">
			<Formik
				initialValues={{ username: "", email: "", password: "" }}
				onSubmit={async (values, { setErrors }) => {
					const response = await register({
						variables: { credentials: values },
						update: (cache, { data }) => {
							cache.writeQuery({
								query: MeDocument,
								data: {
									me: data?.register.user,
								},
							});
						},
					});
					if (response.data?.register.errors) {
						setErrors(toErrorMap(response.data.register.errors));
					} else if (response.data?.register.user) {
						router.push("/");
					}
				}}
			>
				{({ isSubmitting }) => (
					<Form>
						<InputField
							name="username"
							placeholder="username"
							label="Username"
						/>
						<Box mt={2}>
							<InputField name="email" placeholder="email" label="Email" />
						</Box>

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
								Already have an account?
								<NextLink href="/login">
									<Link href="/login" color="blue.300">
										{" "}
										Sign In
									</Link>
								</NextLink>
							</Box>
							<Button type="submit" mt={4} ml="auto" isLoading={isSubmitting}>
								Register
							</Button>
						</Flex>
					</Form>
				)}
			</Formik>
		</Wrapper>
	);
};

export default Register;

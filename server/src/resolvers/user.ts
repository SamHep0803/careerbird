import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";
import bcrypt from "bcryptjs";
import { User } from "../entities/User";
import { ContextType } from "../types";

@InputType()
class CredentialsInput {
	@Field()
	username: string;

	@Field()
	email: string;

	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;

	@Field()
	message: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Query(() => User, { nullable: true })
	async me(@Ctx() { req }: ContextType): Promise<User | null> {
		if (!req.session.userId) {
			return null;
		}
		const user = await User.findOne(req.session.userId);
		if (!user) {
			req.session.destroy((err) => {
				console.error(err);
			});
			return null;
		}
		return user;
	}

	@Mutation(() => UserResponse)
	async register(
		@Ctx() { req }: ContextType,
		@Arg("credentials") credentials: CredentialsInput
	): Promise<UserResponse> {
		const usernameCheck = await User.findOne({
			where: { username: credentials.username },
		});
		if (usernameCheck) {
			return {
				errors: [
					{
						field: "username",
						message: "username already taken",
					},
				],
			};
		}
		const emailCheck = await User.findOne({
			where: { email: credentials.email },
		});
		if (emailCheck) {
			return {
				errors: [
					{
						field: "email",
						message: "email already taken",
					},
				],
			};
		}

		if (credentials.username.length < 3) {
			return {
				errors: [
					{
						field: "username",
						message: "username has to be more then 3 characters",
					},
				],
			};
		}
		if (credentials.username.includes("@")) {
			return {
				errors: [
					{
						field: "username",
						message: "username cannot contain an @",
					},
				],
			};
		}
		if (!credentials.email.includes("@")) {
			return {
				errors: [
					{
						field: "email",
						message: "invalid email",
					},
				],
			};
		}
		if (credentials.password.length < 4) {
			return {
				errors: [
					{
						field: "password",
						message: "password has to be more then 4 characters",
					},
				],
			};
		}

		const hashedPassword = await bcrypt.hash(credentials.password, 12);
		const user = await User.create({
			username: credentials.username,
			email: credentials.email,
			password: hashedPassword,
		}).save();

		req.session.userId = user.id;

		return {
			user,
		};
	}

	@Mutation(() => UserResponse)
	async login(
		@Ctx() { req }: ContextType,
		@Arg("usernameOrEmail") usernameOrEmail: string,
		@Arg("password") password: string
	): Promise<UserResponse> {
		const user = await User.findOne({
			where: usernameOrEmail.includes("@")
				? { email: usernameOrEmail }
				: { username: usernameOrEmail },
		});

		if (!user) {
			return {
				errors: [
					{
						field: "usernameOrEmail",
						message: "account does not exist",
					},
				],
			};
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return {
				errors: [
					{
						field: "password",
						message: "incorrect password",
					},
				],
			};
		}

		req.session.userId = user.id;

		return {
			user,
		};
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { req }: ContextType): Promise<Boolean> {
		req.session.destroy((err) => {
			console.error(err);
		});
		return true;
	}
}

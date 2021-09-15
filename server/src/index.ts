import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import { ContextType } from "./types";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const main = async () => {
	const conn = await createConnection();
	await conn.runMigrations();

	const RedisStore = connectRedis(session);
	const redis = new Redis();

	const app = express();

	app.use(
		session({
			name: "qid",
			store: new RedisStore({
				client: redis,
				disableTTL: true,
				disableTouch: true,
			}),
			cookie: {
				httpOnly: true,
				sameSite: "lax",
				maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
			},
			saveUninitialized: false,
			secret: "asdfasdfasdfasdf",
			resave: false,
		})
	);

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, UserResolver],
			validate: false,
		}),
		context: ({ req, res }: ContextType) => ({ req, res, redis }),
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
	});

	await apolloServer.start();
	apolloServer.applyMiddleware({
		app,
		cors: {
			origin: "http://localhost:3000",
			credentials: true,
		},
	});

	app.listen(4000, () => {
		console.log(
			`🚀 Server running at http://localhost:4000${apolloServer.graphqlPath}`
		);
	});
};

main().catch((error) => {
	console.error(error);
});

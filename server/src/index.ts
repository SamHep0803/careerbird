import "reflect-metadata";
import "dotenv-safe/config"
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
import path from "path";
import { User } from "./entities/User";
import { __prod__ } from "./constants";

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: !__prod__,
    migrations: [path.join(__dirname, "./migrations/*")],
    migrationsRun: __prod__,
    entities: [User]
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set("trust proxy", 1)

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
        secure: __prod__,
        domain: __prod__ ? ".careerbirdtest.tech" : undefined
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
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
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    },
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log(
      `🚀 Server running at http://localhost:4000${apolloServer.graphqlPath}`
    );
  });
};

main().catch((error) => {
  console.error(error);
});

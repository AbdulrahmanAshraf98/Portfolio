import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import type { NextFunction, Request, Response } from "express";
import { HealthController } from "./health.controller";
import { PortfolioResolver } from "./resolvers/portfolio.resolver";
import { InternalKeyGuard, isAllowedGatewayKey } from "./security";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env.local", "../../.env.local"] }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: process.env.VERCEL ? "/tmp/schema.gql" : true,
      sortSchema: true,
      playground: false,
      introspection: false,
      formatError: (error) => {
        const raw = error.message ?? "Request failed";
        const message = /invalid credentials|unauthorized|forbidden/i.test(raw)
          ? "Unauthorized"
          : "Request failed";
        return { message };
      },
      path: "/graphql",
      context: ({ req }: { req: Request }) => ({
        req,
        token: req.headers.authorization?.replace(/^Bearer\s+/i, ""),
      }),
    }),
  ],
  controllers: [HealthController],
  providers: [PortfolioResolver, InternalKeyGuard],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.originalUrl?.startsWith("/graphql")) {
          next();
          return;
        }
        const key = req.header("x-internal-key");
        if (!(await isAllowedGatewayKey(key))) {
          res.status(401).json({ errors: [{ message: "Forbidden" }] });
          return;
        }
        next();
      })
      .forRoutes("*");
  }
}

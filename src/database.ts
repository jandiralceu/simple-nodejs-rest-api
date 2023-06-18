import "dotenv/config";
import { knex as knexSetup, type Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite",
  connection: {
    filename: process.env.DATABASE_URL as string
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
export const knex = knexSetup(config);

import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]).default("pg"),
  PORT: z.coerce.number().default(3200),
  NODE_ENV: z.enum(["development", "test", "production", "homolog"]).default("production")
});

const environmentValues = envSchema.safeParse(process.env);

if (!environmentValues.success) {
  console.log(`Invalid environment variables!`, environmentValues.error.format());
  throw new Error("Invalid environment variables!");
}

export const env = environmentValues.data;

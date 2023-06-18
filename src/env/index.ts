import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  NODE_ENV: z.enum(["development", "test", "production", "homolog"]).default("production")
});

const environmentValues = envSchema.safeParse(process.env);

if (!environmentValues.success) {
  console.log(`Invalid environment variables!`, environmentValues.error.format());

  throw new Error("Invalid environment variables!");
}

export const env = environmentValues.data;

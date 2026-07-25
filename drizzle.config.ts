import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const isTurso = process.env.DATABASE_URL?.startsWith("libsql://") || !!process.env.DATABASE_AUTH_TOKEN;

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: isTurso ? "turso" : "sqlite",
  dbCredentials: isTurso 
    ? {
        url: process.env.DATABASE_URL!,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      }
    : {
        url: process.env.DATABASE_URL || "file:sqlite.db",
      },
});

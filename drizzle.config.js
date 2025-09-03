import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials : {
    url: 'postgresql://neondb_owner:npg_T73GpMbVIABf@ep-calm-block-adhj65tg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
  }
});

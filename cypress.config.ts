import { defineConfig } from "cypress";
import { existsSync, readFileSync } from "fs";

// Toma la URL del back del archivo .env (la misma que usa el front)
function readApiUrl() {
  if (existsSync(".env")) {
    const match = readFileSync(".env", "utf8").match(/^NEXT_PUBLIC_API_URL=(.+)$/m);
    if (match) {
      return match[1].trim();
    }
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    expose: {
      apiUrl: readApiUrl(),
    },
    defaultCommandTimeout: 10000,
  },
});

import { config, assertConfig } from "./config.js";
import { connectDb } from "./db.js";
import { createApp } from "./app.js";

async function main() {
  assertConfig();
  await connectDb();

  const app = createApp();
  app.listen(config.port, () => {
    console.log(`OIDC provider listening on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

import express from "express";
import oidcRoutes from "./routes/oidc.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  // Small body limit; the API-key auth uses headers, no large bodies expected.
  app.use(express.json({ limit: "16kb" }));

  app.use("/", oidcRoutes);

  app.use((_req, res) => res.status(404).json({ error: "not_found" }));

  // Centralized error handler: log server-side, return a generic message.
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "internal_error" });
  });

  return app;
}

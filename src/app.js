import express from "express";
import oidcRoutes from "./routes/oidc.js";
import { patchJson } from "./utils/middleware.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");

  app.use(express.json({ limit: "16kb" }));
  app.use(patchJson);

  app.use("/", oidcRoutes);

  app.use((_req, res) => res.status(404).json({ error: "not_found" }));

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "internal_error" });
  });

  return app;
}

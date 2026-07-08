import { Router } from "express";
import {
  openidConfiguration,
  jwks,
  token,
} from "../controllers/oidcController.js";

const router = Router();

// Forwards rejected promises from async handlers to the error middleware.
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get("/", (_req, res) => res.status(200).type("text").send("OIDC Provider"));

router.get("/.well-known/openid-configuration", openidConfiguration);
router.get("/.well-known/jwks", jwks);

// Preserve the original contract: POST issues a token, any other method → 405.
router
  .route("/token")
  .post(asyncHandler(token))
  .all((_req, res) => res.status(405).json({ error: "invalid_method" }));

router.get("/health/", (_req, res) => res.status(200).type("text").send("OK"));

export default router;

import { config } from "../config.js";
import { JenkinsClient } from "../models/JenkinsClient.js";
import { generateJwt, getJwks } from "../utils/jwt.js";

export function openidConfiguration(_req, res) {
  res.json({
    issuer: config.oidcIssuer,
    jwks_uri: `${config.oidcIssuer}/.well-known/jwks`,
    id_token_signing_alg_values_supported: ["RS256"],
    response_types_supported: ["id_token"],
    claims_supported: [
      "sub",
      "iss",
      "project",
      "environment",
      "pipeline",
      "jti",
      "iat",
      "exp",
    ],
  });
}

export function jwks(_req, res) {
  res.json(getJwks());
}

export async function token(req, res) {
  const apiKey = req.get("X-API-KEY");
  if (!apiKey) {
    return res.status(401).json({ error: "missing_api_key" });
  }
  const client = await JenkinsClient.findOne({ apiKey, isActive: true }).lean();
  if (!client) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const idToken = generateJwt(`${client.name}`);
  return res.json({ token: idToken });
}

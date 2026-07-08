import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.resolve(__dirname, "..");

const resolveKeyPath = (envValue, fallback) =>
  path.isAbsolute(envValue ?? "")
    ? envValue
    : path.join(BASE_DIR, envValue ?? fallback);

export const config = {
  port: Number(process.env.PORT ?? 8000),
  debug: process.env.DEBUG === "True",
  oidcIssuer: process.env.OIDC_ISSUER,
  mongoUri: process.env.MONGODB_URI,
  privateKeyPath: resolveKeyPath(process.env.PRIVATE_KEY_PATH, "keys/private.pem"),
  publicKeyPath: resolveKeyPath(process.env.PUBLIC_KEY_PATH, "keys/public.pem"),
  // Kept identical to the original provider so a pre-configured GCP WIF pool
  // (which pins this kid) keeps working after the port.
  keyId: process.env.OIDC_KEY_ID ?? "f3d31c42-53bf-4cd9-8912-74df7be06bb7",
};

export function assertConfig() {
  const missing = [];
  if (!config.oidcIssuer) missing.push("OIDC_ISSUER");
  if (!config.mongoUri) missing.push("MONGODB_URI");
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

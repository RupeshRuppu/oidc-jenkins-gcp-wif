import fs from "node:fs";
import crypto, { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

function loadPrivateKey() {
  return fs.readFileSync(config.privateKeyPath, "utf8");
}

function loadPublicKey() {
  return fs.readFileSync(config.publicKeyPath, "utf8");
}

export function generateJwt(sub) {
  return jwt.sign(
    {
      sub,
      iss: config.oidcIssuer,
      project: "fe-application",
      environment: "production",
      pipeline: "deploy-pipeline",
      jti: randomUUID(),
      aud: config.audience
    },
    loadPrivateKey(),
    {
      algorithm: "RS256",
      expiresIn: "10m",
    },
  );
}

export function getJwks() {
  const jwk = crypto.createPublicKey(loadPublicKey()).export({ format: "jwk" });
  return {
    keys: [
      {
        kty: jwk.kty,
        alg: "RS256",
        use: "sig",
        kid: config.keyId,
        n: jwk.n,
        e: jwk.e,
      },
    ],
  };
}

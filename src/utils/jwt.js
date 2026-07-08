import fs from "node:fs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

function loadPrivateKey() {
  return fs.readFileSync(config.privateKeyPath, "utf8");
}

function loadPublicKey() {
  return fs.readFileSync(config.publicKeyPath, "utf8");
}

// Issues an RS256 id_token with the same claim set as the original Django
// provider: iss, sub, aud="gcp", iat, exp (+10 minutes).
export function generateJwt(sub) {
  return jwt.sign(
    {
      iss: config.oidcIssuer,
      sub,
      aud: "gcp",
    },
    loadPrivateKey(),
    {
      algorithm: "RS256",
      expiresIn: "10m",
    }
  );
}

// Builds the JWKS document from the RSA public key. `crypto` exports the
// modulus (n) and exponent (e) as base64url without padding, matching the
// original hand-rolled encoding.
export function getJwks() {
  const jwk = crypto.createPublicKey(loadPublicKey()).export({ format: "jwk" });
  return {
    keys: [
      {
        kty: "RSA",
        alg: "RS256",
        use: "sig",
        kid: config.keyId,
        n: jwk.n,
        e: jwk.e,
      },
    ],
  };
}

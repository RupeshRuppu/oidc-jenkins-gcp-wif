import crypto from "node:crypto";
import { assertConfig } from "../src/config.js";
import { connectDb, disconnectDb } from "../src/db.js";
import { JenkinsClient } from "../src/models/JenkinsClient.js";

// Equivalent of the Django `seed_jenkins` management command: upsert the
// "jenkins-prod" client with a freshly generated URL-safe API key.
async function main() {
  assertConfig();
  await connectDb();

  const apiKey = crypto.randomBytes(32).toString("base64url");

  const result = await JenkinsClient.findOneAndUpdate(
    { name: "jenkins-prod" },
    { $set: { apiKey } },
    { new: true, upsert: true, rawResult: true }
  );

  const created = result.lastErrorObject?.updatedExisting === false;

  console.log(`API KEY: created=${created}, api_key=${apiKey}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDb();
  });

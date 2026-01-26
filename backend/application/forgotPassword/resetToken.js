//reset token helper functions
import crypto from "crypto";

//creates random token for URL
export function makeResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

//hashes reset token pepper from .env to store in db
export function hashResetToken(rawToken, pepper) {
  return crypto
    .createHash("sha256")
    .update(rawToken + pepper)
    .digest("hex");
}

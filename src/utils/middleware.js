import { hostname } from "node:os";

const HOSTNAME = hostname();

export function toPayload(value) {
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    return { data: value };
  }
  return value;
}

export function patchJson(_req, res, next) {
  const json = res.json.bind(res);
  res.json = function (body) {
    const payload = toPayload(body);
    return json({ ...payload, hostname: HOSTNAME });
  };
  next();
}

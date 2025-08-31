import { json } from "./util";

export const handler = async () => {
  return json({ ok: true, ts: new Date().toISOString() });
};

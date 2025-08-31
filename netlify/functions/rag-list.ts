import { json, ragStore, getUser, requireAdmin } from "./util";

export const handler = async (event: any, context: any) => {
  const user = getUser(context);
  requireAdmin(user);
  const list = await ragStore.list({ prefix: "doc:" });
  const out: any[] = [];
  for (const b of list.blobs) {
    const val = await ragStore.getJSON(b.key);
    if (val) out.push(val);
  }
  out.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  return json(out);
};

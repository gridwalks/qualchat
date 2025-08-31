import { json, loadSettings, getUser, requireAdmin, isAdminUser } from "./util";

export const handler = async (event: any, context: any) => {
  const s = await loadSettings();
  // Non-admins can read effective settings but not necessarily secrets
  return json(s);
};

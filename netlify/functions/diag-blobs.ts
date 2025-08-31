import { getStore } from "@netlify/blobs";

export const handler = async () => {
  const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID || "";
  const token  = process.env.NETLIFY_BLOBS_TOKEN || "";

  const cfg = (siteID && token) ? { siteID, token } : undefined;

  // Try to talk to a store using whichever config is available
  const store = getStore("settings-store", cfg);

  let okList = false, errList = "";
  try {
    await store.list({ prefix: "admin:" });
    okList = true;
  } catch (e: any) {
    errList = e?.message || String(e);
  }

  const mask = (v?: string) => v ? "set" : "missing";
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seen_env: {
        NETLIFY_BLOBS_SITE_ID: mask(process.env.NETLIFY_BLOBS_SITE_ID),
        NETLIFY_SITE_ID:        mask(process.env.NETLIFY_SITE_ID),
        NETLIFY_BLOBS_TOKEN:    mask(process.env.NETLIFY_BLOBS_TOKEN),
      },
      list_ok: okList,
      list_err: errList
    })
  };
};

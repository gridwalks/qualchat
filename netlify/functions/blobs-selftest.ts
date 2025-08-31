import { getStore } from "@netlify/blobs";

export const handler = async () => {
  const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID;
  const token  = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_API_TOKEN;
  const mask = (v?: string) => (v && String(v).length > 0 ? "set" : "missing");

  if (!siteID || !token) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        env_seen: {
          NETLIFY_BLOBS_SITE_ID: mask(process.env.NETLIFY_BLOBS_SITE_ID),
          NETLIFY_SITE_ID:        mask(process.env.NETLIFY_SITE_ID),
          NETLIFY_BLOBS_TOKEN:    mask(process.env.NETLIFY_BLOBS_TOKEN),
          NETLIFY_API_TOKEN:      mask(process.env.NETLIFY_API_TOKEN),
        },
        ok: false,
        step: "env-missing",
        note: "Set NETLIFY_BLOBS_SITE_ID (or NETLIFY_SITE_ID) and NETLIFY_BLOBS_TOKEN (or NETLIFY_API_TOKEN) on the Site, then redeploy."
      })
    };
  }

  const cfg = { siteID, token };
  const store = getStore("settings-store", cfg);

  const key = `diag:selftest:${Date.now()}`;
  let writeOk = false, readOk = false, listOk = false, error = "";

  try { await store.setJSON(key, { hello: "world" }); writeOk = true; } catch (e: any) { error = e?.message || String(e); }
  try { const v = await store.getJSON(key); if (v?.hello === "world") readOk = true; } catch (e: any) { error = e?.message || String(e); }
  try { await store.list({ prefix: "diag:" }); listOk = true; } catch (e: any) { error = e?.message || String(e); }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      env_seen: {
        NETLIFY_BLOBS_SITE_ID: mask(process.env.NETLIFY_BLOBS_SITE_ID),
        NETLIFY_SITE_ID:        mask(process.env.NETLIFY_SITE_ID),
        NETLIFY_BLOBS_TOKEN:    mask(process.env.NETLIFY_BLOBS_TOKEN),
        NETLIFY_API_TOKEN:      mask(process.env.NETLIFY_API_TOKEN),
      },
      ok: writeOk && readOk && listOk,
      writeOk, readOk, listOk,
      error
    })
  };
};

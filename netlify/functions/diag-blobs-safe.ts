export const handler = async () => {
  const siteID = process.env.NETLIFY_BLOBS_SITE_ID || process.env.NETLIFY_SITE_ID || "";
  const token  = process.env.NETLIFY_BLOBS_TOKEN || "";

  const mask = (v?: string) => (v && String(v).length > 0 ? "set" : "missing");

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seen_env: {
        NETLIFY_BLOBS_SITE_ID: mask(process.env.NETLIFY_BLOBS_SITE_ID),
        NETLIFY_SITE_ID:        mask(process.env.NETLIFY_SITE_ID),
        NETLIFY_BLOBS_TOKEN:    mask(process.env.NETLIFY_BLOBS_TOKEN),
      },
      advice: !siteID || !token
        ? "One or both variables are missing in the function runtime. Set NETLIFY_BLOBS_SITE_ID (Site API ID) and NETLIFY_BLOBS_TOKEN (Personal Access Token) in Site configuration → Build & deploy → Environment, then redeploy."
        : "Both variables are present. If Blobs still fails, the token may be invalid or revoked."
    })
  };
};

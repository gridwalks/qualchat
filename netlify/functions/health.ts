import { json } from "./util";

export const handler = async () => {
  const mask = (v?: string) => (v ? "set" : "missing");
  return json({
    ok: true,
    env: {
      OPENAI_API_KEY: mask(process.env.OPENAI_API_KEY),
      OPENAI_COMPLETIONS_MODEL: process.env.OPENAI_COMPLETIONS_MODEL || "default",
      OPENAI_MODEL: process.env.OPENAI_MODEL || "default",
      CHAT_REQUIRE_AUTH: process.env.CHAT_REQUIRE_AUTH || "false",
    },
  });
};

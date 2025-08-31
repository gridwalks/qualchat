import { marked } from "marked";
import DOMPurify from "dompurify";
import React from "react";

marked.setOptions({
  breaks: true,
  gfm: true,
});

type Props = { markdown: string };

export default function SafeMarkdown({ markdown }: Props) {
  const clean = React.useMemo(() => {
    const html = marked.parse(markdown || "_(no content)_") as string;
    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
  }, [markdown]);
  return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: clean }} />;
}

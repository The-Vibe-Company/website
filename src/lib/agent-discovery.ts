/** RFC 8288 discovery links shared by HTML and machine-readable responses. */
export const AGENT_LINK_HEADER =
  '</llms.txt>; rel="describedby"; type="text/markdown", </sitemap.xml>; rel="sitemap", </.well-known/agent-skills/index.json>; rel="service-desc"';

/** Only offer Markdown for pages backed by an existing Markdown source. */
export function hasMarkdownRepresentation(pathname: string): boolean {
  return /^\/(?:fr|en)?\/?$/.test(pathname) ||
    /^\/(fr|en)\/resources\/articles\/[^/]+\/?$/.test(pathname);
}

/** Require an explicit, acceptable Markdown media type; wildcards keep HTML. */
export function prefersMarkdown(accept: string | null): boolean {
  const ranges = (accept ?? "").split(",").map((range) => {
    const [type, ...parameters] = range.trim().toLowerCase().split(";");
    const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
    const q = quality ? Number(quality.trim().slice(2)) : 1;
    return { type: type.trim(), q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
  });
  const markdown = ranges.find((range) => range.type === "text/markdown")?.q ?? 0;
  const html = ranges.find((range) => range.type === "text/html")?.q ??
    ranges.find((range) => range.type === "text/*")?.q ??
    ranges.find((range) => range.type === "*/*")?.q ?? 0;
  return markdown > 0 && markdown >= html;
}

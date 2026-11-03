import { absoluteUrl, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** RFC 9727 catalog using the RFC 9264 JSON linkset representation. */
export function GET() {
  return Response.json({
    linkset: [{
      anchor: SITE_URL,
      describedby: [{ href: absoluteUrl("/llms.txt"), type: "text/markdown" }],
      sitemap: [{ href: absoluteUrl("/sitemap.xml"), type: "application/xml" }],
      "service-desc": [
        { href: absoluteUrl("/.well-known/agent-skills/index.json"), type: "application/json" },
        { href: absoluteUrl("/.well-known/mcp/server-card.json"), type: "application/json" },
        { href: absoluteUrl("/.well-known/agent-card.json"), type: "application/json" },
      ],
      "service-doc": [{ href: absoluteUrl("/auth.md"), type: "text/markdown" }],
      "service": [{ href: absoluteUrl("/mcp") }, { href: absoluteUrl("/a2a") }],
    }],
  }, { headers: { "Content-Type": "application/linkset+json" } });
}

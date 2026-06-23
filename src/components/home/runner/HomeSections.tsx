import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { PROJECTS, SLABS } from "./runner-data";

/*
 * Static lower page for the playable-runner homepage (preview /v2):
 * manifesto band → work grid → departures → footer. No client interactivity,
 * so this stays a server component (the game engine in VibeRunner never touches
 * these nodes). Links are wired to real destinations where they exist.
 */

const MONO = "var(--font-geist-mono), monospace";

const kickerStyle: CSSProperties = {
  display: "block",
  fontFamily: MONO,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

/** Internal routes → next/link; mailto/external → plain anchor. */
function SmartLink({
  href,
  style,
  className,
  children,
}: {
  href: string;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} style={style} className={className}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} style={style} className={className} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {children}
    </a>
  );
}

const SITE_LINKS = [
  { label: "Home", href: "/v2" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Resources", href: "/resources" },
  { label: "Mission", href: "/agency" },
];

const ELSEWHERE_LINKS = [
  { label: "X / Twitter ↗", href: "https://x.com/thevibecompany" },
  { label: "GitHub ↗", href: "https://github.com/The-Vibe-Company" },
  { label: "LinkedIn ↗", href: "https://www.linkedin.com/company/thevibecompany" },
];

const STATUS_ITEMS = ["Building in public", "Shipping daily", "Open to projects"];

const footerColHeading: CSSProperties = {
  fontFamily: MONO,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "rgba(250,250,247,0.6)",
  marginBottom: 16,
};

const footerList: CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 9,
  fontSize: 13,
};

const footerLink: CSSProperties = { color: "rgba(250,250,247,0.72)", textDecoration: "none" };

export function HomeSections() {
  return (
    <>
      {/* MANIFESTO band */}
      <section style={{ background: "#0a0a0a", color: "#fafaf7" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "clamp(56px,9vh,104px) clamp(24px,6vw,80px)" }}>
          <span style={{ ...kickerStyle, color: "rgba(250,250,247,0.55)", marginBottom: 22 }}>{"// The vibe"}</span>
          <p style={{ margin: 0, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.05, fontSize: "clamp(28px,4.5vw,60px)", maxWidth: "18ch" }}>
            We build with AI. We ship fast. We show <em style={{ fontStyle: "italic", fontWeight: 400 }}>everything.</em>
          </p>
          <p style={{ margin: "26px 0 0", fontSize: "clamp(15px,1.6vw,18px)", lineHeight: 1.6, color: "rgba(250,250,247,0.62)", maxWidth: 540 }}>
            {"Vibe coding isn't chaos. It's disciplined intuition. We trust the process, move fast, and don't cut corners."}
          </p>
        </div>
      </section>

      {/* WORK */}
      <section id="work" style={{ maxWidth: 1600, margin: "0 auto", padding: "clamp(56px,8vh,88px) clamp(24px,6vw,80px) clamp(24px,4vh,40px)" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 36, flexWrap: "wrap" }}>
          <h2 style={{ margin: 0, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1, fontSize: "clamp(32px,5vw,56px)" }}>
            Recent <em style={{ fontStyle: "italic", fontWeight: 400 }}>work.</em>
          </h2>
          <span style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(10,10,10,0.5)" }}>
            {"// A selection of our productions"}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))", gap: 18 }}>
          {PROJECTS.map((p) => {
            const dateColor = p.inverted ? "rgba(250,250,247,0.45)" : "rgba(10,10,10,0.4)";
            const descColor = p.inverted ? "rgba(250,250,247,0.65)" : "rgba(10,10,10,0.6)";
            return (
              <article
                key={p.name}
                style={{
                  background: p.inverted ? "#0a0a0a" : "#ffffff",
                  border: p.inverted ? "1px solid #0a0a0a" : "1px solid rgba(10,10,10,0.12)",
                  borderRadius: 20,
                  padding: 16,
                  color: p.inverted ? "#fafaf7" : "#0a0a0a",
                }}
              >
                <div style={{ aspectRatio: "16 / 10", background: "#0a0a0a", overflow: "hidden", borderRadius: 14 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.cover} alt={p.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                </div>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginTop: 18 }}>
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: "-0.025em" }}>{p.name}</h3>
                  <span style={{ fontFamily: MONO, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: dateColor }}>{p.date}</span>
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: descColor }}>{p.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* DEPARTURES */}
      <section id="method" style={{ maxWidth: 1600, margin: "0 auto", padding: "clamp(40px,6vh,72px) clamp(24px,6vw,80px) clamp(56px,8vh,88px)" }}>
        <span style={{ ...kickerStyle, color: "rgba(10,10,10,0.5)", marginBottom: 14 }}>{"// Where to next?"}</span>
        <div style={{ borderTop: "1px solid rgba(10,10,10,0.14)" }}>
          {SLABS.map((s) => (
            <SmartLink
              key={s.num}
              href={s.href}
              className="vibe-slab-row"
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "1fr auto auto",
                alignItems: "center",
                gap: 16,
                borderBottom: "1px solid rgba(10,10,10,0.14)",
                textDecoration: "none",
                color: "#0a0a0a",
                overflow: "hidden",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "clamp(54px, 14vw, 84px)",
                  fontWeight: 600,
                  letterSpacing: "-0.06em",
                  color: "rgba(10,10,10,0.07)",
                  pointerEvents: "none",
                }}
              >
                {s.num}
              </span>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.title}</div>
                <div style={{ fontFamily: MONO, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 8, opacity: 0.6 }}>{s.meta}</div>
              </div>
              <div
                className="vibe-slab-gate"
                style={{
                  fontFamily: MONO,
                  fontSize: 10.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  textAlign: "right",
                  lineHeight: 1.6,
                  color: "rgba(10,10,10,0.5)",
                  paddingLeft: 20,
                  borderLeft: "1px solid rgba(10,10,10,0.14)",
                }}
              >
                {s.gate}
                <br />
                STATUS: {s.status}
              </div>
              <span style={{ fontSize: 26, fontWeight: 300, paddingLeft: 16 }}>→</span>
            </SmartLink>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="studio" style={{ background: "#0a0a0a", color: "#fafaf7" }}>
        <div style={{ maxWidth: 1600, margin: "0 auto", padding: "clamp(48px,7vh,72px) clamp(24px,6vw,80px) 28px" }}>
          <div className="vibe-footer-grid" style={{ marginBottom: 56 }}>
            <div>
              <div style={{ fontSize: "clamp(34px,4vw,52px)", fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 0.9, marginBottom: 14 }}>The Vibe Co.</div>
              <p style={{ fontSize: 14, color: "rgba(250,250,247,0.6)", margin: "0 0 14px", maxWidth: 280, lineHeight: 1.5 }}>
                {"An AI-native agency. Paris · Worldwide. We move fast but we don't cut corners."}
              </p>
              <a href="mailto:founders@thevibecompany.co" style={{ fontFamily: MONO, fontSize: 12, color: "#fafaf7", textDecoration: "underline", textUnderlineOffset: 4 }}>
                founders@thevibecompany.co
              </a>
            </div>
            <div>
              <div style={footerColHeading}>Site</div>
              <ul style={footerList}>
                {SITE_LINKS.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href} style={footerLink} className="vibe-footer-link">
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={footerColHeading}>Elsewhere</div>
              <ul style={footerList}>
                {ELSEWHERE_LINKS.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href} style={footerLink} className="vibe-footer-link">
                      {l.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={footerColHeading}>Status</div>
              <ul style={footerList}>
                {STATUS_ITEMS.map((label) => (
                  <li key={label}>
                    <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#fafaf7", marginRight: 8, animation: "vc-pulse 2s infinite" }} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              paddingTop: 22,
              borderTop: "1px solid rgba(250,250,247,0.15)",
              fontFamily: MONO,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(250,250,247,0.5)",
            }}
          >
            <span>© 2026 The Vibe Company</span>
            <span>YC W24 · Made in France</span>
            <span>v0.4.27 · Last deploy 04:32 UTC</span>
          </div>
        </div>
      </footer>
    </>
  );
}

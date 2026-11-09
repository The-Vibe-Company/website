/** Prefix-less legacy URLs → locale-less target path, resolved by the middleware in one 308. */
export function legacyBareTarget(pathname: string): string | null {
  if (pathname === "/agency" || pathname === "/agency/") return "/";
  if (/^\/resources\/(articles|tools|tutorials|concepts|focus|learnings)\/?$/.test(pathname)) return "/resources";
  if (/^\/resources\/(tools|tutorials|concepts|focus|learnings)\/.+/.test(pathname)) return "/resources";
  return null;
}

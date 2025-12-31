const links = [
  { label: "Products", href: "#products" },
  { label: "Learn", href: "#learn" },
  { label: "Twitter/X", href: "https://twitter.com", external: true },
  { label: "GitHub", href: "https://github.com", external: true },
];

export function Footer() {
  return (
    <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-border bg-background">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
        <div className="text-sm text-muted-foreground font-medium">
          &copy; {new Date().getFullYear()} The Vibe Company
        </div>
        <nav className="flex flex-wrap gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

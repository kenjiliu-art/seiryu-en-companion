import { site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="px-4 py-3 md:px-6">
        <h1 className="site-title truncate">{site.title}</h1>
        <p className="text-sm text-muted-foreground">{site.tagline}</p>
      </div>
    </header>
  );
}
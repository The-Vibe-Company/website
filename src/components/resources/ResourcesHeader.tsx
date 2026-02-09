import { TypeNav } from '@/components/resources/TypeNav';
import { resourcesTheme } from '@/lib/resources-theme';

interface TypeNavLink {
  label: string;
  href: string;
  slug: string;
}

interface ResourcesHeaderProps {
  subtitle?: string;
  typeNavLinks: TypeNavLink[];
  counts?: Record<string, number>;
}

const DEFAULT_SUBTITLE =
  'A collection of raw build logs, tutorials, and philosophy on shipping AI-native software.';

export function ResourcesHeader({
  subtitle,
  typeNavLinks,
  counts,
}: ResourcesHeaderProps) {
  return (
    <section className={`${resourcesTheme.section.padding} pt-20 pb-8`}>
      <div className="max-w-4xl mb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-res-text-muted block mb-3">
          Vibe Learning Hub
        </span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-res-text mb-3 leading-[0.95]">
          The <span className="text-res-text-muted">Archives.</span>
        </h1>
        <p className="text-base md:text-lg text-res-text-muted max-w-2xl leading-relaxed">
          {subtitle || DEFAULT_SUBTITLE}
        </p>
      </div>

      <TypeNav types={typeNavLinks} counts={counts} />
    </section>
  );
}

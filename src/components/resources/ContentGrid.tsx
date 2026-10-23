interface ContentGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function ContentGrid({ children, columns = 3 }: ContentGridProps) {
  const gridClass =
    columns === 2
      ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';

  return <div className={gridClass}>{children}</div>;
}

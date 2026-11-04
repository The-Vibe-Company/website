interface ContentGridProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export function ContentGrid({ children, columns = 3 }: ContentGridProps) {
  const gridClass =
    columns === 2
      ? 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5'
      : 'grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3';

  return <div className={gridClass}>{children}</div>;
}

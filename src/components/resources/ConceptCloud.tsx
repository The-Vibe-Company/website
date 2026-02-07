interface ConceptCloudProps {
  concepts: string[];
}

export function ConceptCloud({ concepts }: ConceptCloudProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {concepts.map((concept) => (
        <span
          key={concept}
          className="px-3 py-1.5 rounded-full border border-res-border text-xs font-mono hover:bg-res-bg-secondary transition-colors"
        >
          {concept}
        </span>
      ))}
    </div>
  );
}

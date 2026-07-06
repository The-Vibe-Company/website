interface Proof {
  metric: string;
  label: string;
}

const PROOFS: Proof[] = [
  { metric: "2 months", label: "Monka's mobile app, from scratch to the App Store" },
  { metric: "87%", label: "of LocService's support tickets answered by our AI" },
];

export function ProofBar() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-[100rem] px-6 md:px-12">
        <div className="grid grid-cols-1 border-b-2 border-foreground md:grid-cols-3">
          <div className="flex items-center border-b border-border py-7 md:border-b-0 md:border-r md:pr-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              In production for clients
            </span>
          </div>
          {PROOFS.map((proof) => (
            <div
              key={proof.metric}
              className="flex flex-col justify-center border-b border-border py-7 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:last:border-r-0"
            >
              <span className="text-[38px] font-bold leading-none tracking-[-0.04em] text-foreground md:text-[44px]">
                {proof.metric}
              </span>
              <span className="mt-2.5 text-sm leading-snug text-muted-foreground">
                {proof.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

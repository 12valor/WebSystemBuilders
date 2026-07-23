type SectionEyebrowProps = {
  children: React.ReactNode;
  centered?: boolean;
};

export function SectionEyebrow({ children, centered = false }: SectionEyebrowProps) {
  return (
    <p className={`mb-6 flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-secondary ${centered ? "justify-center" : ""}`}>
      <span className="size-[7px] rounded-full bg-brand ring-4 ring-blue-500/10" aria-hidden="true" />
      {children}
    </p>
  );
}
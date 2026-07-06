interface SectionTitleProps {
  children: string;
  className?: string;
}

export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h3
      className={`text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary mb-4 ${className ?? ""}`}
    >
      {children}
    </h3>
  );
}

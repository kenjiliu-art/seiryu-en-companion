interface ObjectLabelProps {
  children: React.ReactNode;
}

export function ObjectLabel({ children }: ObjectLabelProps) {
  return (
    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
      {children}
    </p>
  );
}
type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header>
      <h1 className="text-2xl font-semibold tracking-normal text-text">{title}</h1>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}
    </header>
  );
}

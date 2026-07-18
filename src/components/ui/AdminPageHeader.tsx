export default function AdminPageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <h1 className="text-2xl font-serif text-ink tracking-wide">{title}</h1>
      {action}
    </div>
  );
}

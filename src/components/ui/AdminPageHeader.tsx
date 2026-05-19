export default function AdminPageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-serif text-ink">{title}</h1>
      {action}
    </div>
  );
}

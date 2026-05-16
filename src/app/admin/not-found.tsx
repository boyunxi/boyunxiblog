import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-ink/20 mb-4">404</h1>
        <p className="text-inkGray mb-8">你访问的页面不存在</p>
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-ochre text-white rounded hover:bg-ochre/90 transition-colors text-sm"
        >
          返回仪表盘
        </Link>
      </div>
    </div>
  );
}

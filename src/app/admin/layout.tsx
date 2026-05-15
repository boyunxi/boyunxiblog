import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/layout/Providers";
import AdminSidebar from "@/components/layout/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <Providers>
        <div className="bg-ricepaper font-sans min-h-screen">
          {children}
        </div>
      </Providers>
    );
  }

  return (
    <Providers>
      <div className="bg-ricepaper font-sans min-h-screen">
        <AdminSidebar />
        <main className="lg:ml-64 min-h-screen bg-ricepaper">
          <div className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</div>
        </main>
      </div>
    </Providers>
  );
}

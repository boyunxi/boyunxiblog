import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Providers from "@/components/layout/Providers";
import AdminShell from "@/components/layout/AdminShell";

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
      <AdminShell>{children}</AdminShell>
    </Providers>
  );
}

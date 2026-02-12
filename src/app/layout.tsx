import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: "Worker Dashboard",
  description: "Operations-focused dashboard for workers and staff",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className="antialiased" style={{ backgroundColor: "#0f1419", color: "#f3f4f6" }}>
      <body className="min-h-screen font-sans bg-[#0f1419] text-gray-100">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}

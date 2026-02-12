import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function WorkerProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "WORKER") redirect("/login");
  const profile = await prisma.workerProfile.findUnique({
    where: { userId: session.user.id },
  });
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Profile & settings</h1>
      <section className="card">
        <h2 className="mb-3 font-medium text-white">Personal info</h2>
        <ProfileForm
          name={user?.name ?? ""}
          email={user?.email ?? ""}
          department={profile?.department ?? ""}
          emergencyContact={profile?.emergencyContact ?? ""}
          phone={profile?.phone ?? ""}
        />
      </section>
    </div>
  );
}

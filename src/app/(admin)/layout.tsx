import { redirect } from "next/navigation";
import { fetchAuthQuery } from "@/lib/auth-server";

import AdminShell from "./AdminShell";
import { api } from "../../../convex/_generated/api";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchAuthQuery(api.auth.getCurrentUser, {});

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/auth");
  }

  // user verified, now render client shell
  return <AdminShell>{children}</AdminShell>;
}

import { redirect } from "next/navigation";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../convex/_generated/api";

import AdminClientShell from "./AdminClientShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;

  try {
    user = await fetchAuthQuery(api.auth.getCurrentUser, {});
  } catch {
    redirect("/auth");
  }

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    redirect("/auth");
  }

  return <AdminClientShell>{children}</AdminClientShell>;
}

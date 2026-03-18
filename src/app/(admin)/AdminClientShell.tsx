"use client";

import AdminShell from "./AdminShell";

export default function AdminClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}

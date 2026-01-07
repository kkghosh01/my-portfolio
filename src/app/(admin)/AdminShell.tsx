"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/adminNavbar";
import Sidebar from "@/components/admin/sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AdminNavbar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className={`
            hidden md:block
            border-r
            transition-all duration-300
            ${collapsed ? "w-20" : "w-64"}
          `}
        >
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed(!collapsed)}
          />
        </aside>

        {/* Mobile sidebar */}
        <Sidebar
          mobile
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </>
  );
}

"use client";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Newspaper,
  FolderOpen,
  ChartBarStacked,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DialogTitle } from "../ui/dialog";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

interface SidebarItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  collapsed?: boolean;
}

function SidebarItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: SidebarItemProps) {
  return (
    <Link href={href}>
      <CommandItem
        className={cn(
          "flex items-center gap-3 cursor-pointer transition-colors duration-150 ease-in-out",
          "data-[selected=true]:bg-muted/70",
          active && "bg-primary/10 text-primary font-medium",
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </CommandItem>
    </Link>
  );
}

function SidebarContent({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <Command className="h-full rounded-none bg-muted/40">
      <CommandList>
        <CommandGroup heading={!collapsed ? "Dashboard" : undefined}>
          <SidebarItem
            href="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            active={pathname === "/dashboard"}
            collapsed={collapsed}
          />
          <SidebarItem
            href="/dashboard/posts"
            icon={Newspaper}
            label="All Posts"
            active={pathname === "/dashboard/posts"}
            collapsed={collapsed}
          />
          <SidebarItem
            href="/dashboard/projects"
            icon={FolderOpen}
            label="All Projects"
            active={pathname === "/dashboard/projects"}
            collapsed={collapsed}
          />
          <SidebarItem
            href="/dashboard/contacts"
            icon={MessageSquare}
            label="Contacts"
            active={pathname === "/dashboard/contacts"}
            collapsed={collapsed}
          />
          <SidebarItem
            href="/dashboard/categories"
            icon={ChartBarStacked}
            label="Categories"
            active={pathname === "/dashboard/categories"}
            collapsed={collapsed}
          />
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default function Sidebar({
  collapsed,
  onToggle,
  mobile,
  open,
  onClose,
}: SidebarProps) {
  // Mobile overlay
  if (mobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="p-0 w-64">
          <div className="sr-only">
            <DialogTitle>Admin Navigation</DialogTitle>
          </div>

          <SidebarContent />
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar
  return (
    <div className="relative h-full">
      <SidebarContent collapsed={collapsed} />

      <button
        onClick={onToggle}
        className="absolute -right-3 top-1 bg-background border rounded-full p-1 shadow"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180",
          )}
        />
      </button>
    </div>
  );
}

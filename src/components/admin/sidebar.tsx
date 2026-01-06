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
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DialogTitle } from "../ui/dialog";
import { useEffect, useState } from "react";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  mobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}

function SidebarContent({ collapsed }: { collapsed?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const Item = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: any;
    label: string;
  }) => {
    const active = pathname === href;

    return (
      <Link href={href}>
        <CommandItem
          className={cn(
            "flex items-center gap-3",
            active && "bg-primary/10 text-primary"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {!collapsed && <span>{label}</span>}
        </CommandItem>
      </Link>
    );
  };

  return (
    <Command className="h-full rounded-none bg-muted/40">
      <CommandList>
        <CommandGroup heading={!collapsed ? "Dashboard" : undefined}>
          <Item
            href="/admin/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
          />
          <Item href="/admin/posts" icon={Newspaper} label="Posts" />
          <Item href="/admin/projects" icon={FolderOpen} label="Projects" />
          <Item
            href="/admin/categories"
            icon={ChartBarStacked}
            label="Categories"
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
            collapsed && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CircleFadingPlus } from "lucide-react";

const ICONS = {
  plus: CircleFadingPlus,
};

interface AdminHeaderAction {
  label: string;
  href: string;
  icon?: keyof typeof ICONS;
}

export default function AdminHeader({
  title,
  actions,
}: {
  title: string;
  actions?: AdminHeaderAction[];
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

      <div className="flex gap-2">
        {actions?.map((action) => {
          const Icon = action.icon ? ICONS[action.icon] : null;

          return (
            <Link key={action.href} href={action.href}>
              <Button>
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

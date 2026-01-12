import AdminHeader from "@/components/admin/adminHeader";
import DashboardCard from "@/components/admin/dashboardCard";
import {
  ChartBarStacked,
  FolderOpen,
  MessageCircle,
  Newspaper,
} from "lucide-react";

export default function DashBoard() {
  return (
    <>
      <AdminHeader
        title="Dashboard"
        actions={[
          {
            label: "New Post",
            href: "/admin/create-post",
            icon: "plus",
          },
          {
            label: "New Project",
            href: "/admin/create-project",
            icon: "plus",
          },
        ]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Posts" count={42} icon={Newspaper} />
        <DashboardCard title="Projects" count={15} icon={FolderOpen} />
        <DashboardCard title="Categories" count={8} icon={ChartBarStacked} />
        <DashboardCard title="Comments" count={128} icon={MessageCircle} />
      </div>
    </>
  );
}

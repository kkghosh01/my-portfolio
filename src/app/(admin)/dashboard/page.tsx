import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";
import DashboardCard from "@/components/admin/dashboardCard";
import {
  FileText,
  Layout,
  MessageSquare,
  Eye,
  Heart,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  let data = null;
  try {
    data = await fetchAuthQuery(api.dashboard.getDashboardStats, {});
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">No Dashboard Data</h2>
          <p className="text-muted-foreground mt-2">
            Unable to load dashboard data. This might be due to authentication
            issues or missing permissions.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/auth">Go to Login</Link>
          </Button>
          <Button asChild>
            <Link href="/admin">Retry</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { stats, activities } = data;

  if (stats.posts === 0 && stats.projects === 0 && stats.messages === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome! Get started by creating your first post or project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Card className="p-8 flex flex-col items-center text-center space-y-4 border-dashed">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <FileText className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Create your first post</h2>
            <p className="text-muted-foreground">
              Share your thoughts and knowledge with the world.
            </p>
            <Button asChild size="lg">
              <Link href="/admin/create-post">Get Started</Link>
            </Button>
          </Card>

          <Card className="p-8 flex flex-col items-center text-center space-y-4 border-dashed">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Layout className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold">Add your first project</h2>
            <p className="text-muted-foreground">
              Showcase your best work and technical skills.
            </p>
            <Button asChild size="lg" variant="outline">
              <Link href="/admin/create-project">Get Started</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <DashboardCard
          title="Total Posts"
          count={stats.posts}
          icon={FileText}
        />
        <DashboardCard title="Projects" count={stats.projects} icon={Layout} />
        <DashboardCard
          title="Messages"
          count={stats.messages}
          icon={MessageSquare}
        />
        <DashboardCard title="Total Views" count={stats.views} icon={Eye} />
        <DashboardCard title="Total Likes" count={stats.likes} icon={Heart} />
        <DashboardCard
          title="New Messages"
          count={stats.newMessages}
          icon={MessageSquare}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <Card className="lg:col-span-2 overflow-hidden border-none shadow-sm dark:bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl font-semibold">
              Recent Activity
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts" className="flex items-center gap-1">
                View All <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground border-y">
                  <tr>
                    <th className="px-6 py-3 font-medium">Content</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium max-w-[200px] truncate">
                        {activity.title}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="capitalize">
                          {activity.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            activity.status === "published" ||
                            activity.status === "replied"
                              ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20"
                          }
                          variant="secondary"
                        >
                          {activity.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(activity.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links / Quick Actions */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm dark:bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button asChild className="w-full justify-start gap-2 h-11">
                <Link href="/admin/create-post">
                  <FileText className="h-4 w-4" /> Create New Post
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start gap-2 h-11"
              >
                <Link href="/admin/create-project">
                  <Layout className="h-4 w-4" /> Add New Project
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-primary/5 dark:bg-primary/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-primary mb-2">Pro Tip</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Check your messages regularly to keep in touch with potential
                clients and recruiters.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

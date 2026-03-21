"use client";

import { useQuery } from "convex/react";
import { StatCard } from "@/components/dashboard/stat-card";
import { AnalyticsChart } from "@/components/dashboard/chart";
import { AnalyticsTable } from "@/components/dashboard/table";
import {
  FileText,
  Layout,
  Heart,
  MessageSquare,
  Eye,
  Users,
  Loader2,
  TrendingUp,
  BarChart3,
  List,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "../../../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function StatsPage() {
  const data = useQuery(api.stats.getAdvancedStats);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const { totals, charts, tables } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link
              href="/dashboard"
              className="hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Analytics</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Track your portfolio's growth, engagement, and performance metrics.
          </p>
        </div>
      </div>

      {/* Main Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Posts"
          value={totals.posts}
          icon={FileText}
          description="Total published articles"
          className="border-l-4 border-l-blue-500 bg-blue-500/5 hover:bg-blue-500/10 transition-all duration-300"
        />
        <StatCard
          title="Total Projects"
          value={totals.projects}
          icon={Layout}
          description="Showcased technical works"
          className="border-l-4 border-l-purple-500 bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300"
        />
        <StatCard
          title="Total Views"
          value={totals.views.toLocaleString()}
          icon={Eye}
          description="Cumulative article views"
          className="border-l-4 border-l-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all duration-300"
        />
        <StatCard
          title="Total Likes"
          value={totals.likes.toLocaleString()}
          icon={Heart}
          description="Cumulative post likes"
          className="border-l-4 border-l-rose-500 bg-rose-500/5 hover:bg-rose-500/10 transition-all duration-300"
        />
        <StatCard
          title="Total Comments"
          value={totals.comments}
          icon={MessageSquare}
          description="Community interactions"
          className="border-l-4 border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-all duration-300"
        />
        <StatCard
          title="Inquiries"
          value={totals.messages}
          icon={Users}
          description="Contact form submissions"
          className="border-l-4 border-l-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all duration-300"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="overview" className="gap-2 px-6">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2 px-6">
              <List className="h-4 w-4" /> Content Performance
            </TabsTrigger>
            <TabsTrigger value="engagement" className="gap-2 px-6">
              <TrendingUp className="h-4 w-4" /> Engagement
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl p-0.5 bg-gradient-to-br from-blue-500/20 to-transparent">
              <AnalyticsChart
                title="Daily Post Activity"
                data={charts.posts}
                dataKey="count"
                type="bar"
                color="#3b82f6"
              />
            </div>
            <div className="rounded-xl p-0.5 bg-gradient-to-br from-emerald-500/20 to-transparent">
              <AnalyticsChart
                title="Daily Comments Activity"
                data={charts.comments}
                dataKey="count"
                type="line"
                color="#10b981"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnalyticsTable
              title="Latest Posts"
              data={tables.latestPosts}
              type="posts"
            />
            <AnalyticsTable
              title="Latest Comments"
              data={tables.latestComments}
              type="comments"
            />
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl p-0.5 bg-gradient-to-br from-indigo-500/20 to-transparent">
              <AnalyticsTable
                title="Most Viewed Posts"
                data={tables.topViewedPosts}
                type="posts"
              />
            </div>
            <div className="rounded-xl p-0.5 bg-gradient-to-br from-rose-500/20 to-transparent">
              <AnalyticsTable
                title="Most Liked Posts"
                data={tables.topLikedPosts}
                type="posts"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6 pt-2">
          <Card className="p-16 text-center border-dashed border-2 bg-muted/20 flex flex-col items-center justify-center space-y-6">
            <div className="p-6 rounded-full bg-primary/10 text-primary animate-pulse">
              <TrendingUp className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">
                Audience Insights Coming Soon
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto text-lg">
                We're currently collecting more data to provide you with deep
                insights into reader behavior, session durations, and conversion
                rates.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 rounded-lg bg-background border text-xs font-medium">
                Tracking Active
              </div>
              <div className="px-4 py-2 rounded-lg bg-background border text-xs font-medium text-muted-foreground">
                Collecting Data...
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

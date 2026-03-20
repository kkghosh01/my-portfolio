import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

export default async function AdminProfilePage() {
  const user = await fetchAuthQuery(api.auth.getCurrentUser, {});

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Profile</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your administrator account and activity.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/" target="_blank" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" /> View Site
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="border-none shadow-sm dark:bg-muted/30">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 relative w-fit">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                  <AvatarImage
                    src={user.image || "https://github.com/shadcn.png"}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.name?.[0] || "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background shadow-sm">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <div className="mt-4 flex justify-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  Administrator
                </Badge>
                <Badge variant="outline">Verified</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-muted p-2 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Primary Email</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-muted p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Account Created</p>
                  <p className="text-muted-foreground">
                    {new Date(user._creationTime).toLocaleDateString(
                      undefined,
                      {
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm dark:bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button
                asChild
                variant="ghost"
                className="justify-start gap-2 h-9 text-sm"
              >
                <Link href="/admin/settings">
                  <User className="h-4 w-4" /> Edit Profile Details
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="justify-start gap-2 h-9 text-sm"
              >
                <Link href="/admin/settings">
                  <ShieldCheck className="h-4 w-4" /> Security Settings
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Account Details & Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm dark:bg-muted/30">
            <CardHeader>
              <CardTitle className="text-xl">Session Information</CardTitle>
              <CardDescription>
                Details about your current active session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500/10 p-2 rounded-full text-emerald-500">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-muted-foreground">
                      Active from {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                  Active Now
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Role
                  </p>
                  <p className="font-semibold text-lg">Super Admin</p>
                </div>
                <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Auth Provider
                  </p>
                  <p className="font-semibold text-lg">Email/Password</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm dark:bg-muted/30">
            <CardHeader>
              <CardTitle className="text-xl">Connected Services</CardTitle>
              <CardDescription>
                Integrations linked to your admin account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-900 text-white p-2 rounded-lg">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">GitHub Repository</p>
                    <p className="text-xs text-muted-foreground">
                      my-portfolio-v2
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-emerald-500 bg-emerald-500/5"
                >
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Professional Profile</p>
                    <p className="text-xs text-muted-foreground">
                      kishor-kumar-ghosh
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="text-emerald-500 bg-emerald-500/5"
                >
                  Connected
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

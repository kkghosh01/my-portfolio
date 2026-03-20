"use client";

import { useState, useTransition } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Globe, Github, Linkedin, Twitter, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function SettingsForm() {
  const [isPending, startTransition] = useTransition();
  const settings = useQuery(api.settings.getSettings);
  const updateSettings = useMutation(api.settings.updateSettings);

  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);

  // Initialize form when data is loaded
  const [initialized, setInitialized] = useState(false);
  if (settings && !initialized) {
    setSiteName(settings.siteName || "");
    setSiteDescription(settings.siteDescription || "");
    setSeoTitle(settings.seo?.title || "");
    setSeoDescription(settings.seo?.description || "");
    setKeywords(settings.seo?.keywords?.join(", ") || "");
    setSocialLinks(settings.socialLinks || []);
    setInitialized(true);
  }

  const handleAddSocial = () => {
    setSocialLinks([...socialLinks, { platform: "github", url: "" }]);
  };

  const handleRemoveSocial = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSocialChange = (index: number, field: "platform" | "url", value: string) => {
    const updated = [...socialLinks];
    updated[index][field] = value;
    setSocialLinks(updated);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        await updateSettings({
          siteName,
          siteDescription,
          socialLinks,
          seo: {
            title: seoTitle,
            description: seoDescription,
            keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
          }
        });
        toast.success("Settings updated successfully");
      } catch (error) {
        toast.error("Failed to update settings");
      }
    });
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your portfolio and site preferences.
          </p>
        </div>
        <Button onClick={handleSubmit} disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* General Settings */}
        <Card className="border-none shadow-sm dark:bg-muted/30">
          <CardHeader>
            <CardTitle>General Information</CardTitle>
            <CardDescription>Main site branding and details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <Input 
                value={siteName} 
                onChange={(e) => setSiteName(e.target.value)} 
                placeholder="e.g. Kishor's Code"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Description</label>
              <Textarea 
                value={siteDescription} 
                onChange={(e) => setSiteDescription(e.target.value)} 
                placeholder="Briefly describe your portfolio..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card className="border-none shadow-sm dark:bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Manage your social media presence.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddSocial} className="gap-1">
              <Plus className="h-4 w-4" /> Add Link
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialLinks.map((link, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="w-1/3">
                  <select
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={link.platform}
                    onChange={(e) => handleSocialChange(index, "platform", e.target.value)}
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="globe">Website</option>
                  </select>
                </div>
                <div className="flex-1">
                  <Input 
                    value={link.url} 
                    onChange={(e) => handleSocialChange(index, "url", e.target.value)} 
                    placeholder="https://..."
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveSocial(index)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {socialLinks.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4 italic">
                No social links added yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card className="border-none shadow-sm dark:bg-muted/30">
          <CardHeader>
            <CardTitle>SEO & Metadata</CardTitle>
            <CardDescription>Optimize your site for search engines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Title</label>
              <Input 
                value={seoTitle} 
                onChange={(e) => setSeoTitle(e.target.value)} 
                placeholder="Browser tab title..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea 
                value={seoDescription} 
                onChange={(e) => setSeoDescription(e.target.value)} 
                placeholder="Description for search engines..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords (comma separated)</label>
              <Input 
                value={keywords} 
                onChange={(e) => setKeywords(e.target.value)} 
                placeholder="nextjs, react, portfolio..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

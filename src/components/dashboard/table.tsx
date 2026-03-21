import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Heart, MessageSquare } from "lucide-react";

interface AnalyticsTableProps {
  title: string;
  data: any[];
  type: "posts" | "comments" | "projects";
}

export function AnalyticsTable({ title, data, type }: AnalyticsTableProps) {
  return (
    <Card className="border-none shadow-sm dark:bg-muted/30">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {type === "posts" && (
                  <>
                    <TableHead>Title</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Date</TableHead>
                  </>
                )}
                {type === "comments" && (
                  <>
                    <TableHead>User</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Post ID</TableHead>
                    <TableHead>Date</TableHead>
                  </>
                )}
                {type === "projects" && (
                  <>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id} className="hover:bg-muted/40 transition-colors">
                  {type === "posts" && (
                    <>
                      <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          {item.views ?? 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3 text-rose-500" />
                          {item.likes ?? 0}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                    </>
                  )}
                  {type === "comments" && (
                    <>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground">{item.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-xs italic">"{item.comment}"</TableCell>
                      <TableCell className="text-[10px] font-mono text-muted-foreground">{item.postId.slice(0, 8)}...</TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                    </>
                  )}
                  {type === "projects" && (
                    <>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{item.category || "General"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] capitalize">{item.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

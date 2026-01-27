"use client";

import { useQuery } from "convex/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";
import { api } from "../../../../../convex/_generated/api";
import { ReplyDialog } from "@/components/admin/ReplyDialog";

export default function AdminContactsPage() {
  const messages = useQuery(api.contacts.getMessages);

  if (messages === undefined) return <p>Loading...</p>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Sender</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((msg) => (
            <TableRow key={msg._id}>
              <TableCell className="text-xs">
                {format(msg.createdAt, "PPP")}
              </TableCell>
              <TableCell>
                <div className="font-medium">{msg.name}</div>
                <div className="text-xs text-muted-foreground">{msg.email}</div>
              </TableCell>
              <TableCell className="max-w-75 truncate">{msg.message}</TableCell>
              <TableCell>
                <Badge
                  variant={msg.status === "new" ? "destructive" : "secondary"}
                >
                  {msg.status === "new" ? "New" : "Replied"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {msg.status === "new" ? (
                  <ReplyDialog contact={msg} />
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Replied
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

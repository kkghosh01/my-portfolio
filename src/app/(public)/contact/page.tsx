"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/app/schemas/contactSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import type { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function ContactPage() {
  const createContact = useMutation(api.contacts.createContact); // Convex mutation [cite: 6]
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  function onSubmit(values: z.infer<typeof contactSchema>) {
    startTransition(async () => {
      try {
        // Convex mutation call
        await createContact(values);
        toast.success("Message sent successfully!");
        form.reset();
      } catch (error) {
        toast.error("Something went wrong!");
      }
    });
  }
  return (
    <div className="py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Contact Me</h1>
        <p className="text-xl text-muted-foreground mt-4">
          Send me a message using the form below.
        </p>
      </div>
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Input placeholder="Your name" {...form.register("name")} />
              <p className="text-sm text-destructive">
                {form.formState.errors.name?.message}
              </p>

              <Input
                type="email"
                placeholder="Your email"
                {...form.register("email")}
              />
              <p className="text-sm text-destructive">
                {form.formState.errors.email?.message}
              </p>

              <Textarea
                rows={6}
                placeholder="Your message"
                {...form.register("message")}
              />
              <p className="text-sm text-destructive">
                {form.formState.errors.message?.message}
              </p>

              <Button className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

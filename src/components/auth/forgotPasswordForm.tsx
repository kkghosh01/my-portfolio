"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: z.infer<typeof forgotPasswordSchema>) {
    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          email: data.email,
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
        {
          onSuccess: () => {
            toast.success(
              "If that email exists, we sent a password reset link.",
            );
            router.push("/auth");
          },
          onError: (error) => {
            toast.error(
              error.error.message || "Unable to send reset email right now.",
            );
          },
        },
      );
    });
  }

  return (
    <div className="w-125 max-w-full p-6 rounded-lg shadow-lg border bg-background">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl text-center mb-4">
            Forgot password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="admin@example.com"
                      type="email"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full mt-4">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>Send reset link</>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


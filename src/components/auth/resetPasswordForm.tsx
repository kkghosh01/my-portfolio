"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const queryToken = searchParams.get("token");
    const error = searchParams.get("error");

    if (error === "INVALID_TOKEN") {
      toast.error("This password reset link is invalid or has expired.");
      router.replace("/auth");
      return;
    }

    if (!queryToken) {
      toast.error("Missing password reset token.");
      router.replace("/auth");
      return;
    }

    setToken(queryToken);
  }, [searchParams, router]);

  function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    if (!token) return;

    startTransition(async () => {
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (error) {
        toast.error(
          error.message || "Unable to reset password. The link may be expired.",
        );
        return;
      }

      toast.success("Password updated. You can now log in.");
      router.replace("/auth");
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="w-125 max-w-full p-6 rounded-lg shadow-lg border bg-background">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl text-center mb-4">
              Reset password
            </CardTitle>
            <CardDescription className="text-center">
              Choose a new password for your admin account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>New password</FieldLabel>
                      <Input
                        aria-invalid={fieldState.invalid}
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Confirm password</FieldLabel>
                      <Input
                        aria-invalid={fieldState.invalid}
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Button
                  disabled={isPending || !token}
                  type="submit"
                  className="w-full mt-4"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating password...
                    </>
                  ) : (
                    <>Reset password</>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

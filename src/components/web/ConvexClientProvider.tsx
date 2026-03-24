"use client";

import { ReactNode, useState } from "react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

export function ConvexClientProvider({
  children,
  initialToken,
}: {
  children: ReactNode;
  initialToken?: string | null;
}) {
  const [convex] = useState(() => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
      // In SSR or development, if URL is missing, we still need a client object
      // to avoid breaking the provider, but it shouldn't be used for real requests yet.
      // This is a common issue during build/SSR in Next.js.
      return new ConvexReactClient("https://placeholder.convex.cloud");
    }
    return new ConvexReactClient(url);
  });

  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}

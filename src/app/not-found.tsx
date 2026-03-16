"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="max-w-xl w-full text-center">
        {/* 404 */}
        <h1 className="text-7xl font-bold tracking-tight text-primary">404</h1>

        {/* Title */}
        <h2 className="mt-4 text-2xl font-semibold">Page not found</h2>

        {/* Description */}
        <p className="mt-2 text-muted-foreground">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Card */}
        <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            You can go back to the previous page or return to homepage.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {/* Home */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition"
            >
              <Home size={16} />
              Go Home
            </Link>

            {/* Back */}
            <button
              onClick={() => history.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-accent transition"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

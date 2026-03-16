"use client";

import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { Loader2, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

export function SearchInput() {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);

  const result = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { limit: 5, term } : "skip",
  );

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setTerm(e.target.value);
    setOpen(true);
  }

  /* close when click outside */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      {/* input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          type="search"
          placeholder="Search blog posts..."
          value={term}
          onChange={handleSearch}
          onFocus={() => setOpen(true)}
          className="
            w-full pl-10
            bg-background
            border border-gray-300 dark:border-gray-700
            rounded-lg
            focus:ring-2 focus:ring-primary
            focus:border-primary
            transition-all
          "
        />
      </div>

      {/* dropdown */}
      {open && term.length >= 2 && (
        <div
          className="
          absolute z-50 mt-2 w-full
          rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          shadow-xl
          overflow-hidden
          animate-in fade-in zoom-in-95
        "
        >
          {/* loading */}
          {result === undefined && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          )}

          {/* empty */}
          {result && result.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">
              No results for <strong>{term}</strong>
            </div>
          )}

          {/* result */}
          {result && result.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              {result.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  onClick={() => {
                    setOpen(false);
                    setTerm("");
                  }}
                  className="
                    block px-4 py-3
                    text-sm
                    hover:bg-gray-100
                    dark:hover:bg-gray-800
                    transition-colors
                    border-b last:border-none
                    border-gray-200 dark:border-gray-700
                  "
                >
                  <p className="font-medium text-foreground">{post.title}</p>

                  {post.content && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {post.content.substring(0, 100)}...
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

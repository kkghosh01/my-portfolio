"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "../ui/button";
import { ArrowUpRight, Download, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
  // ✅ ALL hooks first
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ safe hydration guard
  if (!mounted) return null;

  function NavLink({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`${buttonVariants({
          variant: isActive ? "navActive" : "nav",
        })} relative px-4 py-2 font-medium`}
      >
        {isActive && (
          <motion.span
            className="pointer-events-none absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-md"
            layoutId="nav-pill"
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 1,
            }}
          />
        )}
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur bg-background/70"
      suppressHydrationWarning
    >
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-3xl font-bold tracking-tighter">
          Kishor&apos;s<span className="text-primary">Code</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center lg:gap-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/blog">Blog</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <Link
            href="/contact"
            className={buttonVariants({ variant: "default" })}
          >
            Hire me
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
          <Link href="/cv" className={buttonVariants({ variant: "outline" })}>
            <Download className="ml-2 h-4 w-4" />
            Download CV
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="sr-only">
                <SheetTitle>Mobile navigation</SheetTitle>
                <SheetDescription>
                  Navigation menu for mobile devices
                </SheetDescription>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                {[
                  ["/", "Home"],
                  ["/about", "About"],
                  ["/projects", "Projects"],
                  ["/blog", "Blog"],
                  ["/contact", "Contact"],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className={buttonVariants({ variant: "ghost" })}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}

                <Link
                  href="/contact"
                  className={buttonVariants({ variant: "default" })}
                  onClick={() => setIsOpen(false)}
                >
                  Hire me
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                </Link>

                <Link
                  href="/cv"
                  className={buttonVariants({ variant: "outline" })}
                  onClick={() => setIsOpen(false)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Button, buttonVariants } from "../ui/button";
import { ArrowUpRight, Eye, Menu } from "lucide-react";
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

function NavLink({
  href,
  children,
  pathname,
}: {
  href: string;
  children: React.ReactNode;
  pathname: string;
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

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-16 border-b border-border" />;
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-3xl font-bold tracking-tighter">
          Kishor&apos;s<span className="text-primary">Code</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center lg:gap-2">
          <NavLink href="/" pathname={pathname}>
            Home
          </NavLink>
          <NavLink href="/about" pathname={pathname}>
            About
          </NavLink>
          <NavLink href="/projects" pathname={pathname}>
            Projects
          </NavLink>
          <NavLink href="/blog" pathname={pathname}>
            Blog
          </NavLink>
          <NavLink href="/contact" pathname={pathname}>
            Contact
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-2 lg:gap-6">
          <Link
            href="/contact"
            className={buttonVariants({ variant: "default" })}
          >
            Hire me
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>

          <Link
            href="/resume"
            className={buttonVariants({ variant: "outline" })}
          >
            <Eye className="ml-2 h-4 w-4" />
            View Resume
          </Link>

          <ThemeToggle />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <div className="sr-only">
                <SheetTitle>Mobile navigation</SheetTitle>
                <SheetDescription>Navigation menu</SheetDescription>
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
              </div>

              {/* Mobile CTAs */}
              <div className="mt-auto flex flex-col gap-3 pb-20">
                <Link
                  href="/contact"
                  className={buttonVariants({
                    variant: "default",
                    className: "w-full",
                  })}
                  onClick={() => setIsOpen(false)}
                >
                  Hire me <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/resume"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                  onClick={() => setIsOpen(false)}
                >
                  <Eye className="mr-2 h-4 w-4" /> View Resume
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

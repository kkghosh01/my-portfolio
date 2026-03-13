"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, Heart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/kkghosh01",
    icon: <Github className="h-4 w-4" />,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/kishor-kumar-ghosh-b2839722a/",
    icon: <Linkedin className="h-4 w-4" />,
  },
  {
    name: "Email",
    href: "mailto:hello@kishorkumar.dev",
    icon: <Mail className="h-4 w-4" />,
  },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t bg-linear-to-b from-background to-secondary/10">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex flex-col items-start gap-4">
              <div>
                <Link href="/" className="text-3xl font-bold tracking-tighter">
                  Kishor&apos;s<span className="text-primary">Code</span>
                </Link>
                <p className="text-lg text-muted-foreground mt-1">
                  Full Stack Developer
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Crafting digital experiences with modern technologies.
                Passionate about building scalable web applications and solving
                complex problems through code.
              </p>
            </div>
          </div>

          {/* Navigation Section */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-6">
              Navigation
            </h4>
            <nav className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.name}
                  <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Connect Section */}
          <div className="lg:col-span-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80 mb-6">
              Let&apos;s Connect
            </h4>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Interested in collaboration or have a project in mind?
                <br />
                Feel free to reach out!
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-foreground/10 hover:border-primary/30 hover:bg-primary/5 transition-all hover:scale-105"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.name}
                    >
                      {link.icon}
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Crafted with{" "}
            <Heart className="inline h-3 w-3 text-red-500 fill-red-500 mx-0.5" />{" "}
            in Bangladesh
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          <p className="text-sm text-muted-foreground text-center md:text-right">
            © {currentYear} Kishor Kumar. All rights reserved.
          </p>
        </div>

        {/* Back to Top Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-8 -top-6 h-12 w-12 rounded-full border shadow-md hover:shadow-lg transition-all"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUpRight className="h-4 w-4 rotate-270" />
        </Button>
      </div>

      {/* Gradient Ornament */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
    </footer>
  );
}

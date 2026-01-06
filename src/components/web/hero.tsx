"use client";

import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden py-16 scroll-mt-24"
      aria-label="Hero section"
      id="home"
    >
      <div className="container mx-auto grid lg:grid-cols-[2fr_1fr] gap-12 items-center">
        {/* LEFT CONTENT */}
        <div className="space-y-7 flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            I'm{" "}
            <span className="bg-linear-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
              Kishor
            </span>{" "}
            Kumar Ghosh
          </h1>

          <h2 className="text-lg md:text-2xl font-semibold text-muted-foreground">
            Full Stack Developer & UI Enthusiast
          </h2>

          {/* TAGLINE BADGE */}
          <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-accent/50 backdrop-blur-md px-3 py-1.5 text-xs md:text-sm text-foreground">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 " />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>

            <span className="md:hidden">Crafting digital experiences</span>
            <span className="hidden md:inline">
              Turning ideas into elegant digital experiences
            </span>
          </div>

          <p className="max-w-md text-sm md:text-base text-muted-foreground leading-relaxed">
            I build scalable, responsive web applications using modern
            technologies and best practices—focused on clean UI, smooth
            interactions, and real-world problem solving.
          </p>

          <Button
            className={buttonVariants({
              size: "lg",
              className: "group inline-flex items-center gap-2 rounded-xl",
            })}
          >
            Hire Me
            <ArrowUpRight
              size={18}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center lg:justify-center-safe group group-hover:shadow-xl group-hover:shadow-indigo-500/10">
          {/* background card */}
          <div className="absolute w-72 h-96 rounded-2xl bg-indigo-500/20 lg:rotate-12 transition-transform duration-500 ease-out group-hover:rotate-0 group-hover:scale-105" />

          {/* image card */}
          <div className="relative w-72 h-96 overflow-hidden rounded-2xl border border-white/10 backdrop-blur transition-transform duration-500 ease-out lg:rotate-6 group-hover:rotate-0 group-hover:scale-105">
            <Image
              src="/Kishor.jpg"
              alt="Kishor Kumar Ghosh"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* DECORATIVE SHAPES */}
      <span className="absolute top-24 left-1/2 h-6 w-6 rotate-45 border border-white/20" />
      <span className="absolute bottom-32 left-20 h-4 w-4 rounded-full bg-indigo-400/30" />
      <span className="absolute top-10 right-24 h-1 w-10 bg-white/30" />
    </section>
  );
}

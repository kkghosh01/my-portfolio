"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Rocket,
  LayoutDashboard,
  Sparkles,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  const services = [
    {
      title: "Frontend Development",
      text: "Building modern responsive interfaces using React, Next.js and Tailwind.",
      icon: LayoutDashboard,
    },
    {
      title: "UI / UX Focus",
      text: "Creating clean and intuitive user experiences with performance in mind.",
      icon: Sparkles,
    },
    {
      title: "Performance Optimization",
      text: "Improving website speed, SEO, and scalability for production apps.",
      icon: Rocket,
    },
  ];

  return (
    <section className="w-full bg-background text-foreground py-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center px-6">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center md:justify-start"
        >
          <div className="relative w-full max-w-xs sm:max-w-sm aspect-[340/380] rounded-3xl overflow-hidden border border-border shadow-md group">
            <Image
              src="/Kishor.jpg"
              alt="Kishor Kumar"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
          </div>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            About Me
          </h1>

          <p className="text-muted-foreground leading-relaxed">
            Hi, I&apos;m{" "}
            <span className="font-semibold text-foreground">Kishor Kumar</span>,
            a passionate Frontend Developer focused on building modern, fast,
            and user-friendly web applications.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            I specialize in building responsive interfaces using
            <span className="text-primary font-medium"> React</span>,
            <span className="text-primary font-medium"> Next.js</span>, and
            <span className="text-primary font-medium"> TypeScript</span>.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Currently expanding toward full-stack development with Node.js while
            exploring modern backend architectures.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Button asChild size="lg" className="gap-2">
              <Link href="/contact">
                <Mail size={18} />
                Hire Me
              </Link>
            </Button>

            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/projects">
                View Projects
                <ArrowRight size={18} />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* What I Do */}
      <div className="max-w-6xl mx-auto mt-24 px-6">
        <h2 className="text-2xl font-semibold mb-10">What I Do</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Card className="group border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    {/* Icon */}
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>

                    <h3 className="font-semibold text-lg">{item.title}</h3>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-6xl mx-auto mt-24 px-6">
        <h2 className="text-2xl font-semibold mb-8">Tech Stack</h2>

        <motion.div
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {[
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Node.js",
            "Git",
            "REST API",
          ].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-lg border border-border bg-muted text-sm hover:bg-accent transition-colors"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

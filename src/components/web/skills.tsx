"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Code2, Server, Wrench, Sparkles } from "lucide-react";

type SkillCategory = {
  title: string;
  skills: string[];
  icon: React.ReactNode;
  gradient: string;
};

const SKILLS: SkillCategory[] = [
  {
    title: "Frontend Development",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "TypeScript",
      "React.js",
      "Next.js 14",
      "Tailwind CSS",
      "Shadcn UI",
    ],
    icon: <Code2 className="h-5 w-5" />,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    title: "Backend & Database",
    skills: ["Node.js", "Express.js", "Convex", "MongoDB", "REST APIs"],
    icon: <Server className="h-5 w-5" />,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Tools & Platforms",
    skills: ["Git & GitHub", "Vercel", "Figma", "VS Code", "Responsive Design"],
    icon: <Wrench className="h-5 w-5" />,
    gradient: "from-amber-500 to-orange-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

export default function Skills() {
  return (
    <section className="py-20 bg-linear-to-b from-background to-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-4xl font-bold tracking-tight">
              Technical Expertise
            </h2>
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive toolkit of modern technologies and frameworks I
            utilize to build exceptional digital experiences
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {SKILLS.map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Card className="h-full border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2 rounded-lg bg-linear-to-r ${category.gradient}`}
                    >
                      <div className="text-white">{category.icon}</div>
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {category.title}
                    </CardTitle>
                  </div>
                  <div className="h-1 w-12 bg-linear-to-r from-transparent via-primary to-transparent opacity-60" />
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-4 py-2 text-sm font-medium rounded-full border bg-secondary/50 hover:bg-secondary transition-colors cursor-default group"
                      >
                        <span className="group-hover:scale-105 transition-transform block">
                          {skill}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 border">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">
                Continuously learning
              </span>{" "}
              and adapting to new technologies in the ever-evolving web
              landscape
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

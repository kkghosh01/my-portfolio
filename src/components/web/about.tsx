import { CodeXml, User2, Backpack } from "lucide-react";

export function About() {
  return (
    <section
      id="about"
      aria-label="About Me"
      className="container mx-auto py-20 px-4 sm:px-6 lg:px-8 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="mb-14 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 bg-linear-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
          About Me
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A quick introduction to who I am and what I love building
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
        {/* Left Content */}
        <div className="max-w-3xl space-y-6 text-center md:text-left mx-auto">
          <h3 className="text-2xl font-bold">
            Passionate Web Developer & UI Designer
          </h3>

          <p className="text-muted-foreground leading-relaxed">
            I'm a passionate Frontend Developer focused on building clean,
            responsive, and user-friendly web interfaces. I enjoy transforming
            complex problems into simple, elegant solutions using modern web
            technologies.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            My core expertise includes{" "}
            <strong className="text-foreground">
              JavaScript, React, and Next.js
            </strong>
            . I love working with component-based architectures, smooth
            animations, and performance-optimized UI while maintaining strong
            accessibility and SEO practices.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            Currently, I'm expanding toward full-stack development by learning{" "}
            <strong className="text-foreground">Node.js</strong> and databases,
            with a long-term goal of building scalable, real-world applications
            and integrating AI-powered features into web products.
          </p>

          <p className="text-muted-foreground leading-relaxed">
            I believe in continuous learning, writing clean and maintainable
            code, and growing through real-world projects. Exploring new tools
            and ideas keeps me motivated and inspired.
          </p>
        </div>

        {/* Right Cards */}
        <div className="space-y-6">
          {/* Card 1 */}
          <div className="flex items-start gap-4 bg-accent/50 backdrop-blur-md p-6 rounded-xl transition hover:shadow-lg">
            <div className="p-4 bg-accent/70 rounded-full">
              <CodeXml size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold">Web Development</h4>
              <p className="text-muted-foreground leading-relaxed mt-1">
                Building responsive, accessible, and high-performance web
                applications with modern technologies.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-start gap-4 bg-accent/50 backdrop-blur-md p-6 rounded-xl transition hover:shadow-lg">
            <div className="p-4 bg-accent/70 rounded-full">
              <User2 size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold">UI / UX Design</h4>
              <p className="text-muted-foreground leading-relaxed mt-1">
                Designing intuitive, user-centered interfaces with a strong
                focus on usability and visual clarity.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-start gap-4 bg-accent/50 backdrop-blur-md p-6 rounded-xl transition hover:shadow-lg">
            <div className="p-4 bg-accent/70 rounded-full">
              <Backpack size={28} className="text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-semibold">Project Management</h4>
              <p className="text-muted-foreground leading-relaxed mt-1">
                Planning, organizing, and delivering projects efficiently while
                maintaining clean code and clear communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

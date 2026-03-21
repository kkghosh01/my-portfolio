"use client";

import DownloadCVButton from "@/components/web/DownloadCVButton";
import Breadcrumbs from "@/components/web/breadcrumbs";

export default function Resume() {
  return (
    <div className="bg-gray-50 min-h-screen p-6 text-gray-800">
      <div className="max-w-4xl mx-auto mb-6">
        <Breadcrumbs />
      </div>
      <main className="max-w-4xl mx-auto bg-white p-8 shadow-sm">
        {/* Top bar */}
        <div className="flex justify-end mb-4">
          <DownloadCVButton />
        </div>

        {/* Header */}
        <section className="mb-6 text-center">
          <h1 className="text-2xl font-bold">KISHOR KUMAR GHOSH</h1>

          <p className="mt-2 text-gray-600">
            Satkhira, Bangladesh | kishorkumarghosh23@gmail.com | Portfolio:
            kishorscode.com | GitHub: github.com/kkghosh01
          </p>
        </section>

        <div className="w-full h-px bg-gray-300 my-4" />

        {/* Summary */}
        <section className="mb-6">
          <h2 className="font-semibold">PROFESSIONAL SUMMARY</h2>

          <div className="w-full h-px bg-gray-300 my-2" />

          <p>
            Full Stack Web Developer with experience in JavaScript, React,
            Next.js, and Node.js. Skilled in building responsive, SEO-friendly,
            and scalable web applications. Experienced in REST APIs,
            authentication, database design, and deployment. Passionate about
            modern web development, performance optimization, and clean UI.
          </p>
        </section>

        {/* Skills */}
        <section className="mb-6">
          <h2 className="font-semibold">TECHNICAL SKILLS</h2>

          <div className="w-full h-px bg-gray-300 my-2" />

          <p>
            <b>Languages:</b> JavaScript (ES6+), TypeScript, Python, HTML5, CSS3
          </p>

          <p>
            <b>Frontend:</b> React, Next.js, Tailwind CSS, Shadcn UI
          </p>

          <p>
            <b>Backend:</b> Node.js, Express.js, REST API, Authentication
          </p>

          <p>
            <b>Database:</b> MongoDB, PostgreSQL, Convex, NoSQL
          </p>

          <p>
            <b>Tools:</b> Git, GitHub, VS Code, Figma, npm
          </p>

          <p>
            <b>Other:</b> SEO Optimization, Performance Optimization,
            Deployment, Debugging
          </p>
        </section>

        {/* Projects */}
        <section className="mb-6">
          <h2 className="font-semibold">PROJECTS</h2>

          <div className="w-full h-px bg-gray-300 my-2" />

          <div className="mb-3">
            <p className="font-medium">Portfolio Website</p>

            <p>
              Full-stack portfolio built using Next.js and Node.js with blog
              system, SEO optimization, dynamic routing, and responsive design.
            </p>
          </div>

          <div className="mb-3">
            <p className="font-medium">Food Delivery and Recipe Frontend</p>

            <p>
              Responsive web application built with React and Tailwind CSS,
              including food listing, recipe pages, and interactive UI.
            </p>
          </div>

          <div>
            <p className="font-medium">E-commerce Frontend</p>

            <p>
              Responsive online store built with HTML, CSS, and JavaScript,
              including product showcase, cart UI, and hero animations.
            </p>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-6">
          <h2 className="font-semibold">EXPERIENCE / FREELANCE WORK</h2>

          <div className="w-full h-px bg-gray-300 my-2" />

          <p className="font-medium">Freelance Web Developer</p>

          <ul className="list-disc ml-6">
            <li>
              Built full-stack web applications using React, Next.js, and
              Node.js
            </li>

            <li>Implemented authentication with BetterAuth and Convex</li>

            <li>Developed REST APIs and database integrations</li>

            <li>Optimized performance, SEO, and responsiveness</li>

            <li>Created reusable UI components and scalable structures</li>
          </ul>
        </section>

        {/* Education */}
        <section className="mb-6">
          <h2 className="font-semibold">EDUCATION</h2>

          <div className="w-full h-px bg-gray-300 my-2" />

          <p>Bachelor of Social Science (BSS)</p>

          <p>Satkhira Govt. College, Bangladesh</p>

          <p>Relevant Courses: Web Development, JavaScript, React, Node.js</p>
        </section>

        {/* Achievements */}
        <section className="mb-6">
          <h2 className="font-semibold">ACHIEVEMENTS & HIGHLIGHTS</h2>

          <div className="w-full h-px bg-gray-300 my-2" />

          <ul className="list-disc ml-6">
            <li>
              Built and deployed multiple personal and freelance projects
              end-to-end
            </li>

            <li>
              Created ThemeForest-ready templates and blogs with SEO best
              practices
            </li>

            <li>
              Experienced in building full-stack applications with
              authentication and database integration
            </li>

            <li>Strong problem-solving skills and quick learning ability</li>
          </ul>
        </section>

        {/* Soft skills */}
        <section>
          <h2 className="font-semibold">SOFT SKILLS</h2>

          <div className="w-full h-px bg-gray-300 my-2" />

          <p>
            Problem solving, teamwork, adaptability, self-learning, attention to
            detail
          </p>
        </section>
      </main>
    </div>
  );
}

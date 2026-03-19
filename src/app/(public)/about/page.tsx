import AboutPage from "@/components/web/about/AboutPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Kishor Kumar Ghosh - Full Stack Developer",
};

export default function Page() {
  return <AboutPage />;
}

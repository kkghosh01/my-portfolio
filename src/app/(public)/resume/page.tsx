import Resume from "@/components/web/resume/ResumePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Kishor Kumar Ghosh's Resume",
};
export default function Page() {
  return <Resume />;
}

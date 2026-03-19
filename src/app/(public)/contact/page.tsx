import ContactPage from "@/components/web/contact/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Kishor Kumar Ghosh",
};
export default function page() {
  return <ContactPage />;
}

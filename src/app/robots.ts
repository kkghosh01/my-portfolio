import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://my-portfolio-tau-six-33xhna7rpv.vercel.app/sitemap.xml",
  };
}

"use client";

import { Download } from "lucide-react";

export default function DownloadCVButton() {
  return (
    <a
      href="/cv/KishorKumar_CV.pdf"
      target="_blank"
      rel="noopener noreferrer"
      download
      className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 outline bg-secondary text-primary hover:bg-secondary/50 rounded-lg transition"
    >
      Download Resume
      <Download className="ml-2 h-4 w-4" />
    </a>
  );
}

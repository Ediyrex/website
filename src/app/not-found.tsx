import type { Metadata } from "next";
import { NotFoundPage } from "@/components/errors/NotFound";

export const metadata: Metadata = {
  title: "404 — Signal Lost | EDYREX Studio",
  description:
    "The page you're looking for could not be found. Explore EDYREX services, projects and studio capabilities.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundPage />;
}

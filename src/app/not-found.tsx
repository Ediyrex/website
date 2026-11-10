import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#08090B] px-5 py-32">
      <div className="max-w-lg text-center space-y-6">
        <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#D6B77A]">
          Error 404
        </span>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#F5F3EE]">
          Page not found
        </h1>
        <p className="text-sm sm:text-base text-[#B2B4BA] leading-relaxed">
          The page you are looking for may have moved or does not exist. Explore our capabilities or return to the studio homepage.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button href="/" variant="primary" size="md">
            <ArrowLeft className="w-4 h-4" />
            <span>Return Home</span>
          </Button>
          <Link
            href="/services"
            className="text-sm font-medium text-[#B2B4BA] hover:text-[#F5F3EE] px-4 py-2 transition-colors"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
}

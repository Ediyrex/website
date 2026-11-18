import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Sign In | EDIYREX Studio",
  description: "Sign in to EDIYREX Studio internal administration workspace.",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

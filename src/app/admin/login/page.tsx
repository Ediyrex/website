"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loginSchema } from "@/lib/validations/auth";
import { TurnstileWidget, useTurnstile } from "@/features/turnstile";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const turnstile = useTurnstile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const parsed = loginSchema.safeParse({
      email,
      password,
      turnstileToken: turnstile.token || undefined,
    });
    if (!parsed.success) {
      setErrorMessage(
        parsed.error.issues[0]?.message || "Please check your credentials."
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.message || "Invalid email or password.");
        turnstile.reset();
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErrorMessage("Unable to reach authentication server.");
      turnstile.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090B] px-5 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link
            href="/"
            aria-label="EDIYREX Studio - Home"
            className="inline-flex items-center justify-center gap-3 group"
          >
            <Image
              src="/images/logo/ediyrex-emblem.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <Image
              src="/images/logo/ediyrex-wordmark.png"
              alt="EDIYREX STUDIO"
              width={140}
              height={22}
              className="h-5 w-auto object-contain"
            />
          </Link>
          <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#777D87]">
            Studio Administration
          </p>
        </div>

        <div className="p-7 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#252A32]">
            <Lock className="w-4 h-4 text-[#D6B77A]" />
            <h1 className="font-heading text-lg font-semibold text-[#F5F3EE]">
              Sign in to Admin Dashboard
            </h1>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-[#F07878]/10 border border-[#F07878]/30 text-[#F07878] text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
              >
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ediyrex.com"
                className="w-full h-12 px-3.5 rounded-[8px] bg-[#0D0F12] border border-[#3A414B] text-[#F5F3EE] placeholder-[#777D87] text-sm focus:outline-none focus:border-[#D6B77A]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-medium text-[#F5F3EE] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-3.5 pr-11 rounded-[8px] bg-[#0D0F12] border border-[#3A414B] text-[#F5F3EE] placeholder-[#777D87] text-sm focus:outline-none focus:border-[#D6B77A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777D87] hover:text-[#F5F3EE] p-1 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <TurnstileWidget
              action="admin_login"
              onSuccess={turnstile.onSuccess}
              onError={turnstile.onError}
              onExpire={turnstile.onExpire}
              theme="dark"
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              variant="primary"
              className="w-full mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}


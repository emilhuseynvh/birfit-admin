"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/lib/config";
import { ADMIN_COOKIE, COOKIE_MAX_AGE, TOKEN_COOKIE, type AdminUser } from "@/lib/auth-cookies";
import { toApiError } from "@/lib/api-error";
import Logo from "@/components/layout/logo";

type LoginResponse = {
  accessToken: string;
  user: AdminUser & { role: "user" | "admin" };
};

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
      });
      if (!response.ok) throw await toApiError(response);
      const data = (await response.json()) as LoginResponse;
      if (data.user.role !== "admin") {
        throw new Error("This account does not have admin access");
      }
      setCookie(TOKEN_COOKIE, data.accessToken);
      setCookie(
        ADMIN_COOKIE,
        JSON.stringify({ id: data.user.id, fullName: data.user.fullName, email: data.user.email })
      );
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign in");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 px-4">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold">Welcome back</h2>
        <p className="text-muted-foreground text-sm">Sign in to the BirFit admin panel</p>
        {params.get("expired") && (
          <p className="text-destructive text-sm">Your session expired, please sign in again.</p>
        )}
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@birfit.app"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2Icon className="animate-spin" />}
          Sign in
        </Button>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 overflow-hidden bg-[#0a0807] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(242,107,29,0.35),transparent_55%)]" />
        <Image src="/hero.png" alt="BirFit" fill className="object-contain p-24" priority />
        <div className="absolute bottom-12 left-12 flex items-center gap-3 text-white">
          <Logo />
          <div>
            <div className="text-lg font-semibold">BirFit</div>
            <div className="text-sm text-white/60">AI powered training and nutrition</div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center lg:w-1/2">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

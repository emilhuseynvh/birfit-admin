import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { SiteHeader } from "@/components/layout/header";
import { ADMIN_COOKIE, TOKEN_COOKIE, type AdminUser } from "@/lib/auth-cookies";

function parseAdmin(raw: string | undefined): AdminUser | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export default async function DashboardLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  if (!cookieStore.get(TOKEN_COOKIE)?.value) {
    redirect("/login");
  }
  const admin = parseAdmin(cookieStore.get(ADMIN_COOKIE)?.value);
  const sidebarCookie = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarCookie === undefined || sidebarCookie.value === "true";

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 14)",
          "--content-padding": "calc(var(--spacing) * 4)",
          "--content-margin": "calc(var(--spacing) * 1.5)",
          "--content-full-height":
            "calc(100vh - var(--header-height) - (var(--content-padding) * 2) - (var(--content-margin) * 2))"
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" admin={admin} />
      <SidebarInset>
        <SiteHeader admin={admin} />
        <div className="bg-muted/40 flex flex-1 flex-col">
          <div className="@container/main p-(--content-padding) xl:group-data-[theme-content-layout=centered]/layout:container xl:group-data-[theme-content-layout=centered]/layout:mx-auto">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

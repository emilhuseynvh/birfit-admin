"use client";

import * as React from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useIsTablet } from "@/hooks/use-mobile";
import type { AdminUser } from "@/lib/auth-cookies";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/layout/logo";

export function AppSidebar({
  admin,
  ...props
}: React.ComponentProps<typeof Sidebar> & { admin: AdminUser | null }) {
  const pathname = usePathname();
  const { setOpen, setOpenMobile, isMobile } = useSidebar();
  const isTablet = useIsTablet();

  useEffect(() => {
    if (isMobile) setOpenMobile(false);
  }, [pathname]);

  useEffect(() => {
    setOpen(!isTablet);
  }, [isTablet]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="hover:text-foreground h-10 group-data-[collapsible=icon]:px-0! hover:bg-[var(--primary)]/5"
              asChild
            >
              <Link href="/dashboard">
                <Logo />
                <span className="text-foreground font-semibold">BirFit</span>
                <Badge variant="outline" className="ml-auto group-data-[collapsible=icon]:hidden">
                  Admin
                </Badge>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <NavMain />
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser admin={admin} />
      </SidebarFooter>
    </Sidebar>
  );
}

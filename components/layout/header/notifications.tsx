"use client";

import { BellIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api.client";
import { generateAvatarFallback } from "@/lib/utils";
import type { AppUser, Paginated } from "@/lib/types";

const Notifications = () => {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    apiFetch<Paginated<AppUser>>("/admin/users?limit=8")
      .then((result) => setUsers(result.items))
      .catch(() => setUsers([]));
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="ghost" className="relative">
          <BellIcon />
          {users.length > 0 && (
            <span className="bg-destructive absolute end-0.5 top-0.5 block size-1.5 shrink-0 rounded-full"></span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={isMobile ? "center" : "end"} className="ms-4 w-80 p-0">
        <DropdownMenuLabel className="bg-background dark:bg-muted sticky top-0 z-10 p-0">
          <div className="flex justify-between border-b px-6 py-4">
            <div className="font-medium">New members</div>
            <Button variant="link" className="h-auto p-0 text-xs" size="icon-sm" asChild>
              <Link href="/dashboard/users">View all</Link>
            </Button>
          </div>
        </DropdownMenuLabel>

        <ScrollArea className="h-[350px]">
          {users.length === 0 && (
            <div className="text-muted-foreground px-6 py-10 text-center text-sm">
              No new members yet.
            </div>
          )}
          {users.map((user) => (
            <DropdownMenuItem
              key={user.id}
              className="group flex cursor-pointer items-start gap-9 rounded-none border-b px-4 py-3"
              asChild
            >
              <Link href={`/dashboard/users/${user.id}`}>
                <div className="flex flex-1 items-start gap-2">
                  <div className="flex-none">
                    <Avatar className="size-8">
                      <AvatarFallback>{generateAvatarFallback(user.fullName)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="truncate text-sm font-medium">{user.fullName} joined</div>
                    <div className="text-muted-foreground line-clamp-1 text-xs">{user.email}</div>
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <ClockIcon className="size-3!" />
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;

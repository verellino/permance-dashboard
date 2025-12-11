"use client";

import * as React from "react";
import { Building2, Home, Users, ChevronsUpDown, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { protocol, rootDomain } from "@/lib/utils";

type Membership = {
  workspaceId: string;
  workspaceType: "MASTER" | "CLIENT" | "CLIPPER";
  role: string;
  subdomain?: string | null;
};

type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
  membership: Membership;
};

export function TeamSwitcher() {
  const { isMobile } = useSidebar();
  const { data } = useSession();
  const memberships = (data as any)?.memberships as Membership[] | undefined;

  const teams: Team[] =
    memberships?.map((m) => ({
      name:
        m.workspaceType === "MASTER"
          ? "Master"
          : m.subdomain ?? m.workspaceType.toLowerCase(),
      logo:
        m.workspaceType === "MASTER"
          ? Building2
          : m.workspaceType === "CLIENT"
            ? Users
            : Home,
      plan: `${m.workspaceType.toLowerCase()} • ${m.role}`,
      membership: m,
    })) ?? [];

  const [activeTeam, setActiveTeam] = React.useState<Team | null>(
    teams[0] ?? null
  );

  React.useEffect(() => {
    if (!activeTeam && teams.length > 0) {
      setActiveTeam(teams[0]);
    }
  }, [teams, activeTeam]);

  const goToWorkspace = (m: Membership) => {
    if (m.workspaceType === "MASTER") {
      window.location.href = "/master/dashboard";
      return;
    }
    if (m.subdomain) {
      const path =
        m.workspaceType === "CLIENT"
          ? "/client/dashboard"
          : "/clipper/dashboard";
      window.location.href = `${protocol}://${m.subdomain}.${rootDomain}${path}`;
    }
  };

  if (!activeTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground border"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={`${team.membership.workspaceId}-${team.membership.workspaceType}`}
                onClick={() => {
                  setActiveTeam(team);
                  goToWorkspace(team.membership);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            {/* <DropdownMenuSeparator /> */}
            {/* <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add workspace</div>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}


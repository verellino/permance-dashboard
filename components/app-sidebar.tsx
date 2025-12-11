"use client"

import * as React from "react"
import {
  IconDashboard,
  IconUsers,
  IconSend,
  IconSettings,
  IconUserCircle,
  IconClipboardList,
  IconFiles,
  IconListCheck,
  IconCloudUpload,
  IconHome,
  IconBuildingSkyscraper,
  IconShieldHalfFilled,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const masterNav = [
  { title: "Dashboard", url: "/master/dashboard", icon: IconDashboard },
  { title: "Clients", url: "/master/clients", icon: IconBuildingSkyscraper },
  { title: "Clippers", url: "/master/clippers", icon: IconUsers },
  { title: "Invites", url: "/master/invites", icon: IconSend },
  { title: "Workspace Settings", url: "/master/workspace-settings", icon: IconSettings },
  { title: "Account", url: "/master/account", icon: IconUserCircle },
]

const clientNav = [
  { title: "Dashboard", url: "/client/dashboard", icon: IconDashboard },
  { title: "Content", url: "/client/content", icon: IconFiles },
  { title: "Tasks", url: "/client/tasks", icon: IconListCheck },
  { title: "Invites", url: "/client/invites", icon: IconSend },
  { title: "Team", url: "/client/team", icon: IconUsers },
  { title: "Workspace Settings", url: "/client/workspace-settings", icon: IconSettings },
  { title: "Account", url: "/client/account", icon: IconUserCircle },
]

const clipperNav = [
  { title: "Dashboard", url: "/clipper/dashboard", icon: IconHome },
  { title: "My Tasks", url: "/clipper/tasks", icon: IconClipboardList },
  { title: "Uploads", url: "/clipper/uploads", icon: IconCloudUpload },
  { title: "Account", url: "/clipper/account", icon: IconUserCircle },
]

const secondary = [
  { title: "Support", url: "#", icon: IconShieldHalfFilled },
]

const baseUser = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar({
  workspaceType = "MASTER",
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  workspaceType?: "MASTER" | "CLIENT" | "CLIPPER"
}) {
  const navMain =
    workspaceType === "MASTER"
      ? masterNav
      : workspaceType === "CLIENT"
        ? clientNav
        : clipperNav

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-2xl font-semibold text-primary">Permance</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={baseUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

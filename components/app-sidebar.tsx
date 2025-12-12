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
  IconListDetails,
  IconAdjustments,
  IconCpu,
  IconKey,
  IconReceipt2,
  IconShieldLock,
  IconBook,
  IconBulb,
  IconTimelineEvent,
  IconBriefcase,
  IconLayersIntersect,
  IconScissors,
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
import { TeamSwitcher } from "@/components/team-switcher"

const masterNav = [
  { title: "Dashboard", url: "/master/dashboard", icon: IconDashboard },
  { title: "Clients", url: "/master/clients", icon: IconBuildingSkyscraper },
  { title: "Clippers", url: "/master/clippers", icon: IconScissors },
  { 
    title: "Posts", 
    url: "/master/posts", 
    icon: IconFiles,
    items: [
      { title: "All Posts", url: "/master/posts", icon: IconFiles },
      { title: "Trial Reels", url: "/master/posts/trial", icon: IconBulb },
    ]
  },
  { title: "Billing", url: "/master/billing", icon: IconReceipt2 },
  { title: "Workspace: Users & Roles", url: "/master/users", icon: IconUsers },
  { title: "Workspace Settings", url: "/master/workspace-settings", icon: IconSettings },
  // { title: "Creators", url: "/master/creators", icon: IconUsers },
  // { title: "Content (Legacy)", url: "/master/content", icon: IconFiles },
  // { title: "Operations", url: "/master/operations", icon: IconListDetails },
  // { title: "Content Intelligence", url: "/master/content-intelligence", icon: IconCpu },
  // { title: "API Keys", url: "/master/api-keys", icon: IconKey },
  // { title: "Audit Logs", url: "/master/audit-logs", icon: IconShieldLock },
  // { title: "Invites", url: "/master/invites", icon: IconSend },
  // { title: "Account", url: "/master/account", icon: IconUserCircle },
]

const clientNav = [
  { title: "Dashboard", url: "/client/dashboard", icon: IconDashboard },
  { title: "Content Library", url: "/client/content-library", icon: IconFiles },
  { title: "Insights", url: "/client/insights", icon: IconAdjustments },
  { title: "Ideas & Strategy", url: "/client/ideas", icon: IconBulb },
  { title: "Clip Pipeline", url: "/client/clip-pipeline", icon: IconListCheck },
  { title: "Invites", url: "/client/invites", icon: IconSend },
  { title: "Team", url: "/client/team", icon: IconUsers },
  { title: "Brand & Assets", url: "/client/assets", icon: IconBook },
  { title: "Social Accounts", url: "/client/social-accounts", icon: IconTimelineEvent },
  { title: "Workspace Settings", url: "/client/workspace-settings", icon: IconSettings },
  { title: "Account", url: "/client/account", icon: IconUserCircle },
]

const clipperNav = [
  { title: "Dashboard", url: "/clipper/dashboard", icon: IconHome },
  { title: "My Tasks", url: "/clipper/tasks", icon: IconClipboardList },
  { title: "Content Queue", url: "/clipper/content-queue", icon: IconListDetails },
  { title: "Content Library", url: "/clipper/content-library", icon: IconLayersIntersect },
  { title: "Ideas & Inspiration", url: "/clipper/ideas", icon: IconBulb },
  { title: "Uploads", url: "/clipper/uploads", icon: IconCloudUpload },
  { title: "Client Briefs", url: "/clipper/client-briefs", icon: IconBriefcase },
  { title: "Settings", url: "/clipper/settings", icon: IconSettings },
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
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavSecondary items={secondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

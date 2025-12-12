"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconCirclePlusFilled, IconMail, IconChevronDown, IconChevronRight, type Icon } from "@tabler/icons-react"
import { useState, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  url: string
  icon?: Icon
  items?: NavItem[]
}

function isActive(pathname: string, url: string): boolean {
  // Exact match
  if (pathname === url) return true
  
  // For paths that end with the URL, check if it's followed by / or end of string
  // This prevents /master/posts/trial from matching /master/posts
  // But allows /master/posts/123 to match /master/posts if needed
  if (pathname.startsWith(url)) {
    const nextChar = pathname[url.length]
    // Only match if URL is followed by / or nothing (end of string)
    // This ensures /master/posts matches /master/posts but not /master/posts/trial
    return nextChar === undefined || nextChar === '?'
  }
  
  return false
}

function NavItemComponent({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const hasSubItems = item.items && item.items.length > 0
  
  // Check if any sub-item is currently active
  const hasActiveSubItem = hasSubItems && item.items!.some(subItem => isActive(pathname, subItem.url))
  
  // Use a stable storage key for this menu item
  const storageKey = `sidebar-open-${item.title}`
  
  // Initialize state from sessionStorage or based on active sub-item
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(storageKey)
      if (stored !== null) {
        return stored === 'true'
      }
    }
    // Default to open if sub-item is active
    return hasActiveSubItem
  })
  
  // Persist state to sessionStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, String(isOpen))
    }
  }, [isOpen, storageKey])
  
  // Auto-open if sub-item becomes active (but don't auto-close)
  useEffect(() => {
    if (hasSubItems && hasActiveSubItem && !isOpen) {
      setIsOpen(true)
    }
  }, [pathname, hasSubItems, hasActiveSubItem, isOpen])
  
  const handleToggle = () => {
    setIsOpen(!isOpen)
  }
  
  const isItemActive = isActive(pathname, item.url)

  if (hasSubItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          onClick={handleToggle}
          className={cn(
            (isItemActive || hasActiveSubItem)
              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
              : ""
          )}
        >
          {(() => {
            const IconComponent = item.icon
            return IconComponent ? <IconComponent /> : null
          })()}
          <span>{item.title}</span>
          {isOpen ? <IconChevronDown className="ml-auto" /> : <IconChevronRight className="ml-auto" />}
        </SidebarMenuButton>
        {isOpen && (
          <SidebarMenuSub>
            {item.items!.map((subItem) => {
              const SubIconComponent = subItem.icon
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isActive(pathname, subItem.url)}
                  >
                    <Link href={subItem.url}>
                      {SubIconComponent && <SubIconComponent />}
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    )
  }
  
  // If item has a URL but no sub-items, make it a regular link
  if (item.url) {
    const IconComponent = item.icon
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          className={cn(
            isItemActive
              ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
              : ""
          )}
        >
          <Link href={item.url}>
            {IconComponent && <IconComponent />}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }
  
  return null
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <NavItemComponent key={item.title} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

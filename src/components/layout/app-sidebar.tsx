"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavGroup } from "@/components/layout/nav-group"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import { sidebarData } from "./data/sidebar-data"
import { ScrollArea } from "../ui/scroll-area"
import { useAuth } from "@/hooks/use-auth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Filter sidebar groups based on user role
  const filteredNavGroups = sidebarData.navGroups

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="overflow-y-auto">
          {filteredNavGroups.map((props) => (
            <NavGroup key={props.title} {...props} />
          ))}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user || sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

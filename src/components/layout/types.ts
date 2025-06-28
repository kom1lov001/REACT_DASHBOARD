import type { LucideIcon } from "lucide-react"

export interface NavLink {
  title: string
  url: string
  icon?: LucideIcon
  badge?: string
}

export interface NavCollapsible extends NavLink {
  items: NavLink[]
}

export type NavItem = NavLink | NavCollapsible

export interface NavGroup {
  title: string
  items?: NavItem[]
  url?: string
  icon?: LucideIcon
  roles?: string
}

export interface User {
  name: string
  email: string
  avatar: string
  role: string
}

export interface Team {
  name: string
  logo: LucideIcon
  plan: string
}

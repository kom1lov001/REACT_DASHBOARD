"use client"

import { useState, useEffect, Fragment } from "react"
import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Header } from "./header"
import ModeToggle from "../mode-toggle"
import { UserNav } from "./user-nav"
import { NotificationsButton } from "./notification-button"
interface BreadcrumbItemType {
  label: string
  href?: string
}

export function BreadcrumbHeader() {
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([])

  useEffect(() => {
    if (pathname) {
      const pathSegments = pathname.split("/").filter(Boolean)
      const breadcrumbItems: BreadcrumbItemType[] = []

      // Add Home
      breadcrumbItems.push({ label: "Bosh sahifa", href: "/" })

      // Add path segments
      let currentPath = ""
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`

        const formattedSegment = segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        if (index === pathSegments.length - 1) {
          breadcrumbItems.push({ label: formattedSegment })
        } else {
          breadcrumbItems.push({
            label: formattedSegment,
            href: currentPath,
          })
        }
      })

      setBreadcrumbs(breadcrumbItems)
    }
  }, [pathname])

  return (
    <Header fixed className="border-b">
      <div className="flex-1">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <NotificationsButton />
        <UserNav />
      </div>
    </Header>
  )
}

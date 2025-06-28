"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Bell, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/api/axios-config"
import { toast } from "sonner"

// Types
interface TenantNote {
  id: string
  subject: string
  text: string
  created_at: string
}
interface TenantMail {
  id: number
  text: string
  created_at: string
}

export function NotificationsButton() {
  const [notifications, setNotifications] = useState<TenantNote[]>([])
  const [emails, setEmails] = useState<TenantMail[]>([])
  const [notificationCount, setNotificationCount] = useState(0)
  const [emailCount, setEmailCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch notifications and emails
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch bot notifications
        const notificationsResponse = await api.get("/tenant-note/")

        // Fetch tenant mail
        const emailsResponse = await api.get("/tenant-mail")

        // Transform bot notifications to our format
        const formattedNotifications = notificationsResponse.data.map((item: TenantNote) => ({
          id: item.id.toString(),
          text: item.text.substring(0, 50) + (item.text.length > 50 ? "..." : ""),
          subject: item.text,
          created_at: formatTimeAgo(item.created_at),
        }))

        // Transform emails to our format
        const formattedEmails = emailsResponse.data.map((item: TenantMail) => ({
          id: item.id.toString(),
          text: item.text,
          created_at: formatTimeAgo(item.created_at),
        }))

        setNotifications(formattedNotifications)
        setEmails(formattedEmails)
        setNotificationCount(formattedNotifications.filter((n: TenantNote) => !n.read).length)
        setEmailCount(formattedEmails.filter((e: TenantMail) => !e.is_read).length)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        // Use mock data if API fails
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()

    // Set up polling for new notifications
    const interval = setInterval(fetchData, 60000) // Poll every minute

    return () => clearInterval(interval)
  }, [])

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`
    }
  }

  // Mark notification as read
  const markNotificationAsRead = async (id: string) => {
    try {
      await api.get(`/tenant-note/${id}/`)
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      )
      setNotificationCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // Optimistic update even if API fails
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      )
      setNotificationCount((prev) => Math.max(0, prev - 1))
    }
  }

  // Mark email as read
  const markEmailAsRead = async (id: string) => {
    try {
      await api.get(`/tenant-mail/${id}`, { is_read: true })
      setEmails((prev) =>
        prev.map((email) => (email.id.toString() === id ? { ...email, read: true } : email))
      )
      setEmailCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking email as read:", error)
      // Optimistic update even if API fails
      setEmails((prev) =>
        prev.map((email) => (email.id.toString() === id ? { ...email, read: true } : email))
      )
      setEmailCount((prev) => Math.max(0, prev - 1))
    }
  }

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      // This would be a bulk update endpoint in a real API
      await Promise.all(
        notifications.filter((n) => !n.read).map((n) => api.get(`/tenant-note/${n.id}/`))
      )
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setNotificationCount(0)
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      // Optimistic update even if API fails
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setNotificationCount(0)
    }
  }

  // Mark all emails as read
  const markAllEmailsAsRead = async () => {
    try {
      // This would be a bulk update endpoint in a real API
      await Promise.all(
        emails.filter((e) => !e.read).map((e) => api.get(`/tenant-mail/${e.id}`, { is_read: true }))
      )
      setEmails((prev) => prev.map((e) => ({ ...e, read: true })))
      setEmailCount(0)
      toast.success("All emails marked as read")
    } catch (error) {
      console.error("Error marking all emails as read:", error)
      // Optimistic update even if API fails
      setEmails((prev) => prev.map((e) => ({ ...e, read: true })))
      setEmailCount(0)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] p-0">
          <DropdownMenuLabel className="flex items-center justify-between border-b p-4">
            <span className="text-base font-semibold">Bildirishnomalar</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                {notificationCount > 9 ? "9+" : notificationCount}
              </Button>
            </div>
          </DropdownMenuLabel>
          <ScrollArea className="g-2 grid h-[300px] px-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <p className="text-sm text-gray-500">Bildirishnomalar yuklanmoqda...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex cursor-pointer flex-col items-start border-b p-4 last:border-0",
                    !notification.read && "bg-blue-50 dark:bg-blue-900/20"
                  )}
                  onClick={() => {
                    markNotificationAsRead(notification.id)
                  }}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{notification.subject}</p>
                        <p className="line-clamp-2 text-xs text-gray-500">{notification.text}</p>
                        <p className="text-xs text-gray-400">{notification.created_at}</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <Bell className="mb-2 h-12 w-12 text-gray-300" />
                <p className="text-muted-foreground py-6 text-center text-sm">
                  Hech qanday bildirishnoma mavjud emas
                </p>
                <p className="text-xs text-gray-400">Hammasi tayyor!</p>
              </div>
            )}
          </ScrollArea>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              onClick={markAllNotificationsAsRead}
              disabled={notificationCount === 0}
              variant="outline"
              className="h-8 w-full justify-center rounded-full text-xs"
            >
              <Check className="mr-1 h-3 w-3" />
              Barchasini o&apos;qilgan deb belgilash
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
            <Mail className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            {emailCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-medium text-white">
                {emailCount > 9 ? "9+" : emailCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] p-0">
          <DropdownMenuLabel className="flex items-center justify-between border-b p-4">
            <span className="text-base font-semibold">Elektron pochta xabarnomalari</span>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              {emailCount > 9 ? "9+" : emailCount}
            </Button>
          </DropdownMenuLabel>
          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                <p className="text-sm text-gray-500">Elektron pochta xabarlari yuklanmoqda...</p>
              </div>
            ) : emails.length > 0 ? (
              emails.map((email) => (
                <DropdownMenuItem
                  key={email.id}
                  className={cn(
                    "flex cursor-pointer flex-col items-start border-b p-4 last:border-0",
                    !email.read && "bg-blue-50 dark:bg-blue-900/20"
                  )}
                  onClick={() => {
                    markEmailAsRead(email.id.toString())
                  }}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{email.text}</p>
                        <p className="text-xs text-gray-400">{email.created_at}</p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
                <Mail className="mb-2 h-12 w-12 text-gray-300" />
                <p className="mb-1 text-gray-500">Elektron pochta xabarnomalari yo&apos;q</p>
                <p className="text-xs text-gray-400">Sizning pochta qutingiz bo&apos;sh!</p>
              </div>
            )}
          </ScrollArea>
          <DropdownMenuSeparator />
          <div className="p-2">
            <Button
              disabled={emailCount === 0}
              onClick={markAllEmailsAsRead}
              variant="outline"
              className="w-full justify-center rounded-full"
            >
              <Check className="mr-1 h-3 w-3" />
              Barchasini o&apos;qilgan deb belgilash
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Bell, Check } from "lucide-react"
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
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api/axios-config"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
}

export function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds} soniya oldin`
    else if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} daqiqa oldin`
    else if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} soat oldin`
    else return `${Math.floor(diffInSeconds / 86400)} kun oldin`
  }

  // ✅ useCallback bilan o‘ralgan
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await api.get("/tenant-note/")
      const data = res.data.map((item: Notification) => ({
        id: item.id.toString(),
        title: item.text.substring(0, 50) + (item.text.length > 50 ? "..." : ""),
        message: item.text,
        time: formatTimeAgo(item.created_at),
        read: item.is_read || false,
      }))
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    } catch (err) {
      console.error("Bildirishnomalarni olishda xatolik:", err)
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/bot-notifications/${id}/read`)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (err) {
      console.error("O'qilgan deb belgilashda xatolik:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read)
      await Promise.all(unread.map((n) => api.patch(`/bot-notifications/${n.id}/read`)))
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success("Barcha bildirishnomalar o'qildi deb belgilandi")
    } catch (err) {
      console.error("Barchasini o'qildi deb belgilashda xatolik:", err)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px] p-0">
        <DropdownMenuLabel className="flex items-center justify-between border-b p-4">
          <span className="text-base font-semibold">Bildirishnomalar</span>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="h-8 text-xs"
            disabled={unreadCount === 0}
          >
            <Check className="mr-1 h-3 w-3" />
            Hammasini o‘qildi deb belgilash
          </Button>
        </DropdownMenuLabel>

        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-6 text-sm">
              <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              Yuklanmoqda...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center text-sm">
              Hech qanday bildirishnoma yo‘q
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={cn(
                  "flex cursor-pointer flex-col items-start space-y-0.5 border-b px-4 py-3 transition-colors",
                  !n.read && "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <Link href={`/notifications/${n.id}`} className="w-full space-y-1">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-gray-500">{n.message}</p>
                  <p className="text-xs text-gray-400">{n.time}</p>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Link href="/notifications" className="block w-full">
            <Button variant="outline" className="w-full justify-center rounded-full">
              Barchasini ko‘rish
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

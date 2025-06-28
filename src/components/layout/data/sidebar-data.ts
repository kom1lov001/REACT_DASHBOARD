import {
  LayoutDashboard,
  Users,
  UserCog,
  CalendarCheck,
  Clock,
  ShieldCheck,
  FlaskConical,
  Building2,
  BadgeDollarSign,
  Gift,
  Bot,
  BellRing,
  // Settings,
  // SlidersHorizontal,
  // KeyRound,
  // Bell,
  // MessageSquare
} from "lucide-react"

import { NavGroup, Team, User } from "../types"

export const sidebarData = {
  user: {
    name: "TimeTrack Admin",
    email: "admin@timetrack.uz",
    avatar: "/avatar.svg",
    role: "superadmin",
  } as User,

  teams: [
    {
      name: "Time Truck",
      logo: Building2,
      plan: "Superadmin panel",
    },
    {
      name: "Ishchi guruh",
      logo: Users,
      plan: "Operatorlar uchun",
    },
  ] as Team[],

  navGroups: [
    {
      title: "Asosiy",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Xodimlar",
      items: [
        {
          title: "Xodimlar",
          url: "/staff",
          icon: UserCog,
          items: [
            { title: "Ro'yxat", url: "/staff/list", icon: Users },
            { title: "Davomat", url: "/staff/attendance", icon: CalendarCheck },
            { title: "Ish vaqtini sozlash", url: "/staff/work-schedule", icon: Clock },
          ],
        },
        {
          title: "Rollar",
          url: "/roles",
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: "Qurilmalar",
      items: [
        {
          title: "Qurilmalar",
          url: "/devices",
          icon: FlaskConical,
        },
      ],
    },
    {
      title: "Filiallar",
      items: [
        {
          title: "Filiallar",
          url: "/branches",
          icon: Building2,
        },
      ],
    },
    {
      title: "Jarimalar",
      items: [
        {
          title: "Jarimalar",
          url: "/fines",
          icon: BadgeDollarSign,
        },
      ],
    },
    {
      title: "Bonuslar",
      items: [
        {
          title: "Bonuslar",
          url: "/bonuses",
          icon: Gift,
        },
      ],
    },
    {
      title: "Kommunikatsiya",
      items: [
        {
          title: "Telegram bot",
          url: "/telegram-bot",
          icon: Bot,
        },
        {
          title: "Bot bildirishnomalari",
          url: "/bot-notifications",
          icon: BellRing,
          badge: "5",
        },
      ],
    },
    // {
    //   title: "Tizim",
    //   items: [
    //     {
    //       title: "Settings",
    //       url: "/settings",
    //       icon: Settings,
    //       items: [
    //         { title: "Umumiy", url: "/settings/general", icon: SlidersHorizontal },
    //         { title: "Ruxsatlar", url: "/settings/permissions", icon: KeyRound },
    //         { title: "Bildirishnomalar", url: "/settings/notifications", icon: Bell },
    //       ]
    //     },
    //   ]
    // }
  ] as NavGroup[],
}

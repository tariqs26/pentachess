"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookText, Gamepad2, Trophy } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/Button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/Sidebar"
import { UserDropdown } from "./UserDropdown"

// Navigation items
const navItems = [
  {
    title: "Play Online",
    href: "/game",
    icon: Trophy,
  },
  {
    title: "Play Local",
    href: "/game/local",
    icon: Gamepad2,
  },
  {
    title: "Rules",
    href: "/rules-and-regulations",
    icon: BookText,
  },
]

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  return (
    <Sidebar className="fixed" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            PentaChess.
          </Link>
          <ThemeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-background/50",
                      pathname === item.href && "bg-background/50 font-medium"
                    )}
                  >
                    <item.icon size={20} />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <div className="mt-auto">
        {isPending ? null : session ? (
          <UserDropdown user={session.user} />
        ) : (
          <Button className="w-full" asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </Sidebar>
  )
}

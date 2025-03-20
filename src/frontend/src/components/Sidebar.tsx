"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookText, Gamepad2, Trophy, ChevronLeft, Menu } from "lucide-react"
import { useState, useEffect } from "react"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/Button"
import { UserDropdown } from "./UserDropdown"

const items = [
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
] as const

interface SidebarProps {
  onExpandedChange?: (expanded: boolean) => void;
}

export const Sidebar = ({ onExpandedChange }: SidebarProps) => {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    onExpandedChange?.(isExpanded);
  }, [isExpanded, onExpandedChange]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <button
        onClick={toggleSidebar}
        className={cn(
          "fixed z-20 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-all",
          isExpanded ? "left-[160px] top-4" : "left-4 top-4"
        )}
        aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isExpanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={cn(
          "fixed z-10 flex h-screen flex-col overflow-y-auto border-r bg-accent p-4 pt-2 transition-all duration-300 ease-in-out",
          isExpanded ? "w-[180px] translate-x-0" : "w-[180px] -translate-x-[180px]"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold">
            PentaChess.
          </Link>
          <ThemeToggle />
        </div>
        <nav className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-background/50",
                pathname === item.href && "bg-background/50 font-medium"
              )}
            >
              <item.icon size={20} />
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          {isPending ? null : session ? (
            <UserDropdown user={session.user} />
          ) : (
            <Button className="w-full" asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </aside>
    </>
  )
}

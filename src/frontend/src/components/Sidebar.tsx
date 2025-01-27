"use client"

import { BookText, Gamepad2, Trophy } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { Button } from "./ui/Button"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

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

export const Sidebar = () => {
  const pathname = usePathname()

  return (
    <aside className="fixed z-10 flex h-screen w-[180px] flex-col overflow-y-auto border-r bg-accent p-4 pt-2">
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
      <Button asChild className="mt-auto w-full">
        <Link href="/login">Login</Link>
      </Button>
    </aside>
  )
}

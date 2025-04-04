"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

export const UserDropdown = ({
  user,
}: Readonly<{
  user: { username: string; email: string; image?: string | null }
}>) => {
  const router = useRouter()

  const avatar = (
    <Avatar className="size-8 rounded-lg">
      <AvatarImage src={user.image ?? undefined} alt={user.username} />
      <AvatarFallback className="rounded-lg border">
        {user.username[0].toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group inline-flex w-full items-center gap-2 rounded-md bg-background p-2 transition-colors hover:bg-background/80"
        >
          {avatar}
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.username}</span>
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <ChevronsUpDown
            className="ml-auto stroke-muted-foreground transition-colors group-hover:stroke-primary group-data-[state='open']:stroke-primary"
            size={16}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="end"
        sideOffset={4}
        side="right"
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            {avatar}
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.username}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href="/account">
            <BadgeCheck />
            Account
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={async () => {
            const { error } = await authClient.signOut()

            if (error) {
              toast.error(error.message)
              return
            }

            toast.success("Logged out successfully")
            router.refresh()
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

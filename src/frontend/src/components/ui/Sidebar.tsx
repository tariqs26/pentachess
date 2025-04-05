"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronLeft, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

type SidebarContextProps = {
  open: boolean
  setOpen: (expanded: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

export const SidebarProvider = ({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) => {
  const [open, setOpen] = React.useState(defaultExpanded)

  const toggleSidebar = React.useCallback(
    () => setOpen((open) => !open),
    [setOpen]
  )

  return (
    <SidebarContext.Provider value={{ open, setOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

export type SidebarProps = React.HTMLAttributes<HTMLElement>

export const Sidebar = ({ className, ...props }: SidebarProps) => {
  const { open, toggleSidebar } = useSidebar()

  return (
    <>
      <button
        type="button"
        onClick={toggleSidebar}
        className={cn(
          "fixed left-4 top-4 z-20 flex size-9 items-center justify-center rounded bg-accent text-secondary-foreground transition-all duration-300 hover:bg-accent/80",
          open && "left-[176px]"
        )}
        aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={cn(
          "relative z-10 flex h-screen w-[180px] -translate-x-[180px] flex-col overflow-y-auto border-r bg-accent p-4 pt-2 transition-transform duration-300 ease-in-out",
          open && "translate-x-0",
          className
        )}
        {...props}
      />
    </>
  )
}

export const SidebarHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-2 mt-2", className)} {...props} />
)

export const SidebarContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-1 flex-col", className)} {...props} />
)

export const SidebarGroup = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />

export const SidebarMenu = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn("space-y-1", className)} {...props} />
)

export const SidebarMenuItem = ({
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />

export type SidebarMenuButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
    size?: "default" | "lg"
  }

export const SidebarMenuButton = ({
  className,
  asChild = false,
  size = "default",
  ...props
}: SidebarMenuButtonProps) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-background/50",
        size === "lg" && "py-3",
        className
      )}
      {...props}
    />
  )
}

export const SidebarInset = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar()

  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        open && "ml-[180px]",
        className
      )}
      {...props}
    />
  )
}

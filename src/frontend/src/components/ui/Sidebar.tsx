"use client"

import * as React from "react"
import { createContext, useContext } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft, Menu } from "lucide-react"

import { cn } from "@/lib/utils"

type SidebarContextProps = {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const SidebarContext = createContext<SidebarContextProps | null>(null)

export const SidebarProvider = ({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => {
  const context = useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }

  return context
}

const sidebarVariants = cva(
  "relative w-[180px] z-10 flex h-screen flex-col overflow-y-auto border-r bg-accent p-4 pt-2 transition-transform duration-300 ease-in-out",
  {
    variants: {
      expanded: {
        true: "translate-x-0",
        false: "-translate-x-[180px]",
      },
    },
    defaultVariants: { expanded: true },
  }
)

export type SidebarProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof sidebarVariants>

export function Sidebar({ className, ...props }: SidebarProps) {
  const { expanded, setExpanded } = useSidebar()

  return (
    <>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "fixed left-4 top-4 z-20 flex size-10 items-center justify-center rounded bg-accent text-secondary-foreground transition-all duration-300 hover:bg-accent/80",
          expanded && "left-[176px]"
        )}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      >
        {expanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
      </button>
      <aside
        className={cn(sidebarVariants({ expanded, className }))}
        {...props}
      />
    </>
  )
}

export const SidebarHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-2 mt-3", className)} {...props} />
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

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild = false, size = "default", ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-background/50",
        size === "lg" && "py-3",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export const SidebarMenuSub = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) => (
  <ul className={cn("mt-1 space-y-1", className)} {...props} />
)

export const SidebarMenuSubItem = ({
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />

export type SidebarMenuSubButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean
    isActive?: boolean
  }

export const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuSubButtonProps
>(({ className, asChild = false, isActive = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-background/50",
        isActive && "bg-background/50 font-medium",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export const SidebarRail = ({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />

export const SidebarTrigger = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { expanded, setExpanded } = useSidebar()

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-accent",
        className
      )}
      aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
      {...props}
    >
      <Menu size={18} />
    </button>
  )
}

export const SidebarInset = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { expanded } = useSidebar()

  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        expanded && "ml-[180px]",
        className
      )}
      {...props}
    />
  )
}

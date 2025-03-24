"use client"

import * as React from "react"
import { createContext, useContext } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronLeft, Menu } from "lucide-react"

import { cn } from "@/lib/utils"

// Sidebar context
interface SidebarContextProps {
  expanded: boolean
  setExpanded: (expanded: boolean) => void
}

const SidebarContext = createContext<SidebarContextProps>({
  expanded: true,
  setExpanded: () => undefined,
})

export function SidebarProvider({
  children,
  defaultExpanded = true,
}: {
  children: React.ReactNode
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)

  return (
    <SidebarContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)

// Sidebar components
const sidebarVariants = cva(
  "relative z-10 flex h-screen flex-col overflow-y-auto border-r bg-accent p-4 pt-2 transition-all duration-300 ease-in-out",
  {
    variants: {
      expanded: {
        true: "w-[180px] translate-x-0",
        false: "w-[180px] -translate-x-[180px]",
      },
    },
    defaultVariants: {
      expanded: true,
    },
  }
)

export interface SidebarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sidebarVariants> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { expanded, setExpanded } = useSidebar()

  return (
    <>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "fixed z-20 flex h-10 w-10 items-center justify-center rounded bg-accent text-secondary-foreground transition-all",
          expanded ? "left-[175px] top-4" : "left-4 top-4"
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

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-2 mt-3", className)} {...props} />
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-1 flex-col", className)} {...props} />
}

export function SidebarGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-1", className)} {...props} />
}

export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />
}

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

export function SidebarMenuSub({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("mt-1 space-y-1", className)} {...props} />
}

export function SidebarMenuSubItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />
}

export interface SidebarMenuSubButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

export function SidebarRail({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
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

export function SidebarInset({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { expanded } = useSidebar()

  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        expanded ? "ml-[180px]" : "ml-0",
        className
      )}
      {...props}
    />
  )
}

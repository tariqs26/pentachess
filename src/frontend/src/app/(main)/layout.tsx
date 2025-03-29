"use client"

import { AppSidebar } from "@/components/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/Sidebar"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex-grow">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

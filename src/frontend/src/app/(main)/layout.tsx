"use client"

import { AppSidebar } from "@/components/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <SidebarInset>
          <main className="flex-grow">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

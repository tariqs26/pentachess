"use client"

import { Sidebar, SidebarContext } from "@/components/Sidebar"
import { useState } from "react"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  return (
    <SidebarContext.Provider
      value={{ expanded: sidebarExpanded, setExpanded: setSidebarExpanded }}
    >
      <article className="relative flex">
        <Sidebar />
        <main
          className={`flex-grow transition-all duration-300 ${sidebarExpanded ? "ml-[180px]" : "ml-0"}`}
        >
          {children}
        </main>
      </article>
    </SidebarContext.Provider>
  )
}

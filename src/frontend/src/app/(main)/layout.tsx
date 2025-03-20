"use client"

import { Sidebar } from "@/components/Sidebar"
import { useState } from "react"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <article className="flex relative">
      <Sidebar onExpandedChange={setSidebarExpanded} />
      <main className={`transition-all duration-300 flex-grow ${sidebarExpanded ? "ml-[180px]" : "ml-0"}`}>
        {children}
      </main>
    </article>
  )
}

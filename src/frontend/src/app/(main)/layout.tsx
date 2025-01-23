import { Sidebar } from "@/components/Sidebar"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <article className="flex">
      <Sidebar />
      <main className="ml-[180px] flex-grow">{children}</main>
    </article>
  )
}

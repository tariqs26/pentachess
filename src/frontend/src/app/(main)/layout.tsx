// TODO: Implement MainLayout
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex">
      <aside></aside>
      <section className="">{children}</section>
    </main>
  )
}

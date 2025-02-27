export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="grid min-h-screen place-items-center bg-muted p-6 dark:bg-background">
      {children}
    </main>
  )
}

import { LocalGameProvider } from "@/features/game/components/LocalGameProvider"

export default function LocalGameLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <LocalGameProvider>{children}</LocalGameProvider>
}

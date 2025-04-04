import type { Metadata } from "next"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { GameProvider } from "@/features/game/components/GameProvider"
import { OnlineGame } from "@/features/game/components/OnlineGame"

export const metadata: Metadata = {
  title: "Online Game",
}

export default async function OnlineGamePage() {
  const session = await auth.api.getSession({ headers: headers() })

  if (!session) {
    return <div>Not authenticated</div>
  }

  return (
    <GameProvider>
      <OnlineGame {...session.user} />
    </GameProvider>
  )
}

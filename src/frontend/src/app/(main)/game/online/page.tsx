import { headers } from "next/headers"
import { LocalGameProvider } from "@/features/game/components/LocalGameProvider"
import { auth } from "@/lib/auth"
import { Game } from "./Game"

export default async function OnlineGamePage() {
  const session = await auth.api.getSession({ headers: headers() })

  if (!session) {
    return <div>Not authenticated</div>
  }

  return (
    <LocalGameProvider>
      <Game {...session.user} />
    </LocalGameProvider>
  )
}

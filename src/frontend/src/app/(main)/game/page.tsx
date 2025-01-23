import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { JoinGameForm } from "@/features/game/components/JoinGameForm"

export default function GamePage() {
  return (
    <div className="mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Create Game</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateGameForm isOnline />
        </CardContent>
        <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
          <hr className="flex-grow" /> OR <hr className="flex-grow" />
        </div>
        <CardHeader className="py-3">
          <CardTitle className="text-xl">Join Game</CardTitle>
        </CardHeader>
        <CardContent>
          <JoinGameForm />
        </CardContent>
      </Card>
    </div>
  )
}

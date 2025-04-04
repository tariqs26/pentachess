import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
// import { CreateGameForm } from "@/features/game/components/CreateGameForm"
import { JoinGameForm } from "@/features/game/components/JoinGameForm"

export const metadata: Metadata = {
  title: "Play Online",
  description: "Find, join, or host an online game.",
}

export default function GamePage() {
  return (
    <div className="mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
      <Card className="max-w-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Play Online</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 pb-3 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Random Match</p>
            <Button variant="default" className="w-full" asChild>
              <Link href="/game/online">Find Opponent</Link>
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">Join Game</p>
            <JoinGameForm />
            <p className="text-sm text-muted-foreground">Under development.</p>
          </div>
        </CardContent>
        <div className="flex items-center gap-4 px-6 pt-2 text-sm font-medium text-muted-foreground">
          <hr className="flex-grow" /> OR <hr className="flex-grow" />
        </div>
        <CardHeader className="py-3">
          <CardTitle className="text-xl">Create Game</CardTitle>
          <CardDescription>
            This feature is under development, and is currently unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent>{/* <CreateGameForm isOnline /> */}</CardContent>
      </Card>
    </div>
  )
}

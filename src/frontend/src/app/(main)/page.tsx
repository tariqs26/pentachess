import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default function HomePage() {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/game">Create/Join Game</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/game/local">Local Game</Link>
        </Button>
      </div>
    </div>
  )
}

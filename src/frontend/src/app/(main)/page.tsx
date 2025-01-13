import Link from "next/link"
import { Button } from "@/components/ui/Button"

// TODO: Implement HomePage
export default function HomePage() {
  return (
    <>
      <Button asChild>
        <Link href="/game">Create/Join Game</Link>
      </Button>

      <Button asChild variant="secondary">
        <Link href="/game/local">Local Game</Link>
      </Button>
    </>
  )
}

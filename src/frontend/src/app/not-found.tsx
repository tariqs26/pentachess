import type { Metadata } from "next"
import Link from "next/link"
import { Home } from "lucide-react"
import { Button } from "@/components/ui/Button"

export const metadata = {
  title: "Page not found",
  description: "Sorry, we couldn't find the page you're looking for.",
} satisfies Metadata

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="mb-3 font-medium text-link">404</p>
        <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
          {metadata.title}
        </h1>
        <p className="mb-8 font-medium text-muted-foreground">
          {metadata.description}
        </p>
        <Button asChild>
          <Link href="/">
            <Home /> Back to home page
          </Link>
        </Button>
      </div>
    </main>
  )
}

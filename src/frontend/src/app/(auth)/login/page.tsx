import type { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your PentaChess account",
}

export default function LoginPage({
  searchParams,
}: Readonly<{ searchParams: { from?: string } }>) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Welcome back!</CardTitle>
        <CardDescription className="text-center">
          {metadata.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm from={searchParams.from} />
      </CardContent>
    </Card>
  )
}

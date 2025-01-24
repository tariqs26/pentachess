import type { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"

export const metadata = {
  title: "Forgot Password",
  description: "Forgot your password? Request a password reset",
} satisfies Metadata

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="block text-center text-xl">
          {metadata.title}
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email to request a password reset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}

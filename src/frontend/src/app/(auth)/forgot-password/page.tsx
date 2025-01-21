import type { Metadata } from "next"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { ForgotPasswordForm } from "@/features/auth/components/ForgotPasswordForm"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot your password? Reset it here",
}

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="block text-center text-xl">
          Forgot Password
        </CardTitle>
        <CardDescription className="text-center">
          Reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  )
}

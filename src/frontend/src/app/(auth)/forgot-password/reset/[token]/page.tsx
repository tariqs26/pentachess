import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card"
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm"

export const metadata = {
  title: "Reset Password",
} satisfies Metadata

export default async function ResetPasswordPage(
  props: Readonly<{
    params: Promise<{ token: string }>
  }>
) {
  const params = await props.params
  // TODO: implement token verification
  if (params.token !== "valid-token") {
    notFound()
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="block text-center text-xl">
          {metadata.title}
        </CardTitle>
        <CardDescription className="text-center">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
    </Card>
  )
}

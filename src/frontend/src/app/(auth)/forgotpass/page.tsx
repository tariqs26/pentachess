"use client"

import { ForgotPassForm } from "@/app/(auth)/forgotpass/ForgotPassForm"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import Link from "next/link"

const formSchema = z.object({
  emailAddress: z.string().email(),
})

// TODO: Implement ForgotPassPage
export default function ForgotPassPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailAddress: "",
    },
  })
  const handleSubmit = () => {
    console.log("submitted")
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ForgotPassForm />
      <Card className="w-full max-w-md space-y-1 p-4">
        <Label className="block text-center text-2xl">
          Forgot Password? Reset Here:
        </Label>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full max-w-md space-y-4 p-6"
          >
            <Label className="w-full max-w-md space-y-4 text-green-400">
              Email
            </Label>
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="mb-4 w-full max-w-md space-y-4"
                        placeholder="someone@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <Button type="submit" className="w-full max-w-md">
              Reset Password
            </Button>
            <Label className="mt-8 block w-full max-w-md text-xs text-gray-400">
              You'll receive an email to reset your password
            </Label>
            <Link
              href="/login"
              className="mt-8 block w-full max-w-md text-xs text-blue-400 hover:underline"
            >
              Remeber your Password? Click here to Login
            </Link>
          </form>
        </Form>
      </Card>
    </div>
  )
}

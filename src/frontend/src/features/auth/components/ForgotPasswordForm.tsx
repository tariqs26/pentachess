"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254, "Invalid email"),
})

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const { isSubmitting } = form.formState

  const handleSubmit = (values: ForgotPasswordValues) => {
    console.log("forgot password submitted:", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="email"
                    placeholder="someone@example.com"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          Send Reset Email
        </Button>
        <p className="text-center text-sm">
          Remembered your password?{" "}
          <Link href="/login" className="text-link hover:underline">
            Login
          </Link>
        </p>
      </form>
    </Form>
  )
}

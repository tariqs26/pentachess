"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { forgotPasswordSchema, type ForgotPasswordValues } from "../schemas"
import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"

export const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const { isSubmitting } = form.formState

  const handleSubmit = (values: ForgotPasswordValues) => {
    // TODO: implement forgot password functionality
    console.info("forgot password submitted:", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  placeholder="someone@example.com"
                  disabled={isSubmitting || true}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                This feature is under development, and is currently unavailable.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting || true}
          className="w-full"
        >
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

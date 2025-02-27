"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { loginSchema, type LoginValues } from "../schemas"
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

export const LoginForm = ({ from }: Readonly<{ from?: string }>) => {
  const router = useRouter()
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const { isSubmitting } = form.formState

  const handleSubmit = async (values: LoginValues) => {
    await authClient.signIn.email(values, {
      onSuccess: () => {
        router.push(from ?? "/")
        router.refresh()
        toast.success("Logged in successfully")
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      },
    })
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
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between gap-2 pb-1">
                Password
                <Link
                  href="/forgot-password"
                  className="font-normal text-link hover:underline"
                >
                  Forgot your password?
                </Link>
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          Login
        </Button>
        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-link hover:underline">
            Register
          </Link>
        </p>
      </form>
    </Form>
  )
}

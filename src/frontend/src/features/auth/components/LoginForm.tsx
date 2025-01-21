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

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254, "Invalid email"),
  password: z.string().min(6, "Must be at least 6 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const handleSubmit = (values: LoginValues) => {
    console.log("login submitted:", values)
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="flex justify-between gap-2 pb-1">
                  Password
                  <Link
                    href="/forgot-password"
                    className="font-normal text-foreground text-indigo-600 hover:underline dark:text-indigo-300"
                  >
                    Forgot your password?
                  </Link>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:underline dark:text-indigo-300"
          >
            Register
          </Link>
        </p>
      </form>
    </Form>
  )
}

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

const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254, "Invalid email"),
  username: z
    .string()
    .trim()
    .regex(
      /^[a-z][a-z0-9_-]+$/i,
      "Must start with a letter and only contain letters, numbers, underscores (_) and hyphens (-)"
    )
    .min(4, "Must be at least 4 characters")
    .max(20, "Must be at most 20 characters"),
  password: z
    .string()
    .min(6, "Must be at least 6 characters")
    .max(72, "Must be at most 72 characters"),
})

type RegisterValues = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  })

  const { isSubmitting } = form.formState

  const handleSubmit = (values: RegisterValues) => {
    console.log("register submitted:", values)
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
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="username"
                    placeholder="someone"
                    disabled={isSubmitting}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••••••"
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
          Login
        </Button>
        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-link hover:underline">
            Login
          </Link>
        </p>
      </form>
    </Form>
  )
}

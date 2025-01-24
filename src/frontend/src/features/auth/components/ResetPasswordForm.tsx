"use client"

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

const passwordSchema = z.object({
  newPassword: z.string().min(6, "Must be at least 6 characters"),
})

type PasswordValues = z.infer<typeof passwordSchema>

export const ResetPasswordForm = () => {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "" },
  })

  const { isSubmitting } = form.formState

  const onSubmit = (data: PasswordValues) => {
    console.log("password submitted:", data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>New Password</FormLabel>
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
          Reset Password
        </Button>
      </form>
    </Form>
  )
}

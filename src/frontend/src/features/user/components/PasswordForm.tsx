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

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Must be at least 6 characters"),
    newPassword: z.string().min(6, "Must be at least 6 characters"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })

type PasswordValues = z.infer<typeof passwordSchema>

export const PasswordForm = () => {
  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  })

  const { isSubmitting, isDirty } = form.formState

  const onSubmit = (data: PasswordValues) => {
    console.log("password submitted:", data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 px-6 pb-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
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
              )
            }}
          />
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
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t bg-card px-6 py-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting || !isDirty}
            onClick={() => form.reset()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            Save
          </Button>
        </div>
      </form>
    </Form>
  )
}

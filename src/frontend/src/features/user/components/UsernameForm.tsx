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

const usernameSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(
      /^[a-z][a-z0-9_-]+$/i,
      "Must start with a letter and only contain letters, numbers, underscores (_) and hyphens (-)"
    )
    .min(4, "Must be at least 4 characters")
    .max(20, "Must be at most 20 characters"),
})

type UsernameValues = z.infer<typeof usernameSchema>

export const UsernameForm = () => {
  const form = useForm<UsernameValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username: "" },
  })

  const { isSubmitting, isDirty } = form.formState

  const onSubmit = async (values: UsernameValues) => {
    console.log("username submitted:", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="px-6 pb-6">
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
        </div>
        <div className="flex flex-wrap justify-end gap-2 border-t bg-card px-6 py-3">
          <Button
            variant="outline"
            disabled={isSubmitting || !isDirty}
            type="button"
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

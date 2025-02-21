"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { usernameSchema, type UsernameValues } from "../schemas"
import { authClient } from "@/lib/auth-client"
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

export const UsernameForm = ({ username }: Readonly<{ username: string }>) => {
  const form = useForm<UsernameValues>({
    resolver: zodResolver(usernameSchema),
    defaultValues: { username },
  })

  const { isSubmitting, isDirty } = form.formState

  const onSubmit = async (values: UsernameValues) => {
    const { error } = await authClient.updateUser(values)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Username updated successfully")
    form.reset(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="px-6 pb-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
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
            )}
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

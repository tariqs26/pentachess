"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { emailSchema, type EmailValues } from "../schemas"
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

export const EmailForm = ({ email }: Readonly<{ email: string }>) => {
  const form = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: email },
  })

  const { isSubmitting, isDirty } = form.formState

  const onSubmit = async (values: EmailValues) => {
    const { error } = await authClient.changeEmail(values)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Email updated successfully")
    form.reset(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="px-6 pb-6">
          <FormField
            control={form.control}
            name="newEmail"
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

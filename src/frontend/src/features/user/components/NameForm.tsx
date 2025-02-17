"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { nameSchema, type NameValues } from "../schemas"
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

export const NameForm = ({ name }: Readonly<{ name: string }>) => {
  const form = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name },
  })

  const { isSubmitting, isDirty } = form.formState

  const onSubmit = async (values: NameValues) => {
    const { error } = await authClient.updateUser(values)

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Name updated successfully")
    form.reset(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="px-6 pb-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
                    placeholder="First Last"
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

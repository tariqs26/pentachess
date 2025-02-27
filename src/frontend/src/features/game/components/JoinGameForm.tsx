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

const joinGameSchema = z.object({
  code: z.string().min(1, "Required"),
  password: z.string().optional(),
})

type JoinGameValues = z.infer<typeof joinGameSchema>

export const JoinGameForm = () => {
  const form = useForm<JoinGameValues>({
    resolver: zodResolver(joinGameSchema),
  })

  const { isSubmitting } = form.formState

  const onSubmit = (values: JoinGameValues) => {
    console.log("join game submitted:", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="PC2024"
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Join
        </Button>
      </form>
    </Form>
  )
}

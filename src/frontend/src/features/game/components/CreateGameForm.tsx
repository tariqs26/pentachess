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

type CreateGameProps = Readonly<
  | {
      isOnline: false
      startHandler: (duration: number | undefined) => void
    }
  | {
      isOnline: true
      startHandler?: never
    }
>

const createGameSchema = z.object({
  startingColor: z.enum(["random", "white", "black"]),
  durationMinutes: z.coerce.number().optional(),
  durationSeconds: z.coerce.number().optional(),
  password: z.string().min(4).max(64).optional(),
})

type CreateGameData = z.infer<typeof createGameSchema>

export const CreateGameForm = ({ isOnline, startHandler }: CreateGameProps) => {
  const form = useForm<CreateGameData>({
    resolver: zodResolver(createGameSchema),
    defaultValues: {
      startingColor: isOnline ? "random" : "white",
      ...(isOnline && { durationMinutes: 5, durationSeconds: 0 }),
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = (values: CreateGameData) => {
    console.log("create game submitted:", values)
    const duration =
      values.durationMinutes !== undefined ||
      values.durationSeconds !== undefined
        ? (values.durationMinutes ?? 0) * 60 + (values.durationSeconds ?? 0)
        : undefined

    if (!isOnline) {
      startHandler(duration)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {isOnline && (
          <FormField
            control={form.control}
            name="startingColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Starting Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    {(["random", "white", "black"] as const).map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant={
                          field.value === color ? "default" : "secondary"
                        }
                        className="w-full"
                        disabled={isSubmitting}
                        onClick={() => {
                          form.setValue("startingColor", color)
                        }}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <fieldset>
          <p className="mb-3 text-sm font-medium text-primary">
            Timer Duration (Optional)
          </p>
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        step={5}
                        className="z-[2] rounded-r-none"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormLabel className="flex h-9 items-center rounded-r-md border border-l-0 bg-muted px-3 py-1 text-foreground">
                      Minutes
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationSeconds"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={5}
                        max={59}
                        className="z-[2] rounded-r-none"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormLabel className="flex h-9 items-center rounded-r-md border border-l-0 bg-muted px-3 py-1 text-foreground">
                      Seconds
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>
        {isOnline && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Start
        </Button>
      </form>
    </Form>
  )
}

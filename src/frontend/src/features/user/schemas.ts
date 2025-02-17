import { z } from "zod"
import { email, password, username } from "../auth/schemas"

export const emailSchema = z.object({ newEmail: email })

export type EmailValues = z.infer<typeof emailSchema>

export const usernameSchema = z.object({ username })

export type UsernameValues = z.infer<typeof usernameSchema>

export const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
})

export type NameValues = z.infer<typeof nameSchema>

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Required"),
    newPassword: password,
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  })

export type PasswordValues = z.infer<typeof passwordSchema>

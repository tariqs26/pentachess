import { z } from "zod"

export const email = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(254, "Invalid email")

export const username = z
  .string()
  .trim()
  .regex(
    /^[a-z][a-z0-9_-]+$/i,
    "Must start with a letter and only contain letters, numbers, underscores (_) or hyphens (-)"
  )
  .min(4, "Must be at least 4 characters")
  .max(20, "Must be at most 20 characters")

export const password = z
  .string()
  .min(6, "Must be at least 6 characters")
  .max(128, "Must be at most 128 characters")

export const registerSchema = z.object({ email, username, password })

export type RegisterValues = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Required"),
})

export type LoginValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({ email })

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>

export const passwordSchema = z.object({ newPassword: password })

export type PasswordValues = z.infer<typeof passwordSchema>

import { describe, expect, it, vi, beforeEach } from "vitest"
import {
  email,
  username,
  password,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  passwordSchema,
} from "@/features/auth/schemas"

// Mock the auth client and database
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
    signUp: {
      email: vi.fn(),
    },
  },
}))

vi.mock("@/lib/db", () => ({
  db: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

describe("Auth Schemas", () => {
  describe("email validation", () => {
    it("should accept valid email addresses", () => {
      expect(email.safeParse("test@example.com").success).toBe(true)
      expect(email.safeParse("user.name@domain.co.uk").success).toBe(true)
    })

    it("should reject invalid email addresses", () => {
      expect(email.safeParse("invalid-email").success).toBe(false)
      expect(email.safeParse("test@").success).toBe(false)
      expect(email.safeParse("@domain.com").success).toBe(false)
    })
  })

  describe("username validation", () => {
    it("should accept valid usernames", () => {
      expect(username.safeParse("john_doe").success).toBe(true)
      expect(username.safeParse("user123").success).toBe(true)
      expect(username.safeParse("test-user").success).toBe(true)
    })

    it("should reject invalid usernames", () => {
      expect(username.safeParse("123user").success).toBe(false) // doesn't start with letter
      expect(username.safeParse("a").success).toBe(false) // too short
      expect(username.safeParse("this_username_is_way_too_long").success).toBe(
        false
      ) // too long
    })
  })

  describe("password validation", () => {
    it("should accept valid passwords", () => {
      expect(password.safeParse("password123").success).toBe(true)
      expect(password.safeParse("123456").success).toBe(true)
    })

    it("should reject invalid passwords", () => {
      expect(password.safeParse("12345").success).toBe(false) // too short
      expect(password.safeParse("").success).toBe(false) // empty
    })
  })

  describe("login schema validation", () => {
    it("should accept valid login data", () => {
      expect(
        loginSchema.safeParse({
          email: "test@example.com",
          password: "password123",
        }).success
      ).toBe(true)
    })

    it("should reject invalid login data", () => {
      expect(
        loginSchema.safeParse({
          email: "invalid-email",
          password: "password123",
        }).success
      ).toBe(false)
      expect(
        loginSchema.safeParse({
          email: "test@example.com",
          password: "",
        }).success
      ).toBe(false)
    })
  })

  describe("register schema validation", () => {
    it("should accept valid registration data", () => {
      expect(
        registerSchema.safeParse({
          email: "test@example.com",
          username: "testuser",
          password: "password123",
        }).success
      ).toBe(true)
    })

    it("should reject invalid registration data", () => {
      expect(
        registerSchema.safeParse({
          email: "invalid-email",
          username: "testuser",
          password: "password123",
        }).success
      ).toBe(false)
      expect(
        registerSchema.safeParse({
          email: "test@example.com",
          username: "123user",
          password: "password123",
        }).success
      ).toBe(false)
    })
  })

  describe("forgot password schema validation", () => {
    it("should accept valid email", () => {
      expect(
        forgotPasswordSchema.safeParse({
          email: "test@example.com",
        }).success
      ).toBe(true)
    })

    it("should reject invalid email", () => {
      expect(
        forgotPasswordSchema.safeParse({
          email: "invalid-email",
        }).success
      ).toBe(false)
    })
  })

  describe("password reset schema validation", () => {
    it("should accept valid new password", () => {
      expect(
        passwordSchema.safeParse({
          newPassword: "newpassword123",
        }).success
      ).toBe(true)
    })

    it("should reject invalid new password", () => {
      expect(
        passwordSchema.safeParse({
          newPassword: "12345",
        }).success
      ).toBe(false)
    })
  })
})

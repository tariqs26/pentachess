import React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import { LoginForm } from "../components/LoginForm"
import { RegisterForm } from "../components/RegisterForm"
import { ForgotPasswordForm } from "../components/ForgotPasswordForm"
import { ResetPasswordForm } from "../components/ResetPasswordForm"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Mock useForm to provide default values
jest.mock("react-hook-form", () => {
  const original = jest.requireActual("react-hook-form");
  return {
    ...original,
    useForm: (props: any) => {
      // Ensure defaultValues are always defined
      const defaultProps = {
        ...props,
        defaultValues: {
          email: "",
          password: "",
          username: "",
          newPassword: "",
          ...(props?.defaultValues || {})
        }
      };
      return original.useForm(defaultProps);
    }
  };
});

// Mock auth client functions
jest.mock("@/lib/auth-client", () => ({
  authClient: {
    signIn: {
      email: jest.fn((values, callbacks) => {
        callbacks.onSuccess()
        return Promise.resolve()
      }),
    },
    signUp: {
      email: jest.fn((values, callbacks) => {
        callbacks.onSuccess()
        return Promise.resolve()
      }),
    },
  },
}))

// Mock toast notifications
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock Link from next/link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

describe("LoginForm", () => {
  it("renders login form elements", () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument()
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
  })

  it("allows entering email and password", async () => {
    render(<LoginForm />)
    const user = userEvent.setup()
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    
    expect(emailInput).toHaveValue("test@example.com")
    expect(passwordInput).toHaveValue("password123")
  })

  it("handles form submission", async () => {
    const { authClient } = require("@/lib/auth-client")
    const { toast } = require("sonner")
    
    render(<LoginForm />)
    const user = userEvent.setup()
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/password/i)
    const submitButton = screen.getByRole("button", { name: /login/i })
    
    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")
    await user.click(submitButton)
    
    expect(authClient.signIn.email).toHaveBeenCalledWith(
      { email: "test@example.com", password: "password123" },
      expect.any(Object)
    )
    expect(toast.success).toHaveBeenCalledWith("Logged in successfully")
  })
})

describe("RegisterForm", () => {
  it("renders register form elements", () => {
    render(<RegisterForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument()
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
  })

  it("allows entering registration details", async () => {
    render(<RegisterForm />)
    const user = userEvent.setup()
    
    const emailInput = screen.getByLabelText(/email/i)
    const usernameInput = screen.getByLabelText(/username/i)
    const passwordInput = screen.getByLabelText(/password/i)
    
    await user.type(emailInput, "newuser@example.com")
    await user.type(usernameInput, "newuser")
    await user.type(passwordInput, "securepass123")
    
    expect(emailInput).toHaveValue("newuser@example.com")
    expect(usernameInput).toHaveValue("newuser")
    expect(passwordInput).toHaveValue("securepass123")
  })
})

describe("ForgotPasswordForm", () => {
  it("renders forgot password form elements", () => {
    render(<ForgotPasswordForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /send reset email/i })).toBeInTheDocument()
    expect(screen.getByText(/remembered your password/i)).toBeInTheDocument()
  })

  it("allows entering email for password reset", async () => {
    render(<ForgotPasswordForm />)
    const user = userEvent.setup()
    
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, "forgot@example.com")
    
    expect(emailInput).toHaveValue("forgot@example.com")
  })
})

describe("ResetPasswordForm", () => {
  it("renders reset password form elements", () => {
    render(<ResetPasswordForm />)
    
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument()
  })

  it("allows entering a new password", async () => {
    render(<ResetPasswordForm />)
    const user = userEvent.setup()
    
    const passwordInput = screen.getByLabelText(/new password/i)
    await user.type(passwordInput, "newpassword123")
    
    expect(passwordInput).toHaveValue("newpassword123")
  })
})

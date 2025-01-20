"use client"

import { RegisterForm } from "@/app/(auth)/register/RegisterForm"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Label } from "@/components/ui/Label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form"
import { Input } from "@/components/ui/Input"
import Link from "next/link"

const formSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  userName: z.string().min(3),
  emailAddress: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
})

// TODO: Implement RegisterPage
export default function RegisterPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
    },
  })
  const handleSubmit = () => {
    console.log("submitted")
  }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <RegisterForm />
      <Card className="w-full max-w-md space-y-1 p-4">
        <Label className="block text-center text-2xl">Welcome! Register:</Label>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full max-w-md space-y-4 p-6"
          >
            <Label className="w-full max-w-md space-y-4 text-green-400">
              First and Last Name
            </Label>
            <div className="flex space-x-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="mb-4 w-full max-w-md space-y-4"
                          placeholder="someone"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="mb-4 w-full max-w-md space-y-4"
                          placeholder="someone"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>
            <Label className="w-full max-w-md space-y-4 text-green-400">
              Username
            </Label>
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="mb-4 w-full max-w-md space-y-4"
                        placeholder="someone"
                        type="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <Label className="w-full max-w-md space-y-4 text-green-400">
              Email
            </Label>
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="mb-4 w-full max-w-md space-y-4"
                        placeholder="someone@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <Label className="w-full max-w-md space-y-4 text-green-400">
              Password
            </Label>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="mb-4 w-full max-w-md space-y-4"
                        placeholder="********"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
            <Button type="submit" className="w-full max-w-md space-y-4">
              Register
            </Button>
            <Link
              href="/login"
              className="mt-8 block w-full max-w-md text-xs text-blue-400 hover:underline"
            >
              Already have an account? Click here to Login
            </Link>
          </form>
        </Form>
      </Card>
    </div>
  )
}

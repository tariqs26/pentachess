import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { db } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: "mongodb" }),
  emailAndPassword: { enabled: true, minPasswordLength: 6 },
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: true,
        returned: true,
        sortable: true,
        unique: true,
      },
    },
    changeEmail: { enabled: true },
    deleteUser: { enabled: true },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email" && ctx.path !== "/update-user") {
        return
      }

      const username = ctx.body.username

      if (username) {
        if (username.length < 4) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message: "username is too short",
          })
        }

        if (username.length > 20) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message: "username is too long",
          })
        }

        if (!/^[a-z][a-z0-9_-]+$/i.test(username)) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message: "username is invalid",
          })
        }

        const user = await ctx.context.adapter.findOne({
          model: "user",
          where: [{ field: "username", value: username }],
        })

        if (user) {
          throw new APIError("UNPROCESSABLE_ENTITY", {
            message: "username is already taken. please try another.",
          })
        }
      }
    }),
  },
})

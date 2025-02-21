import type { Metadata } from "next"
import { headers } from "next/headers"

import { AccountSection } from "@/features/user/components/AccountSection"
import { DeleteAccountDialog } from "@/features/user/components/DeleteAccountDialog"
import { EmailForm } from "@/features/user/components/EmailForm"
import { NameForm } from "@/features/user/components/NameForm"
import { PasswordForm } from "@/features/user/components/PasswordForm"
import { UsernameForm } from "@/features/user/components/UsernameForm"
import { auth } from "@/lib/auth"

export const metadata = {
  title: "Account Settings",
  description: "Manage your account settings",
} satisfies Metadata

export default async function AccountPage() {
  const session = await auth.api.getSession({ headers: headers() })

  if (!session) {
    return <div>Not authenticated</div>
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">
        {metadata.title}
      </h1>
      <section className="space-y-8">
        <AccountSection
          title="Username"
          description="This is your username, which will be displayed on your profile and when you play games."
        >
          <UsernameForm username={session.user.username} />
        </AccountSection>
        <AccountSection
          title="Name"
          description="Please enter your full name, or a name you are comfortable with."
        >
          <NameForm name={session.user.name} />
        </AccountSection>
        <AccountSection
          title="Email"
          description="Your email address is used to log in and receive password reset emails."
        >
          <EmailForm email={session.user.email} />
        </AccountSection>
        <AccountSection
          title="Change Password"
          description="For security reasons, we recommend changing your password periodically."
        >
          <PasswordForm />
        </AccountSection>
        <AccountSection
          title="Delete Account"
          description="Permanently remove your account and all of its contents from PentaChess. This action is not reversible, so please continue with caution."
        >
          <DeleteAccountDialog />
        </AccountSection>
      </section>
    </div>
  )
}

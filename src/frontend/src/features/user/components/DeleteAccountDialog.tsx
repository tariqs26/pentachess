"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog"
import { Button } from "@/components/ui/Button"

export const DeleteAccountDialog = () => {
  const router = useRouter()

  const handleDelete = async () => {
    const data = await authClient.deleteUser()

    if (data.error) {
      toast.error(data.error.message)
      return
    }

    router.replace("/")
    router.refresh()
    toast.success("Account deleted successfully")
  }

  return (
    <div className="mt-2 flex justify-end border-t bg-card px-6 py-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">Delete personal account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

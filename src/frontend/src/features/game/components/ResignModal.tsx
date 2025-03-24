import { useState } from "react"
import { Button } from "@/components/ui/Button"

type ResignModalProps = Readonly<{
  handleResign: () => void
}>

export const ResignModal = ({ handleResign }: ResignModalProps) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="destructive"
        className="h-[42px] w-full"
        onClick={() => {
          setOpen(true)
        }}
      >
        Resign
      </Button>
      {open && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <div className="ml-4 rounded-xl border bg-card p-4 shadow-lg">
            <h2 className="mb-6 text-center font-semibold leading-none tracking-tight">
              Are you sure you want to resign?
            </h2>
            <div className="flex justify-center gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen(false)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleResign}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

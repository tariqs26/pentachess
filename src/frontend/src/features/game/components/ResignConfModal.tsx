import { Button } from "@/components/ui/Button"

type ResignConfModalProps = Readonly<{
  handleResignYes: () => void
  handleResignNo: () => void
}>

export const ResignConfModal = ({
  handleResignYes,
  handleResignNo,
}: ResignConfModalProps) => (
  <>
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
      <div className="ml-4 rounded-xl border bg-card p-4 text-center shadow-lg">
        <h2 className="mb-4 font-semibold leading-none tracking-tight">
          Are you sure you want to resign?
        </h2>
        <div className="mt-2 flex justify-center gap-4">
          <Button
            className="bg-primary px-8 py-2 text-primary-foreground"
            onClick={handleResignYes}
          >
            Yes
          </Button>
          <Button
            className="bg-secondary px-8 py-2 text-secondary-foreground"
            onClick={handleResignNo}
          >
            No
          </Button>
        </div>
      </div>
    </div>
  </>
)

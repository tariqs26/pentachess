import { Button } from "@/components/ui/Button"

type ResetBoardModalProps = Readonly<{
  action: string
  handleReset: () => void
}>

export const ResetBoardModal = ({
  action,
  handleReset,
}: ResetBoardModalProps) => (
  <>
    <Button
      variant="destructive"
      className="h-[42px] w-full"
      onClick={handleReset}
    >
      {action}
    </Button>
  </>
)

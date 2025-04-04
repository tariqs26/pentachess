import { Button } from "@/components/ui/Button"

type ResetBoardButtonProps = Readonly<{
  action: string
  handleReset: () => void
}>

export const ResetBoardButton = ({
  action,
  handleReset,
}: ResetBoardButtonProps) => (
  <Button
    variant="destructive"
    className="h-[42px] w-full"
    onClick={handleReset}
  >
    {action}
  </Button>
)

import { Button } from "@/components/ui/Button"
import { Undo2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGame } from "../hooks/useGame"

type MoveConfirmationProps = Readonly<{
  className?: string
  disabled?: boolean
}>

export const MoveConfirmation = ({
  className,
  disabled,
}: MoveConfirmationProps) => {
  const { dispatch } = useGame()

  if (disabled) return null

  return (
    <div className={cn("absolute right-0 flex w-[72px] gap-1", className)}>
      <Button
        variant="ghost"
        className="h-[35px] w-[35px] rounded-md bg-red-500 p-0 text-white hover:bg-red-600"
        onClick={() => dispatch({ type: "CANCEL_MOVE" })}
      >
        <Undo2 className="size-5" />
      </Button>
      <Button
        variant="ghost"
        className="h-[35px] w-[35px] rounded-md bg-green-500 p-0 text-white hover:bg-green-600"
        onClick={() => dispatch({ type: "CONFIRM_MOVE" })}
      >
        <Check className="size-5" />
      </Button>
    </div>
  )
}

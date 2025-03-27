import { Button } from "@/components/ui/Button"
import { Check, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGame } from "../hooks/useGame"

type MoveConfirmationProps = Readonly<{
  className?: string
  hidden?: boolean
}>

export const MoveConfirmation = ({
  className,
  hidden,
}: MoveConfirmationProps) => {
  const { dispatch } = useGame()

  if (hidden) return null

  return (
    <div className={cn("absolute right-0 space-x-1", className)}>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => dispatch({ type: "CANCEL_MOVE" })}
      >
        <Undo2 className="!size-5" />
      </Button>
      <Button size="icon" onClick={() => dispatch({ type: "CONFIRM_MOVE" })}>
        <Check className="!size-5" />
      </Button>
    </div>
  )
}

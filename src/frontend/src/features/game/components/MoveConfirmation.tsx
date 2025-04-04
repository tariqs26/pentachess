import { useEffect } from "react"
import { Check, Undo2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGame } from "../hooks/useGame"
import { Button } from "@/components/ui/Button"

type MoveConfirmationProps = Readonly<{
  className?: string
  hidden?: boolean
}>

export const MoveConfirmation = ({
  className,
  hidden,
}: MoveConfirmationProps) => {
  const { dispatch } = useGame()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (hidden) return
      if (event.key === "Escape") dispatch({ type: "CANCEL_MOVE" })
      if (event.key === "Enter") dispatch({ type: "CONFIRM_MOVE" })
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden])

  if (hidden) return null

  return (
    <div className={cn("absolute right-0 space-x-1", className)}>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => dispatch({ type: "CANCEL_MOVE" })}
        data-testid="cancel-move"
      >
        <Undo2 className="!size-5" />
      </Button>
      <Button
        size="icon"
        onClick={() => dispatch({ type: "CONFIRM_MOVE" })}
        data-testid="confirm-move"
      >
        <Check className="!size-5" />
      </Button>
    </div>
  )
}

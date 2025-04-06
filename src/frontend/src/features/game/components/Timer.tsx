import { cn } from "@/lib/utils"
import { displayTimeRemaining } from "../utils"

type TimerProps = Readonly<{
  duration?: number
  className?: string
  disabled?: boolean
}>

export const Timer = ({ className, duration, disabled }: TimerProps) =>
  duration !== undefined ? (
    <time
      className={cn(
        "absolute right-0 w-[76px] rounded-md border bg-secondary p-2 text-center font-bold text-secondary-foreground shadow-sm",
        disabled && "opacity-50",
        className
      )}
      data-testid="timer"
    >
      {displayTimeRemaining(duration)}
    </time>
  ) : null

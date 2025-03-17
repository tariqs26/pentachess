import { displayTimeRemaining } from "../utils"
import { cn } from "@/lib/utils"

type TimerProps = Readonly<{
  duration: number
  className?: string
  disabled?: boolean
}>

export const Timer = ({ className, duration, disabled }: TimerProps) => (
  <time
    className={cn(
      "absolute right-0 w-[72px] rounded-md border bg-secondary p-2 text-center font-bold text-secondary-foreground shadow-sm",
      disabled && "opacity-50",
      className
    )}
  >
    {displayTimeRemaining(duration)}
  </time>
)

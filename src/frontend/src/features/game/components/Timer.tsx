import { displayTimeRemaining } from "../utils"
import { cn } from "@/lib/utils"

type TimerProps = Readonly<{
  duration: number
  className?: string
}>

export const Timer = ({ className, duration }: TimerProps) => (
  <time
    className={cn(
      "absolute right-0 w-[72px] rounded-md border bg-secondary p-2 text-center font-bold text-secondary-foreground shadow-sm",
      className
    )}
  >
    {displayTimeRemaining(duration)}
  </time>
)

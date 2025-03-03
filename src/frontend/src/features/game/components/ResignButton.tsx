import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

type ResignButtonProps = Readonly<{
  className?: string
  handleResign: () => void | null
}>

export const ResignButton = ({
  className,
  handleResign,
}: ResignButtonProps) => {
  return (
    <Button
      className={cn(
        "absolute right-0 w-[72px] rounded-md border bg-secondary p-2 text-center font-bold text-secondary-foreground shadow",
        className
      )}
      onClick={handleResign}
    >
      Resign
    </Button>
  )
}

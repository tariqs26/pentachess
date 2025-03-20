import { cn } from "@/lib/utils"

type PlayerCardProps = Readonly<{
  username: string
  isCheck?: boolean
  isCheckmate?: boolean
  isDraw?: boolean
  className?: string
}>

export const PlayerCard = (props: PlayerCardProps) => (
  <p
    className={cn(
      "absolute left-0 -mb-1 ml-1 font-bold max-w-[20ch]",
      props.isCheck && "text-red-500",
      props.isDraw && "text-gray-500",
      props.className
    )}
  >
    {props.username}{" "}
    {(props.isCheck && `(${props.isCheckmate ? "checkmate" : "check"})`) ||
      (props.isDraw && "(draw)")}
  </p>
)

type SideProps = React.PropsWithChildren<{
  ring: number
  side: number
}>

export const Side = (props: SideProps) => {
  return <div className="side flex">{props.children}</div>
}

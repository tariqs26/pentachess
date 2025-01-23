type Props = React.PropsWithChildren<{
  title: string
  description: string
}>

export const AccountSection = (props: Props) => (
  <section className="rounded-md border">
    <div className="p-6 pb-2">
      <h2 className="mb-1 text-lg font-semibold md:text-xl">{props.title}</h2>
      <p className="text-muted-foreground">{props.description}</p>
    </div>
    {props.children}
  </section>
)

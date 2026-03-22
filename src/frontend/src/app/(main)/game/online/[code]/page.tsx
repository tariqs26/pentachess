export default async function OnlineCustomGamePage(
  props: Readonly<{ params: Promise<{ code: string }> }>
) {
  const params = await props.params
  // TODO: Implement custom online game page
  return (
    <div className="mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
      Game code: {params.code}
    </div>
  )
}

export default function OnlineCustomGamePage({
  params,
}: Readonly<{ params: { code: string } }>) {
  // TODO: Implement custom online game page
  return (
    <div className="mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
      Game code: {params.code}
    </div>
  )
}

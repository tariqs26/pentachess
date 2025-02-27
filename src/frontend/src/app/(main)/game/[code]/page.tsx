// TODO: Implement OnlineGamePage

export default function OnlineGamePage({
  params,
}: Readonly<{ params: { code: string } }>) {
  return (
    <div className="mx-auto grid min-h-screen max-w-5xl place-items-center p-6">
      Game code: {params.code}
    </div>
  )
}

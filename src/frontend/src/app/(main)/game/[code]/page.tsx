// TODO: Implement OnlineGamePage

export default function OnlineGamePage(
  props: Readonly<{ params: { code: string } }>
) {
  return <div>Game {props.params.code}</div>
}

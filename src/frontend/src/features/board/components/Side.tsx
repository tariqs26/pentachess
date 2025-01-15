import type { CSSProperties } from "react"

type SideProps = React.PropsWithChildren<{
  ring: number
  side: number
}>

export const sideRotation = (ring: number) => {
  switch (ring) {
    case 0:
      return [-20, -17, -91, -87, -165, -161, 124, 128, 52, 56]
    case 1:
      return [19, -20, -52, -93, -123, -162, 162, 122, 92, 52]
    default:// /        /
      return [20, -35, -51.5, -112, -145, -185, 140, 105, 70, 38]
  }
}

export const sideLeft = (ring: number) => {
  switch (ring) {
    case 0:
      return [56.57, 80, 53.5, 46, -34.3, -68.8, -83, -99, -27, -3]
    case 1:
      return [-78, 11, 73, 65, 26, -73, -160, -213, -221, -162.3]
    default:// /         /
      return [-138, 20, 118, 115, 30, -100, -225, -295, -285, -200]
  }
}

export const sideTop = (ring: number) => {
  switch (ring) {
    case 0:
      return [0, -9, -88, -116, -113, -113, -39, -2.5, 31, 62]
    case 1:
      return [100.5, 65, 1, -98, -174, -203, -181, -99, -12.5, 64]
    default:// /           /
      return [189.5, 140, 58, -2000, -2000, -2000, -2000, -2000, 2000, 2000]
  }
}

const sideStyle = (ring: number, side: number): CSSProperties => ({
  display: "flex",
  position: "absolute",
  rotate: `${sideRotation(ring)[side]}deg`,
  top: `${sideTop(ring)[side]}px`,
  left: `${sideLeft(ring)[side]}px`,
  zIndex: side % 2 == 0 ? 2 : 1,
})

export const Side = ({ side, ring, ...props }: SideProps) => {
  return <div style={sideStyle(ring, side)} {...props} />
}

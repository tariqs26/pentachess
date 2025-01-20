import type { CSSProperties } from "react"

type SideProps = React.PropsWithChildren<{
  ring: number
  side: number
}>

export const sideRotation = (ring: number) => {
  switch (ring) {
    case 0:
      return [-20, -17.5, -92, -89.5, -164, -161.5, 124, 126.5, 52, 54.6]
    case 1:
      return [19, -17, -53, -89, -125, -161, 163, 127, 91, 55]
    default:
      return [19, -17, -53, -89, -125, -161, 163, 127, 91, 55]
  }
}

export const sideLeft = (ring: number) => {
  switch (ring) {
    case 0:
      return [56.57, 87, 66.5, 72.2, 2, -25.2, -48.0, -70.8, -14.3, -1.4]
    case 1:
      return [-74, 14, 76.2, 89, 47.3, -32.7, -120.6, -182.8, -195.5, -153.8]
    default:
      return [-133.5, 13.5, 123, 153.5, 93, -35, -181.9, -291.2, -321.8, -261.3]
  }
}

export const sideTop = (ring: number) => {
  switch (ring) {
    case 0:
      return [0, 6.2, -71, -91.3, -102.5, -107.5, -50.9, -19.8, 12.5, 50.5]
    case 1:
      return [93.5, 78.2, 14.2, -74.1, -153.1, -192.5, -177.3, -113.5, -25.1, 54]
    default:
      return [184.5, 168.7, 69.5, -75, -210, -283.5, -267.8, -169, -24.5, 110.5]
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

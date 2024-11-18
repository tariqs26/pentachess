import type { CSSProperties } from "react"

type SideProps = React.PropsWithChildren<{
  ring: number
  side: number
}>

export const sideRotation = (ring: number) => {
  switch (ring) {
    case 0:
      return [0, 0, -70, -73, -140, -142, 150, 148, 75, 70]
    case 1:
      return [-5, -40, -75, -110, -145, -180, 145, 110, 75, 38]
    default:
      return [-5, -35, -75, -112, -145, -185, 140, 105, 70, 38]
  }
}

export const sideLeft = (ring: number) => {
  switch (ring) {
    case 0:
      return [0, 30, 30, 35, -12, -38, -70, -92, -63, -50]
    case 1:
      return [-33, 45, 83, 65, 10, -65, -140, -185, -180, -120]
    default:
      return [-60, 70, 137, 115, 30, -100, -225, -295, -285, -200]
  }
}

export const sideTop = (ring: number) => {
  switch (ring) {
    case 0:
      return [0, -2, -55, -85, -102, -117, -75, -55, -11, 18]
    case 1:
      return [88, 50, -28, -110, -170, -185, -150, -80, 8, 78]
    default:
      return [177, 120, -2, -140, -245, -270, -210, -90, 50, 150]
  }
}

const sideStyle = (ring: number, side: number): CSSProperties => ({
  display: "flex",
  position: "absolute",
  rotate: `${sideRotation(ring)[side]}deg`,
  top: `${sideTop(ring)[side]}px`,
  left: `${sideLeft(ring)[side]}px`,
})

export const Side = ({ side, ring, ...props }: SideProps) => {
  return <div style={sideStyle(ring, side)} {...props} />
}

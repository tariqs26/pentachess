import type { CSSProperties } from "react"

type SideProps = React.PropsWithChildren<{
  ring: number
  side: number
}>

function rotationStyle(ring: number, side: number): number {
  const rotations_ring_0 = [0, 0, -70, -73, -140, -142, 150, 148, 75, 70]
  const rotations_ring_1 = [-5, -40, -75, -110, -145, -180, 145, 110, 75, 38]
  const rotations_ring_2 = [-5, -35, -75, -112, -145, -185, 140, 105, 70, 38]

  switch (ring) {
    case 0:
      return rotations_ring_0[side]
    case 1:
      return rotations_ring_1[side]
    default:
      return rotations_ring_2[side]
  }
}

// left and top are based on the top/left position of the ring currently 50% top, 50% left

const leftStyle = (ring: number): Array<number> => {
  switch (ring) {
    case 0:
      // TODO fix inner ring positioning
      return [0, 30, 30, 35, -12, -38, -70, -92, -63, -50]
    case 1:
      // pattern, -18, -18, 87, 87, -148, -148, -253, -253
      return [-33, 45, 83, 65, 10, -65, -140, -185, -180, -120]
    default:
      // pattern, -20, -20, 171, 171, -256, -256, -447, -447
      return [-60, 70, 137, 115, 30, -100, -225, -295, -285, -200]
  }
}

const topStyle = (ring: number): Array<number> => {
  switch (ring) {
    case 0:
      // TODO fix inner ring positioning
      return [0, -2, -55, -85, -102, -117, -75, -55, -11, 18]
    case 1:
      // pattern, -18, -18, 87, 87, -148, -148, -253, -253
      return [88, 50, -28, -110, -170, -185, -150, -80, 8, 78]
    default:
      // pattern, -20, -20, 171, 171, -256, -256, -447, -447
      return [177, 120, -2, -140, -245, -270, -210, -90, 50, 150]
  }
}

const getSideStyle = (ring: number, side: number): CSSProperties => ({
  display: "flex",
  position: "absolute",
  rotate: `${rotationStyle(ring, side)}deg`,
  top: `${topStyle(ring)[side]}px`,
  left: `${leftStyle(ring)[side]}px`,
  zIndex: side,
})

export const Side = ({ side, ring, ...props }: SideProps) => {
  return <div style={getSideStyle(ring, side)} {...props} />
}

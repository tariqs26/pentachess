import type { CSSProperties } from "react"

type SideProps = React.PropsWithChildren<{
  ring: number
  side: number
}>

function rotationStyle(side: number): number {
  const [step, baseAngle] = [36, -18]
  return (baseAngle - step * side) % 360
}

// left and top are based on the top/left position of the ring currently 50% top, 50% left

const leftStyle = (ring: number): Array<number> => {
  switch (ring) {
    case 0:
      // TODO fix inner ring positioning
      return [-8, 48, 68, 48, -8, -92, -102, -122, -122, -72]
    case 1:
      // pattern, -18, -18, 87, 87, -148, -148, -253, -253
      return [-18, 87, 127, 87, -18, -148, -253, -293, -253, -148]
    default:
      // pattern, -20, -20, 171, 171, -256, -256, -447, -447
      return [-20, 171, 244, 171, -20, -256, -447, -520, -447, -256]
  }
}

const topStyle = (ring: number): Array<number> => {
  // 0, 1, 2, 3, 4
  // TODO fix inner ring positioning
  let firstHalf = [50, 30, -38, -110, -160]

  if (ring === 1) {
    // pattern diff (0,1) = 76, diff (1,2) = 122, diff (2,3) = 122, diff (3,4) = 76
    firstHalf = [146, 70, -52, -174, -250]
  } else if (ring === 2) {
    // pattern diff (0,1) = 140, diff (1,2) = 224, diff (2,3) = 224, diff (3,4) = 140
    firstHalf = [312, 172, -52, -276, -416]
  }

  return [...firstHalf, ...firstHalf.toReversed()]
}

const getSideStyle = (ring: number, side: number): CSSProperties => ({
  display: "flex",
  position: "absolute",
  rotate: `${rotationStyle(side)}deg`,
  top: `${topStyle(ring)[side]}px`,
  left: `${leftStyle(ring)[side]}px`,
  zIndex: side,
})

export const Side = ({ side, ring, ...props }: SideProps) => {
  return <div style={getSideStyle(ring, side)} {...props} />
}

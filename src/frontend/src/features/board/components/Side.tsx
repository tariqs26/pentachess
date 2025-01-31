export const sideRotation = [
  // ring 0
  [-20, -17.5, -92, -89.5, -164, -161.5, 124, 126.5, 52, 54.6],
  // ring 1
  [19, -17, -53, -89, -125, -161, 163, 127, 91, 55],
  // ring 2
  [19, -17, -53, -89, -125, -161, 163, 127, 91, 55],
]

export const sideLeft = [
  // ring 0
  [56.57, 87, 66.5, 72.2, 2, -25.2, -48.0, -70.8, -14.3, -1.4],
  // ring 1
  [-6, 82.3, 132.1, 124.4, 62.1, -30.8, -119.1, -168.9, -161.2, -99.1],
  // ring 2
  [-65.5, 81.8, 179, 189, 107.7, -33, -180.2, -277.5, -287.5, -206.5],
]

export const sideTop = [
  // ring 0
  [0, 6.2, -71, -91.3, -102.5, -107.5, -50.9, -19.8, 12.5, 50.5],
  // ring 1
  [105, 68.1, -13.7, -109.1, -181.7, -203.7, -166.8, -85, 10.4, 82.8],
  // ring 2
  [196.2, 158.7, 41.9, -109.7, -238.4, -294.5, -257.3, -140.5, 11.25, 140]
]

type SideProps = React.PropsWithChildren<{ ring: number; side: number }>

export const Side = ({ side, ring, ...props }: SideProps) => (
  <div
    id={`side-${ring}-${side}`}
    className="absolute flex"
    style={{
      rotate: `${sideRotation[ring][side]}deg`,
      left: `${sideLeft[ring][side]}px`,
      top: `${sideTop[ring][side]}px`
    }}
    {...props}
  />
)

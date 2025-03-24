export const sideRotation = [
  // ring 0
  [-20, -17.5, -92, -89.5, -164, -161.5, 124, 126.5, 52, 54.6],
  // ring 1
  [19, -17, -53, -89, -125, -161, 163, 127, 91, 55],
  // ring 2
  [19.2, -17, -53, -89, -125, -161, 163, 127, 91, 55],
]

export const sideLeft = [
  // ring 0
  [56.6, 87, 66.3, 71.6, 2, -25.2, -47.8, -70.8, -14, -1.4],
  // ring 1
  [-6.2, 82.3, 131.9, 124.4, 61.8, -30.8, -118.6, -168.4, -160.7, -99.1],
  // ring 2
  [-65, 81.8, 179.1, 188.9, 107.7, -33, -180.2, -277.3, -287.1, -206.2],
]

export const sideTop = [
  // ring 0
  [-0.3, 6.2, -71, -91, -102.5, -107.5, -50.9, -19.8, 12.5, 50.5],
  // ring 1
  [104.8, 68.1, -13.7, -109.1, -181.3, -203.7, -167, -85.2, 10, 82.6],
  // ring 2
  [196.2, 158.7, 41.7, -109.7, -238.2, -294.5, -257.3, -140.5, 11.25, 139.5],
]

type SideProps = React.PropsWithChildren<{ ring: number; side: number }>

export const Side = ({ side, ring, ...props }: SideProps) => (
  <div
    id={`side-${ring}-${side}`}
    className="absolute flex"
    style={{
      rotate: `${sideRotation[ring][side]}deg`,
      left: `${sideLeft[ring][side]}px`,
      top: `${sideTop[ring][side]}px`,
    }}
    {...props}
  />
)

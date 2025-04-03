import { describe, expect, it } from "vitest"
import { customRender } from "../setup"
import { Board } from "@/features/board/components/Board"
import { fireEvent } from "@testing-library/react"
import { getSidePosition } from "./utils"
import { RING_SIZES } from "@/features/board/constants"
import { cellRotation, marginLeftStyle, marginTopStyle } from "@/features/board/utils"
import { makeCell } from "@/features/board/cell"

describe("UI Tests", () => {
    it("Clicked cell should be highlighted orange", () => {
      const board = customRender(<Board disabled={false} />)
  
      const cellContainer = board.container.querySelector(
        "#cell-container-a0"
      ) as HTMLDivElement | null

      fireEvent.click(cellContainer!)
  
      const cellFrom = board.container.querySelector(
        "#cell-a0"
      ) as HTMLDivElement | null
  
      expect(cellFrom?.className.includes("bg-orange-500")).toBe(true)
    })

    it("Board show show all rings with correct positioning and # of sides", () => {
      const board = customRender(<Board disabled={false} />)
      const rings = board.container.querySelectorAll(`.absolute.left-\\[45\\.2\\%\\].top-\\[49\\.5\\%\\]`)

      // Check that there are 3 rings
      expect(rings.length).toBe(3)
      
      // Check each ring has correct positioning, and number of sides
      rings.forEach((ring) => {
        expect(ring.className).toEqual("absolute left-[45.2%] top-[49.5%]")
        expect(ring.children.length).toBe(10)
      })
    })
    
    it("Ensure that each ring contains 10 sides in the correct positioning", () => {
      const rings = ["0", "1", "2"]
      const board = customRender(<Board disabled={false} />)
      
      rings.forEach((ring) => {
        const sides = board.container.querySelectorAll(`[id^="side-${ring}-"]`)        
        expect(sides.length).toBe(10)
        
        sides.forEach((side) => {
          const div_id = side.id
          const x = div_id.split("-")[1]
          const y = div_id.split("-")[2]

          expect(div_id).toBe(`side-${ring}-${y}`)

          const { rotate, left, top } = window.getComputedStyle(side)

          expect({ rotate, left, top }).toEqual(getSidePosition(Number(x), Number(y)))
        })
      })
    })
    
    it("ensure that each cell is rendered correctly in the correct positioning", () => {
      const ringIds = ['c', 'b', 'a']
      const board = customRender(<Board disabled={false} />)

      const rings = ringIds.map(letter => 
        Array.from(board.container.querySelectorAll(`[id^="cell-${letter}"]`))
          .filter(el => el.id.match(new RegExp(`^cell-${letter}\\d+$`)))
      )

      rings.forEach((ring, i) => {
        expect(ring.length).toBe(RING_SIZES[i])

        ring.forEach((cell) => {
          const div_id = cell.id
          const id = div_id.split("-")[1]
          const sampleCell = makeCell(i, Number(id.slice(1)), 0)

          expect(id[0]).toBe(ringIds[i])
          
          const { rotate, marginLeft, marginTop } = window.getComputedStyle(cell)

          expect({ rotate, marginLeft, marginTop }).toEqual({
            rotate: `${cellRotation(sampleCell)}deg`,
            marginLeft: `${marginLeftStyle(sampleCell)}px`,
            marginTop: `${marginTopStyle(sampleCell)}px`,
          })
        })
      })
    })
  })
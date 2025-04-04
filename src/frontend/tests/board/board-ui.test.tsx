import { fireEvent } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { makeCell } from "@/features/board/cell"
import { Board } from "@/features/board/components/Board"
import { RING_SIZES } from "@/features/board/constants"
import {
  cellRotation,
  marginLeftStyle,
  marginTopStyle,
} from "@/features/board/utils"
import { INITIAL_PIECES, PIECE_DATA } from "@/features/piece/constants"

import { customRender } from "../setup"
import { getSideProps, normalizeImagePath } from "./utils"

describe("Board UI Tests", () => {
  it("should highlight a cell with orange background when clicked", () => {
    const board = customRender(<Board disabled={false} />)
    const cellId = "a0"
    const cellContainer = board.container.querySelector(
      `#cell-container-${cellId}`
    ) as HTMLDivElement

    fireEvent.click(cellContainer)

    const clickedCell = board.container.querySelector(
      `#cell-${cellId}`
    ) as HTMLDivElement
    expect(clickedCell.className).toContain("bg-orange-500")
  })

  it("should display all rings with correct positioning", () => {
    const board = customRender(<Board disabled={false} />)
    const rings = board.container.querySelectorAll(
      ".absolute.left-\\[45\\.2\\%\\].top-\\[49\\.5\\%\\]"
    )

    // Check that there are 3 rings
    expect(rings.length).toBe(3)

    // Verify each ring's positioning and structure
    rings.forEach((ring) => {
      expect(ring.className).toBe("absolute left-[45.2%] top-[49.5%]")
      expect(ring.children.length).toBe(10)
    })
  })

  it("should render each ring with 10 sides in correct positions", () => {
    const ringIndices = ["0", "1", "2"]
    const board = customRender(<Board disabled={false} />)

    ringIndices.forEach((ringIndex) => {
      const sides = board.container.querySelectorAll(
        `[id^="side-${ringIndex}-"]`
      )
      expect(sides.length).toBe(10)

      sides.forEach((side) => {
        const [_, ringId, sideId] = side.id.split("-")

        expect(side.id).toBe(`side-${ringIndex}-${sideId}`)

        const computedStyle = window.getComputedStyle(side)
        const positionProps = {
          rotate: computedStyle.rotate,
          left: computedStyle.left,
          top: computedStyle.top,
        }

        const expectedProps = getSideProps(Number(ringId), Number(sideId))
        expect(positionProps).toEqual(expectedProps)
      })
    })
  })

  it("should render each cell with correct positioning and rotation", () => {
    const ringLetters = ["c", "b", "a"]
    const board = customRender(<Board disabled={false} />)

    ringLetters.forEach((ringLetter, ringIndex) => {
      const cellsInRing = Array.from(
        board.container.querySelectorAll(`[id^="cell-${ringLetter}"]`)
      ).filter((element) =>
        element.id.match(new RegExp(`^cell-${ringLetter}\\d+$`))
      )

      expect(cellsInRing.length).toBe(RING_SIZES[ringIndex])

      cellsInRing.forEach((cellElement) => {
        const cellId = cellElement.id.split("-")[1]
        const cellNumber = Number(cellId.slice(1))

        const referenceCell = makeCell(ringIndex, cellNumber, 0)

        expect(cellId[0]).toBe(ringLetters[ringIndex])

        const styles = window.getComputedStyle(cellElement)

        expect({
          rotate: styles.rotate,
          marginLeft: styles.marginLeft,
          marginTop: styles.marginTop,
        }).toEqual({
          rotate: `${cellRotation(referenceCell)}deg`,
          marginLeft: `${marginLeftStyle(referenceCell)}px`,
          marginTop: `${marginTopStyle(referenceCell)}px`,
        })
      })
    })
  })

  it("should ensure each piece displays the correct image", () => {
    const board = customRender(<Board disabled={false} />)
    const pieceElements = board.container.querySelectorAll(`img`)

    pieceElements.forEach((pieceElement) => {
      const [color, pieceType] = pieceElement.alt.split(" ")
      const pieceColor =
        color[0] as keyof (typeof PIECE_DATA)[keyof typeof PIECE_DATA]["image"]
      const expectedPieceData = PIECE_DATA[pieceType as keyof typeof PIECE_DATA]

      expect(expectedPieceData).toBeDefined()

      const actualImagePath = normalizeImagePath(pieceElement.src)
      const expectedImagePath = expectedPieceData.image[pieceColor].src

      expect(actualImagePath).toBe(expectedImagePath)
    })
  })

  it("should ensure pieces appear in the correct cells based on initial setup", () => {
    const board = customRender(<Board disabled={false} />)

    const cells = Array.from(
      board.container.querySelectorAll('[id^="cell-"]')
    ).filter((el) => el.id.match(/^cell-[abc]\d+$/))

    cells.forEach((cell) => {
      const cellId = cell.id.split("-")[1]
      const ringChar = cellId[0]
      const cellPosition = Number(cellId.slice(1))
      const ringIndex = "cba".indexOf(ringChar)

      if (
        ringIndex in INITIAL_PIECES &&
        cellPosition in INITIAL_PIECES[ringIndex]
      ) {
        const pieceImage = cell.querySelector("img")

        expect(pieceImage).toBeDefined()

        const [color, pieceType] = pieceImage?.alt.split(" ") || []
        const pieceColor = color[0]

        expect(INITIAL_PIECES[ringIndex][cellPosition]).toEqual([
          pieceType,
          pieceColor,
        ])
      }
    })
  })
})

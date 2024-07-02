"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { getColorForPiece } from "../../../lib/utils/pieceShape";
import { useAppSelector } from "./../../../lib/hooks";
import { useTetrisControls } from "./useTetrisControls";
import { useGameTick } from "./useGameTick";
import p5 from "p5";
import drawTetrisPiece from "./drawTetrisPiece";
import { PieceType } from "@/types/pieces";
import { Orientation } from "@/types/directions";
import { RootState } from "@/lib/store";

const PADDING_DISTANCE = 20;
const cellSize = 20; // Size of each cell
const officialBoardHeight = 20; // Official game area height
const HOLD_WIDTH = PADDING_DISTANCE + 4 * cellSize + PADDING_DISTANCE;
const BOARD_WIDTH = 10 * cellSize + PADDING_DISTANCE;

const P5Wrapper = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [sketchController, setController] = useState<p5 | null>(null);
  const board = useAppSelector((state) => state.board);
  const current = useAppSelector((state) => state.current);
  const next = useAppSelector((state) => state.next);
  const hold = useAppSelector((state) => state.hold);
  useTetrisControls();
  useGameTick();

  const drawHoldPiece = useCallback(
    (p: p5, cellSize: number, type: PieceType) => {
      drawTetrisPiece({
        p,
        type,
        orientation: Orientation.UP,
        canvasX: PADDING_DISTANCE,
        canvasY: 2 * PADDING_DISTANCE,
        cellSize,
      });
    },
    [],
  );

  const drawCurrentPiece = useCallback(
    (p: p5, cellSize: number, current: RootState["current"]) => {
      drawTetrisPiece({
        p,
        type: current.type,
        orientation: current.orientation,
        canvasX: HOLD_WIDTH + current.column * cellSize,
        canvasY:
          PADDING_DISTANCE + (board.grid.length - 1 - current.row) * cellSize,
        cellSize,
      });
    },
    [board.grid],
  );

  const drawNextPieces = useCallback(
    (p: p5, cellSize: number, queue: PieceType[]) => {
      const startX = HOLD_WIDTH + BOARD_WIDTH; // Start drawing 20 pixels to the right of the board
      let startY = 2 * PADDING_DISTANCE; // Start drawing 20 pixels from the top
      queue.slice(0, 5).forEach((type, index) => {
        const pieceSize = index === 0 ? cellSize * 1.2 : cellSize;
        drawTetrisPiece({
          p,
          type,
          orientation: Orientation.UP,
          canvasX: startX,
          canvasY: startY,
          cellSize: pieceSize,
        });
        startY += 2 * cellSize + 10 + pieceSize; // Add spacing between pieces
      });
    },
    [],
  );

  const drawBoard = useCallback(
    (p: p5, cellSize: number, grid: (typeof board)["grid"]) => {
      const startX = HOLD_WIDTH;
      const startY = PADDING_DISTANCE;

      p.background(0); // Set background to black

      // Draw the border of the board
      p.stroke(255); // White color for the borders
      p.noFill();
      // p.rect(0, 0, cellSize * grid[0].length, cellSize * 40);
      p.rect(
        startX,
        startY,
        cellSize * grid[0].length,
        cellSize * officialBoardHeight,
      );
      p.rect(
        startX,
        startY,
        cellSize * grid[0].length,
        cellSize * (grid.length - officialBoardHeight),
      );

      // Draw each cell
      for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
          if (row <= officialBoardHeight) {
            p.strokeWeight(1); // Border thickness for the entire grid
          } else {
            p.strokeWeight(0.3); // Border thickness for the entire grid
          }
          const piece = grid[row][col];
          const y = (grid.length - 1 - row) * cellSize; // Calculate y from the bottom
          p.fill(getColorForPiece(piece, row));
          p.stroke(255); // White color for cell borders
          p.rect(startX + col * cellSize, startY + y, cellSize, cellSize);
        }
      }
    },
    [],
  );

  const drawSketch = useCallback(
    (p: p5) => {
      // Draw current piece
      drawBoard(p, cellSize, board.grid);
      drawCurrentPiece(p, cellSize, current);
      drawNextPieces(p, cellSize, next.queue);
      drawHoldPiece(p, cellSize, hold.type);
    },
    [
      drawBoard,
      drawCurrentPiece,
      drawNextPieces,
      drawHoldPiece,
      board,
      next,
      hold,
      current,
    ],
  ); // Dependency on the board state

  useEffect(() => {
    if (sketchRef.current) {
      const sketch = (p: p5) => {
        p.setup = () => {
          p.createCanvas(800, 800);
          p.noLoop(); // Disable continuous looping
        };

        p.draw = () => {
          drawSketch(p); // Use the callback in the draw function
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);

      setController(myP5);

      return () => {
        setController(null);
        myP5.remove();
      };
    }
  }, [drawSketch]);

  useEffect(() => {
    if (sketchController) {
      sketchController.redraw();
    }
  }, [sketchController, drawSketch]); // Redraw when dependencies change

  return (
    <div className="p-8 bg-gray-100">
      <div ref={sketchRef} />
      <div>{JSON.stringify(board.grid)}</div>
    </div>
  );
};

export default P5Wrapper;

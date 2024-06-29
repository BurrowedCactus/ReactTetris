"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { getColorForPiece, getPieceShapes } from "./pieceShape";
import { useAppDispatch, useAppSelector } from "./../../../lib/hooks";
import { moveCurrentPiece } from "./../../../lib/features/current/currentThunk";
import p5 from "p5";

const P5Wrapper = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [sketchController, setController] = useState<p5 | null>(null);
  const board = useAppSelector((state) => state.board);
  const current = useAppSelector((state) => state.current);
  const next = useAppSelector((state) => state.next);
  // const [tick, setTick] = useState(0);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   // Initialize game when component mounts
  //   dispatch(initializeBoard());
  // }, []);

  useEffect(() => {
    let lastPos = 0;
    let tick = 0;
    const gameTick = () => {
      tick += 1;
      if (tick / 10 >= lastPos) {
        lastPos += 1;
        dispatch(moveCurrentPiece("down"));
      }
      // Update game state based on logic
    };

    const intervalId = setInterval(gameTick, 1000 / 60); // 10 FPS game tick
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [dispatch]);

  const drawCurrentPiece = useCallback(
    (p: p5, cellSize: number, grid: (typeof board)["grid"]) => {
      const color = getColorForPiece(current.type, current.row);
      const shape = getPieceShapes(current.type, current.orientation);

      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] !== " ") {
            const x = (current.column + j) * cellSize;
            const y =
              (grid.length - (current.row - i) - shape.length) * cellSize;
            p.fill(color);
            p.stroke(255); // White border for each block of the piece
            p.rect(x, y, cellSize, cellSize);
          }
        }
      }
    },
    [current],
  );

  const drawNextPieces = useCallback(
    (p: p5, cellSize: number, queue: string[]) => {
      const startX = board.grid[0].length * cellSize + 20; // Start drawing 20 pixels to the right of the board
      let startY = 20; // Start drawing 20 pixels from the top

      queue.slice(0, 5).forEach((type, index) => {
        const shapes = getPieceShapes(type, "up");
        const pieceSize = index === 0 ? cellSize * 1.2 : cellSize; // Increase size for the first piece
        const color = getColorForPiece(type, 0);

        p.fill(color);
        p.stroke(255); // White border for each block of the piece

        // Calculate height offset for each piece
        let pieceHeight = 0;
        shapes.forEach((row, i) => {
          for (let j = 0; j < row.length; j++) {
            if (row[j] !== " ") {
              const x = startX + j * pieceSize;
              const y = startY + i * pieceSize;
              p.rect(x, y, pieceSize, pieceSize);
              pieceHeight = Math.max(pieceHeight, i * pieceSize);
            }
          }
        });

        // Update startY for the next piece
        startY += pieceHeight + 10 + pieceSize; // Add spacing between pieces
      });
    },
    [board.grid],
  );

  const drawSketch = useCallback(
    (p: p5) => {
      p.background(0); // Set background to black
      const cellSize = 20; // Size of each cell
      const grid = board.grid; // Access the grid from Redux state
      const officialBoardHeight = 20; // Official game area height

      // Draw the border of the board
      p.stroke(255); // White color for the borders
      p.noFill();
      // p.rect(0, 0, cellSize * grid[0].length, cellSize * 40);
      p.rect(0, 0, cellSize * grid[0].length, cellSize * officialBoardHeight);
      p.rect(
        0,
        0,
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
          p.rect(col * cellSize, y, cellSize, cellSize);
        }
      }

      // Draw current piece
      drawCurrentPiece(p, cellSize, board.grid);
      drawNextPieces(p, cellSize, next.queue);
    },
    [board, drawCurrentPiece, drawNextPieces, next],
  ); // Dependency on the board state // Dependency on the board state

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
    <div>
      <div ref={sketchRef} />
      <div>{JSON.stringify(board.grid)}</div>
    </div>
  );
};

export default P5Wrapper;

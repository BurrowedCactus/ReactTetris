// features/current/currentThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store"; // adjust the path as necessary
import { move } from "./currentSlice";
import { getPieceShapes } from "./../../../app/game/components/pieceShape";

export const moveCurrentPiece = createAsyncThunk(
  "current/move",
  (direction: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { current, board } = state;

    // Calculate new position based on direction
    const { newRow, newColumn } = calculateNewPosition(current, direction);

    // Check if the move is valid
    if (isValidMove(current, board, newRow, newColumn)) {
      // Dispatch move action if valid
      dispatch(move({ row: newRow, column: newColumn }));
    } else {
      console.log("Move is not valid");
    }
  },
);

function calculateNewPosition(
  current: { row: number; column: number; type: string; orientation: string },
  direction: string,
) {
  let { row, column } = current;
  switch (direction) {
    case "down":
      row -= 1;
      break;
    case "left":
      column -= 1;
      break;
    case "right":
      column += 1;
      break;
  }
  return { newRow: row, newColumn: column };
}

// isValidMove should also consider the type of piece and its orientation for handling rotations and complex movements
function isValidMove(
  current: { row: number; column: number; type: string; orientation: string },
  board: RootState["board"],
  newRow: number,
  newColumn: number,
) {
  // out of boundary
  if (newRow < 0 || newColumn < 0 || newColumn >= 10) {
    return false;
  }
  // new shape has a location where it collides with old grid
  const shape = getPieceShapes(current.type, current.orientation);
  const shapeCoordinates = shape.map((str) => str.split(""));

  for (let i = 0; i < shape.length; ++i) {
    for (let j = 0; j < shape[i].length; ++j) {
      if (
        shapeCoordinates[i][j] !== " " &&
        board.grid[newRow + i][newColumn + j] !== " "
      ) {
        return false;
      }
    }
  }
  // validation passed
  return true;
}

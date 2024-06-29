// features/current/currentThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store"; // adjust the path as necessary
import { move, setCurrent } from "./currentSlice";
import { startLockDelay, clearLockDelay } from "./../lockDelay/lockDelaySlice";
import { getPieceShapes } from "./../../../app/game/components/pieceShape";
import { takeNextPiece } from "./../next/nextSlice";
import { writePieceToBoard, checkForLineClears } from "./../board/boardSlice";

export const moveCurrentPiece = createAsyncThunk(
  "current/move",
  (orientation: string, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { current, board, lockDelay } = state;

    // Calculate new position based on direction
    const { newRow, newColumn } = calculateNewPosition(current, orientation);

    // Check if the move is valid
    if (isValidMove(current, board, newRow, newColumn)) {
      // Dispatch move action if valid
      dispatch(move({ row: newRow, column: newColumn }));

      // Check for pieces directly below
      if (isTouchingBottomOrBlocked(current, board, newRow, newColumn)) {
        if (!lockDelay.isActive) {
          console.log("yes lock piece is going to run in 1 second");
          const timerId = window.setTimeout(() => {
            console.log("yes lock piece is called");
            dispatch(lockPiece());
          }, 1000); // set lock delay time
          dispatch(startLockDelay(timerId));
        }
      } else {
        if (lockDelay.isActive) {
          window.clearTimeout(lockDelay.timerId);
          dispatch(clearLockDelay());
        }
      }
    } else {
      console.log("Move is not valid");
    }
  },
);

export const lockPiece = createAsyncThunk(
  "game/lockPiece",
  async (_, { getState, dispatch }) => {
    console.log("yes lock piece is executed 1");
    const state = getState() as RootState;
    const { current, next } = state;

    console.log("yes lock piece is executed 2", { state });
    // Write current piece info into the board
    dispatch(writePieceToBoard(current));
    console.log("yes lock piece is executed 3", current);
    dispatch(checkForLineClears());

    console.log("yes lock piece is executed 4", next.queue);
    // Update the current piece to the first item in the next pieces queue
    if (next.queue.length > 0) {
      console.log("yes lock piece is executed 5");
      const nextPieceType = next.queue[0];
      console.log("yes lock piece is executed 6", nextPieceType);
      dispatch(setCurrent(nextPieceType));
      dispatch(takeNextPiece());
    }
  },
);

const calculateNewPosition = (
  current: { row: number; column: number; type: string; orientation: string },
  orientation: string,
) => {
  let { row, column } = current;
  switch (orientation) {
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
};

// isValidMove should also consider the type of piece and its orientation for handling rotations and complex movements
const isValidMove = (
  current: { row: number; column: number; type: string; orientation: string },
  board: RootState["board"],
  newRow: number,
  newColumn: number,
) => {
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
        board.grid[newRow + shape.length - i - 1][newColumn + j] !== " "
      ) {
        return false;
      }
    }
  }
  // validation passed
  return true;
};

const isTouchingBottomOrBlocked = (
  current: { row: number; column: number; type: string; orientation: string },
  board: RootState["board"],
  newRow: number,
  newColumn: number,
) => {
  // If moving down one more row is not valid, the piece is touching the bottom or another piece
  return !isValidMove(current, board, newRow - 1, newColumn);
};

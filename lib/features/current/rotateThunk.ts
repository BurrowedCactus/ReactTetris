import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";

import { isValidMove, calculateRotationResult } from "../../utils/pieceShape";

import { move } from "./currentSlice";
import { RotationDirection } from "@/types/directions";

export const rotateCurrentPiece = createAsyncThunk(
  "current/rotate",
  async (direction: RotationDirection, { getState, dispatch }) => {
    const { current, board } = getState() as RootState;
    const { type, orientation, row, column } = current;
    const { offsets, newOrientation } = calculateRotationResult(
      type,
      orientation,
      direction,
    );
    // Check if the rotation without wall kicks is valid
    offsets.some((offset) => {
      if (
        isValidMove(
          type,
          {
            newRow: row + offset[0],
            newColumn: column + offset[1],
            newOrientation: newOrientation,
          },
          board,
        )
      ) {
        console.log(
          "yes passed check move",
          row + offset[0],
          column + offset[1],
        );
        dispatch(
          move({
            row: row + offset[0],
            column: column + offset[1],
            orientation: newOrientation,
          }),
        );
        return true;
      }
      return false;
    });
  },
);

// // This is a utility function to dispatch the actual update, might be part of your slice reducers
// const updatePiecePosition = (payload) => ({
//   type: "current/updatePiece",
//   payload,
// });

// // Get the appropriate wall kick data based on the piece and its rotation states
// function getWallKickData(pieceType, currentOrientation, nextOrientation) {
//   // This should return an array of [dx, dy] adjustments based on the piece type and rotation states
//   return [[0, 0]]; // Placeholder, replace with actual data
// }

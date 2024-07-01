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
    const [rowOffset, columnOffset, newOrientation] = calculateRotationResult(
      type,
      orientation,
      direction,
    );
    // Check if the rotation without wall kicks is valid
    if (
      isValidMove(
        type,
        {
          newRow: row + rowOffset,
          newColumn: column + columnOffset,
          newOrientation: newOrientation,
        },
        board,
      )
    ) {
      dispatch(
        move({
          row: row + rowOffset,
          column: column + columnOffset,
          orientation: newOrientation,
        }),
      );
      return;
    }
    // // Apply wall kicks if the initial rotation is not valid
    // const wallKickData = getWallKickData(type, orientation, nextOrientation); // Define or import this function based on your piece data
    // for (const [dx, dy] of wallKickData) {
    //   if (
    //     isValidMove(
    //       type,
    //       {
    //         newRow: row + dy,
    //         newColumn: column + dx,
    //         newOrientation: nextOrientation,
    //       },
    //       board
    //     )
    //   ) {
    //     dispatch(
    //       updatePiecePosition({
    //         row: row + dy,
    //         column: column + dx,
    //         orientation: nextOrientation,
    //       })
    //     );
    //     return;
    //   }
    // }

    // console.error("No valid rotation found.");
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

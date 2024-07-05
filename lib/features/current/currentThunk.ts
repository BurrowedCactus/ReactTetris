// features/current/currentThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { move, setCurrent } from "./currentSlice";
import { startLockDelay, clearLockDelay } from "./../lockDelay/lockDelaySlice";
import { isValidMove } from "../../utils/pieceShape";
import { takeNextPiece } from "./../next/nextSlice";
import { writePieceToBoard, checkForLineClears } from "./../board/boardSlice";

import { Orientation, MoveDirection } from "@/types/directions";
import { PieceType } from "@/types/pieces";

export const moveCurrentPiece = createAsyncThunk(
  "current/move",
  (direction: MoveDirection, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { current, board, lockDelay } = state;

    // Calculate new position based on direction
    const { newRow, newColumn } = calculateNewPosition(current, direction);

    // Check if the move is valid
    if (
      isValidMove(
        current.type,
        { newRow, newColumn, newOrientation: current.orientation },
        board,
      )
    ) {
      // Dispatch move action if valid
      dispatch(
        move({
          row: newRow,
          column: newColumn,
          orientation: current.orientation,
        }),
      );
      // Check for pieces directly below
      if (
        !isValidMove(
          current.type,
          {
            newRow: newRow - 1,
            newColumn,
            newOrientation: current.orientation,
          },
          board,
        )
      ) {
        if (!lockDelay.isActive) {
          const timerId = window.setTimeout(() => {
            dispatch(dropCurrentPiece());
          }, 1000); // set lock delay time
          dispatch(startLockDelay(timerId));
        }
      } else {
        if (lockDelay.isActive) {
          window.clearTimeout(lockDelay.timerId);
          dispatch(clearLockDelay());
        }
      }
    }
  },
);

export const dropCurrentPiece = createAsyncThunk(
  "current/drop",
  (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { current, board } = state;

    // keeps moving the current piece downward until reaching obstacles
    let stoppingRow = current.row;
    while (true) {
      if (
        isValidMove(
          current.type,
          {
            newRow: stoppingRow - 1,
            newColumn: current.column,
            newOrientation: current.orientation,
          },
          board,
        )
      ) {
        stoppingRow -= 1;
      } else {
        dispatch(
          move({
            row: stoppingRow,
            column: current.column,
            orientation: current.orientation,
          }),
        );
        break;
      }
    }
    dispatch(lockCurrentPiece());
  },
);

export const lockCurrentPiece = createAsyncThunk(
  "game/lockCurrentPiece",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { current, next } = state;

    // Write current piece info into the board
    dispatch(writePieceToBoard(current));
    dispatch(checkForLineClears());

    // Update the current piece to the first item in the next pieces queue
    if (next.queue.length > 0) {
      const nextPieceType = next.queue[0];
      dispatch(setCurrent(nextPieceType));
      dispatch(takeNextPiece());
    }
  },
);

const calculateNewPosition = (
  current: {
    row: number;
    column: number;
    type: PieceType;
    orientation: Orientation;
  },
  direction: MoveDirection,
) => {
  let { row, column } = current;
  switch (direction) {
    case MoveDirection.DOWN:
      row -= 1;
      break;
    case MoveDirection.LEFT:
      column -= 1;
      break;
    case MoveDirection.RIGHT:
      column += 1;
      break;
  }
  return { newRow: row, newColumn: column };
};

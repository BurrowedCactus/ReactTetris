// features/current/currentThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { takeNextPiece } from "./../next/nextSlice";
import { PieceType } from "@/types/pieces";
import { setHold } from "./holdSlice";
import { setCurrent } from "../current/currentSlice";

export const holdPiece = createAsyncThunk(
  "hold/hold",
  (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { current, hold, next } = state;

    // if hold is empty, we place current to hold, and set current as the first item from the next pieces queue.
    if (hold.type === PieceType.EMPTY) {
      dispatch(setHold({ type: current.type }));
      if (next.queue.length > 0) {
        const nextPieceType = next.queue[0];
        dispatch(setCurrent(nextPieceType));
        dispatch(takeNextPiece());
      }
    } else {
      // if hold is not empty, we swap current with hold.
      const currentHoldType = hold.type;
      const currentType = current.type;
      dispatch(setCurrent(currentHoldType));
      dispatch(setHold({ type: currentType }));
    }
  },
);

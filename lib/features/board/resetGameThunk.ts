// features/current/currentThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../store"; // adjust the path as necessary
import { setCurrent } from "./../current/currentSlice";
import { refillQueue } from "./../next/nextSlice";
import { resetBoard } from "./../board/boardSlice";

export const resetGame = createAsyncThunk(
  "game/resetGame",
  async (_, { dispatch, getState }) => {
    // Reset the board
    dispatch(resetBoard());

    // Reinitialize the generator and refill the queue
    dispatch(refillQueue());

    // Get the state to check the updated queue
    const state = getState() as RootState;
    const { next } = state;

    // Set the first piece as the current one and refill the queue again
    if (next.queue.length > 0) {
      const firstPiece = next.queue[0];
      dispatch(setCurrent(firstPiece));
      dispatch(refillQueue());
    }
  },
);

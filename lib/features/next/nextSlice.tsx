import { PieceType } from "@/types/pieces";
import { createSlice } from "@reduxjs/toolkit";

function shuffleBag() {
  const pieces = [
    PieceType.I,
    PieceType.O,
    PieceType.S,
    PieceType.Z,
    PieceType.T,
    PieceType.J,
    PieceType.L,
  ];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

function generateDoubleBag() {
  return shuffleBag().concat(shuffleBag());
}

const initialState = {
  queue: generateDoubleBag(),
};

const nextSlice = createSlice({
  name: "next",
  initialState,
  reducers: {
    takeNextPiece: (state) => {
      state.queue.shift(); // This will remove the first element in the queue
      // Refill the queue if necessary
      if (state.queue.length < 7) {
        state.queue = state.queue.concat(shuffleBag());
      }
    },
    refillQueue: (state) => {
      if (state.queue.length < 7) {
        state.queue = state.queue.concat(shuffleBag());
      }
    },
  },
});

export const { takeNextPiece, refillQueue } = nextSlice.actions;

export default nextSlice.reducer;

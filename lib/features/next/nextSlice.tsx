import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of the next
const initialState = {
  queue: [] as string[],
};

function* generate7Bag() {
  const pieces = ["i", "o", "s", "z", "t", "j", "l"];

  while (true) {
    // Fisher-Yates Shuffle Algorithm
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
    }

    for (const piece of pieces) {
      yield piece;
    }
  }
}

const pieceGenerator = generate7Bag();

const nextSlice = createSlice({
  name: "next",
  initialState,
  reducers: {
    refillQueue: (state) => {
      while (state.queue.length < 5) {
        const newPiece = pieceGenerator.next().value;
        if (newPiece) {
          state.queue.push(newPiece);
        }
      }
    },
    pieceLocked: {
      reducer: (state) => {
        return state;
      },
      prepare: () => {
        return { meta: "", error: "", payload: 2 };
      },
    },
  },
});

export const { refillQueue } = nextSlice.actions;
export { pieceGenerator };

export default nextSlice.reducer;

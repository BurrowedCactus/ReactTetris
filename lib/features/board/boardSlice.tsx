import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of the board
const initialState = {
  grid: [] as string[][], // This would be a 2D array representing the Tetris grid
  gameStatus: "idle", // Status could be 'idle', 'running', 'paused', 'over'
  score: 0,
  level: 1,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    resetBoard: (state) => {
      // Logic to initialize or reset the board
      state.grid = createInitialGrid();
      state.score = 0;
      state.level = 1;
      state.gameStatus = "idle";
    },
    updateBoard: () => {
      // handle updating the board
    },
    // Additional reducers for game logic such as moving pieces, clearing lines, etc.
  },
});

// Utility function to create an empty grid
function createInitialGrid() {
  return Array.from({ length: 20 }, () => Array(10).fill(""));
}

export const { resetBoard } = boardSlice.actions;

export default boardSlice.reducer;

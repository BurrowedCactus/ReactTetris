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
  const arr = Array.from({ length: 25 }, () => Array(10).fill(" "));
  arr[0] = [" ", "i", "i", "i", "i", " ", " ", " ", "l", "l"];
  arr[1] = [" ", " ", "t", "t", "t", " ", " ", " ", "l", " "];
  arr[2] = [" ", " ", " ", "t", " ", " ", " ", " ", "l", " "];
  arr[3] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  arr[4] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  arr[5] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  arr[6] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  arr[7] = [" ", " ", " ", " ", "j", " ", " ", " ", " ", " "];
  arr[8] = [" ", " ", " ", " ", "j", " ", " ", " ", " ", " "];
  arr[9] = [" ", " ", " ", " ", "j", "j", " ", " ", " ", " "];
  return arr;
}

export const { resetBoard } = boardSlice.actions;

export default boardSlice.reducer;

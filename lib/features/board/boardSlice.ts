import { getPieceShapes } from "@/app/game/components/pieceShape";
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
    writePieceToBoard: (state, action) => {
      const { row, column, type, orientation } = action.payload;
      const shape = getPieceShapes(type, orientation);
      const newGrid = state.grid.map((innerArray) => [...innerArray]);
      for (let i = 0; i < shape.length; ++i) {
        for (let j = 0; j < shape[i].length; ++j) {
          // Only overwrite empty (' ') cells to avoid destroying parts of other pieces.
          // This ensures that if a piece like 'S' is dropped on a 'J', the top of the 'J' that
          // does not overlap with 'S' remains visible. This check prevents the new piece
          // from overwriting non-empty parts of the grid, preserving the visible parts of
          // underlying pieces that are not directly covered by the new piece.
          if (newGrid[row + shape.length - i - 1][column + j] === " ") {
            newGrid[row + shape.length - i - 1][column + j] = shape[i][j];
          }
        }
      }
      return { ...state, grid: newGrid };
      // handle updating the board
    },
    checkForLineClears: (state) => {
      const newGrid = state.grid.filter(
        (row) => !row.every((col) => col !== " "),
      );
      const newGridWithSpace = [
        ...newGrid,
        Array(10).fill(" "),
        Array(10).fill(" "),
        Array(10).fill(" "),
        Array(10).fill(" "),
      ].slice(0, 25);
      return { ...state, grid: newGridWithSpace };
    },
    // Additional reducers for game logic such as moving pieces, clearing lines, etc.
  },
});

// Utility function to create an empty grid
function createInitialGrid() {
  const arr = Array.from({ length: 25 }, () => Array(10).fill(" "));
  arr[0] = ["i", "i", "i", "i", "i", "t", "t", "t", "l", " "];
  arr[1] = [" ", " ", "t", "t", "t", " ", "t", " ", "l", " "];
  arr[2] = [" ", " ", " ", "t", " ", " ", " ", " ", "l", " "];
  arr[3] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  arr[4] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  arr[5] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  arr[6] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  arr[7] = [" ", " ", " ", "j", " ", " ", " ", " ", " ", " "];
  arr[8] = [" ", " ", " ", "j", " ", " ", " ", " ", " ", " "];
  arr[9] = [" ", " ", " ", "j", "j", " ", " ", " ", " ", " "];
  // arr[0] = [" ", "i", "i", "i", "i", " ", " ", " ", "l", "l"];
  // arr[1] = [" ", " ", "t", "t", "t", " ", " ", " ", "l", " "];
  // arr[2] = [" ", " ", " ", "t", " ", " ", " ", " ", "l", " "];
  // arr[3] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  // arr[4] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  // arr[5] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  // arr[6] = [" ", " ", " ", "i", " ", " ", " ", " ", " ", " "];
  // arr[7] = [" ", " ", " ", " ", "j", " ", " ", " ", " ", " "];
  // arr[8] = [" ", " ", " ", " ", "j", " ", " ", " ", " ", " "];
  // arr[9] = [" ", " ", " ", " ", "j", "j", " ", " ", " ", " "];
  return arr;
}

export const { resetBoard, writePieceToBoard, checkForLineClears } =
  boardSlice.actions;

export default boardSlice.reducer;

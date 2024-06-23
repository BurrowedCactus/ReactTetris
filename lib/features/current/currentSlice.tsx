import { createSlice } from "@reduxjs/toolkit";
// import { getNext } from "../next/nextSlice";

// Define the initial state of the current
const initialState = {
  row: 21,
  column: 5,
  type: "j",
  orientation: "up",
};

const currentSlice = createSlice({
  name: "current",
  initialState,
  reducers: {
    hardDrop: (state) => {
      return state;
    },
    move: (state, action) => {
      return {
        ...state,
        row: action.payload.row,
        column: action.payload.column,
      };
      // handle tetromino movement
    },
    rotate: (state) => {
      return state;
      // handle tetromino rotation
    },
    setCurrent: (_, action) => {
      return {
        row: 20,
        column: 0,
        type: action.payload,
        orientation: "up",
      };
    },
  },
});

export const { hardDrop, move, rotate, setCurrent } = currentSlice.actions;

export default currentSlice.reducer;

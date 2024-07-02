import { PieceType } from "@/types/pieces";
import { Orientation } from "@/types/directions";
import { createSlice } from "@reduxjs/toolkit";
// import { getNext } from "../next/nextSlice";

// Define the initial state of the current
const initialState = {
  //row: 21,
  row: 10,
  column: 5,
  type: PieceType.J,
  orientation: Orientation.UP,
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
        orientation: action.payload.orientation,
      };
      // handle tetromino movement
    },
    setCurrent: (_, action) => {
      return {
        row: 20,
        column: action.payload === PieceType.O ? 4 : 3,
        type: action.payload,
        orientation: Orientation.UP,
      };
    },
  },
});

export const { hardDrop, move, setCurrent } = currentSlice.actions;

export default currentSlice.reducer;

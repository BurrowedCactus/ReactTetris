import { PieceType } from "@/types/pieces";
import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of the hold
const initialState = {
  type: PieceType.EMPTY,
};

const holdSlice = createSlice({
  name: "hold",
  initialState,
  reducers: {
    setHold: (state, action: { payload: { type: PieceType } }) => {
      return {
        ...state,
        type: action.payload.type,
      };
      // handle tetromino movement
    },
  },
});

export const { setHold } = holdSlice.actions;

export default holdSlice.reducer;

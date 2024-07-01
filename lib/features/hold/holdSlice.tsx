import { createSlice } from "@reduxjs/toolkit";
// import { getNext } from "../next/nextSlice";

// Define the initial state of the hold
const initialState = {
  type: "j",
};

const holdSlice = createSlice({
  name: "hold",
  initialState,
  reducers: {
    setHold: (state, action) => {
      return {
        ...state,
        type: action.type,
      };
      // handle tetromino movement
    },
  },
});

export const { setHold } = holdSlice.actions;

export default holdSlice.reducer;

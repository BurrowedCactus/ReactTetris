import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of the board
const initialState = {
  isActive: false,
  timerId: 0,
  lockDelay: 1000,
};

const lockDelaySlice = createSlice({
  name: "lockDelay",
  initialState,
  reducers: {
    startLockDelay: (state, action) => {
      return { ...initialState, isActive: true, timerId: action.payload };
    },
    clearLockDelay: () => {
      return { ...initialState, isActive: false, timerId: 0 };
    },
    // Additional reducers for game logic such as moving pieces, clearing lines, etc.
  },
});

export const { startLockDelay, clearLockDelay } = lockDelaySlice.actions;

export default lockDelaySlice.reducer;

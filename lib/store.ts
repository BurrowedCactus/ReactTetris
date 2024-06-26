import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./features/board/boardSlice";
import currentSlice from "./features/current/currentSlice";
import nextSlice from "./features/next/nextSlice";
import lockDelaySlice from "./features/lockDelay/lockDelaySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      board: boardSlice,
      current: currentSlice,
      next: nextSlice,
      lockDelay: lockDelaySlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

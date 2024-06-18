import { configureStore } from "@reduxjs/toolkit";
import boardSlice from "./features/board/boardSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      board: boardSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import boardSlice from "./features/board/boardSlice";
import currentSlice from "./features/current/currentSlice";
import nextSlice from "./features/next/nextSlice";
import lockDelaySlice from "./features/lockDelay/lockDelaySlice";
import holdSlice from "./features/hold/holdSlice";

const rootReducer = combineReducers({
  board: boardSlice,
  current: currentSlice,
  next: nextSlice,
  lockDelay: lockDelaySlice,
  hold: holdSlice,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState,
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

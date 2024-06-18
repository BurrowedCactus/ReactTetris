"use client";

import dynamic from "next/dynamic";
import StoreProvider from "../StoreProvider";
const P5Wrapper = dynamic(() => import("./components/P5Wrapper"), {
  ssr: false,
});

const Game = () => {
  return (
    <StoreProvider>
      <P5Wrapper />
    </StoreProvider>
  );
};

export default Game;

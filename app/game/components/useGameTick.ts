import { useEffect } from "react";
import { useAppDispatch } from "./../../../lib/hooks";
import { moveCurrentPiece } from "./../../../lib/features/current/currentThunk";
import { MoveDirection } from "@/types/directions";

const useGameTick = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    let lastPos = 0;
    let tick = 0;
    const intervalId = setInterval(() => {
      tick += 1;
      if (tick / 10 >= lastPos) {
        lastPos += 1;
        dispatch(moveCurrentPiece(MoveDirection.DOWN));
      }
    }, 1000 / 2); // 10 FPS game tick
    return () => clearInterval(intervalId);
  }, [dispatch]);
};

export { useGameTick };

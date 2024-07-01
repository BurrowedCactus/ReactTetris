import { useEffect, useState } from "react";
import { useAppDispatch } from "./../../../lib/hooks";
import { moveCurrentPiece } from "./../../../lib/features/current/currentThunk";
import { rotateCurrentPiece } from "./../../../lib/features/current/rotateThunk";
import { MoveDirection, RotationDirection } from "@/types/directions";

const useTetrisControls = () => {
  const [keyPressed, setKeyPressed] = useState({
    left: false,
    right: false,
    hold: 0,
    hardDrop: 0,
    down: false,
    cw: false,
    ccw: false,
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "w":
          //   dispatch(setHold())
          break;
        case "a":
          dispatch(moveCurrentPiece(MoveDirection.LEFT));
          setKeyPressed((prev) => ({ ...prev, left: true }));
          break;
        case "s":
          dispatch(moveCurrentPiece(MoveDirection.DOWN));
          setKeyPressed((prev) => ({ ...prev, down: true }));
          break;
        case "d":
          dispatch(moveCurrentPiece(MoveDirection.RIGHT));
          setKeyPressed((prev) => ({ ...prev, right: true }));
          break;
        case "j":
          dispatch(rotateCurrentPiece(RotationDirection.COUNTER_CLOCKWISE));
          setKeyPressed((prev) => ({ ...prev, ccw: true }));
          break;
        case "k":
          dispatch(rotateCurrentPiece(RotationDirection.CLOCKWISE));
          setKeyPressed((prev) => ({ ...prev, cw: true }));
          break;
        case " ":
          //   dispatch(setHold())
          //   setKeyPressed((prev) => ({ ...prev, hardDrop: prev.hardDrop + 1 }));
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case "a":
          setKeyPressed((prev) => ({ ...prev, left: false }));
          break;
        case "s":
          setKeyPressed((prev) => ({ ...prev, down: false }));
          break;
        case "d":
          setKeyPressed((prev) => ({ ...prev, right: false }));
          break;
        case "j":
          setKeyPressed((prev) => ({ ...prev, ccw: false }));
          break;
        case "k":
          setKeyPressed((prev) => ({ ...prev, cw: false }));
          break;
        case "w":
        case " ":
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  useEffect(() => {
    let moveTimeout: NodeJS.Timeout | undefined;
    let moveInterval: NodeJS.Timeout | undefined;
    const dasDelay = 200; // milliseconds before auto-repeat starts
    const arrSpeed = 50; // milliseconds between moves once auto-repeat starts

    // Function to setup DAS and ARR
    const setupMovement = (direction: "left" | "right" | "down") => {
      moveTimeout = setTimeout(() => {
        // Setup the initial delay
        moveInterval = setInterval(() => {
          // Setup the auto-repeat interval
          dispatch(moveCurrentPiece(direction));
        }, arrSpeed);
      }, dasDelay);
    };

    // Determine the effective direction or null if conflicting
    const effectiveDirection =
      keyPressed.right === keyPressed.left
        ? null
        : keyPressed.right
          ? "right"
          : keyPressed.left
            ? "left"
            : keyPressed.down
              ? "down"
              : null;

    if (effectiveDirection) {
      setupMovement(effectiveDirection);
    }

    return () => {
      if (moveTimeout) {
        clearTimeout(moveTimeout); // Clear the timeout when the component unmounts or dependencies change
      }
      if (moveInterval) {
        clearInterval(moveInterval); // Clear the interval as well
      }
    };
  }, [keyPressed.left, keyPressed.right, keyPressed.down, dispatch]); // Dependencies for the effect

  return null; // This hook doesn't need to return anything
};

export { useTetrisControls };

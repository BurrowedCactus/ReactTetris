"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { useAppSelector } from "./../../../lib/hooks";
// import { resetBoard } from "./../../../lib/features/board/boardSlice";
import p5 from "p5";

const P5Wrapper = () => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [sketchController, setController] = useState<p5 | null>(null);
  const board = useAppSelector((state) => state.board);
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   // Initialize game when component mounts
  //   dispatch(initializeBoard());
  // }, []);

  const drawSketch = useCallback(
    (p: p5) => {
      p.background(0);
      // p.translate(position.x, position.y);
      // p.rotate(rotation);
      p.rect(-25, -25, 50, 50); // Centered rectangle
      p.rect(-25, -25, board.score, 50); // Centered rectangle
    },
    [board],
  ); // Dependencies on Redux state

  useEffect(() => {
    if (sketchRef.current) {
      const sketch = (p) => {
        p.setup = () => {
          p.createCanvas(400, 400);
          p.noLoop(); // Disable continuous looping
        };

        p.draw = () => {
          drawSketch(p); // Use the callback in the draw function
        };
      };

      const myP5 = new p5(sketch, sketchRef.current);

      setController(myP5);

      return () => {
        setController(null);
        myP5.remove();
      };
    }
  }, [drawSketch]);

  useEffect(() => {
    if (sketchController) {
      sketchController.redraw();
    }
  }, [sketchController, drawSketch]); // Redraw when dependencies change

  return <div ref={sketchRef} />;
};

export default P5Wrapper;

"use client";

import {
  getColorForPiece,
  getPieceShapes,
} from "../../../lib/utils/pieceShape";
import p5 from "p5";
import { PieceType } from "@/types/pieces";
import { Orientation } from "@/types/directions";

const drawTetrisPiece = (params: {
  p: p5;
  type: PieceType;
  orientation: Orientation;
  canvasX: number;
  canvasY: number;
  cellSize: number;
}) => {
  const { p, type, orientation, canvasX, canvasY, cellSize } = params;
  const color = getColorForPiece(type);
  const shape = getPieceShapes(type, orientation);
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell !== PieceType.EMPTY) {
        const x = canvasX + colIndex * cellSize;
        const y = canvasY - rowIndex * cellSize;
        p.fill(color);
        p.stroke(255); // White border for better visibility
        p.rect(x, y, cellSize, cellSize);
      }
    });
  });
};

export default drawTetrisPiece;

import { RootState } from "../store";
import { Orientation, RotationDirection } from "@/types/directions";
import { BlockType } from "@/types/blocks";

// Function to map piece types to colors
const getColorForPiece = (type: BlockType, row: number) => {
  if (row < 0) {
    return "#202020";
  }
  switch (type) {
    case BlockType.I:
      return "#00ffff"; // Cyan for "I" piece
    case BlockType.J:
      return "#0000ff"; // Blue for "J" piece
    case BlockType.L:
      return "#ffa500"; // Orange for "L" piece
    case BlockType.O:
      return "#ffff00"; // Yellow for "O" piece
    case BlockType.S:
      return "#00ff00"; // Green for "S" piece
    case BlockType.T:
      return "#800080"; // Purple for "T" piece
    case BlockType.Z:
      return "#ff0000"; // Red for "Z" piece
    case BlockType.EMPTY:
    default:
      return "#202020"; // Dark grey for empty space to indicate less focus
  }
};

// Function to get shapes based on the piece type and orientation
// remember that in tetris grid, [0,0] is the bottom left cornor,
// for example, for faced up t tetromino, "ttt" is at the bottom, and " t " at the top.
const getPieceShapes = (
  type: BlockType,
  orientation: Orientation,
): string[] => {
  switch (type) {
    case BlockType.I:
      switch (orientation) {
        case Orientation.UP:
        case Orientation.DOWN:
          return ["iiii"];
        case Orientation.LEFT:
        case Orientation.RIGHT:
          return ["i", "i", "i", "i"];
      }
      break;
    case BlockType.O:
      return ["oo", "oo"];
    case BlockType.T:
      switch (orientation) {
        case Orientation.UP:
          return ["ttt", " t "];
        case Orientation.DOWN:
          return [" t ", "ttt"];
        case Orientation.LEFT:
          return [" t", "tt", " t"];
        case Orientation.RIGHT:
          return ["t ", "tt", "t "];
      }
      break;
    case BlockType.S:
      switch (orientation) {
        case Orientation.UP:
        case Orientation.DOWN:
          return ["ss ", " ss"];
        case Orientation.LEFT:
        case Orientation.RIGHT:
          return [" s", "ss", "s "];
      }
      break;
    case BlockType.Z:
      switch (orientation) {
        case Orientation.UP:
        case Orientation.DOWN:
          return [" zz", "zz "];
        case Orientation.LEFT:
        case Orientation.RIGHT:
          return ["z ", "zz", " z"];
      }
      break;
    case BlockType.J:
      switch (orientation) {
        case Orientation.UP:
          return ["jjj", "j  "];
        case Orientation.DOWN:
          return ["  j", "jjj"];
        case Orientation.LEFT:
          return ["jj", " j", " j"];
        case Orientation.RIGHT:
          return ["j ", "j ", "jj"];
      }
      break;
    case BlockType.L:
      switch (orientation) {
        case Orientation.UP:
          return ["lll", "  l"];
        case Orientation.DOWN:
          return ["l  ", "lll"];
        case Orientation.LEFT:
          return [" l", " l", "ll"];
        case Orientation.RIGHT:
          return ["ll", "l ", "l "];
      }
      break;
    default:
      throw new Error("Invalid piece type or orientation");
  }
  return [];
};

type RotationOffset = [number, number];
type RotationOffsetsMap = {
  [key in BlockType]: [
    RotationOffset,
    RotationOffset,
    RotationOffset,
    RotationOffset,
  ];
};
type RotationResult = [number, number, Orientation];

const rotationOffsets: RotationOffsetsMap = {
  [BlockType.I]: [
    [-2, 2], // UP to RIGHT
    [1, -2], // RIGHT to DOWN
    [-1, 1], // DOWN to LEFT
    [2, -1], // LEFT to UP
  ],
  [BlockType.J]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [BlockType.L]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [BlockType.O]: [
    [0, 0], // UP to RIGHT
    [0, 0], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [0, 0], // LEFT to UP
  ],
  [BlockType.S]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [BlockType.T]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [BlockType.Z]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [BlockType.EMPTY]: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
};

const getRotationOffsets = (
  type: BlockType,
  currentOrientation: Orientation,
  direction: RotationDirection,
): RotationOffset => {
  const orientations = [
    Orientation.UP,
    Orientation.RIGHT,
    Orientation.DOWN,
    Orientation.LEFT,
  ];
  const index = orientations.indexOf(currentOrientation);
  switch (direction) {
    case RotationDirection.CLOCKWISE:
      return rotationOffsets[type][index];
    case RotationDirection.COUNTER_CLOCKWISE:
    default:
      const newIndex = (4 + index - 1) % 4;
      return rotationOffsets[type][newIndex].map(
        (offset) => 0 - offset,
      ) as RotationOffset;
  }
};

const getNewOrientation = (
  currentOrientation: Orientation,
  direction: RotationDirection,
): Orientation => {
  const orientations = [
    Orientation.UP,
    Orientation.RIGHT,
    Orientation.DOWN,
    Orientation.LEFT,
  ];
  const index = orientations.indexOf(currentOrientation);
  const newIndex =
    (index + (direction === RotationDirection.CLOCKWISE ? 1 : -1) + 4) % 4;
  return orientations[newIndex];
};

const calculateRotationResult = (
  type: BlockType,
  currentOrientation: Orientation,
  direction: RotationDirection,
): RotationResult => {
  const offsets = getRotationOffsets(type, currentOrientation, direction);
  const newOrientation = getNewOrientation(currentOrientation, direction);
  return [...offsets, newOrientation];
};

// isValidMove will consider the type of piece and its orientation for handling rotations and complex movements
const isValidMove = (
  pieceType: BlockType,
  newLocation: {
    newRow: number;
    newColumn: number;
    newOrientation: Orientation;
  },
  board: RootState["board"],
) => {
  const { newRow, newColumn, newOrientation } = newLocation;
  // out of boundary
  if (newRow < 0 || newColumn < 0 || newColumn >= 10) {
    return false;
  }
  // new shape has a location where it collides with old grid
  const shape = getPieceShapes(pieceType, newOrientation);
  const shapeCoordinates = shape.map((str) => str.split(""));

  for (let i = 0; i < shape.length; ++i) {
    for (let j = 0; j < shape[i].length; ++j) {
      if (
        shapeCoordinates[i][j] !== " " &&
        board.grid[newRow + i][newColumn + j] !== " "
      ) {
        return false;
      }
    }
  }
  // validation passed
  return true;
};

const isTouchingBottomOrBlocked = (
  pieceType: BlockType,
  newLocation: {
    newRow: number;
    newColumn: number;
    newOrientation: Orientation;
  },
  board: RootState["board"],
): boolean => {
  return !isValidMove(
    pieceType,
    {
      newRow: newLocation.newRow - 1,
      newColumn: newLocation.newColumn,
      newOrientation: newLocation.newOrientation,
    },
    board,
  );
};

export {
  getColorForPiece,
  getPieceShapes,
  isValidMove,
  isTouchingBottomOrBlocked,
  calculateRotationResult,
};

import { RootState } from "../store";
import { Orientation, RotationDirection } from "@/types/directions";
import { PieceType } from "@/types/pieces";

// Function to map piece types to colors
const getColorForPiece = (type: PieceType, row?: number) => {
  if (row !== undefined && row < 0) {
    return "#202020";
  }
  switch (type) {
    case PieceType.I:
      return "#00ffff"; // Cyan for "I" piece
    case PieceType.J:
      return "#0000ff"; // Blue for "J" piece
    case PieceType.L:
      return "#ffa500"; // Orange for "L" piece
    case PieceType.O:
      return "#ffff00"; // Yellow for "O" piece
    case PieceType.S:
      return "#00ff00"; // Green for "S" piece
    case PieceType.T:
      return "#800080"; // Purple for "T" piece
    case PieceType.Z:
      return "#ff0000"; // Red for "Z" piece
    case PieceType.EMPTY:
    default:
      return "#202020"; // Dark grey for empty space to indicate less focus
  }
};

// Function to get shapes based on the piece type and orientation
// remember that in tetris grid, [0,0] is the bottom left cornor,
// for example, for faced up t tetromino, [T,T,T] is at the bottom, and [_,T,_] at the top,
// and will be represented as [[T,T,T],[_,T,_]]
const { I, J, L, O, S, T, Z, EMPTY: _ } = PieceType;
const getPieceShapes = (
  type: PieceType,
  orientation: Orientation,
): PieceType[][] => {
  switch (type) {
    case I:
      switch (orientation) {
        case Orientation.UP:
        case Orientation.DOWN:
          return [[I, I, I, I]];
        case Orientation.LEFT:
        case Orientation.RIGHT:
          return [[I], [I], [I], [I]];
      }
    case O:
      return [
        [O, O],
        [O, O],
      ];
    case T:
      switch (orientation) {
        case Orientation.UP:
          return [
            [T, T, T],
            [_, T, _],
          ];
        case Orientation.DOWN:
          return [
            [_, T, _],
            [T, T, T],
          ];
        case Orientation.LEFT:
          return [
            [_, T],
            [T, T],
            [_, T],
          ];
        case Orientation.RIGHT:
          return [
            [T, _],
            [T, T],
            [T, _],
          ];
      }
    case S:
      switch (orientation) {
        case Orientation.UP:
        case Orientation.DOWN:
          return [
            [S, S, _],
            [_, S, S],
          ];
        case Orientation.LEFT:
        case Orientation.RIGHT:
          return [
            [_, S],
            [S, S],
            [S, _],
          ];
      }
    case Z:
      switch (orientation) {
        case Orientation.UP:
        case Orientation.DOWN:
          return [
            [_, Z, Z],
            [Z, Z, _],
          ];
        case Orientation.LEFT:
        case Orientation.RIGHT:
          return [
            [Z, _],
            [Z, Z],
            [_, Z],
          ];
      }
    case J:
      switch (orientation) {
        case Orientation.UP:
          return [
            [J, J, J],
            [J, _, _],
          ];
        case Orientation.DOWN:
          return [
            [_, _, J],
            [J, J, J],
          ];
        case Orientation.LEFT:
          return [
            [J, J],
            [_, J],
            [_, J],
          ];
        case Orientation.RIGHT:
          return [
            [J, _],
            [J, _],
            [J, J],
          ];
      }
    case L:
      switch (orientation) {
        case Orientation.UP:
          return [
            [L, L, L],
            [_, _, L],
          ];
        case Orientation.DOWN:
          return [
            [L, _, _],
            [L, L, L],
          ];
        case Orientation.LEFT:
          return [
            [_, L],
            [_, L],
            [L, L],
          ];
        case Orientation.RIGHT:
          return [
            [L, L],
            [L, _],
            [L, _],
          ];
      }
    case _:
      return [];
  }
};

type RotationOffset = [number, number];
type RotationOffsetsMap = {
  [key in PieceType]: [
    RotationOffset,
    RotationOffset,
    RotationOffset,
    RotationOffset,
  ];
};
type RotationResult = {
  offsets: [number, number][];
  newOrientation: Orientation;
};

const rotationOffsets: RotationOffsetsMap = {
  [PieceType.I]: [
    [-2, 2], // UP to RIGHT
    [1, -2], // RIGHT to DOWN
    [-1, 1], // DOWN to LEFT
    [2, -1], // LEFT to UP
  ],
  [PieceType.J]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [PieceType.L]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [PieceType.O]: [
    [0, 0], // UP to RIGHT
    [0, 0], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [0, 0], // LEFT to UP
  ],
  [PieceType.S]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [PieceType.T]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [PieceType.Z]: [
    [-1, 1], // UP to RIGHT
    [0, -1], // RIGHT to DOWN
    [0, 0], // DOWN to LEFT
    [1, 0], // LEFT to UP
  ],
  [PieceType.EMPTY]: [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ],
};

const getRotationOffsets = (
  type: PieceType,
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

const getWallKickTable = () => {
  // https://tetris.wiki/Super_Rotation_System
  // this cannot be used directly. here (x, y) means move right x unit and up y unit.
  // however in the code base, the representation is (a, b), and a means height and b means column.
  // if official table says [+1, +2], it means 1 unit right and 2 unit up, and therefore (2, 1) in this code base.
  // prettier-ignore
  const wallKickTable = {
    [PieceType.T]: {
      [`${Orientation.UP}+${RotationDirection.CLOCKWISE}`]:            [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
      [`${Orientation.RIGHT}+${RotationDirection.COUNTER_CLOCKWISE}`]: [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
      [`${Orientation.RIGHT}+${RotationDirection.CLOCKWISE}`]:         [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
      [`${Orientation.DOWN}+${RotationDirection.COUNTER_CLOCKWISE}`]:  [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
      [`${Orientation.DOWN}+${RotationDirection.CLOCKWISE}`]:          [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
      [`${Orientation.LEFT}+${RotationDirection.COUNTER_CLOCKWISE}`]:  [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
      [`${Orientation.LEFT}+${RotationDirection.CLOCKWISE}`]:          [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
      [`${Orientation.UP}+${RotationDirection.COUNTER_CLOCKWISE}`]:    [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
    },
    [PieceType.I]: {
      [`${Orientation.UP}+${RotationDirection.CLOCKWISE}`]:            [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
      [`${Orientation.RIGHT}+${RotationDirection.COUNTER_CLOCKWISE}`]: [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
      [`${Orientation.RIGHT}+${RotationDirection.CLOCKWISE}`]:         [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
      [`${Orientation.DOWN}+${RotationDirection.COUNTER_CLOCKWISE}`]:  [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
      [`${Orientation.DOWN}+${RotationDirection.CLOCKWISE}`]:          [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
      [`${Orientation.LEFT}+${RotationDirection.COUNTER_CLOCKWISE}`]:  [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
      [`${Orientation.LEFT}+${RotationDirection.CLOCKWISE}`]:          [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
      [`${Orientation.UP}+${RotationDirection.COUNTER_CLOCKWISE}`]:    [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
    }
  }
  // Repeat for L, S, T, Z following the pattern

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedTable: any = {};
  // Iterate through each piece type in the wall kick table
  Object.entries(wallKickTable).forEach(([pieceType, orientationData]) => {
    formattedTable[pieceType] = {};

    // Iterate through each orientation and rotation direction
    Object.entries(orientationData).forEach(([key, kickData]) => {
      // For each set of kick data, create a new array where y is negated
      formattedTable[pieceType][key] = kickData.map(([x, y]) => [y, x]);
    });
  });

  return formattedTable as Record<
    PieceType,
    Record<
      string,
      [RotationOffset, RotationOffset, RotationOffset, RotationOffset]
    >
  >;
};

const getWallKickData = (
  type: PieceType,
  currentOrientation: Orientation,
  direction: RotationDirection,
): RotationOffset[] => {
  switch (type) {
    case PieceType.I:
      return getWallKickTable()[PieceType.I][
        `${currentOrientation}+${direction}`
      ] as RotationOffset[];
    case PieceType.J:
    case PieceType.L:
    case PieceType.S:
    case PieceType.Z:
    case PieceType.T:
      return getWallKickTable()[PieceType.T][
        `${currentOrientation}+${direction}`
      ] as RotationOffset[];
    case PieceType.EMPTY:
    case PieceType.O:
    default:
      return [];
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
  type: PieceType,
  currentOrientation: Orientation,
  direction: RotationDirection,
): RotationResult => {
  const defaultOffset = getRotationOffsets(type, currentOrientation, direction);
  const wallKicksOffsets = getWallKickData(type, currentOrientation, direction);

  // Calculate new offsets including wall kicks
  const combinedOffsets = wallKicksOffsets.map((kick) => [
    defaultOffset[0] + kick[0],
    defaultOffset[1] + kick[1],
  ]) as RotationOffset[];
  const newOrientation = getNewOrientation(currentOrientation, direction);
  return {
    offsets: combinedOffsets,
    newOrientation,
  };
};

// isValidMove will consider the type of piece and its orientation for handling rotations and complex movements
const isValidMove = (
  pieceType: PieceType,
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

  for (let i = 0; i < shape.length; ++i) {
    for (let j = 0; j < shape[i].length; ++j) {
      if (
        shape[i][j] !== " " &&
        board.grid[newRow + i][newColumn + j] !== " "
      ) {
        return false;
      }
    }
  }
  // validation passed
  return true;
};

export {
  getColorForPiece,
  getPieceShapes,
  isValidMove,
  calculateRotationResult,
};

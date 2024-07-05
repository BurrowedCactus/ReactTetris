import { setupStore } from "@/lib/store";
import { Orientation } from "@/types/directions";
import { RotationDirection } from "@/types/directions";
import { PieceType } from "@/types/pieces";
import { rotateCurrentPiece } from "../rotateThunk";
import { lockCurrentPiece } from "../currentThunk";

const { I, J, L, O, S, T, Z, EMPTY: _ } = PieceType;
const nextQueue = [Z, J, O, I, S, T, L, J, O, T, I, S, Z];
const testCases = [
  {
    title: "rotate piece no line clear",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [_, _, _, _, _, _, _, _, _, _],
          ...Array(25).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 2,
        column: 1,
        orientation: Orientation.UP,
        type: PieceType.T,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [
      rotateCurrentPiece(RotationDirection.CLOCKWISE),
      lockCurrentPiece(),
    ],
    result: {
      board: {
        grid: [
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, T, _, _, _, _, _, _, _],
          [_, _, T, T, _, _, _, _, _, _],
          [_, _, T, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },
  {
    title: "before any rotation",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, I, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, I, _, _, _, I, I, I],
          [_, _, _, _, _, _, I, I, I, I],

          [_, _, _, _, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 4,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.J,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [lockCurrentPiece()],
    result: {
      board: {
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, I, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, I, _, _, _, I, I, I],
          [_, _, _, J, J, J, I, I, I, I],

          [_, _, _, J, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },
  {
    title: "default rotation Up to Left test 1",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, I, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, _, _, _, _, I, I, I],
          [_, _, _, _, _, _, I, I, I, I],

          [_, _, _, _, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 4,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.J,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [
      rotateCurrentPiece(RotationDirection.COUNTER_CLOCKWISE),
      lockCurrentPiece(),
    ],
    result: {
      board: {
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, I, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, J, J, _, _, I, I, I],
          [_, _, _, _, J, _, I, I, I, I],

          [_, _, _, _, J, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },

  {
    title: "default rotation Up to Left test 2, kick offset (1 , 0)",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, I, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, I, _, _, _, I, I, I],
          [_, _, _, _, _, _, I, I, I, I],

          [_, _, _, _, _, _, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 4,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.J,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [
      rotateCurrentPiece(RotationDirection.COUNTER_CLOCKWISE),
      lockCurrentPiece(),
    ],
    result: {
      board: {
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, I, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, I, J, J, _, I, I, I],
          [_, _, _, _, _, J, I, I, I, I],

          [_, _, _, _, _, J, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },
  {
    title: "default rotation Up to Left test 3",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, I, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, I, I, I, I, I, I, I],
          [_, _, _, _, _, _, I, I, I, I],

          [_, _, _, _, _, _, I, I, _, _],
          [_, _, _, _, I, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 4,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.J,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [
      rotateCurrentPiece(RotationDirection.COUNTER_CLOCKWISE),
      lockCurrentPiece(),
    ],
    result: {
      board: {
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, I, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, I, I, I, I, I, I, I],
          [_, _, _, _, J, J, I, I, I, I],

          [_, _, _, _, _, J, I, I, _, _],
          [_, _, _, _, I, J, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },
  {
    title: "default rotation Up to Left test 4",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, _, _, _, I, I, I, I],
          [I, I, _, _, _, _, I, I, I, I],
          [_, I, I, I, _, _, _, I, I, I],
          [_, _, _, _, _, _, I, I, I, I],

          [_, _, _, _, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 4,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.J,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [
      rotateCurrentPiece(RotationDirection.COUNTER_CLOCKWISE),
      lockCurrentPiece(),
    ],
    result: {
      board: {
        grid: [
          [I, I, I, I, I, _, I, I, I, I],
          [I, I, I, J, J, _, I, I, I, I],
          [I, I, _, _, J, _, I, I, I, I],
          [_, I, I, I, J, _, _, I, I, I],
          [_, _, _, _, _, _, I, I, I, I],

          [_, _, _, _, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },
  {
    title: "default rotation Up to Left test 5 (final test)",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [I, I, I, I, I, _, I, I, I, _],
          [I, I, I, I, _, _, I, I, I, _],
          [I, I, _, _, I, _, I, I, I, _],
          [_, I, I, I, I, _, _, I, I, _],
          [_, _, _, _, _, _, I, I, I, _],

          [_, _, _, _, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 4,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.J,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [
      rotateCurrentPiece(RotationDirection.COUNTER_CLOCKWISE),
      lockCurrentPiece(),
    ],
    result: {
      board: {
        grid: [
          [I, I, I, I, I, _, I, I, I, _],
          [I, I, I, I, J, J, I, I, I, _],
          [I, I, _, _, I, J, I, I, I, _],
          [_, I, I, I, I, J, _, I, I, _],
          [_, _, _, _, _, _, I, I, I, _],

          [_, _, _, _, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },
  {
    title: "default rotation Up to Left rotation failed",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [I, I, I, I, I, _, I, I, I, _],
          [I, I, I, I, _, I, I, I, I, _],
          [I, I, _, _, _, _, I, I, I, _],
          [_, I, I, I, I, I, _, I, I, _],
          [_, _, _, _, _, _, I, I, I, _],

          [_, _, _, _, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 4,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.J,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [
      rotateCurrentPiece(RotationDirection.COUNTER_CLOCKWISE),
      lockCurrentPiece(),
    ],
    result: {
      board: {
        grid: [
          [I, I, I, I, I, _, I, I, I, _],
          [I, I, I, I, _, I, I, I, I, _],
          [I, I, _, _, _, _, I, I, I, _],
          [_, I, I, I, I, I, _, I, I, _],
          [_, _, _, J, J, J, I, I, I, _],

          [_, _, _, J, _, I, I, I, _, _],
          [_, _, _, _, I, I, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(15).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },
  {
    title: "rotate J from Right to Up (insert into holes)",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [_, _, I, _, _, _, I, _, _, _],
          [_, _, I, _, I, I, I, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 0,
        column: 3,
        orientation: Orientation.RIGHT,
        type: PieceType.J,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [
      rotateCurrentPiece(RotationDirection.COUNTER_CLOCKWISE),
      lockCurrentPiece(),
    ],
    result: {
      board: {
        grid: [
          [_, _, I, J, J, J, I, _, _, _],
          [_, _, I, J, I, I, I, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
      },
      current: {
        row: 21,
        column: 3,
        orientation: Orientation.UP,
        type: PieceType.Z,
      },
      next: {
        queue: nextQueue.slice(1),
      },
    },
  },
];

describe("Piece Movement Tests", () => {
  testCases.forEach((testCase, index) => {
    test(`Test case #${index + 1}: ${testCase.title}`, async () => {
      // Setup store with initial state for each test case
      const store = setupStore(testCase.initialTestState);

      // Dispatch all actions for the current test case
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      testCase.actions.forEach((action: any) => {
        store.dispatch(action);
      });

      // Get the current state after all actions
      const {
        current,
        board: { grid },
        next: { queue },
      } = store.getState();

      // Create partial expected state to match only specified parts
      const expectedCurrentState = {
        ...testCase.initialTestState.current,
        ...testCase.result.current,
      };
      // Check that the relevant parts of the state match
      expect(current).toMatchObject(expectedCurrentState);
      expect(grid).toMatchObject(testCase.result.board.grid);
      expect(queue).toMatchObject(testCase.result.next.queue);
    });
  });
});

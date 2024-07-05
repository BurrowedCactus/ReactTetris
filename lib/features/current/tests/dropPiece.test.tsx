import { setupStore } from "@/lib/store";
import { Orientation } from "@/types/directions";
import { PieceType } from "@/types/pieces";
import { dropCurrentPiece } from "../currentThunk";

const { I, J, L, O, S, T, Z, EMPTY: _ } = PieceType;
const nextQueue = [Z, J, O, I, S, T, L, J, O, T, I, S, Z];
const testCases = [
  {
    title: "drop piece no line clear",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [_, I, _, _, I, T, T, T, T, I],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
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
    actions: [dropCurrentPiece()],
    result: {
      board: {
        gameStatus: "idle",
        grid: [
          [_, I, _, _, I, T, T, T, T, I],
          [_, T, T, T, _, _, _, _, _, _],
          [_, _, T, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
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
    title: "drop piece with line clear",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [T, T, _, _, _, T, T, T, T, I],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 13,
        column: 2,
        orientation: Orientation.UP,
        type: PieceType.L,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [dropCurrentPiece()],
    result: {
      board: {
        gameStatus: "idle",
        grid: [
          [_, _, _, _, L, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
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
    title: "drop piece with multiple line clear",
    initialTestState: {
      board: {
        gameStatus: "idle",
        grid: [
          [T, T, _, _, I, T, T, T, T, I],
          [I, _, _, _, I, _, _, _, _, I],
          [Z, Z, _, Z, Z, Z, Z, Z, Z, Z],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
      },
      current: {
        row: 0,
        column: 2,
        orientation: Orientation.RIGHT,
        type: PieceType.L,
      },
      next: {
        queue: nextQueue,
      },
    },
    actions: [dropCurrentPiece()],
    result: {
      board: {
        gameStatus: "idle",
        grid: [
          [I, _, L, _, I, _, _, _, _, I],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],
          [_, _, _, _, _, _, _, _, _, _],

          ...Array(20).fill([_, _, _, _, _, _, _, _, _, _]),
        ],
        level: 1,
        score: 0,
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
    test(`Test case #${index + 1}: Movement Sequence`, async () => {
      // Setup store with initial state for each test case
      const store = setupStore(testCase.initialTestState);

      // Dispatch all actions for the current test case
      testCase.actions.forEach((action) => {
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

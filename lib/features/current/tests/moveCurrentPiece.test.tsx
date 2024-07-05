import { setupStore } from "@/lib/store";
import { MoveDirection, Orientation } from "@/types/directions";
import { PieceType } from "@/types/pieces";
import { moveCurrentPiece } from "../currentThunk";

const { I, J, L, O, S, T, Z, EMPTY: _ } = PieceType;

const initialTestState = {
  board: {
    gameStatus: "idle",
    grid: [
      [_, I, J, L, O, S, T, Z, T, I],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _],
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
};
const testCases = [
  {
    title: "move left no obstacle",
    actions: [moveCurrentPiece(MoveDirection.LEFT)],
    result: {
      current: {
        column: 0,
      },
    },
  },
  {
    title: "move right no obstacle",
    actions: [moveCurrentPiece(MoveDirection.RIGHT)],
    result: {
      current: {
        column: 2,
      },
    },
  },
  {
    title: "move down no obstacle",
    actions: [moveCurrentPiece(MoveDirection.DOWN)],
    result: {
      current: {
        row: 1,
      },
    },
  },
  {
    title: "move down and left no obstacle",
    actions: [
      moveCurrentPiece(MoveDirection.DOWN),
      moveCurrentPiece(MoveDirection.LEFT),
    ],
    result: {
      current: {
        row: 1,
        column: 0,
      },
    },
  },
  {
    title: "obstacle at bottom",
    actions: [
      moveCurrentPiece(MoveDirection.DOWN),
      moveCurrentPiece(MoveDirection.DOWN),
    ],
    result: {
      current: {
        row: 1,
      },
    },
  },
  {
    title: "obstacle at left",
    actions: [
      moveCurrentPiece(MoveDirection.LEFT),
      moveCurrentPiece(MoveDirection.LEFT),
    ],
    result: {
      current: {
        column: 0,
      },
    },
  },
  {
    title: "obstacle at right",
    actions: Array(10).fill(moveCurrentPiece(MoveDirection.RIGHT)),
    result: {
      current: {
        column: 7,
      },
    },
  },
];

describe("Piece Movement Tests", () => {
  testCases.forEach((testCase, index) => {
    test(`Test case #${index + 1}: Movement Sequence`, async () => {
      // Setup store with initial state for each test case
      const store = setupStore(initialTestState);

      // Dispatch all actions for the current test case
      testCase.actions.forEach((action) => {
        store.dispatch(action);
      });

      // Get the current state after all actions
      const currentState = store.getState().current;

      // Create partial expected state to match only specified parts
      const expectedPartialState = {
        ...initialTestState.current,
        ...testCase.result.current,
      };

      // Check that the relevant parts of the state match
      expect(currentState).toMatchObject(expectedPartialState);
    });
  });
});

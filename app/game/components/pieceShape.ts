// Function to map piece types to colors
const getColorForPiece = (type: string, row: number) => {
  if (row < 0) {
    return "#202020";
  }
  switch (type) {
    case "i":
      return "#00ffff"; // Cyan for "I" piece
    case "j":
      return "#0000ff"; // Blue for "J" piece
    case "l":
      return "#ffa500"; // Orange for "L" piece
    case "o":
      return "#ffff00"; // Yellow for "O" piece
    case "s":
      return "#00ff00"; // Green for "S" piece
    case "t":
      return "#800080"; // Purple for "T" piece
    case "z":
      return "#ff0000"; // Red for "Z" piece
    default:
      return "#202020"; // Dark grey for empty space to indicate less focus
  }
};

const getPieceShapes = (type: string, orientation: string): string[] => {
  switch (type) {
    case "i":
      switch (orientation) {
        case "up":
        case "down":
          return ["iiii"];
        case "left":
        case "right":
          return ["i", "i", "i", "i"];
      }
      break;
    case "o":
      return ["oo", "oo"];
    case "t":
      switch (orientation) {
        case "up":
          return [" t ", "ttt"];
        case "down":
          return ["ttt", " t "];
        case "left":
          return [" t", "tt", " t"];
        case "right":
          return ["t ", "tt", "t "];
      }
      break;
    case "s":
      switch (orientation) {
        case "up":
        case "down":
          return [" ss", "ss "];
        case "left":
        case "right":
          return ["s ", "ss", " s"];
      }
      break;
    case "z":
      switch (orientation) {
        case "up":
        case "down":
          return ["zz ", " zz"];
        case "left":
        case "right":
          return [" z", "zz", "z "];
      }
      break;
    case "j":
      switch (orientation) {
        case "up":
          return ["j  ", "jjj"];
        case "down":
          return ["jjj", "  j"];
        case "left":
          return [" j", " j", "jj"];
        case "right":
          return ["jj", "j ", "j "];
      }
      break;
    case "l":
      switch (orientation) {
        case "up":
          return ["  l", "lll"];
        case "down":
          return ["lll", "l  "];
        case "left":
          return ["l ", "l ", "ll"];
        case "right":
          return ["ll", " l", " l"];
      }
      break;
    default:
      throw new Error("Invalid piece type or orientation");
  }
  return [];
};

export { getColorForPiece, getPieceShapes };

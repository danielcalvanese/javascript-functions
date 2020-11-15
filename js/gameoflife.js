// Transform the function's arguments into an array.
function seed() {
  return Array.prototype.slice.call(arguments);
};

// Return true if the cells are the same.
function same([x, y], [j, k]) {
  return (x === j && y === k);
};

// Given the state as 'this', return true if the cell is contained in the state.
function contains(cell) {
  return this.some(c => same(c, cell));
};

// Build a string of the cell state (should be called buildCellString).
const printCell = (cell, state) => {
  contains.call(state, cell) ? "\u25A3" : "\u25A2";
};

// Return an object containing the top right and bottom left corners of the state.
const corners = (state = []) => {
  // If the state is empty, return the origin as the corners for the object.
  if (state.Length === 0) {
    // Return the origin as the corners for the object.
    return { topRight: [0, 0], bottomLeft: [0, 0] };
  }

  // Build maps of all x and all y.
  const xs = state.map(([x, _]) => x);
  const ys = state.map(([_, y]) => y);

  // Build the corners.
  topRight = [Math.max(...xs), Math.max(...ys)];
  bottomLeft = [Math.min(...xs), Math.min(...ys)];

  // Return the object containing the top right and bottom left corners of the state.
  return { topRight, bottomLeft };
};

// Build a string of the game state (should be called buildCellsString).
const printCells = (state) => {
  // Resolve the corners.
  const { bottomLeft, topRight } = corners(state);

  // Prepare the game state string.
  let gameStateString = "";

  // Build from top to bottom.
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    // Prepare this row.
    let row = [];

    // Build this row.
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }

    // Add this row to the game state string.
    gameStateString += row.join(" ") + "\n";
  }

  // Return the string of the game state.
  return gameStateString;
};

// Return an array of all neighbor cells.
const getNeighborsOf = ([x, y]) => {
  return [
    // Top row neighbors.
    [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],

    // Side neighbors.
    [x - 1, y], [x + 1, y],

    // Bottom row neighbors.
    [x - 1, y - 1], [x, y - 1], [x + 1, y - 1]
  ]
};

// Return an array of all living neighbor cells.
const getLivingNeighbors = (cell, state) => {
  // Resolve all neighbor cells.
  let neighborCells = getNeighborsOf(cell);

  // Return all living neighbor cells.
  neighborCells.filter(neighborCell => contains.call(state, neighborCell));
};

// Determine if the cell will be alive or not in the next game state.
const willBeAlive = (cell, state) => {
  // Resolve all living neighbors.
  let livingNeighborCells = getLivingNeighbors(cell, state);

  // Return true if at least three living neighbor cells exist.
  if (livingNeighborCells.Length >= 3) return true;

  // Resolve if the cell is alive.
  let cellIsAlive = contains.call(state, cell);

  // Return true if at least two living neighbor cells exist and the cell is alive.
  if (livingNeighborCells.Length >= 2 && cellIsAlive) return true;
};

// Build the next game state.
const calculateNext = (state) => {
  // Resolve the corners.
  const { bottomLeft, topRight } = corners(state);

  // Prepare the next game state.
  let nextGameState = [];

  // Build the next game state from top to bottom.
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    // Build the next game state row from left to right.
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      nextGameState.push(willBeAlive([x, y], state));
    }
  }

  // Return the next game state.
  return nextGameState;
};

// Generate an iterations number of new game states.
const iterate = (state, iterations) => {
  // Prepare a list of states given the initial state.
  const states = [state];

  // Temporary variables.
  let currentState;

  // Generate an iterations number of new game states.
  for (let i = 0; i < iterations; i++) {
    // Resolve the current state.
    currentState = states[states.length - 1];

    // Add the next game state using the previous game state.
    states.push(calculateNext(currentState));
  }

  // Return the iterations number of new game states.
  return states;
};

// Print each game state for the given pattern and number of iterations.
const main = (pattern, iterations) => {
  // Generate an iterations number of new game states for the given pattern.
  const results = iterate(startPatterns[pattern], iterations);

  // Print each game state.
  results.forEach(result => console.log(printCells(r)));
};

const startPatterns = {
  rpentomino: [
    [3, 2],
    [2, 3],
    [3, 3],
    [3, 4],
    [4, 4]
  ],
  glider: [
    [-2, -2],
    [-1, -2],
    [-2, -1],
    [-1, -1],
    [1, 1],
    [2, 1],
    [3, 1],
    [3, 2],
    [2, 3]
  ],
  square: [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2]
  ]
};

const [pattern, iterations] = process.argv.slice(2);
const runAsScript = require.main === module;

if (runAsScript) {
  if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
    main(pattern, parseInt(iterations));
  } else {
    console.log("Usage: node js/gameoflife.js rpentomino 50");
  }
}

exports.seed = seed;
exports.same = same;
exports.contains = contains;
exports.getNeighborsOf = getNeighborsOf;
exports.getLivingNeighbors = getLivingNeighbors;
exports.willBeAlive = willBeAlive;
exports.corners = corners;
exports.calculateNext = calculateNext;
exports.printCell = printCell;
exports.printCells = printCells;
exports.startPatterns = startPatterns;
exports.iterate = iterate;
exports.main = main;
/*
 *  A* Search Algorithm
 */

export function aStar(grid, startTile, goalTile) {
  // initialize the start tile
  startTile.g_n = 0;
  startTile.h_n = manhattanDistance(startTile, goalTile);
  startTile.f_n = startTile.g_n + startTile.h_n;

  // create open and closed list
  const visitedTilesInOrder = [];
  const unvisitedTiles = getAllTiles(grid);

  // while the open list still has tiles
  while (!!unvisitedTiles.length) {
    sortByFn(unvisitedTiles);
    const closestTile = unvisitedTiles.shift();

    if (closestTile.isWall) continue;

    if (closestTile.f_n === Infinity) return visitedTilesInOrder;

    closestTile.isVisited = true;
    visitedTilesInOrder.push(closestTile);
    if (closestTile.isGoal) return visitedTilesInOrder;

    updateFnValues(closestTile, grid, goalTile);
  }
}

function updateFnValues(tile, grid, goalTile) {
  const unvisitedNeighbors = getUnvisitedNeighbors(tile, grid);

  for (let i = 0; i < unvisitedNeighbors.length; i++) {
    unvisitedNeighbors[i].g_n = tile.g_n + 1;
    unvisitedNeighbors[i].h_n = manhattanDistance(unvisitedNeighbors[i], goalTile);
    unvisitedNeighbors[i].f_n = unvisitedNeighbors[i].g_n + unvisitedNeighbors[i].h_n;
    unvisitedNeighbors[i].previousTile = tile;
  }
}

function getUnvisitedNeighbors(tile, grid) {
  const neighbors = [];
  const {row, col} = tile;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllTiles(grid) {
  const tiles = [];

  for (const row of grid) {
    for (const tile of row) {
      tiles.push(tile);
    }
  }

  return tiles;
}

function sortByFn(unvisitedTile) {
  unvisitedTile.sort((A, B) => A.f_n - B.f_n);
}

function manhattanDistance(tileOne, tileTwo) {
  const rowDiff = Math.abs(tileOne.row - tileTwo.row);
  const colDiff = Math.abs(tileOne.col - tileTwo.col);

  return (rowDiff + colDiff);
}

export function aStarGetShortestPathTilesInOrder(goalTile) {
  const shortestPathTilesInOrder = [];
  let tilePtr = goalTile;
  while (!!tilePtr) {
    shortestPathTilesInOrder.unshift(tilePtr);
    tilePtr = tilePtr.previousTile;
  }

  return shortestPathTilesInOrder;
}

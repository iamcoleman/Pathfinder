/*
 *    Dijkstra's Algorithm
 */

export function dijkstra(grid, startTile, goalTile) {
  const visitedTilesInOrder = [];
  startTile.distance = 0;
  const unvisitedTiles = getAllTiles(grid);

  while (!!unvisitedTiles.length) {
    sortTilesByDistance(unvisitedTiles);
    const closestTile = unvisitedTiles.shift();

    // if closest tile is a wall, then continue to the next closest tile
    if (closestTile.isWall) {
      continue;
    }

    // if the next closest tile's distance is infinity, then we are trapped and cannot
    // search anymore tiles, so return the visited tiles
    if (closestTile.distance === Infinity) {
      return visitedTilesInOrder;
    }

    closestTile.isVisited = true;
    visitedTilesInOrder.push(closestTile);
    if (closestTile === goalTile) {
      return visitedTilesInOrder;
    }
    updateNeighborDistances(closestTile, grid);
  }
}

// gets all tiles from the gridArray
function getAllTiles(grid) {
  const tiles = [];
  for (const row of grid) {
    for (const tile of row) {
      tiles.push(tile);
    }
  }

  return tiles;
}

// sort all unvisitedTiles by distance
function sortTilesByDistance(unvisitedTiles) {
  unvisitedTiles.sort((A, B) => A.distance - B.distance);
}

// updates the distances to the unvisited neighbors
function updateNeighborDistances(tile, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(tile, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = tile.distance + 1;
    neighbor.previousTile = tile;
  }
}

// gets the unvisited neighbors of a tile
function getUnvisitedNeighbors(tile, grid) {
  const neighbors = [];
  const {row, col} = tile;

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// get the shortest path once Dijkstra's finishes
export function getShortestPathTilesInOrder(goalTile) {
  const shortestPathTilesInOrder = [];
  let tilePtr = goalTile;
  while (!!tilePtr) {
    shortestPathTilesInOrder.unshift(tilePtr);
    tilePtr = tilePtr.previousTile;
  }

  return shortestPathTilesInOrder;
}
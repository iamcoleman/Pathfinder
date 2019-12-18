function Tile(id, row, col) {
  this.id = id;
  this.row = row;
  this.col = col;

  // path finding
  this.isVisited = false;
  this.isStart = false;
  this.isGoal = false;
  this.isWall = false;

  // distances
  this.distance = Infinity;
  this.previousTile = null;
}

module.exports = Tile;

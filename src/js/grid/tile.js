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

  // A*
  this.g_n = Infinity;
  this.h_n = Infinity;
  this.f_n = Infinity;
}

module.exports = Tile;
